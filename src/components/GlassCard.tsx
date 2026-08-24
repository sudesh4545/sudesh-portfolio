import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { accent as accentMap } from '../lib/accents';
import type { Accent } from '../types';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Surface weight: standard card, large panel, or inset well. */
  variant?: 'card' | 'panel' | 'well';
  /** Adds hover lift + gradient rim reveal. Requires the card to be a `group`. */
  interactive?: boolean;
  accent?: Accent;
  radiusClass?: string;
}

/**
 * The signature surface of the site: frosted dark glass, 1px light border,
 * inner highlight, deep shadow — plus a gradient rim that lights up on hover.
 */
export function GlassCard({
  children,
  variant = 'card',
  interactive = false,
  accent = 'cyan',
  radiusClass = 'rounded-2xl',
  className,
  ...rest
}: GlassCardProps) {
  const tone = accentMap[accent];

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden',
        radiusClass,
        variant === 'panel' ? 'glass-panel' : variant === 'well' ? 'glass-well' : 'glass',
        interactive &&
          cn(
            'group transition-[transform,border-color,box-shadow] duration-300 ease-out',
            'hover:-translate-y-1 focus-within:-translate-y-1',
            tone.borderHover,
            tone.shadowHover,
          ),
        className,
      )}
      {...rest}
    >
      {interactive && (
        <span
          aria-hidden="true"
          className={cn('rim pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100', radiusClass)}
        />
      )}
      {children}
    </div>
  );
}
