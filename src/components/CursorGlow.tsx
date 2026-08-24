import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useMediaQuery } from '../hooks/useMediaQuery';

/**
 * A soft cyan/purple glow that trails the pointer.
 * Desktop-only (fine pointers), never replaces the system cursor, always
 * `pointer-events: none`, and disabled entirely under reduced motion.
 */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null);
  const hasFinePointer = useMediaQuery('(pointer: fine)');
  const prefersReduced = useReducedMotion();
  const enabled = hasFinePointer && !prefersReduced;

  useEffect(() => {
    if (!enabled) return;
    const glow = glowRef.current;
    if (!glow) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let frame = 0;
    let visible = false;

    const loop = () => {
      // Lerp toward the pointer for a weighted, premium feel.
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

      // Once the glow has caught up, stop the loop entirely. A trailing glow
      // that keeps running at 60fps composites a screen-blend layer every frame
      // even while the reader is just scrolling — the commonest hidden drain on
      // a page like this. The next pointer move kicks it straight back to life.
      const dx = targetX - x;
      const dy = targetY - y;
      if (dx * dx + dy * dy < 0.2) {
        frame = 0;
        return;
      }
      frame = window.requestAnimationFrame(loop);
    };

    const kick = () => {
      if (frame === 0) frame = window.requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        glow.style.opacity = '1';
      }
      kick();
    };

    const onLeave = () => {
      visible = false;
      glow.style.opacity = '0';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      // No `mix-blend-mode` here: blending a 26rem fixed layer forces a
      // full-screen composite, and the pointer usually moves while scrolling, so
      // it would land squarely on the scroll path. Additive-looking colours over
      // near-black get the same effect for free.
      className="pointer-events-none fixed top-0 left-0 z-[90] size-[26rem] opacity-0 transition-opacity duration-500 will-change-transform"
      style={{
        background:
          'radial-gradient(circle, rgba(0,240,255,0.09) 0%, rgba(138,43,226,0.07) 38%, transparent 68%)',
      }}
    />
  );
}
