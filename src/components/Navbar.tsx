import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Sparkles, Sun, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { navLinks, personal, sectionOrder, socials } from '../data/portfolio';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { cn } from '../lib/cn';
import { initialsOf } from '../lib/initials';
import { scrollToSection } from '../lib/scroll';
import type { Theme } from '../hooks/useTheme';
import { Icon } from './Icon';

/**
 * Not every section gets its own nav link — Core IT Expertise and Coding
 * Activity are read as continuations of Skills and Achievements. Without this
 * map the highlight would simply vanish while those sections are on screen.
 * Built from the data, so adding a section keeps working automatically.
 */
const SECTION_TO_LINK: Record<string, string> = (() => {
  const linkIds = new Set(navLinks.map((link) => link.id));
  const map: Record<string, string> = {};
  let nearest = navLinks[0]?.id ?? '';

  for (const id of sectionOrder) {
    if (linkIds.has(id)) nearest = id;
    map[id] = nearest;
  }

  return map;
})();

interface NavbarProps {
  /** Id of the section currently in view, from the shared scroll-spy. */
  active: string;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const THEMES = [
  { id: 'dark', label: 'Dark', Icon: Moon },
  { id: 'light', label: 'Light', Icon: Sun },
  { id: 'neon', label: 'Neon', Icon: Sparkles },
] as const;

function ThemeSwitcher({ theme, onChange }: { theme: Theme; onChange: (theme: Theme) => void }) {
  return (
    <div className="theme-switcher flex items-center rounded-xl border p-1" role="group" aria-label="Choose website theme">
      {THEMES.map(({ id, label, Icon: ThemeIcon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-label={`${label} theme`}
          aria-pressed={theme === id}
          title={`${label} theme`}
          className={cn(
            'inline-flex size-8 items-center justify-center rounded-lg transition-colors',
            theme === id ? 'theme-option-active' : 'text-faint hover:text-paper',
          )}
        >
          <ThemeIcon aria-hidden="true" className="size-3.5" />
        </button>
      ))}
    </div>
  );
}

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <a
      href="#home"
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      aria-label={`${personal.name} — back to top`}
      className="group relative flex min-h-11 items-center gap-0.5 rounded-lg px-2 py-1.5 font-display text-lg font-bold tracking-tight transition-colors sm:text-xl md:min-h-0"
    >
      <span className="text-brand-cyan/70 transition-colors group-hover:text-brand-cyan">[</span>
      <span className="text-gradient-accent px-0.5">{initialsOf(personal.name)}</span>
      <span className="text-brand-cyan/70 transition-colors group-hover:text-brand-cyan">]</span>
      <span className="absolute inset-0 -z-10 rounded-lg bg-brand-cyan/0 blur-md transition-colors duration-300 group-hover:bg-brand-cyan/10" />
    </a>
  );
}

function AvailabilityPill({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        // No display utility here — callers decide, so `hidden xl:inline-flex` wins.
        'availability-pill glass items-center gap-2 rounded-full py-1.5 pr-3.5 pl-3 whitespace-nowrap',
        className,
      )}
    >
      <span className="relative flex size-2">
        <span className="anim-pulse-ring absolute inline-flex size-full rounded-full bg-emerald-400/70" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
      </span>
      <span className="font-display text-[0.6rem] font-semibold tracking-[0.18em] text-emerald-100/90 uppercase">
        {personal.availability}
      </span>
    </span>
  );
}

