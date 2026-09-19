import { createApp } from '../src/app.js';
export async function server(t, repository, settings = {}) {
  const listener = createApp({ repository, settings }).listen(0, '127.0.0.1');
  await new Promise(resolve => listener.once('listening', resolve));
  t.after(() => new Promise(resolve => { listener.closeAllConnections(); listener.close(resolve); }));
  const base = `http://127.0.0.1:${listener.address().port}/api`;
  return async (path, method = 'GET', data, token) => fetch(`${base}${path}`, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...(data === undefined ? {} : { body: JSON.stringify(data) }) });
}
export function memoryRepository() {
  const projects = new Map(), sessions = new Map();
  let next = 1;
  return {
    status: () => ({ connected: true, state: 'connected' }),
    projects: async category => [...projects.values()].filter(project => !category || project.category === category),
    project: async id => projects.get(id),
    createProject: async data => { if ([...projects.values()].some(p => p.slug === data.slug)) throw Object.assign(new Error(),{ code: 11000 }); const value = { ...data, _id: String(next++).padStart(24,'0') }; projects.set(value._id, value); return value; },
    updateProject: async (id,data) => { if (!projects.has(id)) return null; const value = { ...projects.get(id), ...data }; projects.set(id,value); return value; },
    deleteProject: async id => { const value = projects.get(id); projects.delete(id); return value; },
    createSession: async data => sessions.set(data.tokenHash,data),
    session: async hash => sessions.get(hash),
    deleteSession: async hash => sessions.delete(hash),
    contact: async data => data,
  };
}
