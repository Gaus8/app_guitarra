import { useEffect, useRef, useState } from "react";
import { ChordDiagram } from "../components/ChordDiagram";
import { Button, PageHeader } from "../components/ui";
import { usePrefs } from "../context/Prefs";
import { STRUMS } from "../data";
import {
  INTERVALS,
  OPEN_MIDI,
  STRING_NAME,
  findVoicing,
  labelChord,
  midiToFreq,
  noteAt,
  noteName,
  playMidi,
  voicingsFor,
} from "../lib/api";
import { ensureAudio } from "../lib/api";
import { scheduleStrum } from "../lib/play";
import { stopTransport } from "../lib/transport";

const QUIZ_CHORDS = ["C", "G", "D", "A", "E", "Am", "Em", "Dm", "F", "B7", "Cmaj7", "A7"];

interface Question {
  prompt: string;
  options: string[];
  answer: number;
  diagram?: string;
}

export function PracticeView() {
  return (
    <div className="space-y-12">
      <PageHeader
        kicker="Práctica"
        title="Afinar, el pulso y un poco de memoria."
        lede="El metrónomo, las seis cuerdas de referencia, un afinador con el micrófono y una ronda corta para ver si el mástil ya dice la verdad."
      />
      <Metronome />
      <Tuner />
      <StrumTrainer />
      <Quiz />
    </div>
  );
}

