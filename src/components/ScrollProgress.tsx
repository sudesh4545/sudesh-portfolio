import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/** Hairline cyan→purple reading-progress bar pinned to the very top. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const prefersReduced = useReducedMotion();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: prefersReduced ? scrollYProgress : smooth }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-magenta shadow-[0_0_12px_rgba(0,240,255,0.6)]"
    />
  );
}
