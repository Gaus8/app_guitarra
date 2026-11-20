import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Fretboard } from "../components/Fretboard";
import { Field, PageHeader, RootPicker, Segmented } from "../components/ui";
import { usePrefs } from "../context/Prefs";
import { SCALES, noteName, playMidi, scaleById } from "../lib/api";
import { BOXES } from "../lib/fret";

const BOXABLE = new Set(["pentMin", "pentMaj", "blues", "minor", "major"]);

export function ScalesView() {
  const prefs = usePrefs();
  const [params, setParams] = useSearchParams();
  const rootRaw = Number(params.get("r") ?? "9");
  const root = rootRaw >= 0 && rootRaw < 12 ? rootRaw : 9;
  const scaleId = scaleById(params.get("s") ?? "") ? (params.get("s") as string) : "pentMin";
  const box = params.get("box") ?? "all";
  const [labels, setLabels] = useState<"nota" | "grado">("nota");
  const scale = scaleById(scaleId)!;
  const relativeShift = scaleId === "minor" || scaleId === "pentMin" ? 3 : 9;
  const showRelative = ["major", "minor", "pentMaj", "pentMin"].includes(scaleId);

  function update(next: { r?: number; s?: string; box?: string }) {
    setParams({
      r: String(next.r ?? root),
      s: next.s ?? scaleId,
      box: next.box ?? box,
    });
  }

  return (
    <div>
      <PageHeader
        kicker="Escalas"
        title="Cinco notas ya alcanzan para hablar."
        lede="La pentatónica menor es la primera que conviene tener en los dedos. La mayor es la madre de los modos. El mástil muestra solo las notas que pertenecen."
      />
      <div className="mb-5 space-y-4">
        <Field label="Tónica">
          <RootPicker value={root} onChange={(pc) => update({ r: pc })} naming={prefs.naming} />
        </Field>
        <div className="flex flex-wrap gap-1.5">
          {SCALES.filter((item) => item.id !== "chromatic").map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => update({ s: item.id, box: "all" })}
              className={`rounded-full px-3 py-1.5 text-sm ${item.id === scaleId ? "bg-amber text-paper-ink" : "bg-white/5"}`}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Segmented<"nota" | "grado">
            value={labels}
            onChange={setLabels}
            options={[
              { id: "nota", label: "Notas" },
              { id: "grado", label: "Grados" },
            ]}
          />
          {BOXABLE.has(scaleId) ? (
            <Segmented value={box} onChange={(id) => update({ box: id })} options={BOXES.map((item) => ({ id: item.id, label: item.name }))} />
          ) : null}
        </div>
      </div>
      <article className="mb-5 max-w-3xl">
        <p className="font-serif text-3xl">
          {noteName(root, prefs.naming)} {scale.name.toLowerCase()}
        </p>
        <p className="mt-2 text-sm text-amber">{scale.formula}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{scale.use}</p>
        <p className="mt-3 text-sm">
          {scale.intervals.map((interval) => (
            <span key={interval} className="mr-2 inline-block rounded-full bg-white/5 px-2 py-1">
              {noteName((root + interval) % 12, prefs.naming)}
            </span>
          ))}
        </p>
        {showRelative ? (
          <p className="mt-3 text-sm text-muted">
            Relativa: {noteName((root + relativeShift) % 12, prefs.naming)} {scaleId === "major" || scaleId === "pentMaj" ? "menor" : "mayor"}. Mismas notas, otra tónica.
          </p>
        ) : null}
      </article>
      <Fretboard
        naming={prefs.naming}
        root={root}
        intervals={scale.intervals}
        box={box}
        labels={labels}
        onNote={(note) => {
          if (prefs.preview) playMidi(note.midi);
        }}
      />
      {scaleId === "pentMin" ? (
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
          La caja 1 pone la tónica en la 6ª cuerda y ocupa cuatro trastes. En La empieza en el 5. En Mi, en el aire. Las otras cajas son la misma escala, más arriba, para no vivir en un solo dibujo.
        </p>
      ) : null}
    </div>
  );
}
