import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Naming } from "../lib/api";

type FavKind = "songs" | "riffs";

interface PrefState {
  accidental: "auto" | "sharp" | "flat";
  system: "cipher" | "latin";
  preview: boolean;
  studied: Record<string, boolean>;
  favs: Record<FavKind, string[]>;
  naming: Naming;
  setAccidental: (value: "auto" | "sharp" | "flat") => void;
  setSystem: (value: "cipher" | "latin") => void;
  setPreview: (value: boolean) => void;
  toggleStudied: (id: string) => void;
  toggleFav: (kind: FavKind, id: string) => void;
  isFav: (kind: FavKind, id: string) => boolean;
}

const KEY = "mastil-v1";
const PrefsContext = createContext<PrefState | null>(null);

function read() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}") as Partial<{
      accidental: PrefState["accidental"];
      system: PrefState["system"];
      preview: boolean;
      studied: Record<string, boolean>;
      favs: Record<FavKind, string[]>;
    }>;
    return {
      accidental: raw.accidental ?? "auto",
      system: raw.system ?? "cipher",
      preview: raw.preview ?? true,
      studied: raw.studied ?? {},
      favs: raw.favs ?? { songs: [], riffs: [] },
    };
  } catch {
    return {
      accidental: "auto" as const,
      system: "cipher" as const,
      preview: true,
      studied: {},
      favs: { songs: [] as string[], riffs: [] as string[] },
    };
  }
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const initial = read();
  const [accidental, setAccidental] = useState(initial.accidental);
  const [system, setSystem] = useState(initial.system);
  const [preview, setPreview] = useState(initial.preview);
  const [studied, setStudied] = useState(initial.studied);
  const [favs, setFavs] = useState(initial.favs);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ accidental, system, preview, studied, favs }));
  }, [accidental, system, preview, studied, favs]);

  const value = useMemo<PrefState>(() => {
    const naming: Naming = { accidental, system };
    return {
      accidental,
      system,
      preview,
      studied,
      favs,
      naming,
      setAccidental,
      setSystem,
      setPreview,
      toggleStudied: (id) => setStudied((current) => ({ ...current, [id]: !current[id] })),
      toggleFav: (kind, id) =>
        setFavs((current) => {
          const list = current[kind];
          const next = list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
          return { ...current, [kind]: next };
        }),
      isFav: (kind, id) => favs[kind].includes(id),
    };
  }, [accidental, system, preview, studied, favs]);

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs fuera del proveedor");
  return ctx;
}
