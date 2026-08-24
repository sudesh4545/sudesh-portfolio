import type { ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';
import { cn } from '../lib/cn';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface NeonButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Renders an anchor. `null`/omitted falls back to a button. */
  href?: string | null;
  onClick?: () => void;
  external?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /**
   * The destination isn't configured yet. Instead of linking nowhere, the
   * control stays focusable, is announced as disabled, and explains itself.
   */
  unavailable?: boolean;
  unavailableHint?: string;
  onUnavailable?: (hint: string) => void;
  loading?: boolean;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
  className?: string;
  ariaLabel?: string;
}

const sizes: Record<Size, string> = {
  // Small buttons still need a ~44px touch target on phones, so they only
  // tighten to their compact height once there is room for a pointer device.
  sm: 'h-11 gap-1.5 px-3.5 text-[0.66rem] md:h-9',
  md: 'h-11 px-5 text-[0.71rem]',
  lg: 'h-12 px-6 text-[0.74rem] sm:h-[3.25rem] sm:px-8 sm:text-[0.8rem]',
};

const variants: Record<Variant, string> = {
  primary: cn(
    'bg-gradient-to-r from-brand-cyan via-[#5cc8ff] to-[#b388ff] text-ink',
    'shadow-[0_12px_40px_-14px_rgba(0,240,255,0.7)]',
    'hover:shadow-[0_16px_54px_-12px_rgba(138,43,226,0.8)] hover:brightness-[1.08]',
  ),
  outline: cn(
    'glass text-paper border-white/12',
    'hover:border-brand-cyan/50 hover:text-brand-cyan hover:shadow-[0_12px_40px_-18px_rgba(0,240,255,0.55)]',
  ),
  ghost: 'text-muted hover:text-brand-cyan',
};

/** The site's single button. Uppercase, letter-spaced, neon-lit on hover. */
export function NeonButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  external = true,
  iconLeft,
  iconRight,
  unavailable = false,
  unavailableHint = 'Link not configured yet',
  onUnavailable,
  loading = false,
  type = 'button',
  fullWidth = false,
  className,
  ariaLabel,
}: NeonButtonProps) {
  const base = cn(
    'group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-xl',
    'font-display font-semibold uppercase tracking-[0.14em] whitespace-nowrap',
    'transition-[transform,box-shadow,border-color,color,filter] duration-300 ease-out',
    'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60',
    sizes[size],
    unavailable
      ? 'cursor-not-allowed border border-dashed border-white/15 bg-white/[0.02] text-faint hover:border-white/25 hover:text-muted'
      : variants[variant],
    fullWidth && 'w-full',
    className,
  );

  const inner = (
    <>
      {variant === 'primary' && !unavailable && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/35 blur-md transition-transform duration-700 ease-out group-hover:translate-x-[320%]"
        />
      )}
      {loading ? (
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      ) : (
        iconLeft
      )}
      <span className="relative">{children}</span>
      {iconRight && !loading && (
        <span className="relative transition-transform duration-300 group-hover:translate-x-0.5">{iconRight}</span>
      )}
    </>
  );

  if (unavailable) {
    return (
      <button
        type="button"
        aria-disabled="true"
        aria-label={ariaLabel}
        title={unavailableHint}
        onClick={() => onUnavailable?.(unavailableHint)}
        className={base}
      >
        {inner}
        <span className="sr-only"> — {unavailableHint}</span>
      </button>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        className={base}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={loading} aria-label={ariaLabel} className={base}>
      {inner}
    </button>
  );
}
