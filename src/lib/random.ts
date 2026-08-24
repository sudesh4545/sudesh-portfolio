/**
 * Deterministic PRNG (mulberry32).
 * Sample visualisations (the contribution heatmap, background particles) use a
 * seed so they look identical on every render and every reload — no flicker,
 * no layout surprises.
 */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
