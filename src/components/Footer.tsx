import { ArrowUp } from 'lucide-react';
import { footer, footerLinks, personal, socials } from '../data/portfolio';
import { cn } from '../lib/cn';
import { initialsOf } from '../lib/initials';
import { scrollToSection } from '../lib/scroll';
import { Icon } from './Icon';

const BUILT_WITH = ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'];

/** Two identical wave paths side by side so the horizontal loop is seamless. */
function WaveBand() {
  const wave =
    'M0 24C120 4 240 44 360 24C480 4 600 44 720 24C840 4 960 44 1080 24C1200 4 1320 44 1440 24V56H0Z';

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-14 overflow-hidden">
      <div className="anim-wave flex h-full w-[200%]">
        {[0, 1].map((copy) => (
          <svg
            key={copy}
            viewBox="0 0 1440 56"
            preserveAspectRatio="none"
            className="h-full w-1/2 shrink-0"
          >
            <defs>
              <linearGradient id={`footer-wave-${copy}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.16" />
                <stop offset="50%" stopColor="#8A2BE2" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#D946EF" stopOpacity="0.14" />
              </linearGradient>
            </defs>
            <path d={wave} fill={`url(#footer-wave-${copy})`} />
            <path
              d={wave}
              fill="none"
              stroke={`url(#footer-wave-${copy})`}
              strokeOpacity="0.9"
              strokeWidth="1.5"
            />
          </svg>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] pt-20">
      <WaveBand />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(ellipse_at_50%_120%,rgba(0,240,255,0.1),transparent_65%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-10 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <a
              href="#home"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection('home');
              }}
              className="inline-flex min-h-11 items-center gap-0.5 font-display text-xl font-bold tracking-tight md:min-h-0"
            >
              <span className="text-brand-cyan/70">[</span>
              <span className="text-gradient-accent px-0.5">{initialsOf(personal.name)}</span>
              <span className="text-brand-cyan/70">]</span>
            </a>

            <p className="mt-4 max-w-sm text-[0.85rem] leading-relaxed text-muted">{personal.tagline}</p>

            <p className="mt-4 font-display text-[0.6rem] font-semibold tracking-[0.2em] text-faint uppercase">
              {footer.tagline}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2.5">
              {socials.map((social) => (
                <li key={social.id}>
                  {social.url ? (
                    <a
                      href={social.url}
                      {...(social.id === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                      aria-label={social.label}
                      className="glass inline-flex size-11 items-center justify-center rounded-xl text-muted transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan md:size-10"
                    >
                      <Icon name={social.icon} className="size-4" />
                    </a>
                  ) : (
                    <span
                      title={`${social.label} URL not configured — add it in src/data/portfolio.ts`}
                      className="inline-flex size-11 cursor-not-allowed items-center justify-center rounded-xl border border-dashed border-white/12 text-faint md:size-10"
                    >
                      <Icon name={social.icon} className="size-4" />
                      <span className="sr-only">{social.label} — link not configured yet</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Navigate */}
          <nav aria-label="Footer">
            <h2 className="font-display text-[0.6rem] font-semibold tracking-[0.22em] text-paper uppercase">
              Navigate
            </h2>
            <ul className="mt-5 space-y-1">
              {footerLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToSection(link.id);
                    }}
                    className="group inline-flex min-h-11 items-center gap-2 py-1.5 text-[0.85rem] text-muted transition-colors hover:text-brand-cyan md:min-h-0"
                  >
                    <span
                      aria-hidden="true"
                      className="h-px w-0 bg-brand-cyan transition-all duration-300 group-hover:w-4"
                    />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Details */}
          <div>
            <h2 className="font-display text-[0.6rem] font-semibold tracking-[0.22em] text-paper uppercase">
              Get in touch
            </h2>
            <ul className="mt-5 space-y-3 text-[0.85rem] text-muted">
              <li>
                <a
                  href={`mailto:${personal.email}`}
                  className="inline-flex min-h-11 items-center py-1 break-all transition-colors hover:text-brand-cyan md:min-h-0"
                >
                  {personal.email}
                </a>
              </li>
              <li>{personal.location}</li>
              <li className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="anim-pulse-ring absolute inline-flex size-full rounded-full bg-emerald-400/70" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[0.8rem] text-emerald-100/85">{personal.availability}</span>
              </li>
            </ul>

            <ul className="mt-6 flex flex-wrap gap-1.5">
              {BUILT_WITH.map((tool) => (
                <li
                  key={tool}
                  className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-display text-[0.55rem] font-medium tracking-[0.1em] text-faint"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-5 border-t border-white/[0.07] pt-6 sm:flex-row">
          <p className="text-center text-[0.72rem] text-faint sm:text-left">{footer.copyright}</p>

          <button
            type="button"
            onClick={() => scrollToSection('home')}
            className={cn(
              'glass group inline-flex min-h-11 items-center gap-2 rounded-full py-2 pr-4 pl-3 md:min-h-0',
              'font-display text-[0.6rem] font-semibold tracking-[0.2em] text-muted uppercase',
              'transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan',
            )}
          >
            <ArrowUp
              aria-hidden="true"
              className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5"
            />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
