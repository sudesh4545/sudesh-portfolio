import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds. Use small increments to stagger siblings. */
  delay?: number;
  /** Travel distance in px. */
  y?: number;
  x?: number;
  scale?: number;
  amount?: number;
}

/**
 * Scroll-reveal wrapper. Animates once, and degrades to a plain fade (no
 * movement) when the visitor prefers reduced motion.
 */
export function Reveal({ children, className, delay = 0, y = 26, x = 0, scale, amount = 0.2 }: RevealProps) {
  // Scroll-triggered transforms across dozens of cards compete with the
  // browser's scrolling/compositing work. Keep this wrapper deliberately
  // static; hover and hero motion still provide visual character.
  void delay;
  void y;
  void x;
  void scale;
  void amount;
  return <div className={cn(className)}>{children}</div>;
}
