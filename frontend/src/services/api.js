const base = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
export async function request(path, options = {}) {
  const timeout = new AbortController();
  const timer = setTimeout(() => timeout.abort(), 20000);
  const signal = options.signal ? AbortSignal.any([options.signal, timeout.signal]) : timeout.signal;
  try {
    const response = await fetch(`${base}${path}`, { ...options, signal, headers: { 'Content-Type': 'application/json', ...options.headers } });
    const body = response.status === 204 ? null : await response.json();
    if (!response.ok) {
      const error = new Error(body.error?.message || 'Service temporairement indisponible.');
      error.fields = body.error?.fields;
      error.status = response.status;
      throw error;
    }
    return body;
  } finally { clearTimeout(timer); }
}
export const getProjects = (category, signal) => request(`/projects?category=${encodeURIComponent(category)}`, { signal });
export const sendContact = data => request('/contact', { method: 'POST', body: JSON.stringify(data) });
export function safeUrl(value) {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; } catch { return ''; }
}
export function projectView(project) {
  return {
    id: project._id, category: project.category, featured: project.featured, title: project.title, date: project.year || '', context: project.context || '',
    description: project.shortDescription || project.description || '',
    longDescription: project.description || '', role: project.role || '', problem: project.problem || '',
    challenges: project.challenges || '', solutions: project.solutions || '',
    screenshots: (project.screenshots || []).map(item => ({ url: safeUrl(item.url), alt: item.alt })).filter(item => item.url),
    stack: project.technologies || [], repository: safeUrl(project.githubUrl), demo: safeUrl(project.demoUrl), image: safeUrl(project.imageUrl),
    features: (project.features || []).map(feature => [feature.title, feature.description]),
    isKeyProject: project.slug === 'gestion-de-cles-sofip',
  };
}
