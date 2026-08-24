import { cn } from '../lib/cn';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  /** Small letter-spaced label above the title. */
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
  /** Rendered as the accessible name of the section. */
  id?: string;
}

/**
 * The repeated section header: eyebrow → uppercase gradient title → subtitle,
 * with a hairline gradient rule. Matches the reference's centred hierarchy.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
  id,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col',
        centered ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <Reveal>
        <div className={cn('flex items-center gap-3', centered && 'justify-center')}>
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-brand-cyan/70 sm:w-12" />
          <span className="eyebrow whitespace-nowrap">{eyebrow}</span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-brand-purple/70 sm:w-12" />
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <h2
          id={id}
          className="text-gradient mt-5 text-[clamp(1.65rem,4.6vw,3.1rem)] font-semibold uppercase tracking-[0.01em]"
        >
          {title}
        </h2>
      </Reveal>

      {subtitle && (
        <Reveal delay={0.14}>
          <p
            className={cn(
              'mt-4 text-[0.95rem] leading-relaxed text-muted sm:text-base',
              centered ? 'mx-auto max-w-2xl' : 'max-w-xl',
            )}
          >
            {subtitle}
          </p>
        </Reveal>
      )}

      <Reveal delay={0.2}>
        <span
          aria-hidden="true"
          className="mt-7 block h-px w-24 bg-gradient-to-r from-transparent via-brand-cyan/60 to-transparent"
        />
      </Reveal>
    </div>
  );
}
