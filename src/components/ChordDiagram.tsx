import type { Voicing } from "../lib/api";
import { OPEN_PC } from "../lib/api";

export function ChordDiagram({ voicing, small = false, label }: { voicing: Voicing; small?: boolean; label?: string }) {
  const frets = voicing.frets;
  const fingers = voicing.fingers;
  const sounded = frets.filter((fret) => fret > 0);
  const min = sounded.length ? Math.min(...sounded) : 1;
  const max = sounded.length ? Math.max(...sounded) : 1;
  const nut = frets.includes(0) || min <= 1 || sounded.length === 0;
  const start = nut ? 1 : min;
  const count = Math.max(4, nut ? max : max - min + 1);
  const sGap = small ? 16 : 26;
  const fGap = small ? 20 : 30;
  const left = small ? 18 : 32;
  const top = small ? 20 : 34;
  const width = left + sGap * 5 + (small ? 12 : 18);
  const height = top + fGap * count + (small ? 6 : 10);
  const xOf = (stringIndex: number) => left + stringIndex * sGap;
  const yOf = (fret: number) => top + (fret - start) * fGap + fGap / 2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={small ? "h-28 w-full" : "h-auto w-full max-w-[240px]"} role="img" aria-label={label ?? "Diagrama de acorde"}>
      {Array.from({ length: count + 1 }, (_, row) => {
        const y = top + row * fGap;
        const thick = nut && row === 0;
        return <line key={`fret-${row}`} x1={left} y1={y} x2={left + sGap * 5} y2={y} stroke={thick ? "#241c16" : "#8d7d6c"} strokeWidth={thick ? 4 : 1.25} />;
      })}
      {frets.map((_, stringIndex) => (
        <line
          key={`string-${stringIndex}`}
          x1={xOf(stringIndex)}
          y1={top}
          x2={xOf(stringIndex)}
          y2={top + count * fGap}
          stroke="#241c16"
          strokeWidth={2.3 - stringIndex * 0.22}
        />
      ))}
      {!nut ? (
        <text x={8} y={top + fGap * 0.72} fill="#241c16" fontSize={small ? 10 : 13} fontFamily="Outfit, sans-serif">
          {start}
        </text>
      ) : null}
      {voicing.barre && voicing.barre.fret >= start && voicing.barre.fret < start + count ? (
        <line
          x1={xOf(voicing.barre.from)}
          y1={yOf(voicing.barre.fret)}
          x2={xOf(voicing.barre.to)}
          y2={yOf(voicing.barre.fret)}
          stroke="#241c16"
          strokeWidth={small ? 7 : 10}
          strokeLinecap="round"
        />
      ) : null}
      {frets.map((fret, stringIndex) => {
        const x = xOf(stringIndex);
        if (fret < 0) {
          return (
            <text key={`mark-${stringIndex}`} x={x} y={top - 6} textAnchor="middle" fill="#8a4032" fontSize={small ? 11 : 14}>
              ×
            </text>
          );
        }
        if (fret === 0) {
          return (
            <text key={`mark-${stringIndex}`} x={x} y={top - 6} textAnchor="middle" fill="#241c16" fontSize={small ? 11 : 13}>
              ○
            </text>
          );
        }
        const isRoot = (OPEN_PC[stringIndex] + fret) % 12 === voicing.rootPc;
        const y = yOf(fret);
        const radius = small ? 6.5 : 10;
        return (
          <g key={`dot-${stringIndex}`}>
            <circle cx={x} cy={y} r={radius} fill={isRoot ? "#e39a45" : "#241c16"} />
            {fingers[stringIndex] ? (
              <text
                x={x}
                y={y + (small ? 2.5 : 4)}
                textAnchor="middle"
                fill={isRoot ? "#241c16" : "#f6f0e6"}
                fontSize={small ? 8 : 12}
                fontFamily="Outfit, sans-serif"
              >
                {fingers[stringIndex]}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
