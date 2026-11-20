import * as M from "./music.js";

export interface Naming {
  accidental?: "auto" | "sharp" | "flat";
  system?: "cipher" | "latin";
}

export interface Voicing {
  frets: number[];
  fingers: number[];
  barre: { fret: number; from: number; to: number } | null;
  rootPc: number;
  quality: string;
  name: string;
  priority: number;
  signature: string;
}

export interface Quality {
  id: string;
  name: string;
  symbol: string;
  tokens: string[];
  group: string;
  blurb: string;
}

export interface ScaleDef {
  id: string;
  name: string;
  aka: string;
  intervals: number[];
  formula: string;
  use: string;
}

export interface ChordTone {
  token: string;
  semi: number;
  name: string;
}

export interface ParsedChord {
  rootPc: number;
  qualityId: string;
  rootName: string;
  symbol: string;
}

export interface DiatonicChord {
  degree: string;
  pc: number;
  qualityId: string;
  scaleDegree: number;
}

export interface Signature {
  count: number;
  kind: string;
  notes: string[];
}

export interface FretNote {
  midi: number;
  pc: number;
  stringIndex: number;
  fret: number;
}

export interface IntervalDef {
  semi: number;
  name: string;
  short: string;
}

export interface DetectedChord {
  rootPc: number;
  qualityId: string;
  extra: number;
  size: number;
}

export const SHARP = M.SHARP as string[];
export const FLAT = M.FLAT as string[];
export const OPEN_PC = M.OPEN_PC as number[];
export const OPEN_MIDI = M.OPEN_MIDI as number[];
export const STRING_NAME = M.STRING_NAME as string[];
export const STRING_SHORT = M.STRING_SHORT as string[];
export const INTERVALS = M.INTERVALS as IntervalDef[];
export const QUALITIES = M.QUALITIES as Quality[];
export const SCALES = M.SCALES as ScaleDef[];

export const qualityById = M.qualityById as (id: string) => Quality | null;
export const scaleById = M.scaleById as (id: string) => ScaleDef | null;
export const noteName = M.noteName as (pc: number, naming?: Naming) => string;
export const bothNames = M.bothNames as (pc: number, naming?: Naming) => { cipher: string; latin: string };
export const chordTones = M.chordTones as (rootPc: number, qualityId: string, naming?: Naming) => ChordTone[];
export const voicingsFor = M.voicingsFor as (rootPc: number, qualityId: string) => Voicing[];
export const chordSymbol = M.chordSymbol as (rootPc: number, qualityId: string, naming?: Naming) => string;
export const parseChord = M.parseChord as (symbol: string) => ParsedChord | null;
export const findVoicing = M.findVoicing as (symbol: string, hint?: string | number[]) => Voicing | null;
export const scaleIntervals = M.scaleIntervals as (scaleId: string) => number[];
export const diatonic = M.diatonic as (rootPc: number, mode: "major" | "minor") => DiatonicChord[];
export const keySignature = M.keySignature as (rootPc: number, mode: "major" | "minor") => Signature;
export const detectChords = M.detectChords as (pcs: number[]) => DetectedChord[];
export const noteAt = M.noteAt as (stringIndex: number, fret: number) => FretNote;
export const midiToFreq = M.midiToFreq as (midi: number) => number;
export const octaveOf = M.octaveOf as (midi: number) => number;
export const ensureAudio = M.ensureAudio as () => AudioContext | null;
export const pluck = M.pluck as (midi: number, when?: number | null, dur?: number, bend?: boolean) => void;
export const strumFrets = M.strumFrets as (frets: number[], when?: number | null, gap?: number) => void;
export const playMidi = M.playMidi as (midi: number) => void;
export const stopAudio = M.stopAudio as () => void;

const LATIN_LETTER: Record<string, string> = { C: "Do", D: "Re", E: "Mi", F: "Fa", G: "Sol", A: "La", B: "Si" };

export function displaySpelling(cipher: string, naming: Naming) {
  if (naming.system !== "latin") return cipher;
  return cipher.replace(/[A-G]/g, (letter) => LATIN_LETTER[letter] ?? letter).replaceAll("#", "♯").replaceAll("b", "♭");
}

export function spellInChord(rootPc: number, qualityId: string, pc: number, naming: Naming) {
  const semi = (((pc - rootPc) % 12) + 12) % 12;
  const tone = chordTones(rootPc, qualityId, naming).find((item) => ((item.semi % 12) + 12) % 12 === semi);
  if (!tone) return noteName(pc, naming);
  return displaySpelling(tone.name, naming);
}

export function labelChord(symbol: string, naming: Naming, shift = 0) {
  const parsed = parseChord(symbol);
  if (!parsed) return symbol;
  return chordSymbol((parsed.rootPc + shift + 120) % 12, parsed.qualityId, naming);
}

export function applyCapo(frets: number[], capo: number) {
  if (!capo) return frets;
  return frets.map((fret) => (fret < 0 ? -1 : fret + capo));
}
