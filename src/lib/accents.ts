import type { Accent } from '../types';

/** Raw hex values — for canvas, SVG and inline gradients. */
export const accentHex: Record<Accent, string> = {
  cyan: '#00F0FF',
  purple: '#A855F7',
  magenta: '#FF3BD4',
  blue: '#387CFF',
};

/** `#rrggbb` + alpha → `rgba(...)`. */
export function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface AccentClasses {
  /** Accent-coloured text. */
  text: string;
  /** Icon chip: tinted background + border + colour. */
  chip: string;
  /** Resting border tint for cards. */
  border: string;
  /** Border tint on hover (pair with `group`). */
  borderHover: string;
  /** Faint accent wash. */
  wash: string;
  /** Left→right gradient used by progress bars and rails. */
  bar: string;
  /** Drop shadow revealed on card hover. */
  shadowHover: string;
  /** Small hard glow, e.g. status dots and timeline nodes. */
  dot: string;
}

/**
 * Accent → static Tailwind classes.
 * Static strings only, so nothing gets purged from the build.
 */
export const accent: Record<Accent, AccentClasses> = {
  cyan: {
    text: 'text-brand-cyan',
    chip: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/25',
    border: 'border-brand-cyan/20',
    borderHover: 'group-hover:border-brand-cyan/50',
    wash: 'bg-brand-cyan/10',
    bar: 'from-brand-cyan via-[#38e8ff] to-brand-blue',
    shadowHover: 'group-hover:shadow-[0_24px_70px_-30px_rgba(0,240,255,0.55)]',
    dot: 'bg-brand-cyan shadow-[0_0_12px_rgba(0,240,255,0.85)]',
  },
  purple: {
    text: 'text-[#b07bff]',
    chip: 'bg-brand-purple/15 text-[#b07bff] border-brand-purple/30',
    border: 'border-brand-purple/20',
    borderHover: 'group-hover:border-brand-purple/55',
    wash: 'bg-brand-purple/10',
    bar: 'from-brand-purple via-[#a855f7] to-brand-magenta',
    shadowHover: 'group-hover:shadow-[0_24px_70px_-30px_rgba(138,43,226,0.6)]',
    dot: 'bg-brand-purple shadow-[0_0_12px_rgba(138,43,226,0.95)]',
  },
  magenta: {
    text: 'text-[#e879f9]',
    chip: 'bg-brand-magenta/12 text-[#e879f9] border-brand-magenta/30',
    border: 'border-brand-magenta/20',
    borderHover: 'group-hover:border-brand-magenta/50',
    wash: 'bg-brand-magenta/10',
    bar: 'from-brand-magenta via-[#c026d3] to-brand-purple',
    shadowHover: 'group-hover:shadow-[0_24px_70px_-30px_rgba(217,70,239,0.5)]',
    dot: 'bg-brand-magenta shadow-[0_0_12px_rgba(217,70,239,0.9)]',
  },
  blue: {
    text: 'text-[#7aa2ff]',
    chip: 'bg-brand-blue/15 text-[#7aa2ff] border-brand-blue/30',
    border: 'border-brand-blue/20',
    borderHover: 'group-hover:border-brand-blue/55',
    wash: 'bg-brand-blue/10',
    bar: 'from-brand-blue via-[#4b7bff] to-brand-cyan',
    shadowHover: 'group-hover:shadow-[0_24px_70px_-30px_rgba(42,107,255,0.55)]',
    dot: 'bg-brand-blue shadow-[0_0_12px_rgba(42,107,255,0.95)]',
  },
};
