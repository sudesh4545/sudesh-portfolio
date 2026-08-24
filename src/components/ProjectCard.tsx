import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Check, ExternalLink, Maximize2 } from 'lucide-react';
import { accent as accentMap } from '../lib/accents';
import { cn } from '../lib/cn';
import type { Project } from '../types';
import { GlassCard } from './GlassCard';
import { Icon } from './Icon';
import { NeonButton } from './NeonButton';
import { ProjectPreview } from './ProjectPreview';

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  onUnavailable: (hint: string) => void;
}

export function ProjectCard({ project, onOpen, onUnavailable }: ProjectCardProps) {
  const tone = accentMap[project.accent];
  const prefersReduced = useReducedMotion();

  return (
    <GlassCard interactive accent={project.accent} className="flex h-full flex-col">
      {/* ------------------------------- Preview ------------------------------ */}
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-haspopup="dialog"
        aria-label={`View details for ${project.title}`}
        className="group/preview relative block w-full cursor-pointer overflow-hidden rounded-t-2xl text-left"
      >
        <div className="glass-well relative aspect-[16/10] w-full overflow-hidden rounded-none border-0">
          <div aria-hidden="true" className="cyber-grid-fine absolute inset-0 opacity-30" />
          <div
            aria-hidden="true"
            className={cn('absolute inset-0 opacity-40', tone.wash)}
            style={{ maskImage: 'radial-gradient(circle at 50% 120%, #000, transparent 70%)' }}
          />

          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <motion.div
              className="absolute inset-0"
              whileHover={prefersReduced ? undefined : { scale: 1.03 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectPreview kind={project.preview} />
            </motion.div>
          )}

          {/* Bottom fade so the badges stay readable */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/85 to-transparent"
          />

          {/* Index badge. No backdrop blur on these small badges: they repeat per
              card inside the scrolling content, and each one re-blurs its backdrop
              as it moves. An opaque tint reads the same here. */}
          <span
            className={cn(
              'absolute top-3 left-3 rounded-md border px-2 py-0.5 font-display text-[0.6rem] font-bold tracking-[0.16em]',
              tone.chip,
            )}
          >
            {project.index}
          </span>

          {/* Stack label */}
          <span className="absolute top-3 right-3 rounded-md border border-white/10 bg-ink/80 px-2 py-0.5 font-display text-[0.55rem] font-semibold tracking-[0.14em] text-muted uppercase">
            {project.subtitle}
          </span>

          {/* Hover / focus affordance */}
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center bg-ink/60 opacity-0 transition-opacity duration-300 group-hover/preview:opacity-100 group-focus-visible/preview:opacity-100"
          >
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 font-display text-[0.62rem] font-semibold tracking-[0.18em] text-paper uppercase">
              <Maximize2 className="size-3.5" />
              View details
            </span>
          </span>
        </div>
      </button>

      {/* -------------------------------- Body ------------------------------- */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[1.05rem] leading-snug font-semibold text-paper">{project.title}</h3>

        <p className="mt-2.5 line-clamp-3 text-[0.85rem] leading-relaxed text-muted">{project.description}</p>

        {/* Tech chips */}
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.technologies.map((technology) => (
            <li
              key={technology}
              className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-display text-[0.6rem] font-medium tracking-[0.08em] text-muted"
            >
              {technology}
            </li>
          ))}
        </ul>

        {/* Key features */}
        <ul className="mt-4 grid grid-cols-1 gap-1.5 xs:grid-cols-2">
          {project.features.slice(0, 4).map((feature) => (
            <li key={feature} className="flex items-start gap-1.5 text-[0.72rem] leading-snug text-muted">
              <Check aria-hidden="true" className={cn('mt-[0.15rem] size-3 shrink-0', tone.text)} />
              <span className="min-w-0">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          <NeonButton
            size="sm"
            href={project.demoUrl}
            unavailable={!project.demoUrl}
            unavailableHint={`Live demo for "${project.title}" is not linked yet — set demoUrl in src/data/portfolio.ts`}
            onUnavailable={onUnavailable}
            ariaLabel={`Open the live demo of ${project.title}`}
            iconRight={<ExternalLink aria-hidden="true" className="size-3.5" />}
          >
            Live demo
          </NeonButton>

          <NeonButton
            size="sm"
            variant="outline"
            href={project.githubUrl}
            unavailable={!project.githubUrl}
            unavailableHint={`Repository for "${project.title}" is not linked yet — set githubUrl in src/data/portfolio.ts`}
            onUnavailable={onUnavailable}
            ariaLabel={`Open the source code of ${project.title}`}
            iconLeft={<Icon name="github" className="size-3.5" />}
          >
            Code
          </NeonButton>

          <button
            type="button"
            onClick={() => onOpen(project)}
            aria-haspopup="dialog"
            className="ml-auto inline-flex min-h-11 items-center gap-1 rounded-lg px-2 py-1.5 font-display text-[0.62rem] font-semibold tracking-[0.16em] text-muted uppercase transition-colors hover:text-brand-cyan md:min-h-0"
          >
            Details
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
