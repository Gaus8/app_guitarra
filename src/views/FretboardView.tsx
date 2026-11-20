import { useState } from "react";
import { Link } from "react-router-dom";
import { Fretboard, type BoardNote } from "../components/Fretboard";
import { Field, PageHeader, RootPicker, Segmented } from "../components/ui";
import { usePrefs } from "../context/Prefs";
import { INTERVALS, STRING_NAME, chordSymbol, detectChords, noteName, octaveOf, playMidi, qualityById } from "../lib/api";

export function FretboardView() {
  const prefs = usePrefs();
  const [root, setRoot] = useState(0);
  const [labels, setLabels] = useState<"nota" | "grado">("nota");
  const [spotlight, setSpotlight] = useState<number | null>(null);
  const [marking, setMarking] = useState(false);
  const [marks, setMarks] = useState<number[]>([]);
  const [hit, setHit] = useState<BoardNote | null>(null);
  const found = detectChords(marks);

  function choose(note: BoardNote) {
    setHit(note);
    if (prefs.preview) playMidi(note.midi);
    if (marking) {
      setMarks((current) => (current.includes(note.pc) ? current.filter((pc) => pc !== note.pc) : [...current, note.pc]));
    } else {
      setSpotlight(note.pc);
    }
  }

  const degree = hit ? (hit.pc - root + 12) % 12 : 0;

  return (
    <div>
      <PageHeader
        kicker="Diapasón"
        title="Dónde vive cada nota."
        lede="La 6ª cuerda está arriba. Un traste es un semitono. El mismo nombre se repite en varias cuerdas: esa repetición es el mapa."
      />
      <div className="mb-4 flex flex-wrap items-end gap-4">
        <Field label="Referencia para los grados">
          <RootPicker value={root} onChange={setRoot} naming={prefs.naming} />
        </Field>
        <Segmented
          value={labels}
          onChange={setLabels}
          options={[
            { id: "nota", label: "Notas" },
            { id: "grado", label: "Grados" },
          ]}
        />
        <button
          type="button"
          onClick={() => setMarking((value) => !value)}
          className={`rounded-full px-4 py-2 text-sm ${marking ? "bg-amber text-paper-ink" : "bg-white/5"}`}
        >
          {marking ? "Marcando notas" : "Marcar para reconocer"}
        </button>
        {marks.length ? (
          <button type="button" onClick={() => setMarks([])} className="text-sm text-muted hover:text-ink">
            Limpiar marcas
          </button>
        ) : null}
      </div>
      <Fretboard naming={prefs.naming} root={root} intervals={null} labels={labels} spotlight={spotlight} marks={marks} onNote={choose} />
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: 12 }, (_, pc) => (
          <button
            key={pc}
            type="button"
            onClick={() => setSpotlight(spotlight === pc ? null : pc)}
            className={`rounded-full px-3 py-1 text-xs ${spotlight === pc ? "bg-amber text-paper-ink" : "bg-white/5 text-muted"}`}
          >
            {noteName(pc, prefs.naming)}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl bg-panel p-5">
          <p className="text-[11px] tracking-[0.16em] text-amber uppercase">Nota</p>
          {hit ? (
            <>
              <p className="mt-2 font-serif text-4xl">{noteName(hit.pc, prefs.naming)}</p>
              <p className="mt-2 text-sm text-muted">
                {STRING_NAME[hit.stringIndex]}, traste {hit.fret}. Octava {octaveOf(hit.midi)}. Desde {noteName(root, prefs.naming)}: {INTERVALS[degree].name} ({INTERVALS[degree].short}).
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted">Pulsa el mástil.</p>
          )}
        </article>
        <article className="rounded-3xl bg-panel p-5">
          <p className="text-[11px] tracking-[0.16em] text-amber uppercase">Si estas notas fueran un acorde</p>
          {found.length ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {found.map((chord) => (
                <li key={`${chord.rootPc}-${chord.qualityId}`}>
                  <Link
                    to={`/acordes?r=${chord.rootPc}&q=${chord.qualityId}`}
                    className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm hover:bg-amber hover:text-paper-ink"
                  >
                    {chordSymbol(chord.rootPc, chord.qualityId, prefs.naming)}
                    <span className="ml-2 text-muted">{qualityById(chord.qualityId)?.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted">Activa “Marcar” y elige al menos fundamental y tercera. La app propone el nombre.</p>
          )}
        </article>
      </div>
    </div>
  );
}
