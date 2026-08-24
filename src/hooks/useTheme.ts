import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'neon';

const STORAGE_KEY = 'sudesh-portfolio-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'neon';
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' || stored === 'light' || stored === 'neon' ? stored : 'neon';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark';
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return { theme, setTheme };
}
