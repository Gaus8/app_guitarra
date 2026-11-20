import { useState } from "react";
import { Fretboard } from "../components/Fretboard";
import { PageHeader, RootPicker } from "../components/ui";
import { usePrefs } from "../context/Prefs";
import { QUALITIES, chordSymbol, chordTones, displaySpelling, noteName, playMidi, qualityById, type ChordTone } from "../lib/api";
import type { BoardNote } from "../components/Fretboard";

export function FormationView() {
  const prefs = usePrefs();
  const [root, setRoot] = useState(0);
  const [quality, setQuality] = useState("maj");
  const info = qualityById(quality)!;
  const tones = chordTones(root, quality, prefs.naming);
  const intervals = [...new Set(tones.map((tone) => tone.semi % 12))];

  function toneAt(semi: number): ChordTone | undefined {
    return tones.find((tone) => tone.semi % 12 === semi);
  }

  return (
    <div>
      <PageHeader
        kicker="Formación"
        title="Un acorde es una suma."
        lede="La fundamental no se discute. Lo que cambia el carácter es qué intervalos apilas encima. Baja la tercera y el mayor se vuelve menor."
      />
      <div className="mb-6 space-y-4">
        <RootPicker value={root} onChange={setRoot} naming={prefs.naming} />
        <div className="flex flex-wrap gap-1.5">
          {QUALITIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setQuality(item.id)}
              className={`rounded-full px-3 py-1.5 text-sm ${item.id === quality ? "bg-amber text-paper-ink" : "bg-white/5"}`}
            >
              {item.symbol || "mayor"}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-serif text-4xl">{chordSymbol(root, quality, prefs.naming)}</p>
          <p className="mt-1 text-sm text-muted">{info.blurb}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setQuality("maj")} className="rounded-full bg-white/5 px-3 py-1.5 text-sm">
            Comparar con mayor
          </button>
          <button type="button" onClick={() => setQuality("min")} className="rounded-full bg-white/5 px-3 py-1.5 text-sm">
            Comparar con menor
          </button>
        </div>
      </div>
      <div className="mb-6 grid grid-cols-6 gap-1 sm:grid-cols-12">
        {Array.from({ length: 12 }, (_, semi) => {
          const pc = (root + semi) % 12;
          const tone = toneAt(semi);
          return (
            <button
              key={semi}
              type="button"
              onClick={() => playMidi(60 + ((pc + 12 - 0) % 12))}
              className={`rounded-xl px-1 py-3 text-center ${tone ? "bg-amber text-paper-ink" : "bg-white/5 text-muted"}`}
            >
              <span className="block text-[10px] uppercase">{tone ? tone.token : semi}</span>
              <span className="block text-sm font-medium">{tone ? displaySpelling(tone.name, prefs.naming) : noteName(pc, prefs.naming)}</span>
            </button>
          );
        })}
      </div>
      <Fretboard
        naming={prefs.naming}
        root={root}
        intervals={intervals}
        labels="grado"
        onNote={(note: BoardNote) => {
          if (prefs.preview) playMidi(note.midi);
        }}
      />
      <p className="mt-4 text-sm text-muted">
        Fórmula: {tones.map((tone) => `${tone.token} (${displaySpelling(tone.name, prefs.naming)})`).join(", ")}. En el mástil solo se encienden esas notas.
      </p>
    </div>
  );
}
