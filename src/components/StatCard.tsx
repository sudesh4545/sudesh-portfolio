import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { useCountUp } from '../hooks/useCountUp';
import { accent as accentMap } from '../lib/accents';
import { cn } from '../lib/cn';
import type { Stat } from '../types';
import { GlassCard } from './GlassCard';
import { Icon } from './Icon';

interface StatCardProps {
  stat: Stat;
  index: number;
}

/** A single metric. Counts up on first view; labels itself when it is sample data. */
export function StatCard({ stat, index }: StatCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReduced = useReducedMotion();
  const counted = useCountUp(stat.value ?? 0, inView, 1700);
  const tone = accentMap[stat.accent];

  const shown = stat.value === null ? (stat.display ?? '—') : `${stat.prefix ?? ''}${counted}${stat.suffix ?? ''}`;

  return (
    <motion.div
      ref={ref}
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: prefersReduced ? 0.3 : 0.65,
        delay: prefersReduced ? 0 : index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="h-full"
    >
      <GlassCard interactive accent={stat.accent} className="h-full">
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-14 left-1/2 size-28 -translate-x-1/2 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-90',
            tone.wash,
          )}
        />

        <div className="relative flex h-full flex-col items-center gap-3 p-5 text-center sm:p-6">
          <span
            className={cn(
              'inline-flex size-11 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110',
              tone.chip,
            )}
          >
            <Icon name={stat.icon} className="size-5" />
          </span>

          <p
            className={cn(
              'font-display text-[clamp(1.8rem,5.4vw,2.6rem)] leading-none font-bold tabular-nums',
              tone.text,
            )}
          >
            {shown}
          </p>

          <div>
            <h3 className="font-display text-[0.72rem] font-semibold tracking-[0.16em] text-paper uppercase">
              {stat.label}
            </h3>
            <p className="mt-1 text-[0.7rem] leading-snug text-faint">{stat.caption}</p>
          </div>

          {stat.placeholder && (
            <span
              title="Sample value — replace it in src/data/portfolio.ts"
              className="mt-auto rounded-full border border-dashed border-white/15 px-2 py-0.5 font-display text-[0.5rem] font-semibold tracking-[0.2em] text-faint uppercase"
            >
              Sample
            </span>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