function Metronome() {
  const [bpm, setBpm] = useState(80);
  const [beats, setBeats] = useState(4);
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState(0);
  const taps = useRef<number[]>([]);

  useEffect(() => {
    if (!running) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    let next = ctx.currentTime + 0.08;
    let count = 0;
    let alive = true;
    let timer = 0;
    const ui: number[] = [];
    const nodes: AudioScheduledSourceNode[] = [];
    const loop = () => {
      if (!alive) return;
      while (next < ctx.currentTime + 0.2) {
        const accent = count % beats === 0;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(accent ? 1400 : 900, next);
        gain.gain.setValueAtTime(0.0001, next);
        gain.gain.exponentialRampToValueAtTime(accent ? 0.16 : 0.06, next + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, next + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(next);
        osc.stop(next + 0.06);
        nodes.push(osc);
        const shown = count % beats;
        ui.push(window.setTimeout(() => setCurrent(shown), Math.max(0, (next - ctx.currentTime) * 1000)));
        count += 1;
        next += 60 / bpm;
      }
      timer = window.setTimeout(loop, 40);
    };
    loop();
    return () => {
      alive = false;
      clearTimeout(timer);
      ui.forEach((id) => clearTimeout(id));
      nodes.forEach((node) => {
        try {
          node.stop();
        } catch {
          /* ya sonó */
        }
      });
    };
  }, [running, bpm, beats]);

  function tap() {
    const now = performance.now();
    taps.current = [...taps.current.filter((time) => now - time < 2500), now].slice(-5);
    if (taps.current.length < 2) return;
    const gaps: number[] = [];
    for (let index = 1; index < taps.current.length; index += 1) gaps.push(taps.current[index] - taps.current[index - 1]);
    const average = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
    setBpm(Math.max(40, Math.min(220, Math.round(60000 / average))));
  }

  return (
    <section>
      <h2 className="font-serif text-3xl">Metrónomo</h2>
      <div className="mt-4 flex items-center gap-4">
        <p className="font-serif text-6xl tabular-nums">{bpm}</p>
        <div>
          <input type="range" min={40} max={200} value={bpm} onChange={(event) => setBpm(Number(event.target.value))} />
          <div className="mt-2 flex gap-2">
            {[3, 4, 6].map((value) => (
              <button key={value} type="button" onClick={() => setBeats(value)} className={`rounded-full px-3 py-1 text-sm ${beats === value ? "bg-amber text-paper-ink" : "bg-white/5"}`}>
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {Array.from({ length: beats }, (_, index) => (
          <i key={index} className={`h-4 w-4 rounded-full ${current === index && running ? "bg-amber" : "bg-white/15"} ${index === 0 ? "scale-110" : ""}`} />
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="primary" onClick={() => setRunning((value) => !value)}>
          {running ? "Parar" : "Empezar"}
        </Button>
        <Button onClick={tap}>Marcar tempo</Button>
      </div>
    </section>
  );
}

function Tuner() {
  const prefs = usePrefs();
  const [listening, setListening] = useState(false);
  const [pitch, setPitch] = useState<{ pc: number; cents: number; freq: number } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!listening) return;
    let dead = false;
    let raf = 0;
    let stream: MediaStream | null = null;
    const ctx = ensureAudio();
    if (!ctx) return;
    navigator.mediaDevices
      .getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } })
      .then((media) => {
        if (dead) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = media;
        const source = ctx.createMediaStreamSource(media);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        const buffer = new Float32Array(analyser.fftSize);
        let last = 0;
        const tick = (now: number) => {
          raf = requestAnimationFrame(tick);
          if (now - last < 90) return;
          last = now;
          analyser.getFloatTimeDomainData(buffer);
          const freq = correlate(buffer, ctx.sampleRate);
          if (freq > 70 && freq < 500) {
            const exact = 69 + 12 * Math.log2(freq / 440);
            const midi = Math.round(exact);
            setPitch({ pc: ((midi % 12) + 12) % 12, cents: Math.round((exact - midi) * 100), freq });
          } else setPitch(null);
        };
        raf = requestAnimationFrame(tick);
      })
      .catch(() => setError("El navegador no dejó usar el micrófono."));
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [listening]);

  const nearest = OPEN_MIDI.map((midi, index) => ({ index, freq: midiToFreq(midi) })).reduce((best, item) =>
    pitch && Math.abs(Math.log2(item.freq / pitch.freq)) < Math.abs(Math.log2(best.freq / pitch.freq)) ? item : best,
  );

  return (
    <section>
      <h2 className="font-serif text-3xl">Afinador</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Primero, la referencia de cada cuerda. Si afinas de oído: traste 5 contra la cuerda de abajo, salvo entre Sol y Si, que es el traste 4.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {STRING_NAME.map((name, index) => (
          <button key={name} type="button" onClick={() => playMidi(OPEN_MIDI[index])} className="rounded-2xl bg-panel px-2 py-3 text-sm">
            <span className="block font-medium">{noteName(OPEN_MIDI[index] % 12, prefs.naming)}</span>
            <span className="text-xs text-muted">{name}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Button variant="primary" onClick={() => { setError(""); setListening((value) => !value); }}>
          {listening ? "Cerrar micrófono" : "Escuchar la guitarra"}
        </Button>
        {pitch ? (
          <p className="font-serif text-4xl">
            {noteName(pitch.pc, prefs.naming)}
            <span className={`ml-3 text-lg ${Math.abs(pitch.cents) < 8 ? "text-moss" : "text-muted"}`}>
              {pitch.cents > 0 ? `+${pitch.cents}` : pitch.cents} cents
            </span>
          </p>
        ) : (
          <p className="text-sm text-muted">{listening ? "Toca una cuerda, sola." : error || "El micrófono afina la nota que está sonando."}</p>
        )}
      </div>
      <div className="relative mt-4 h-2 max-w-md rounded-full bg-white/10">
        <i className="absolute top-1/2 left-1/2 h-4 w-px -translate-y-1/2 bg-white/40" />
        {pitch ? (
          <i
            className={`absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded-full ${Math.abs(pitch.cents) < 8 ? "bg-moss" : "bg-amber"}`}
            style={{ left: `${Math.min(100, Math.max(0, 50 + pitch.cents))}%` }}
          />
        ) : null}
      </div>
      {pitch ? (
        <p className="mt-2 text-xs text-muted">
          La cuerda al aire más cercana es {STRING_NAME[nearest.index]}. Si el centro está a la derecha, estás alto.
        </p>
      ) : null}
    </section>
  );
}

function StrumTrainer() {
  const prefs = usePrefs();
  const [strumId, setStrumId] = useState(STRUMS[0].id);
  const [chord, setChord] = useState("G");
  const [bpm, setBpm] = useState(80);
  const [step, setStep] = useState<number | null>(null);
  const strum = STRUMS.find((item) => item.id === strumId) ?? STRUMS[0];
  const voicing = findVoicing(chord);

  function play() {
    stopTransport();
    if (!voicing) return;
    scheduleStrum(strum, bpm, voicing.frets, 4, setStep);
  }

  return (
    <section>
      <h2 className="font-serif text-3xl">Rasgueo</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">El clic marca el tiempo. La flecha es tu mano. Empieza tan lento que puedas decir el nombre del golpe.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {STRUMS.map((item) => (
          <button key={item.id} type="button" onClick={() => setStrumId(item.id)} className={`rounded-full px-3 py-1.5 text-sm ${item.id === strum.id ? "bg-amber text-paper-ink" : "bg-white/5"}`}>
            {item.name}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">{strum.detail}</p>
      <div className="mt-3 flex gap-2">
        {strum.steps.map((item, index) => (
          <span key={`${item.t}-${index}`} className={`grid h-10 w-10 place-items-center rounded-full text-lg ${step === index ? "bg-amber text-paper-ink" : "bg-white/5"}`}>
            {item.dir === "D" ? "↓" : item.dir === "U" ? "↑" : "●"}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <select value={chord} onChange={(event) => setChord(event.target.value)} className="rounded-2xl bg-panel px-3 py-2 text-sm">
          {QUIZ_CHORDS.map((item) => (
            <option key={item} value={item}>
              {labelChord(item, prefs.naming)}
            </option>
          ))}
        </select>
        <label className="text-sm text-muted">
          {bpm}
          <input className="ml-2" type="range" min={50} max={140} value={bpm} onChange={(event) => setBpm(Number(event.target.value))} />
        </label>
        <Button variant="primary" onClick={play}>
          Practicar
        </Button>
        <Button
          onClick={() => {
            stopTransport();
            setStep(null);
          }}
        >
          Parar
        </Button>
      </div>
    </section>
  );
}

function Quiz() {
  const prefs = usePrefs();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [cursor, setCursor] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const question = questions[cursor];

  function start() {
    setQuestions(buildQuiz(prefs.naming));
    setCursor(0);
    setPicked(null);
    setScore(0);
  }

  function choose(index: number) {
    if (picked != null || !question) return;
    setPicked(index);
    if (index === question.answer) setScore((value) => value + 1);
  }

  const diagram = question?.diagram ? voicingsFor(parseRoot(question.diagram), parseQuality(question.diagram))[0] : null;

  return (
    <section>
      <h2 className="font-serif text-3xl">Una ronda</h2>
      <p className="mt-2 text-sm text-muted">Seis preguntas. Notas, intervalos y acordes que ya están en el cuaderno.</p>
      {questions.length === 0 || !question ? (
        <Button className="mt-4" variant="primary" onClick={start}>
          Empezar
        </Button>
      ) : (
        <div className="mt-4 max-w-xl">
          <p className="text-xs text-muted">
            {cursor + 1} / {questions.length} · {score} bien
          </p>
          <p className="mt-2 text-lg">{question.prompt}</p>
          {diagram ? (
            <div className="mt-3 w-40 rounded-2xl bg-paper p-2">
              <ChordDiagram voicing={diagram} small />
            </div>
          ) : null}
          <div className="mt-4 grid gap-2">
            {question.options.map((option, index) => {
              const state = picked == null ? "" : index === question.answer ? "bg-moss text-[#10200c]" : index === picked ? "bg-rose text-white" : "opacity-50";
              return (
                <button key={option} type="button" onClick={() => choose(index)} className={`rounded-2xl bg-panel px-4 py-3 text-left text-sm ${state}`}>
                  {option}
                </button>
              );
            })}
          </div>
          {picked != null ? (
            <Button
              className="mt-4"
              variant="primary"
              onClick={() => {
                if (cursor + 1 >= questions.length) start();
                else {
                  setCursor((value) => value + 1);
                  setPicked(null);
                }
              }}
            >
              {cursor + 1 >= questions.length ? "Otra ronda" : "Siguiente"}
            </Button>
          ) : null}
          {picked != null && cursor + 1 >= questions.length ? (
            <p className="mt-4 text-sm">{score} de {questions.length}. Otra ronda mañana, con la guitarra delante.</p>
          ) : null}
        </div>
      )}
    </section>
  );
}

function parseRoot(symbol: string) {
  const match = symbol.match(/^([A-G](?:#|b)?)/);
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const flats: Record<string, number> = { Db: 1, Eb: 3, Gb: 6, Ab: 8, Bb: 10 };
  if (!match) return 0;
  return flats[match[1]] ?? names.indexOf(match[1]);
}

function parseQuality(symbol: string) {
  if (symbol.endsWith("maj7")) return "maj7";
  if (symbol.endsWith("m")) return "min";
  if (symbol.endsWith("7")) return "7";
  return "maj";
}

function shuffle<T>(list: T[]) {
  return [...list].sort(() => Math.random() - 0.5);
}

function options(correct: string, pool: string[]) {
  const set = new Set([correct]);
  const bag = shuffle(pool.filter((item) => item !== correct));
  while (set.size < 4 && bag.length) set.add(bag.pop() as string);
  return shuffle([...set]);
}

function buildQuiz(naming: Parameters<typeof noteName>[1]): Question[] {
  const questions: Question[] = [];
  for (let count = 0; count < 3; count += 1) {
    const string = Math.floor(Math.random() * 6);
    const fret = Math.floor(Math.random() * 13);
    const note = noteAt(string, fret);
    const correct = noteName(note.pc, naming);
    const pool = Array.from({ length: 12 }, (_, pc) => noteName(pc, naming));
    const opts = options(correct, pool);
    questions.push({
      prompt: `${STRING_NAME[string]}, traste ${fret}. ¿Qué nota es?`,
      options: opts,
      answer: opts.indexOf(correct),
    });
  }
  const interval = INTERVALS[2 + Math.floor(Math.random() * 9)];
  const root = Math.floor(Math.random() * 12);
  const correctInterval = interval.name;
  const intervalOptions = options(
    correctInterval,
    INTERVALS.map((item) => item.name),
  );
  questions.push({
    prompt: `De ${noteName(root, naming)} a ${noteName((root + interval.semi) % 12, naming)}, ¿qué intervalo hay?`,
    options: intervalOptions,
    answer: intervalOptions.indexOf(correctInterval),
  });
  const symbol = QUIZ_CHORDS[Math.floor(Math.random() * QUIZ_CHORDS.length)];
  const chordOptions = options(
    labelChord(symbol, naming ?? {}),
    QUIZ_CHORDS.map((item) => labelChord(item, naming ?? {})),
  );
  questions.push({
    prompt: "¿Qué acorde es este diagrama?",
    options: chordOptions,
    answer: chordOptions.indexOf(labelChord(symbol, naming ?? {})),
    diagram: symbol,
  });
  const degreeRoot = [0, 2, 4, 5, 7, 9][Math.floor(Math.random() * 6)];
  const degree = [
    { n: "I", q: "maj", add: 0 },
    { n: "IV", q: "maj", add: 5 },
    { n: "V", q: "maj", add: 7 },
    { n: "vi", q: "min", add: 9 },
  ][Math.floor(Math.random() * 4)];
  const degreeAnswer = chordSymbolSafe(degreeRoot, degree.add, degree.q, naming);
  const degreePool = [0, 5, 7, 9].map((add, index) => chordSymbolSafe(degreeRoot, add, index === 3 ? "min" : "maj", naming));
  const degreeOptions = options(degreeAnswer, degreePool);
  questions.push({
    prompt: `En ${noteName(degreeRoot, naming)} mayor, el grado ${degree.n} es…`,
    options: degreeOptions,
    answer: degreeOptions.indexOf(degreeAnswer),
  });
  return shuffle(questions);
}

function correlate(buffer: Float32Array, sampleRate: number) {
  let energy = 0;
  for (let index = 0; index < buffer.length; index += 1) energy += buffer[index] * buffer[index];
  if (energy / buffer.length < 0.0008) return -1;
  let best = 0;
  let bestLag = -1;
  const minLag = Math.floor(sampleRate / 480);
  const maxLag = Math.min(Math.floor(sampleRate / 70), Math.floor(buffer.length / 2));
  for (let lag = minLag; lag < maxLag; lag += 1) {
    let sum = 0;
    for (let index = 0; index < buffer.length - lag; index += 2) sum += buffer[index] * buffer[index + lag];
    if (sum > best) {
      best = sum;
      bestLag = lag;
    }
  }
  return bestLag > 0 ? sampleRate / bestLag : -1;
}

function chordSymbolSafe(root: number, add: number, quality: string, naming: Parameters<typeof noteName>[1]) {
  return labelChord(`${["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(root + add) % 12]}${quality === "min" ? "m" : quality === "maj" ? "" : ""}`, naming ?? {});
}
