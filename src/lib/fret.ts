export const BOXES: { id: string; name: string; from?: number; to?: number }[] = [
  { id: "all", name: "Todo el mástil" },
  { id: "1", name: "Caja 1", from: 0, to: 3 },
  { id: "2", name: "Caja 2", from: 2, to: 5 },
  { id: "3", name: "Caja 3", from: 5, to: 8 },
  { id: "4", name: "Caja 4", from: 7, to: 10 },
  { id: "5", name: "Caja 5", from: 9, to: 12 },
];

export function fretInBox(fret: number, rootPc: number, boxId: string) {
  const box = BOXES.find((item) => item.id === boxId);
  if (!box || box.from == null || box.to == null) return true;
  const rootFret = (rootPc - 4 + 12) % 12;
  let start = rootFret + box.from;
  let end = rootFret + box.to;
  if (start > 12) {
    start -= 12;
    end -= 12;
  }
  return fret >= start && fret <= end;
}

export function roleOf(pc: number, root: number, intervals: number[]) {
  const semi = (pc - root + 12) % 12;
  if (!intervals.includes(semi)) return null;
  if (semi === 0) return "root";
  if (semi === 3 || semi === 4) return "third";
  if (semi === 6) return "blue";
  if (semi === 7 || semi === 8) return "fifth";
  if (semi === 9 || semi === 10 || semi === 11) return "seventh";
  return "scale";
}

export const ROLE_CLASS: Record<string, string> = {
  root: "bg-amber text-paper-ink",
  third: "bg-sea text-[#071018]",
  fifth: "bg-moss text-[#10160c]",
  seventh: "bg-plum text-white",
  blue: "bg-rose text-white",
  scale: "bg-[#f0e2cc] text-paper-ink",
  color: "bg-amber-2 text-paper-ink",
};
