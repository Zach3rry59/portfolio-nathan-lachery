import { referenceProjects } from '../../../shared/projects.js';
import { validateProject } from '../../../shared/project-validation.js';
export const cacheKey = 'publicProjects.v1';
export function validProjects(data) {
  return Array.isArray(data) && data.length <= 100 && data.every(item => {
    if (!item || !/^[a-f\d]{24}$/i.test(item._id)) return false;
    const fields = { ...item };
    for (const key of ['_id','createdAt','updatedAt']) delete fields[key];
    return Object.keys(validateProject(fields).fields).length === 0;
  });
}
export function readProjects(storage) {
  try {
    const cache = JSON.parse(storage.getItem(cacheKey));
    if (Date.now() - cache.savedAt < 7 * 24 * 60 * 60 * 1000 && validProjects(cache.data)) return cache.data;
  } catch { /* Storage can be disabled by the browser. */ }
  return referenceProjects;
}
export function saveProjects(storage, data) {
  try { storage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data })); } catch { /* The CV does not require storage. */ }
}
