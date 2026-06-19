import { useState, useEffect, useCallback } from 'react';

/* Theme preference model
   ─────────────────────────────────────────────────────────────────
   pref  : what the user chose — 'system' | 'light' | 'dark'
   mode  : what actually renders — 'light' | 'dark' (system resolved)

   - 'system' tracks the OS setting live (great default for Mac users,
     who get their menu-bar light/dark choice reflected automatically).
   - 'light' / 'dark' override the OS and persist across visits.

   This hook is intentionally portable: the same three-state model can
   be dropped into the Casebase app so the marketing site and product
   share one theming contract. */

const STORAGE_KEY = 'casebase-theme-pref';

function systemMode() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [pref, setPref] = useState(() => {
    if (typeof window === 'undefined') return 'system';
    return localStorage.getItem(STORAGE_KEY) || 'system';
  });

  const [resolvedSystem, setResolvedSystem] = useState(systemMode);

  // Track the OS setting while we're in 'system' mode (and always, cheaply).
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setResolvedSystem(mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Persist the user's explicit choice.
  useEffect(() => {
    if (pref === 'system') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, pref);
  }, [pref]);

  const mode = pref === 'system' ? resolvedSystem : pref;

  // Keep <html>/<meta theme-color> in step for native chrome + scrollbars.
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const cycle = useCallback(() => {
    // light -> dark -> system -> light …
    setPref((p) => (p === 'light' ? 'dark' : p === 'dark' ? 'system' : 'light'));
  }, []);

  return { pref, mode, setPref, cycle };
}
