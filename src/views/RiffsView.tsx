import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Disclaimer, PageHeader } from "../components/ui";
import { usePrefs } from "../context/Prefs";
import { RIFFS, riffById, type RiffNote } from "../data";
import { scheduleRiff } from "../lib/play";
import { later, stopTransport } from "../lib/transport";

const LEVEL: Record<number, string> = { 1: "Fácil", 2: "Media", 3: "Trabajada" };
const LABELS = ["E", "A", "D", "G", "B", "e"];

export function RiffsView() {
  const { id } = useParams();
  if (id) return <RiffDetail id={id} />;
  return <RiffList />;
}

function RiffList() {
  const prefs = usePrefs();
  return (
    <div>
      <PageHeader
        kicker="Riffs"
        title="Frases que se reconocen en dos segundos."
        lede="Versiones cortas para sacar con calma. El tempo se baja. La digitación es la de estudio, no una transcripción nota por nota de la toma."
      />
      <Disclaimer />
      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {RIFFS.map((riff) => (
          <li key={riff.id}>
            <Link to={`/riffs/${riff.id}`} className="block rounded-3xl border border-white/10 bg-panel p-4 hover:border-amber/40">
              <p className="text-[11px] tracking-[0.14em] text-amber uppercase">{LEVEL[riff.level]}</p>
              <h2 className="mt-1 font-serif text-2xl">{riff.title}</h2>
              <p className="text-sm text-muted">{riff.artist}</p>
              {prefs.isFav("riffs", riff.id) ? <p className="mt-2 text-xs text-amber">Guardado</p> : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function columns(notes: RiffNote[]) {
  const times = [...new Set(notes.map((note) => note.t))].sort((a, b) => a - b);
  const cols: ({ t: number; notes: RiffNote[] } | null)[] = [];
  let previous = 0;
  times.forEach((time) => {
    const rests = Math.max(0, Math.round((time - previous) / 0.5) - 1);
    for (let index = 0; index < rests; index += 1) cols.push(null);
    cols.push({ t: time, notes: notes.filter((note) => note.t === time) });
    previous = time;
  });
  return cols;
}

function RiffDetail({ id }: { id: string }) {
  const riff = riffById(id);
  const prefs = usePrefs();
  const [speed, setSpeed] = useState(0.8);
  const [cursor, setCursor] = useState<number | null>(null);
  const [loop, setLoop] = useState(true);
  const token = useRef(0);
  const loopRef = useRef(true);
  loopRef.current = loop;
  if (!riff) {
    return (
      <p>
        Ese riff no está. <Link to="/riffs">Volver</Link>
      </p>
    );
  }
  const cols = columns(riff.notes);
  const bpm = Math.round(riff.bpm * speed);

  function play() {
    const runId = ++token.current;
    const run = () => {
      if (token.current !== runId) return;
      stopTransport();
      const ms = scheduleRiff(riff!.notes, bpm, (time) => {
        if (token.current === runId) setCursor(time);
      });
      later(ms, () => {
        if (token.current === runId && loopRef.current) run();
      });
    };
    run();
  }

  function stop() {
    token.current += 1;
    stopTransport();
    setCursor(null);
  }

  return (
    <div>
      <Link to="/riffs" className="text-sm text-muted hover:text-ink">
        Todos los riffs
      </Link>
      <PageHeader kicker={`${LEVEL[riff.level]} · ${riff.tuning}`} title={riff.title} lede={riff.artist} />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Button variant="primary" onClick={play}>
          Escuchar
        </Button>
        <Button onClick={stop}>Parar</Button>
        <label className="flex items-center gap-2 text-sm text-muted">
          {bpm} bpm
          <input type="range" min={0.5} max={1.15} step={0.05} value={speed} onChange={(event) => setSpeed(Number(event.target.value))} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={loop} onChange={(event) => setLoop(event.target.checked)} className="accent-amber" />
          Repetir
        </label>
        <button type="button" onClick={() => prefs.toggleFav("riffs", riff.id)} className="text-sm text-amber">
          {prefs.isFav("riffs", riff.id) ? "Guardado" : "Guardar"}
        </button>
      </div>
      <div className="overflow-x-auto rounded-3xl bg-[#1a120c] p-4 font-mono text-sm leading-6">
        {[5, 4, 3, 2, 1, 0].map((string) => (
          <div key={string} className="flex">
            <span className="w-6 text-amber">{LABELS[string]}</span>
            <span className="text-white/30">|</span>
            {cols.map((col, index) => {
              const hit = col?.notes.find((note) => note.s === string);
              const glyph = hit ? `${hit.f}${hit.bend ? "b" : ""}` : col ? "-" : "·";
              const on = col != null && col.t === cursor;
              return (
                <span key={index} className={`inline-block w-8 text-center ${on ? "rounded bg-amber text-paper-ink" : "text-[#f3eadc]"}`}>
                  {glyph}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">{riff.tip}</p>
    </div>
  );
}
