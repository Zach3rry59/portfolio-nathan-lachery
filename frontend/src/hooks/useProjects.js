import { useEffect, useState } from 'react';
import { getProjects, projectView } from '../services/api.js';
import { readProjects, saveProjects, validProjects } from '../services/project-cache.js';
export function useProjects() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState(() => {
    let data;
    try { data = readProjects(localStorage); } catch { data = readProjects(null); }
    return { status: 'loading', projects: data.map(projectView) };
  });
  useEffect(() => {
    const controller = new AbortController();
    setState(previous => ({ ...previous, status: 'loading' }));
    getProjects(controller.signal).then(response => {
      if (!validProjects(response.data)) throw new Error('Réponse invalide.');
      try { saveProjects(localStorage, response.data); } catch { /* Optional public cache. */ }
      setState({ status: response.data.length ? 'ready' : 'empty', projects: response.data.map(projectView) });
    }).catch(() => {
      if (!controller.signal.aborted) setState(previous => ({ ...previous, status: 'fallback' }));
    });
    return () => controller.abort();
  }, [attempt]);
  return { ...state, retry: () => setAttempt(value => value + 1) };
}
