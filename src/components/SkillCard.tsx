import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { useCountUp } from '../hooks/useCountUp';
import { accent as accentMap } from '../lib/accents';
import { cn } from '../lib/cn';
import type { Skill } from '../types';
import { GlassCard } from './GlassCard';
import { TechIcon } from './TechIcon';

interface SkillCardProps {
  skill: Skill;
  /** Stagger index for the entrance animation. */
  index: number;
}

/** One technology: brand mark, proficiency bar and a counting percentage. */
export function SkillCard({ skill, index }: SkillCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const prefersReduced = useReducedMotion();
  const percent = useCountUp(skill.level, inView, 1400);
  const tone = accentMap[skill.accent];

  return (
    <motion.div
      ref={ref}
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: prefersReduced ? 0.3 : 0.6,
        delay: prefersReduced ? 0 : (index % 3) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <GlassCard interactive accent={skill.accent} className="h-full">
        {/* Accent wash that blooms on hover */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-16 -right-10 size-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100',
            tone.wash,
          )}
        />

        <div className="relative flex h-full flex-col p-5">
          <div className="flex items-start gap-3.5">
            <span className="glass-well inline-flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
              <TechIcon name={skill.tech} className="size-6" />
            </span>

            <div className="min-w-0 flex-1">
              <h3 className="truncate font-display text-[0.95rem] font-semibold text-paper">{skill.name}</h3>
              <p className="truncate text-[0.7rem] tracking-wide text-faint">{skill.category}</p>
            </div>

            <span className={cn('font-display text-sm font-bold tabular-nums', tone.text)}>
              {percent}
              <span className="text-[0.7em]">%</span>
            </span>
          </div>

          {/* Proficiency track */}
          <div className="mt-5">
            <div
              role="meter"
              aria-valuenow={skill.level}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${skill.name} proficiency`}
              className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]"
            >
              <motion.span
                initial={{ width: 0 }}
                animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                transition={{
                  duration: prefersReduced ? 0.3 : 1.4,
                  delay: prefersReduced ? 0 : 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={cn('absolute inset-y-0 left-0 rounded-full bg-gradient-to-r', tone.bar)}
              >
                {/* Bright leading edge */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 right-0 w-4 rounded-full bg-white/70 blur-[3px]"
                />
              </motion.span>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
