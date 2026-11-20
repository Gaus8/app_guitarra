import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { PageHeader } from "../components/ui";
import { usePrefs } from "../context/Prefs";
import { LESSONS, lessonById } from "../data";
import { chordSymbol, diatonic, keySignature, noteName } from "../lib/api";

const FIFTHS = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];

export function TheoryView() {
  const { chapter } = useParams();
  const prefs = usePrefs();
  const lesson = lessonById(chapter);
  const [keyRoot, setKeyRoot] = useState(0);
  const [mode, setMode] = useState<"major" | "minor">("major");
  const signature = keySignature(keyRoot, mode);
  const chords = diatonic(keyRoot, mode);
  const showCircle = lesson.id === "circulo" || lesson.id === "tonalidad";

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {LESSONS.map((item) => (
          <Link
            key={item.id}
            to={`/teoria/${item.id}`}
            className={`shrink-0 rounded-2xl px-3 py-2 text-sm ${item.id === lesson.id ? "bg-amber text-paper-ink" : "bg-white/5 text-ink hover:bg-white/10"}`}
          >
            {item.title}
          </Link>
        ))}
      </aside>
      <article>
        <PageHeader kicker={lesson.kicker} title={lesson.title} />
        <div className="max-w-3xl space-y-4 text-base leading-relaxed">
          {lesson.blocks.map((block, index) => {
            if (block.type === "ul") {
              return (
                <ul key={index} className="list-disc space-y-1 pl-5 text-ink/90">
                  {block.items?.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            }
            if (block.type === "note") {
              return (
                <p key={index} className="rounded-2xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber-2">
                  {block.text}
                </p>
              );
            }
            return (
              <p key={index} className="text-ink/90">
                {block.text}
              </p>
            );
          })}
        </div>
        {showCircle ? (
          <section className="mt-10">
            <h2 className="font-serif text-3xl">Círculo</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">Afuera, las tonalidades mayores. Adentro, su relativa menor. Elige una y mira la familia de acordes.</p>
            <div className="relative mx-auto mt-6 h-[340px] w-[340px] max-w-full">
              {FIFTHS.map((pc, index) => {
                const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
                const minor = (pc + 9) % 12;
                return (
                  <span key={pc}>
                    <button
                      type="button"
                      onClick={() => {
                        setKeyRoot(pc);
                        setMode("major");
                      }}
                      style={{ left: `${50 + Math.cos(angle) * 42}%`, top: `${50 + Math.sin(angle) * 42}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-xs ${mode === "major" && keyRoot === pc ? "bg-amber text-paper-ink" : "bg-panel text-ink"}`}
                    >
                      {noteName(pc, prefs.naming)}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setKeyRoot(minor);
                        setMode("minor");
                      }}
                      style={{ left: `${50 + Math.cos(angle) * 24}%`, top: `${50 + Math.sin(angle) * 24}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-[10px] ${mode === "minor" && keyRoot === minor ? "bg-sea text-[#071018]" : "bg-white/10 text-muted"}`}
                    >
                      {noteName(minor, prefs.naming)}
                    </button>
                  </span>
                );
              })}
            </div>
            <div className="mt-4 rounded-3xl bg-panel p-5">
              <p className="font-serif text-3xl">
                {noteName(keyRoot, prefs.naming)} {mode === "major" ? "mayor" : "menor"}
              </p>
              <p className="mt-2 text-sm text-muted">
                {signature.count === 0
                  ? "Ninguna alteración en la armadura."
                  : `${signature.count} ${signature.count === 1 ? signature.kind.slice(0, -1) : signature.kind}: ${signature.notes.join(", ")}.`}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {chords.map((chord) => (
                  <Link
                    key={chord.degree}
                    to={`/acordes?r=${chord.pc}&q=${chord.qualityId}`}
                    className="rounded-2xl bg-white/5 px-3 py-2 text-sm hover:bg-amber hover:text-paper-ink"
                  >
                    <span className="block text-[10px] tracking-wide text-amber">{chord.degree}</span>
                    {chordSymbol(chord.pc, chord.qualityId, prefs.naming)}
                  </Link>
                ))}
              </div>
              {mode === "minor" ? (
                <p className="mt-4 text-sm text-muted">En menor natural el V es menor. En la menor armónica ese grado sube y se vuelve mayor: es el Mi de un Lam, el acorde que pide volver a casa.</p>
              ) : null}
            </div>
          </section>
        ) : null}
      </article>
    </div>
  );
}
