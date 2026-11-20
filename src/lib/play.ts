import { OPEN_MIDI, applyCapo, ensureAudio, findVoicing, pluck, strumFrets } from "./api";
import { later, trackNode } from "./transport";
import type { Song, Strum } from "../data";

export function scheduleClick(when: number, accent: boolean) {
  const ctx = ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(accent ? 1500 : 980, when);
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(accent ? 0.11 : 0.05, when + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.05);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(when);
  osc.stop(when + 0.06);
  trackNode(osc);
}

function sounding(frets: number[]) {
  const notes: number[] = [];
  frets.forEach((fret, index) => {
    if (fret >= 0) notes.push(OPEN_MIDI[index] + fret);
  });
  return notes;
}

function arpeggiate(frets: number[], when: number, beats: number, beatDur: number, sub: number) {
  const notes = sounding(frets);
  if (!notes.length) return;
  const step = beatDur / sub;
  const total = Math.max(1, beats * sub);
  for (let i = 0; i < total; i++) {
    pluck(notes[i % notes.length], when + i * step, step * 2.4);
  }
}

function boomchick(frets: number[], when: number, beats: number, beatDur: number) {
  const notes = sounding(frets);
  if (!notes.length) return;
  for (let beat = 0; beat < beats; beat++) {
    const time = when + beat * beatDur;
    if (beat % 2 === 0) pluck(notes[0], time, 0.32);
    else strumFrets(frets, time, 0.012);
  }
}

export function playShape(symbol: string, hint: string | undefined, capo: number) {
  const voicing = findVoicing(symbol, hint);
  if (!voicing) return;
  strumFrets(applyCapo(voicing.frets, capo));
}

export function scheduleSong(
  song: Song,
  bpm: number,
  onBar: (id: string | null) => void,
) {
  const ctx = ensureAudio();
  if (!ctx) return 0;
  const beat = 60 / bpm;
  const start = ctx.currentTime + 0.1;
  let cursor = 0;
  song.sections.forEach((section, sectionIndex) => {
    section.bars.forEach((bar, barIndex) => {
      const when = start + cursor * beat;
      const voicing = findVoicing(bar.c, song.hints?.[bar.c]);
      if (voicing) {
        const frets = applyCapo(voicing.frets, song.capo);
        if (song.feel === "arpeggio") arpeggiate(frets, when, bar.beats, beat, song.meter === "6/8" ? 3 : 2);
        else if (song.feel === "boom") boomchick(frets, when, bar.beats, beat);
        else strumFrets(frets, when, 0.026);
      }
      const id = `${sectionIndex}-${barIndex}`;
      later((when - ctx.currentTime) * 1000, () => onBar(id));
      cursor += bar.beats;
    });
  });
  const ms = cursor * beat * 1000;
  later((start - ctx.currentTime) * 1000 + ms, () => onBar(null));
  return ms + 80;
}

export function scheduleStrum(strum: Strum, bpm: number, frets: number[], loops = 4, onStep?: (index: number) => void) {
  const ctx = ensureAudio();
  if (!ctx) return 0;
  const beat = 60 / bpm;
  const start = ctx.currentTime + 0.08;
  const low = sounding(frets)[0];
  for (let loop = 0; loop < loops; loop++) {
    for (let beatIndex = 0; beatIndex < strum.meter; beatIndex++) {
      scheduleClick(start + (loop * strum.meter + beatIndex) * beat, beatIndex === 0);
    }
    strum.steps.forEach((step, index) => {
      const when = start + (loop * strum.meter + step.t) * beat;
      if (step.dir === "B" && low) pluck(low, when, 0.28);
      else strumFrets(frets, when, step.dir === "U" ? -0.018 : 0.02);
      if (onStep) later((when - ctx.currentTime) * 1000, () => onStep(index));
    });
  }
  return loops * strum.meter * beat * 1000;
}

export function scheduleRiff(
  notes: { s: number; f: number; t: number; bend?: boolean }[],
  bpm: number,
  onTime: (time: number | null) => void,
) {
  const ctx = ensureAudio();
  if (!ctx) return 0;
  const beat = 60 / bpm;
  const start = ctx.currentTime + 0.08;
  let end = 0;
  notes.forEach((note) => {
    const when = start + note.t * beat;
    pluck(OPEN_MIDI[note.s] + note.f, when, 0.55, Boolean(note.bend));
    later((when - ctx.currentTime) * 1000, () => onTime(note.t));
    end = Math.max(end, note.t);
  });
  const ms = (end + 0.8) * beat * 1000;
  later((start - ctx.currentTime) * 1000 + ms, () => onTime(null));
  return ms;
}
