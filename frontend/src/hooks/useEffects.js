import { useEffect, useState } from 'react';
export const FX_STORAGE_KEY = 'animationPreference';
export function useEffects() {
  const [manual, setManual] = useState(() => {
    try { const saved = localStorage.getItem(FX_STORAGE_KEY); return ['full', 'reduced'].includes(saved) ? saved : null; } catch { return null; }
  });
  const [systemReduced, setSystemReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const mode = manual ?? (systemReduced ? 'reduced' : 'full');
  useEffect(() => { document.body.dataset.fx = mode; }, [mode]);
  function toggle() {
    const next = mode === 'full' ? 'reduced' : 'full';
    setManual(next);
    try { localStorage.setItem(FX_STORAGE_KEY, next); } catch { /* Choice still works for this visit. */ }
  }
  return { mode, toggle };
}
