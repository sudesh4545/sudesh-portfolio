import { ArrowUpRight } from 'lucide-react';
import { accent as accentMap } from '../lib/accents';
import { cn } from '../lib/cn';
import type { ProjectCollection } from '../types';
import { GlassCard } from './GlassCard';
import { Icon } from './Icon';

interface ProjectCollectionCardProps {
  collection: ProjectCollection;
  onOpen: (collection: ProjectCollection) => void;
}

export function ProjectCollectionCard({ collection, onOpen }: ProjectCollectionCardProps) {
  const tone = accentMap[collection.accent];

  return (
    <GlassCard interactive accent={collection.accent} className="h-full">
      <button
        type="button"
        onClick={() => onOpen(collection)}
        aria-haspopup="dialog"
        className="group/collection flex h-full w-full flex-col p-6 text-left sm:p-7"
      >
        <div className="flex items-start justify-between gap-5">
          <span className={cn('flex size-12 items-center justify-center rounded-2xl border', tone.chip)}>
            <Icon name={collection.icon} className="size-5" />
          </span>
          <span className={cn('font-display text-[0.62rem] font-bold tracking-[0.18em] uppercase', tone.text)}>
            {collection.items.length} slots
          </span>
        </div>

        <p className={cn('mt-7 font-display text-[0.6rem] font-bold tracking-[0.2em] uppercase', tone.text)}>
          {collection.eyebrow}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold text-paper sm:text-2xl">{collection.title}</h3>
        <p className="mt-3 max-w-xl text-[0.86rem] leading-relaxed text-muted">{collection.description}</p>

        <div aria-hidden="true" className="mt-7 grid grid-cols-5 gap-2">
          {collection.items.map((item) => (
            <span
              key={item.id}
              className={cn('aspect-square rounded-md border bg-white/[0.025]', tone.border)}
            />
          ))}
        </div>

        <span className="mt-7 inline-flex items-center gap-2 font-display text-[0.68rem] font-bold tracking-[0.14em] text-paper uppercase">
          Explore collection
          <ArrowUpRight
            aria-hidden="true"
            className={cn('size-4 transition-transform group-hover/collection:-translate-y-0.5 group-hover/collection:translate-x-0.5', tone.text)}
          />
        </span>
      </button>
    </GlassCard>
  );
}
