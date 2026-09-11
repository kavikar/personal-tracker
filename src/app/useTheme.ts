import { useCallback, useEffect, useState } from 'react';
import { applyTheme, getPreferredTheme, getStoredTheme, storeTheme, type Theme } from './theme';

/** Manual theme toggle, persisted to localStorage and defaulting to the OS preference. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme() ?? getPreferredTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      storeTheme(next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
