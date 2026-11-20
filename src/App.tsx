import { useEffect, useRef } from "react";
import { NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { usePrefs } from "./context/Prefs";
import { stopTransport } from "./lib/transport";
import { Segmented } from "./components/ui";
import { HomeView } from "./views/HomeView";
import { FretboardView } from "./views/FretboardView";
import { ChordsView } from "./views/ChordsView";
import { FormationView } from "./views/FormationView";
import { ScalesView } from "./views/ScalesView";
import { TheoryView } from "./views/TheoryView";
import { SongsView } from "./views/SongsView";
import { RiffsView } from "./views/RiffsView";
import { PracticeView } from "./views/PracticeView";

const NAV = [
  { to: "/", label: "Inicio", end: true },
  { to: "/diapason", label: "Diapasón" },
  { to: "/acordes", label: "Acordes" },
  { to: "/formacion", label: "Formación" },
  { to: "/escalas", label: "Escalas" },
  { to: "/teoria", label: "Teoría" },
  { to: "/canciones", label: "Canciones" },
  { to: "/riffs", label: "Riffs" },
  { to: "/practica", label: "Práctica" },
];

export function App() {
  const prefs = usePrefs();
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
    stopTransport();
  }, [pathname]);

  return (
    <div className="min-h-screen bg-bg text-ink md:grid md:h-screen md:grid-cols-[240px_1fr] md:overflow-hidden">
      <aside className="sticky top-0 z-30 border-b border-white/10 bg-bg/95 backdrop-blur md:static md:flex md:h-screen md:flex-col md:overflow-y-auto md:border-r md:border-b-0">
        <div className="px-4 py-4">
          <p className="font-serif text-3xl italic">Mástil</p>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Cuaderno de guitarra</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible">
          {NAV.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex shrink-0 items-baseline gap-3 rounded-2xl px-3 py-2 text-sm ${isActive ? "bg-white/10 text-amber" : "text-ink/80 hover:bg-white/5"}`
              }
            >
              <span className="w-5 text-[11px] text-muted">{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 px-3 py-3">
          <Segmented
            value={prefs.system}
            onChange={prefs.setSystem}
            options={[
              { id: "cipher", label: "C D E" },
              { id: "latin", label: "Do Re Mi" },
            ]}
          />
          <Segmented
            value={prefs.accidental}
            onChange={prefs.setAccidental}
            options={[
              { id: "auto", label: "Auto" },
              { id: "sharp", label: "#" },
              { id: "flat", label: "b" },
            ]}
          />
          <label className="flex items-center gap-2 px-1 text-xs text-muted">
            <input type="checkbox" checked={prefs.preview} onChange={(event) => prefs.setPreview(event.target.checked)} className="accent-amber" />
            Sonar al pulsar
          </label>
        </div>
      </aside>
      <main ref={mainRef} className="px-4 py-6 md:overflow-y-auto md:px-8 md:py-8">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/diapason" element={<FretboardView />} />
          <Route path="/acordes" element={<ChordsView />} />
          <Route path="/formacion" element={<FormationView />} />
          <Route path="/escalas" element={<ScalesView />} />
          <Route path="/teoria" element={<TheoryView />} />
          <Route path="/teoria/:chapter" element={<TheoryView />} />
          <Route path="/canciones" element={<SongsView />} />
          <Route path="/canciones/:id" element={<SongsView />} />
          <Route path="/riffs" element={<RiffsView />} />
          <Route path="/riffs/:id" element={<RiffsView />} />
          <Route path="/practica" element={<PracticeView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <footer className="mt-16 text-xs text-muted">Mástil · para estudiar con la guitarra en la mano.</footer>
      </main>
    </div>
  );
}
