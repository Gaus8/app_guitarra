import { stopAudio } from "./music.js";

const timers = new Set<number>();
const nodes: AudioScheduledSourceNode[] = [];

export function later(ms: number, fn: () => void) {
  const id = window.setTimeout(() => {
    timers.delete(id);
    fn();
  }, Math.max(0, ms));
  timers.add(id);
}

export function trackNode(node: AudioScheduledSourceNode) {
  nodes.push(node);
  node.addEventListener("ended", () => {
    const index = nodes.indexOf(node);
    if (index >= 0) nodes.splice(index, 1);
  });
}

export function stopTransport() {
  timers.forEach((id) => clearTimeout(id));
  timers.clear();
  nodes.forEach((node) => {
    try {
      node.stop();
    } catch {
      /* ya estaba parado */
    }
  });
  nodes.length = 0;
  stopAudio();
}
