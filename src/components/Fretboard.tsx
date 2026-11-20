import { INTERVALS, STRING_NAME, STRING_SHORT, noteAt, noteName, type Naming } from "../lib/api";
import { ROLE_CLASS, fretInBox, roleOf } from "../lib/fret";

const FRET_COUNT = 15;
const INLAYS = [3, 5, 7, 9, 15];

export interface BoardNote {
  midi: number;
  pc: number;
  stringIndex: number;
  fret: number;
}

export function Fretboard({
  naming,
  root,
  intervals,
  box = "all",
  labels = "nota",
  spotlight = null,
  marks = [],
  onNote,
}: {
  naming: Naming;
  root: number;
  intervals: number[] | null;
  box?: string;
  labels?: "nota" | "grado";
  spotlight?: number | null;
  marks?: number[];
  onNote: (note: BoardNote) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-r-2xl bg-gradient-to-b from-[#6a3c22] via-[#4a2918] to-[#341c10] p-3 shadow-2xl shadow-black/40">
      <div className="min-w-[920px]">
        <div className="grid items-end" style={{ gridTemplateColumns: "72px 42px repeat(15, 52px)" }}>
          <span />
          <span className="pb-1 text-center text-[10px] text-[#f3eadc]/50">aire</span>
          {Array.from({ length: FRET_COUNT }, (_, index) => (
            <span key={index} className="pb-1 text-center text-[10px] text-[#f3eadc]/70">
              {index + 1}
            </span>
          ))}
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute top-1/2 right-0 left-[114px] flex -translate-y-1/2">
            {Array.from({ length: FRET_COUNT }, (_, index) => {
              const fret = index + 1;
              const mark = fret === 12 ? "double" : INLAYS.includes(fret) ? "single" : null;
              return (
                <div key={fret} className="flex w-[52px] justify-center gap-1">
                  {mark === "single" ? <i className="h-2.5 w-2.5 rounded-full bg-[#f3eadc]/80" /> : null}
                  {mark === "double" ? (
                    <>
                      <i className="h-2.5 w-2.5 rounded-full bg-[#f3eadc]/80" />
                      <i className="h-2.5 w-2.5 rounded-full bg-[#f3eadc]/80" />
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
          {STRING_NAME.map((name, stringIndex) => (
            <div key={name} className="relative grid h-11 items-center" style={{ gridTemplateColumns: "72px 42px repeat(15, 52px)" }}>
              <div
                className="pointer-events-none absolute right-1 left-[114px] bg-[#f6efe4]/75"
                style={{ height: `${2.4 - stringIndex * 0.28}px` }}
              />
              <div className="absolute top-0 bottom-0 left-[112px] w-[3px] bg-[#f3eadc]" />
              <div className="pr-2 text-right text-[11px] leading-tight text-[#f3eadc]">
                <span className="block font-medium">{STRING_SHORT[stringIndex]}</span>
                <span className="block text-[10px] text-[#f3eadc]/60">{name}</span>
              </div>
              {Array.from({ length: FRET_COUNT + 1 }, (_, fret) => {
                const note = noteAt(stringIndex, fret);
                const inSet = intervals ? intervals.includes((note.pc - root + 12) % 12) : true;
                const placed = fretInBox(fret, root, intervals ? box : "all");
                const role = intervals && inSet && placed ? roleOf(note.pc, root, intervals) : null;
                const spot = spotlight != null && note.pc === spotlight;
                const show = intervals ? Boolean(role) : true;
                const degree = (note.pc - root + 12) % 12;
                const text = labels === "grado" ? (INTERVALS[degree]?.short ?? "") : noteName(note.pc, naming);
                const marked = marks.includes(note.pc);
                const look = role
                  ? ROLE_CLASS[role]
                  : spot || marked
                    ? "bg-amber text-paper-ink"
                    : "bg-black/25 text-[#f6efe4]";
                return (
                  <div key={fret} className={`relative flex h-full items-center justify-center ${fret > 0 ? "border-r border-[#f3eadc]/35" : ""}`}>
                    <button
                      type="button"
                      onClick={() => onNote(note)}
                      className={`relative z-10 grid place-items-center rounded-full ${show ? `h-7 w-7 text-[10px] font-medium ${look} ${marked ? "ring-2 ring-white" : ""}` : "h-2 w-2 bg-white/15"}`}
                      aria-label={`${name}, traste ${fret}, ${noteName(note.pc, naming)}`}
                    >
                      {show ? text : ""}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
