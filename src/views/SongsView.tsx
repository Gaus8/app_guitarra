import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChordDiagram } from "../components/ChordDiagram";
import { Button, Disclaimer, PageHeader } from "../components/ui";
import { usePrefs } from "../context/Prefs";
import { GENRES, SONGS, songById, strumById } from "../data";
import { findVoicing, labelChord } from "../lib/api";
import { playShape, scheduleSong } from "../lib/play";
import { later, stopTransport } from "../lib/transport";

const LEVEL: Record<number, string> = { 1: "Fácil", 2: "Media", 3: "Trabajada" };

export function SongsView() {
  const { id } = useParams();
  if (id) return <SongDetail id={id} />;
  return <SongList />;
}

function SongList() {
  const prefs = usePrefs();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("todas");
  const [level, setLevel] = useState("todas");
  const [onlyFav, setOnlyFav] = useState(false);
  const text = query.trim().toLowerCase();
  const songs = SONGS.filter((song) => {
    if (onlyFav && !prefs.isFav("songs", song.id)) return false;
    if (genre !== "todas" && song.genre !== genre) return false;
    if (level !== "todas" && String(song.level) !== level) return false;
    if (!text) return true;
    return [song.title, song.artist, song.key, song.genre, ...song.chords].join(" ").toLowerCase().includes(text);
  });

  return (
    <div>
      <PageHeader
        kicker="Canciones"
        title="Armonía que ya conoces de oído."
        lede="La progresión, el ritmo y los diagramas. Sirve para cambiar de acorde a tiempo. La letra se canta de memoria."
      />
      <Disclaimer />
      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar tema, tono o acorde"
          className="min-w-52 flex-1 rounded-2xl border border-white/10 bg-panel px-4 py-2 text-sm"
        />
        <select value={genre} onChange={(event) => setGenre(event.target.value)} className="rounded-2xl bg-panel px-3 py-2 text-sm">
          <option value="todas">Todos los estilos</option>
          {GENRES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select value={level} onChange={(event) => setLevel(event.target.value)} className="rounded-2xl bg-panel px-3 py-2 text-sm">
          <option value="todas">Cualquier mano</option>
          <option value="1">Fácil</option>
          <option value="2">Media</option>
          <option value="3">Trabajada</option>
        </select>
        <button type="button" onClick={() => setOnlyFav((value) => !value)} className={`rounded-full px-3 py-2 text-sm ${onlyFav ? "bg-amber text-paper-ink" : "bg-white/5"}`}>
          Guardadas
        </button>
      </div>
      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {songs.map((song) => (
          <li key={song.id}>
            <Link to={`/canciones/${song.id}`} className="block rounded-3xl border border-white/10 bg-panel p-4 hover:border-amber/40">
              <p className="text-[11px] tracking-[0.14em] text-amber uppercase">
                {song.genre} · {LEVEL[song.level]}
              </p>
              <h2 className="mt-1 font-serif text-2xl">{song.title}</h2>
              <p className="text-sm text-muted">{song.artist}</p>
              <p className="mt-3 text-sm text-ink/80">{song.chords.map((chord) => labelChord(chord, prefs.naming)).join("  ·  ")}</p>
            </Link>
          </li>
        ))}
      </ul>
      {songs.length === 0 ? <p className="mt-6 text-sm text-muted">Ningún tema con ese filtro.</p> : null}
    </div>
  );
}

function SongDetail({ id }: { id: string }) {
  const song = songById(id);
  const prefs = usePrefs();
  const [bpm, setBpm] = useState(song?.bpm ?? 80);
  const [current, setCurrent] = useState<string | null>(null);
  const [loop, setLoop] = useState(true);
  const token = useRef(0);
  const loopRef = useRef(true);
  loopRef.current = loop;
  if (!song) {
    return (
      <p>
        Ese tema no está en el cuaderno. <Link to="/canciones">Volver</Link>
      </p>
    );
  }
  const strum = strumById(song.strum);

  function play() {
    const runId = ++token.current;
    const run = () => {
      if (token.current !== runId) return;
      stopTransport();
      const ms = scheduleSong(song!, bpm, (bar) => {
        if (token.current === runId) setCurrent(bar);
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
    setCurrent(null);
  }

  return (
    <div>
      <Link to="/canciones" className="text-sm text-muted hover:text-ink">
        Todas las canciones
      </Link>
      <PageHeader kicker={`${song.genre} · ${LEVEL[song.level]} · ${song.meter}`} title={song.title} lede={song.artist} />
      <Disclaimer />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button variant="primary" onClick={play}>
          Escuchar cambios
        </Button>
        <Button onClick={stop}>Parar</Button>
        <label className="flex items-center gap-2 text-sm text-muted">
          {bpm} bpm
          <input type="range" min={48} max={180} value={bpm} onChange={(event) => setBpm(Number(event.target.value))} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={loop} onChange={(event) => setLoop(event.target.checked)} className="accent-amber" />
          Repetir
        </label>
        <button type="button" onClick={() => prefs.toggleFav("songs", song.id)} className="text-sm text-amber">
          {prefs.isFav("songs", song.id) ? "Guardada" : "Guardar"}
        </button>
      </div>
      <p className="mt-4 text-sm text-muted">
        {song.capo > 0
          ? `Cejilla en el traste ${song.capo}. Los diagramas son las formas que dibujas. La escucha ya suena transportada.`
          : "Sin cejilla. Lo que dibujas es lo que suena."}{" "}
        {strum.name}: {strum.detail}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {strum.steps.map((step, index) => (
          <span key={`${step.t}-${index}`} className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-sm">
            {step.dir === "D" ? "↓" : step.dir === "U" ? "↑" : "●"}
          </span>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {song.chords.map((chord) => {
          const voicing = findVoicing(chord, song.hints?.[chord]);
          if (!voicing) return null;
          return (
            <button
              key={chord}
              type="button"
              onClick={() => playShape(chord, song.hints?.[chord], song.capo)}
              className="rounded-2xl bg-paper p-2 text-left text-paper-ink"
            >
              <ChordDiagram voicing={voicing} small label={chord} />
              <span className="mt-1 block px-1 text-sm font-medium">{labelChord(chord, prefs.naming)}</span>
              {song.capo > 0 ? <span className="block px-1 text-[11px] text-paper-ink/60">suena {labelChord(chord, prefs.naming, song.capo)}</span> : null}
            </button>
          );
        })}
      </div>
      <div className="mt-8 space-y-6">
        {song.sections.map((section, sectionIndex) => (
          <section key={section.name}>
            <h2 className="font-serif text-2xl">{section.name}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {section.bars.map((bar, barIndex) => {
                const id = `${sectionIndex}-${barIndex}`;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      stop();
                      playShape(bar.c, song.hints?.[bar.c], song.capo);
                    }}
                    className={`min-w-16 rounded-2xl px-3 py-2 text-left ${current === id ? "bg-amber text-paper-ink" : "bg-panel"}`}
                  >
                    <span className="block text-sm font-medium">{labelChord(bar.c, prefs.naming)}</span>
                    <span className="text-[11px] opacity-70">{bar.beats} tiempos</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">{song.tip}</p>
    </div>
  );
}