export function Navbar({ active, theme, onThemeChange }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const activeLink = SECTION_TO_LINK[active] ?? active;

  useLockBodyScroll(open);
  const close = useCallback(() => setOpen(false), []);
  useFocusTrap(panelRef, open, close);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = useCallback(
    (id: string) => {
      setOpen(false);
      // Let the drawer's exit animation start before scrolling.
      window.setTimeout(() => scrollToSection(id), open ? 180 : 0);
    },
    [open],
  );

  return (
    <>
      <motion.header
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={cn(
          // No backdrop blur here on purpose. This bar is `fixed` and full width,
          // so a backdrop-filter forces the browser to re-sample and re-blur the
          // strip behind it on EVERY scroll frame — the single most expensive
          // thing a scrolling page can do. Over this near-black palette an opaque
          // tint is visually almost indistinguishable and costs nothing.
          'fixed inset-x-0 top-0 z-[80] transition-[background-color,border-color] duration-500',
          scrolled
            ? 'border-b border-white/[0.07] bg-ink/92'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-8"
        >
          <Logo onClick={() => go('home')} />

          {/* Desktop links — a subtle glass rail, active item underlined in cyan.
              No backdrop blur: it sits inside the fixed header, so it would pay
              the same per-scroll-frame re-blur cost as the bar itself. */}
          <ul className="hidden items-center gap-1 rounded-2xl border border-white/[0.07] bg-white/[0.04] px-2 py-1.5 lg:flex">
            {navLinks.map((link) => {
              const isActive = activeLink === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      go(link.id);
                    }}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative block rounded-xl px-3.5 py-2 font-display text-[0.68rem] font-semibold tracking-[0.16em] uppercase transition-colors duration-300',
                      isActive ? 'text-brand-cyan' : 'text-muted hover:text-paper',
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute inset-x-2.5 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-brand-cyan to-brand-purple shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeSwitcher theme={theme} onChange={onThemeChange} />
            <AvailabilityPill className="hidden xl:inline-flex" />

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="glass inline-flex size-11 items-center justify-center rounded-xl text-paper transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan lg:hidden"
            >
              <Menu aria-hidden="true" className="size-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ---------------------------- Mobile drawer --------------------------- */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[110] lg:hidden">
            <motion.button
              type="button"
              tabIndex={-1}
              aria-label="Close navigation menu"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 size-full cursor-default bg-ink/80 backdrop-blur-sm"
            />

            <motion.div
              id="mobile-menu"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              tabIndex={-1}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="glass-panel absolute inset-y-0 right-0 flex w-[min(86vw,20rem)] flex-col rounded-l-3xl border-y-0 border-r-0 p-6"
            >
              <div className="flex items-center justify-between">
                <span className="eyebrow">Menu</span>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close navigation menu"
                  className="glass inline-flex size-10 items-center justify-center rounded-xl text-paper transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
                >
                  <X aria-hidden="true" className="size-5" />
                </button>
              </div>

              <ul className="mt-8 flex flex-col gap-1.5">
                {navLinks.map((link, index) => {
                  const isActive = activeLink === link.id;
                  return (
                    <motion.li
                      key={link.id}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <a
                        href={`#${link.id}`}
                        onClick={(event) => {
                          event.preventDefault();
                          go(link.id);
                        }}
                        aria-current={isActive ? 'true' : undefined}
                        className={cn(
                          'flex items-center justify-between rounded-xl border px-4 py-3.5 font-display text-sm font-semibold tracking-[0.14em] uppercase transition-colors',
                          isActive
                            ? 'border-brand-cyan/35 bg-brand-cyan/10 text-brand-cyan'
                            : 'border-white/[0.07] bg-white/[0.02] text-muted hover:border-white/15 hover:text-paper',
                        )}
                      >
                        {link.label}
                        <span
                          aria-hidden="true"
                          className={cn(
                            'size-1.5 rounded-full transition-colors',
                            isActive ? 'bg-brand-cyan shadow-[0_0_10px_rgba(0,240,255,0.9)]' : 'bg-white/20',
                          )}
                        />
                      </a>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-auto space-y-5 pt-8">
                <AvailabilityPill className="w-full justify-center flex" />
                <ul className="flex items-center justify-center gap-3">
                  {socials.map((social) => (
                    <li key={social.id}>
                      {social.url ? (
                        <a
                          href={social.url}
                          {...(social.id === 'email'
                            ? {}
                            : { target: '_blank', rel: 'noopener noreferrer' })}
                          aria-label={social.label}
                          className="glass inline-flex size-10 items-center justify-center rounded-xl text-muted transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
                        >
                          <Icon name={social.icon} className="size-4" />
                        </a>
                      ) : (
                        <span
                          title={`${social.label} link not configured yet`}
                          className="inline-flex size-10 cursor-not-allowed items-center justify-center rounded-xl border border-dashed border-white/10 text-faint"
                        >
                          <Icon name={social.icon} className="size-4" />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
