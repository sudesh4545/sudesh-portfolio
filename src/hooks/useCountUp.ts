import { useEffect, useState } from 'react';

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/**
 * Counts 0 → `target` once `active` becomes true.
 * Honours `prefers-reduced-motion` by jumping straight to the final value.
 */
export function useCountUp(target: number, active: boolean, duration = 1600): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || duration <= 0) {
      setValue(target);
      return;
    }

    let frame = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(easeOutCubic(progress) * target));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return value;
}
