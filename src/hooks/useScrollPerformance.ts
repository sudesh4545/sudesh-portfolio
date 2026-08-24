import { useEffect } from 'react';

/**
 * Marks only the active scroll burst. CSS uses this signal to temporarily park
 * decorative work; native scrolling itself is never intercepted or modified.
 */
export function useScrollPerformance() {
  useEffect(() => {
    let timer = 0;
    let active = false;

    const finish = () => {
      active = false;
      document.documentElement.classList.remove('is-scrolling');
    };

    const onScroll = () => {
      if (!active) {
        active = true;
        document.documentElement.classList.add('is-scrolling');
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(finish, 120);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.classList.remove('is-scrolling');
    };
  }, []);
}
