import type { ButtonHTMLAttributes, ReactNode } from "react";
import { noteName, type Naming } from "../lib/api";

export function PageHeader({ kicker, title, lede }: { kicker: string; title: string; lede?: string }) {
  return (
    <header className="mb-8 max-w-3xl">
      <p className="text-[11px] font-medium tracking-[0.18em] text-amber uppercase">{kicker}</p>
      <h1 className="mt-2 font-serif text-4xl leading-tight text-ink md:text-5xl">{title}</h1>
      {lede ? <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{lede}</p> : null}
    </header>
  );
}

export function Button({
  variant = "ghost",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "paper" }) {
  const look = {
    primary: "bg-amber text-paper-ink hover:bg-amber-2",
    ghost: "bg-white/5 text-ink hover:bg-white/10",
    paper: "bg-paper text-paper-ink hover:bg-white",
  }[variant];
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${look} ${className}`}
    />
  );
}

export function NotePair({ pc, naming, big = false }: { pc: number; naming: Naming; big?: boolean }) {
  const primary = noteName(pc, naming);
  const other = noteName(pc, { ...naming, system: naming.system === "latin" ? "cipher" : "latin" });
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className={big ? "font-serif text-5xl leading-none text-ink" : "font-medium text-ink"}>{primary}</span>
      <span className="text-sm text-muted">{other}</span>
    </span>
  );
}

export function RootPicker({ value, onChange, naming }: { value: number; onChange: (pc: number) => void; naming: Naming }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: 12 }, (_, pc) => {
        const on = pc === value;
        return (
          <button
            key={pc}
            type="button"
            onClick={() => onChange(pc)}
            className={`rounded-full px-3 py-1.5 text-sm transition ${on ? "bg-amber text-paper-ink" : "bg-white/5 text-ink hover:bg-white/10"}`}
          >
            {noteName(pc, naming)}
          </button>
        );
      })}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (id: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-full bg-white/5 p-1">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`rounded-full px-3 py-1 text-xs tracking-wide ${value === option.id ? "bg-amber text-paper-ink" : "text-muted hover:text-ink"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">{label}</p>
      {children}
    </div>
  );
}

export function Disclaimer() {
  return (
    <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-muted">
      Versiones de estudio: la armonía y la digitación para practicar. La grabación puede ir en otro tono, con cejilla, o con más notas de las que caben en un primer arreglo. No hay letras.
    </p>
  );
}
