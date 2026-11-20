import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChordDiagram } from "../components/ChordDiagram";
import { Button, Field, PageHeader, RootPicker } from "../components/ui";
import { usePrefs } from "../context/Prefs";
import {
  OPEN_PC,
  QUALITIES,
  chordSymbol,
  chordTones,
  noteName,
  parseChord,
  qualityById,
  spellInChord,
  strumFrets,
  voicingsFor,
} from "../lib/api";

export function ChordsView() {
  const prefs = usePrefs();
  const [params, setParams] = useSearchParams();
  const rootRaw = Number(params.get("r") ?? "0");
  const root = rootRaw >= 0 && rootRaw < 12 ? rootRaw : 0;
  const quality = qualityById(params.get("q") ?? "") ? (params.get("q") as string) : "maj";
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");
  const voicings = useMemo(() => voicingsFor(root, quality), [root, quality]);
  const current = voicings[Math.min(index, voicings.length - 1)];
  const qualityInfo = qualityById(quality);
  const tones = chordTones(root, quality, prefs.naming);

  useEffect(() => setIndex(0), [root, quality]);

  function update(next: { r?: number; q?: string }) {
    setParams({ r: String(next.r ?? root), q: next.q ?? quality });
  }

  const groups = [
    { id: "triada", label: "Tríadas" },
    { id: "septima", label: "Séptimas" },
    { id: "color", label: "Color" },
  ];

  return (
    <div>
      <PageHeader
        kicker="Acordes"
        title="Todos los que de verdad se usan."
        lede="Doce fundamentales y cada tipo, con la digitación más cómoda primero y las formas del mástil detrás. El punto ámbar es la fundamental."
      />
      <div className="mb-6 grid gap-4">
        <Field label="Buscar, por ejemplo F#m7 o Bbm">
          <input
            value={query}
            onChange={(event) => {
              const value = event.target.value;
              setQuery(value);
              const parsed = parseChord(value.trim());
              if (parsed) update({ r: parsed.rootPc, q: parsed.qualityId });
            }}
            placeholder="Cmaj7, Em, Bb, Dsus4"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-panel px-4 py-3 text-ink outline-none"
          />
        </Field>
        <Field label="Fundamental">
          <RootPicker value={root} onChange={(pc) => update({ r: pc })} naming={prefs.naming} />
        </Field>
        {groups.map((group) => (
          <Field key={group.id} label={group.label}>
            <div className="flex flex-wrap gap-1.5">
              {QUALITIES.filter((item) => item.group === group.id).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => update({ q: item.id })}
                  className={`rounded-full px-3 py-1.5 text-sm ${item.id === quality ? "bg-amber text-paper-ink" : "bg-white/5 hover:bg-white/10"}`}
                >
                  {item.symbol || "mayor"}
                </button>
              ))}
            </div>
          </Field>
        ))}
      </div>
      {current && qualityInfo ? (
        <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
          <div className="rounded-[28px] bg-paper p-4 text-paper-ink shadow-2xl">
            <ChordDiagram voicing={current} label={chordSymbol(root, quality, prefs.naming)} />
            <p className="mt-2 text-center text-xs tracking-wide text-paper-ink/60">E A D G B e</p>
          </div>
          <div>
            <p className="font-serif text-5xl">{chordSymbol(root, quality, prefs.naming)}</p>
            <p className="mt-1 text-muted">
              {noteName(root, { ...prefs.naming, system: "latin" })} {qualityInfo.name} · {current.name}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{qualityInfo.blurb}</p>
            <p className="mt-4 text-sm">
              {tones.map((tone) => (
                <span key={tone.token} className="mr-3 inline-block rounded-full bg-white/5 px-3 py-1">
                  {tone.token} · {spellInChord(root, quality, (root + tone.semi) % 12, prefs.naming)}
                </span>
              ))}
            </p>
            <p className="mt-4 text-sm text-muted">
              En el diagrama, de graves a agudos:{" "}
              {current.frets
                .map((fret, stringIndex) => (fret < 0 ? "x" : spellInChord(root, quality, (OPEN_PC[stringIndex] + fret) % 12, prefs.naming)))
                .join("  ")}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="primary" onClick={() => strumFrets(current.frets)}>
                Escuchar
              </Button>
              <p className="self-center text-xs text-muted">1 índice · 2 medio · 3 anular · 4 meñique</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {voicings.map((voicing, voicingIndex) => (
                <button
                  key={voicing.signature}
                  type="button"
                  onClick={() => setIndex(voicingIndex)}
                  className={`rounded-2xl bg-paper p-2 text-left text-paper-ink ${voicingIndex === index ? "ring-2 ring-amber" : ""}`}
                >
                  <ChordDiagram voicing={voicing} small />
                  <span className="mt-1 block px-1 text-xs">{voicing.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-muted">No hay una digitación cómoda para esa combinación.</p>
      )}
    </div>
  );
}
