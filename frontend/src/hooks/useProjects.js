import { useEffect, useState } from 'react';
import { getProjects, projectView } from '../services/api.js';
import { readProjects, saveProjects, validProjects, referenceFor, sortProjects } from '../services/project-cache.js';
export function useProjects(category) {
  const [attempt, setAttempt] = useState(0);
  const isolated = import.meta.env.DEV && location.pathname.startsWith('/test/');
  const storage = () => { try { return isolated ? null : localStorage; } catch { return null; } };
  const [catalogs, setCatalogs] = useState(() => Object.fromEntries(['dev','industry'].map(key => [key, { status:'loading', data:readProjects(storage(), key) || [] }])));
  useEffect(() => {
    const controller = new AbortController();
    setCatalogs(previous => ({ ...previous, [category]: { ...previous[category], status:'loading' } }));
    getProjects(category, controller.signal).then(response => {
      if (!validProjects(response.data) || response.data.some(item => item.category !== category)) throw new Error('Catégorie incohérente.');
      if (controller.signal.aborted) return;
      saveProjects(storage(), response.data, category);
      setCatalogs(previous => ({ ...previous, [category]: { status:response.data.length ? 'ready':'empty', data:sortProjects(response.data) } }));
    }).catch(() => {
      if (!controller.signal.aborted) setCatalogs(previous => ({ ...previous, [category]: { status:'fallback', data:readProjects(storage(),category) ?? referenceFor(category) } }));
    });
    return () => controller.abort();
  }, [category, attempt, isolated]);
  const current = catalogs[category];
  return { status:current.status, projects:current.data.map(projectView), retry:() => setAttempt(value => value+1) };
}
