import { Info } from 'lucide-react';
import { achievementsCopy, badges, stats } from '../data/portfolio';
import { accent as accentMap, accentHex, withAlpha } from '../lib/accents';
import { cn } from '../lib/cn';
import { GlassCard } from './GlassCard';
import { Icon } from './Icon';
import { Reveal } from './Reveal';
import { Section } from './Section';
import { SectionHeading } from './SectionHeading';
import { StatCard } from './StatCard';

const hasPlaceholders = stats.some((stat) => stat.placeholder) || badges.some((badge) => badge.placeholder);

export function Achievements() {
  return (
    <Section id="achievements" labelledBy="achievements-heading">
      <SectionHeading
        id="achievements-heading"
        eyebrow="Achievements"
        title={achievementsCopy.heading}
        subtitle={achievementsCopy.subheading}
      />

      {/* -------------------------------- Stats ------------------------------- */}
      <ul className="mt-14 grid grid-cols-2 gap-4 lg:mt-16 lg:grid-cols-4 lg:gap-5">
        {stats.map((stat, index) => (
          <li key={stat.id} className="h-full">
            <StatCard stat={stat} index={index} />
          </li>
        ))}
      </ul>

      {/* ------------------------------- Badges ------------------------------- */}
      <Reveal delay={0.1} className="mt-6 lg:mt-8">
        <GlassCard variant="panel" radiusClass="rounded-3xl">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="font-display text-[1.05rem] font-semibold text-paper">Recognition & Milestones</h3>
              <p className="text-[0.75rem] text-faint">Hackathons, certifications and practice tracks</p>
            </div>

            <ul className="mt-6 grid grid-cols-2 gap-3.5 lg:grid-cols-4 lg:gap-4">
              {badges.map((badge, index) => {
                const tone = accentMap[badge.accent];
                const hex = accentHex[badge.accent];

                return (
                  <li key={badge.id}>
                    <Reveal delay={0.14 + index * 0.06} className="h-full">
                      <a
                        href={badge.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${badge.lines.join(' ')} — ${badge.caption}`}
                        className={cn(
                          'group glass-well relative flex h-full flex-col items-center gap-3 overflow-hidden rounded-2xl p-4 text-center',
                          'cursor-pointer transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan',
                          tone.borderHover,
                        )}
                      >
                        {/* Ribbon glow */}
                        <span
                          aria-hidden="true"
                          className="absolute -top-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full opacity-50 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                          style={{ background: withAlpha(hex, 0.5) }}
                        />

                        {/* Hexagonal medal */}
                        <span className="relative inline-flex size-12 items-center justify-center">
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 [clip-path:var(--hex)]"
                            style={{ background: `linear-gradient(150deg, ${hex}, ${withAlpha(hex, 0.2)})` }}
                          />
                          <span
                            aria-hidden="true"
                            className="absolute inset-[1.5px] bg-[#050b13] [clip-path:var(--hex)]"
                          />
                          <Icon name={badge.icon} className={cn('relative size-[1.1rem]', tone.text)} />
                        </span>

                        <p className="font-display text-[0.68rem] leading-[1.4] font-semibold tracking-[0.1em] text-paper/90 uppercase">
                          {badge.lines[0]}
                          <br />
                          {badge.lines[1]}
                        </p>

                        <p className="text-[0.62rem] text-faint">{badge.caption}</p>

                        {badge.placeholder && (
                          <span
                            title="Sample value — replace it in src/data/portfolio.ts"
                            className="mt-auto rounded-full border border-dashed border-white/15 px-2 py-0.5 font-display text-[0.48rem] font-semibold tracking-[0.2em] text-faint uppercase"
                          >
                            Sample
                          </span>
                        )}
                        <span className={cn('mt-auto font-display text-[0.5rem] font-semibold tracking-[0.16em] uppercase', tone.text)}>
                          Open ↗
                        </span>
                      </a>
                    </Reveal>
                  </li>
                );
              })}
            </ul>

            {hasPlaceholders && (
              <p className="mt-6 flex items-start gap-2 rounded-xl border border-dashed border-white/12 bg-white/[0.02] p-3.5 text-[0.72rem] leading-relaxed text-faint">
                <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-brand-cyan/70" />
                <span>
                  The values above are sample data shipped with the template. Replace them with your real
                  numbers in <code className="text-brand-cyan/80">src/data/portfolio.ts</code> and set{' '}
                  <code className="text-brand-cyan/80">placeholder: false</code> to remove these labels.
                </span>
              </p>
            )}
          </div>
        </GlassCard>
      </Reveal>
    </Section>
  );
}
