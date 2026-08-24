import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, FileText } from 'lucide-react';
import { heroCards, personal } from '../data/portfolio';
import { useIdleWhenOffscreen } from '../hooks/useIdleWhenOffscreen';
import { accent as accentMap } from '../lib/accents';
import { cn } from '../lib/cn';
import { scrollToSection } from '../lib/scroll';
import { GlassCard } from './GlassCard';
import { Icon } from './Icon';
import { NeonButton } from './NeonButton';
import { NeuralBrain } from './NeuralBrain';
import { useToast } from './Toast';

/** Small holographic tags orbiting the brain (desktop only — decorative). */
const FLOATING_TAGS = [
  { label: '01', className: 'left-[2%] top-[10%]', delay: '0s', tone: 'text-brand-cyan' },
  { label: '</>', className: 'left-[10%] top-[26%]', delay: '-1.4s', tone: 'text-brand-cyan' },
  { label: 'n01', className: 'right-[16%] top-[7%]', delay: '-2.6s', tone: 'text-[#b07bff]' },
  { label: 'API', className: 'right-[1%] top-[24%]', delay: '-0.8s', tone: 'text-brand-cyan' },
  { label: 'API', className: 'left-[1%] top-[52%]', delay: '-3.2s', tone: 'text-[#b07bff]' },
  { label: 'DATA', className: 'left-[8%] bottom-[16%]', delay: '-2s', tone: 'text-brand-cyan' },
  { label: 'AI', className: 'right-[6%] bottom-[20%]', delay: '-4s', tone: 'text-[#e879f9]' },
] as const;

export function Hero() {
  const prefersReduced = useReducedMotion();
  const { push } = useToast();
  // The hero holds 22 of the page's perpetual animations. Park them the moment
  // it scrolls away so reading the rest of the page stays cheap.
  const sectionRef = useIdleWhenOffscreen<HTMLElement>();

  const nameParts = personal.name.trim().split(/\s+/);
  const lastWord = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  const leadWords = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : personal.name;

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: prefersReduced ? 0 : 0.085, delayChildren: 0.12 } },
  };

  const item = prefersReduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4 } } }
    : {
        hidden: { opacity: 0, y: 26 },
        show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const } },
      };

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-center pt-28 pb-16 lg:pt-24"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 items-center gap-y-12 lg:grid-cols-12 lg:gap-x-8"
        >
          {/* ------------------------------- Copy ------------------------------ */}
          <div className="lg:col-span-5">
            <motion.p variants={item} className="text-sm text-muted sm:text-base">
              {personal.greeting}
            </motion.p>

            <motion.h1
              variants={item}
              className="mt-2 font-display text-[clamp(2.6rem,8.5vw,5.2rem)] leading-[0.95] font-bold tracking-[-0.03em]"
            >
              <span className="text-paper">{leadWords}</span>
              {lastWord && (
                <>
                  {' '}
                  <span className="text-gradient-accent">{lastWord}</span>
                </>
              )}
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-4 font-display text-[0.82rem] font-medium text-paper/90 sm:text-[0.95rem]"
            >
              {personal.roles.map((role, index) => (
                <span key={role}>
                  {index > 0 && <span className="mx-2 text-brand-cyan/45">|</span>}
                  {role}
                </span>
              ))}
            </motion.p>

            <motion.p variants={item} className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-muted">
              {personal.tagline}
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
              <NeonButton
                size="lg"
                onClick={() => scrollToSection('projects')}
                iconRight={<ArrowRight aria-hidden="true" className="size-4" />}
              >
                Explore my work
              </NeonButton>

              <NeonButton
                size="lg"
                variant="outline"
                href={personal.resumeUrl}
                unavailable={!personal.resumeUrl}
                unavailableHint="Resume is currently being updated and will be available soon."
                onUnavailable={(hint) =>
                  push({ title: 'Resume updating soon', description: hint, variant: 'info' })
                }
                iconLeft={<FileText aria-hidden="true" className="size-4" />}
              >
                Resume — Updating Soon
              </NeonButton>
            </motion.div>

            <motion.a
              variants={item}
              href="#about"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection('about');
              }}
              aria-label="Scroll to the about section"
              className="group mt-12 hidden items-center gap-3 text-muted transition-colors hover:text-brand-cyan lg:inline-flex"
            >
              <span className="glass inline-flex size-10 items-center justify-center rounded-full transition-colors group-hover:border-brand-cyan/40">
                <ArrowDown
                  aria-hidden="true"
                  className={cn('size-4', !prefersReduced && 'motion-safe:animate-bounce')}
                />
              </span>
              <span className="font-display text-[0.62rem] font-semibold tracking-[0.24em] uppercase">
                Scroll
              </span>
            </motion.a>
          </div>

          {/* ------------------------------ Brain ----------------------------- */}
          <motion.div
            variants={
              prefersReduced
                ? item
                : {
                    hidden: { opacity: 0, scale: 0.9 },
                    show: {
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as const },
                    },
                  }
            }
            className="relative lg:col-span-4"
          >
            <NeuralBrain className="mx-auto max-w-[17.5rem] xs:max-w-[20rem] sm:max-w-[24rem] lg:max-w-none" />

            {/* Floating holographic tags */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
              {FLOATING_TAGS.map((tag, index) => (
                <span
                  key={`${tag.label}-${index}`}
                  className={cn(
                    'glass absolute rounded-lg px-2.5 py-1 font-display text-[0.6rem] font-semibold tracking-[0.16em]',
                    !prefersReduced && 'anim-float',
                    tag.className,
                    tag.tone,
                  )}
                  style={{ animationDelay: tag.delay }}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* --------------------------- Capability cards --------------------- */}
          <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 lg:col-span-3 lg:grid-cols-1">
            {heroCards.map((card, index) => {
              const tone = accentMap[card.accent];
              return (
                <motion.div key={card.id} variants={item} custom={index}>
                  <GlassCard interactive accent={card.accent} radiusClass="rounded-xl" className="h-full">
                    <div className="flex items-center gap-3.5 p-3.5">
                      <span
                        className={cn(
                          'inline-flex size-10 shrink-0 items-center justify-center rounded-lg border transition-transform duration-300 group-hover:scale-110',
                          tone.chip,
                        )}
                      >
                        <Icon name={card.icon} className="size-[1.15rem]" />
                      </span>

                      <div className="min-w-0">
                        <p className={cn('font-display text-[0.7rem] font-bold', tone.text)}>{card.index}</p>
                        <p className="font-display text-[0.66rem] leading-[1.35] font-semibold tracking-[0.12em] text-paper/90 uppercase">
                          {card.lines[0]}
                          <br />
                          {card.lines[1]}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
