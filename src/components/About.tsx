import { ArrowUpRight, Sparkles } from 'lucide-react';
import { about, aboutHighlights, personal } from '../data/portfolio';
import { accent as accentMap } from '../lib/accents';
import { cn } from '../lib/cn';
import { initialsOf } from '../lib/initials';
import { scrollToSection } from '../lib/scroll';
import { GlassCard } from './GlassCard';
import { Icon } from './Icon';
import { NeonButton } from './NeonButton';
import { Reveal } from './Reveal';
import { Section } from './Section';
import { SectionHeading } from './SectionHeading';

const FACTS = [
  { label: 'Degree', value: personal.degree },
  { label: 'University', value: personal.university },
  { label: 'Location', value: personal.location },
  { label: 'Status', value: personal.availability },
];

/** Portrait frame — a real image when configured, else an initials monogram. */
function Portrait() {
  return (
    <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
      {/* Ambient bloom — kept inside the horizontal bounds so narrow viewports never overflow. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -inset-y-6 rounded-[2rem] bg-brand-purple/12 blur-3xl sm:-inset-x-6"
      />

      <GlassCard variant="panel" radiusClass="rounded-[1.75rem]" className="relative p-3">
        <div className="glass-well relative aspect-[4/5] overflow-hidden rounded-[1.35rem]">
          <div aria-hidden="true" className="cyber-grid-fine absolute inset-0 opacity-40" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(0,240,255,0.16),transparent_62%)]"
          />

          {personal.profileImage ? (
            <img
              src={personal.profileImage}
              alt={`Portrait of ${personal.name}`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
              {/* Monogram medallion */}
              <div className="relative flex size-32 items-center justify-center sm:size-36">
                <span
                  aria-hidden="true"
                  className="anim-spin-slow absolute inset-0 rounded-full border border-dashed border-brand-cyan/35"
                />
                <span
                  aria-hidden="true"
                  className="anim-spin-reverse absolute inset-3 rounded-full border border-brand-purple/30"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-6 rounded-full bg-gradient-to-br from-brand-cyan/25 via-brand-purple/20 to-brand-magenta/25 blur-md"
                />
                <span className="text-gradient-accent relative font-display text-4xl font-bold tracking-tight sm:text-5xl">
                  {initialsOf(personal.name)}
                </span>
              </div>

              <p className="max-w-[15rem] px-4 text-center text-[0.7rem] leading-relaxed text-faint">
                Add your photo as{' '}
                <code className="text-brand-cyan/80">profileImage</code> in{' '}
                <code className="text-brand-cyan/80">src/data/portfolio.ts</code>
              </p>
            </div>
          )}

          {personal.profileImage && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-brand-cyan/[0.04]"
            />
          )}

          {/* Corner brackets */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {[
              'left-3 top-3 border-t border-l',
              'right-3 top-3 border-t border-r',
              'left-3 bottom-3 border-b border-l',
              'right-3 bottom-3 border-b border-r',
            ].map((position) => (
              <span key={position} className={cn('absolute size-6 border-brand-cyan/40', position)} />
            ))}
          </div>
        </div>

        {/* Caption bar */}
        <div className="flex items-center justify-between gap-3 px-3 pt-3.5 pb-1.5">
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-paper">{personal.name}</p>
            <p className="truncate text-[0.7rem] text-muted">
              {personal.degreeShort} • {personal.field}
            </p>
          </div>
          <span className="glass inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[0.58rem] font-semibold tracking-[0.16em] text-brand-cyan uppercase">
            <Sparkles aria-hidden="true" className="size-3" />
            {personal.location}
          </span>
        </div>
      </GlassCard>
    </div>
  );
}

export function About() {
  return (
    <Section id="about" labelledBy="about-heading">
      <SectionHeading
        id="about-heading"
        eyebrow="About Me"
        title={about.heading}
        subtitle={about.subheading}
      />

      <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:mt-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <Reveal x={-24} y={0}>
          <Portrait />
        </Reveal>

        <div>
          <Reveal delay={0.1}>
            <h3 className="font-display text-[1.25rem] font-semibold text-paper sm:text-[1.5rem]">
              Turning curiosity into <span className="text-gradient-accent">working software</span>
            </h3>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted sm:text-base">{personal.bio}</p>
          </Reveal>

          {/* Quick facts */}
          <Reveal delay={0.16}>
            <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 xs:grid-cols-2">
              {FACTS.map((fact) => (
                <div key={fact.label} className="border-l border-white/10 pl-4">
                  <dt className="font-display text-[0.58rem] font-semibold tracking-[0.22em] text-faint uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-[0.85rem] font-medium text-paper/90">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Highlight cards */}
          <div className="mt-9 grid grid-cols-1 gap-3.5 xs:grid-cols-3">
            {aboutHighlights.map((highlight, index) => {
              const tone = accentMap[highlight.accent];
              return (
                <Reveal key={highlight.id} delay={0.2 + index * 0.07}>
                  <GlassCard interactive accent={highlight.accent} radiusClass="rounded-xl" className="h-full">
                    <div className="flex h-full flex-col gap-3 p-4">
                      <span
                        className={cn(
                          'inline-flex size-9 items-center justify-center rounded-lg border transition-transform duration-300 group-hover:scale-110',
                          tone.chip,
                        )}
                      >
                        <Icon name={highlight.icon} className="size-4" />
                      </span>
                      <div>
                        <p className="font-display text-[0.56rem] font-semibold tracking-[0.22em] text-faint uppercase">
                          {highlight.label}
                        </p>
                        <p className="mt-1.5 font-display text-[0.8rem] leading-snug font-semibold text-paper">
                          {highlight.lines.map((line) => (
                            <span key={line} className="block">
                              {line}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.34}>
            <div className="mt-9 flex flex-wrap gap-3">
              <NeonButton
                onClick={() => scrollToSection('contact')}
                iconRight={<ArrowUpRight aria-hidden="true" className="size-4" />}
              >
                Get in touch
              </NeonButton>
              <NeonButton variant="outline" onClick={() => scrollToSection('skills')}>
                See my skills
              </NeonButton>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
