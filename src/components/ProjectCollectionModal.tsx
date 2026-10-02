import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Clock3, ExternalLink, X } from 'lucide-react';
import { useRef, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { accent as accentMap } from '../lib/accents';
import { cn } from '../lib/cn';
import type { ProjectCollection } from '../types';
import { Icon } from './Icon';

interface ProjectCollectionModalProps {
  collection: ProjectCollection | null;
  onClose: () => void;
}

const projectTones = [
  { primary: '#00f0ff', secondary: '#2563eb' },
  { primary: '#ff3bd4', secondary: '#9333ea' },
  { primary: '#a855f7', secondary: '#4f46e5' },
  { primary: '#ef4444', secondary: '#7f1d1d' },
  { primary: '#e879f9', secondary: '#6366f1' },
  { primary: '#f43f5e', secondary: '#be123c' },
  { primary: '#34d399', secondary: '#0891b2' },
  { primary: '#fb7185', secondary: '#7c3aed' },
  { primary: '#8b5cf6', secondary: '#ec4899' },
  { primary: '#60a5fa', secondary: '#1d4ed8' },
] as const;

export function ProjectCollectionModal({ collection, onClose }: ProjectCollectionModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();
  const open = collection !== null;

  useLockBodyScroll(open);
  useFocusTrap(panelRef, open, onClose);

  const modal = (
    <AnimatePresence>
      {collection && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center overscroll-none p-3 sm:p-6">
          <motion.button
            type="button"
            tabIndex={-1}
            aria-label={`Close ${collection.title}`}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 size-full cursor-default bg-ink/90 backdrop-blur-md"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="collection-modal-title"
            tabIndex={-1}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 42, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.985 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="collection-modal glass-panel relative z-10 max-h-[94dvh] w-full max-w-5xl touch-pan-y overflow-y-auto overscroll-contain rounded-3xl"
            style={{ '--modal-accent': collection.id === 'small-projects' ? '#00f0ff' : '#a855f7' } as CSSProperties}
          >
            <span aria-hidden="true" className="collection-modal-glow pointer-events-none absolute -top-36 left-1/2 h-72 w-3/4 -translate-x-1/2 rounded-full" />
            <div className="sticky top-0 z-20 flex items-start justify-between gap-5 border-b border-white/[0.07] bg-ink/90 p-5 backdrop-blur-xl sm:p-7">
              <div className="flex min-w-0 items-start gap-4">
                <span className={cn('hidden size-12 shrink-0 items-center justify-center rounded-2xl border sm:flex', accentMap[collection.accent].chip)}>
                  <Icon name={collection.icon} className="size-5" />
                </span>
                <div>
                  <p className={cn('font-display text-[0.6rem] font-bold tracking-[0.2em] uppercase', accentMap[collection.accent].text)}>
                    {collection.eyebrow} · {collection.items.length} projects
                  </p>
                  <h2 id="collection-modal-title" className="mt-1.5 font-display text-2xl font-semibold text-paper sm:text-3xl">
                    {collection.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-[0.82rem] leading-relaxed text-muted sm:text-[0.9rem]">
                    {collection.description}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={`Close ${collection.title}`}
                className="glass inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-paper transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <div className="p-5 sm:p-7">
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {collection.items.map((item, index) => {
                  const itemTone = projectTones[index % projectTones.length];
                  const itemStyle = {
                    '--project-primary': itemTone.primary,
                    '--project-secondary': itemTone.secondary,
                  } as CSSProperties;

                  return (
                  <motion.li
                    key={item.id}
                    className="collection-project-card group/project relative flex min-h-48 flex-col overflow-hidden rounded-2xl p-5"
                    style={itemStyle}
                    initial={prefersReduced ? false : { opacity: 0, y: 22, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, delay: prefersReduced ? 0 : Math.min(index * 0.045, 0.32), ease: [0.16, 1, 0.3, 1] }}
                    whileHover={prefersReduced ? undefined : { y: -6, scale: 1.015 }}
                  >
                    <span aria-hidden="true" className="project-card-glow pointer-events-none absolute -top-14 -right-12 size-36 rounded-full" />
                    <span aria-hidden="true" className="project-card-sweep pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12" />
                    <div className="flex items-center justify-between gap-3">
                      <span className="project-card-accent font-display text-[0.62rem] font-bold tracking-[0.17em]">
                        {item.index}
                      </span>
                      <span className="project-card-status inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-display text-[0.52rem] font-bold tracking-[0.13em] uppercase">
                        <Clock3 aria-hidden="true" className="size-3" />
                        {item.status === 'coming-soon' ? 'Coming soon' : 'Published'}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-base font-semibold text-paper">{item.title}</h3>
                    <p className="mt-2 flex-1 text-[0.76rem] leading-relaxed text-muted">{item.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.technologies.map((technology) => (
                          <span key={technology} className="project-card-tech rounded-md border px-2 py-1 text-[0.6rem]">
                          {technology}
                        </span>
                      ))}
                    </div>
                    {item.status === 'published' && (item.demoUrl || item.githubUrl) && (
                      <div className="mt-4 flex gap-3 border-t border-white/[0.06] pt-4">
                        {item.demoUrl && <a href={item.demoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-brand-cyan">Demo <ExternalLink className="size-3" /></a>}
                        {item.githubUrl && <a href={item.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-paper">Code <ArrowUpRight className="size-3" /></a>}
                      </div>
                    )}
                    <ArrowUpRight aria-hidden="true" className="project-card-arrow absolute right-5 bottom-5 size-4 opacity-60 transition-transform duration-300 group-hover/project:-translate-y-0.5 group-hover/project:translate-x-0.5 group-hover/project:opacity-100" />
                  </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document === 'undefined' ? null : createPortal(modal, document.body);
}
