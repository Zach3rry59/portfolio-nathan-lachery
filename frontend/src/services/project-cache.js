import { referenceProjects } from '../../../shared/projects.js';
import { validateProject } from '../../../shared/project-validation.js';
export const cacheKey = 'publicProjects.v2';
export const sortProjects = data => [...data].sort((a,b) => (a.order || 0) - (b.order || 0) || a._id.localeCompare(b._id));
export const referenceFor = category => sortProjects(referenceProjects.filter(item => item.category === category));
export function validProjects(data) {
  return Array.isArray(data) && data.length <= 100 && data.every(item => {
    if (!item || !/^[a-f\d]{24}$/i.test(item._id)) return false;
    const fields = { ...item };
    for (const key of ['_id','createdAt','updatedAt']) delete fields[key];
    return Object.keys(validateProject(fields).fields).length === 0;
  });
}
export function readProjects(storage, category) {
  try {
    const cache = JSON.parse(storage.getItem(`${cacheKey}.${category}`));
    const age = Date.now() - cache.savedAt;
    if (age >= 0 && age < 604800000 && validProjects(cache.data) && cache.data.every(item => item.category === category)) return sortProjects(cache.data);
  } catch { /* Storage is optional. */ }
  return null;
}
export function saveProjects(storage, data, category) {
  if (!validProjects(data) || data.some(item => item.category !== category)) return;
  try { storage.setItem(`${cacheKey}.${category}`, JSON.stringify({ savedAt: Date.now(), data })); } catch { /* Storage is optional. */ }
}
