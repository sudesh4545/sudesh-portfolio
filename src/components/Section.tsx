import type { ReactNode } from 'react';
import { useIdleWhenOffscreen } from '../hooks/useIdleWhenOffscreen';
import { cn } from '../lib/cn';

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  /** Labels the landmark for screen readers when there is no visible heading. */
  ariaLabel?: string;
  labelledBy?: string;
}

/** Consistent vertical rhythm + max width for every section on the page. */
export function Section({
  id,
  children,
  className,
  containerClassName,
  ariaLabel,
  labelledBy,
}: SectionProps) {
  const ref = useIdleWhenOffscreen<HTMLElement>();

  return (
    <section
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      className={cn('portfolio-section relative scroll-mt-24 py-20 sm:py-24 lg:py-28', className)}
    >
      <div className={cn('mx-auto w-full max-w-7xl px-5 sm:px-8', containerClassName)}>{children}</div>
    </section>
  );
}
