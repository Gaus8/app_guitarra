import { Link } from "react-router-dom";
import { QUALITIES, chordSymbol, noteName } from "../lib/api";
import { TOPICS } from "../data";
import { usePrefs } from "../context/Prefs";
import { PageHeader } from "../components/ui";

const COMMON = ["maj", "min", "7", "maj7", "m7", "sus4"];

export function HomeView() {
  const prefs = usePrefs();
  const day = Math.floor(Date.now() / 86_400_000);
  const root = day % 12;
  const quality = COMMON[day % COMMON.length];
  const done = TOPICS.filter((topic) => prefs.studied[topic.id]).length;

  return (
    <div>
      <PageHeader
        kicker="Cuaderno"
        title="Todo el mapa, en un solo sitio."
        lede="Acordes y cómo se arman, el diapasón, las escalas, el ritmo, canciones conocidas y riffs. Para estudiar con la guitarra en la mano: no hay lecciones que desbloquear."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/diapason" className="rounded-3xl border border-white/10 bg-panel p-5 hover:border-amber/40">
          <p className="text-[11px] tracking-[0.16em] text-amber uppercase">02</p>
          <h2 className="mt-2 font-serif text-2xl">Diapasón</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">Las doce notas, cuerda por cuerda. Pulsa y escucha.</p>
        </Link>
        <Link to={`/acordes?r=${root}&q=${quality}`} className="rounded-3xl border border-white/10 bg-panel p-5 hover:border-amber/40">
          <p className="text-[11px] tracking-[0.16em] text-amber uppercase">Para mirar hoy</p>
          <h2 className="mt-2 font-serif text-2xl">{chordSymbol(root, quality, prefs.naming)}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {noteName(root, { ...prefs.naming, system: "latin" })} · {QUALITIES.find((item) => item.id === quality)?.name}. Cambia cada día.
          </p>
        </Link>
        <Link to="/canciones" className="rounded-3xl border border-white/10 bg-panel p-5 hover:border-amber/40">
          <p className="text-[11px] tracking-[0.16em] text-amber uppercase">07</p>
          <h2 className="mt-2 font-serif text-2xl">Canciones</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">Progresiones reales, sin letra, con el diagrama del acorde que estás por cambiar.</p>
        </Link>
      </div>
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl">Lo que ya miraste</h2>
          <p className="text-sm text-muted">{done} de {TOPICS.length}</p>
        </div>
        <ul className="divide-y divide-white/10 rounded-3xl border border-white/10">
          {TOPICS.map((topic) => (
            <li key={topic.id} className="flex items-center gap-3 px-4 py-3">
              <input
                type="checkbox"
                checked={Boolean(prefs.studied[topic.id])}
                onChange={() => prefs.toggleStudied(topic.id)}
                className="h-4 w-4 accent-amber"
                aria-label={topic.label}
              />
              <Link to={topic.to} className="text-sm text-ink hover:text-amber">
                {topic.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
