import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, ExternalLink, X } from 'lucide-react';
import { useRef } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { accent as accentMap } from '../lib/accents';
import { cn } from '../lib/cn';
import type { Project } from '../types';
import { Icon } from './Icon';
import { NeonButton } from './NeonButton';
import { ProjectPreview } from './ProjectPreview';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onUnavailable: (hint: string) => void;
}

/** Accessible project detail dialog: Escape to close, focus trapped inside. */
export function ProjectModal({ project, onClose, onUnavailable }: ProjectModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();
  const open = project !== null;

  useLockBodyScroll(open);
  useFocusTrap(panelRef, open, onClose);

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[130] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.button
            type="button"
            tabIndex={-1}
            aria-label="Close project details"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 size-full cursor-default bg-ink/85 backdrop-blur-md"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            tabIndex={-1}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.985 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'glass-panel relative z-10 flex max-h-[92svh] w-full max-w-3xl flex-col overflow-hidden',
              'rounded-t-3xl sm:rounded-3xl',
            )}
          >
            {/* Sticky header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] p-5 sm:p-6">
              <div className="min-w-0">
                <p
                  className={cn(
                    'font-display text-[0.6rem] font-bold tracking-[0.22em] uppercase',
                    accentMap[project.accent].text,
                  )}
                >
                  Project {project.index} — {project.subtitle}
                </p>
                <h2
                  id="project-modal-title"
                  className="mt-1.5 font-display text-[1.3rem] leading-tight font-semibold text-paper sm:text-[1.6rem]"
                >
                  {project.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close project details"
                className="glass inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-paper transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6">
              <div className="glass-well relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
                <div aria-hidden="true" className="cyber-grid-fine absolute inset-0 opacity-30" />
                {project.image ? (
                  <img
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  <ProjectPreview kind={project.preview} />
                )}
              </div>

              <p className="mt-6 text-[0.9rem] leading-relaxed text-muted sm:text-[0.95rem]">
                {project.longDescription ?? project.description}
              </p>

              <div className="mt-7 grid grid-cols-1 gap-7 sm:grid-cols-2">
                <div>
                  <h3 className="eyebrow">Tech stack</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <li
                        key={technology}
                        className={cn(
                          'rounded-lg border px-2.5 py-1 font-display text-[0.66rem] font-semibold tracking-[0.08em]',
                          accentMap[project.accent].chip,
                        )}
                      >
                        {technology}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="eyebrow">Key features</h3>
                  <ul className="mt-3 space-y-2">
                    {project.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-[0.8rem] leading-snug text-muted">
                        <Check
                          aria-hidden="true"
                          className={cn('mt-0.5 size-3.5 shrink-0', accentMap[project.accent].text)}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sticky footer actions */}
            <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.07] bg-ink/40 p-5 sm:p-6">
              <NeonButton
                href={project.demoUrl}
                unavailable={!project.demoUrl}
                unavailableHint={`Live demo for "${project.title}" is not linked yet — set demoUrl in src/data/portfolio.ts`}
                onUnavailable={onUnavailable}
                iconRight={<ExternalLink aria-hidden="true" className="size-4" />}
              >
                Live demo
              </NeonButton>

              <NeonButton
                variant="outline"
                href={project.githubUrl}
                unavailable={!project.githubUrl}
                unavailableHint={`Repository for "${project.title}" is not linked yet — set githubUrl in src/data/portfolio.ts`}
                onUnavailable={onUnavailable}
                iconLeft={<Icon name="github" className="size-4" />}
              >
                View code
              </NeonButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
