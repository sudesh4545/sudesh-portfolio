import { useEffect, useState } from 'react';

/**
 * Scroll-spy for the navbar.
 *
 * The section crossing an imaginary line ~42% down the viewport wins, which
 * matches what a reader perceives as "the section I'm looking at".
 *
 * Scheduling deliberately avoids `requestAnimationFrame`: browsers throttle it
 * hard in background/occluded tabs, which used to leave the highlight stuck on
 * whichever section was current when the tab lost focus. A timestamp throttle
 * with a trailing call keeps reads cheap (8 `getBoundingClientRect()` calls, no
 * interleaved writes, so no layout thrash) and always settles on the truth.
 */
export function useActiveSection(ids: readonly string[], offset = 0.42): string {
  const [active, setActive] = useState<string>(ids[0] ?? '');

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const THROTTLE_MS = 90;
    let lastRun = 0;
    let trailing = 0;

    const compute = () => {
      lastRun = performance.now();
      const line = window.innerHeight * offset;
      let current = elements[0].id;

      for (const el of elements) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }

      // Pin to the first/last section at the extremes of the page.
      if (window.scrollY < 8) current = elements[0].id;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) current = elements[elements.length - 1].id;

      setActive(current);
    };

    const schedule = () => {
      const elapsed = performance.now() - lastRun;
      if (elapsed >= THROTTLE_MS) {
        window.clearTimeout(trailing);
        trailing = 0;
        compute();
      } else if (trailing === 0) {
        // Always run once more after the burst so the final position wins.
        trailing = window.setTimeout(() => {
          trailing = 0;
          compute();
        }, THROTTLE_MS - elapsed);
      }
    };

    compute();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.clearTimeout(trailing);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ids, offset]);

  return active;
}
