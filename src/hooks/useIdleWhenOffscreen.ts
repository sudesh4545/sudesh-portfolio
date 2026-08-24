import { useEffect, useRef } from 'react';

/**
 * Parks the CSS animations inside a block while that block is scrolled out of
 * view, by toggling the `.anim-idle` class (see index.css).
 *
 * The page runs ~37 infinite CSS animations and 22 of them live in the hero.
 * Without this they keep ticking — repainting and compositing — the whole time
 * the reader is down in Projects or Contact, which is exactly the work that
 * makes a scroll feel heavy. Pausing is invisible to the reader: an animation
 * they cannot see resumes from where it stopped as soon as it matters.
 *
 * `rootMargin` un-pauses slightly before the block reaches the viewport, so the
 * motion is already running by the time it is on screen.
 */
export function useIdleWhenOffscreen<T extends HTMLElement>(rootMargin = '250px') {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => el.classList.toggle('anim-idle', !entry.isIntersecting),
      { rootMargin },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [rootMargin]);

  return ref;
}
