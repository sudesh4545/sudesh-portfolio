/**
 * Smooth in-page navigation.
 * `html { scroll-padding-top }` in index.css keeps the target clear of the
 * fixed navbar, so `scrollIntoView` needs no manual offset maths.
 */
export function scrollToSection(id: string): void {
  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior: ScrollBehavior = prefersReduced ? 'auto' : 'smooth';

  if (id === 'home') {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({ behavior, block: 'start' });
}
