export const categories = ['dev', 'industry'];
export function httpUrl(value) {
  if (value === '') return true;
  if (typeof value !== 'string' || value.length > 2048) return false;
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password; } catch { return false; }
}
const textFields = { title: [2,160], slug: [2,180], shortDescription: [10,500], description: [0,5000], year: [0,30], context: [0,200], role: [0,1000], problem: [0,1500], challenges: [0,2000], solutions: [0,2000] };
const allowed = [...Object.keys(textFields), 'category', 'technologies', 'githubUrl', 'demoUrl', 'imageUrl', 'featured', 'order', 'features', 'screenshots'];
export function validateProject(input, partial = false) {
  const fields = {}, value = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { fields: { form: 'Objet JSON requis.' }, value };
  if (Object.keys(input).some(key => !allowed.includes(key))) fields.form = 'Champs inattendus.';
  if (partial && !Object.keys(input).length) fields.form = 'Aucune modification.';
  for (const [key,[min,max]] of Object.entries(textFields)) {
    if (!(key in input) && (partial || !['title','slug','shortDescription'].includes(key))) continue;
    if (typeof input[key] !== 'string' || input[key].trim().length < min || input[key].trim().length > max) fields[key] = `Texte de ${min} à ${max} caractères requis.`;
    else value[key] = input[key].trim();
  }
  if (value.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug)) fields.slug = 'Minuscules, chiffres et tirets uniquement.';
  if (!partial || 'category' in input) {
    if (!categories.includes(input.category)) fields.category = 'Choisir dev ou industry.';
    else value.category = input.category;
  }
  for (const key of ['githubUrl','demoUrl','imageUrl']) if (key in input) {
    if (!httpUrl(input[key])) fields[key] = 'URL HTTP(S) sans identifiant requise.';
    else value[key] = input[key];
  }
  if ('technologies' in input) {
    if (!Array.isArray(input.technologies) || input.technologies.length > 20 || input.technologies.some(item => typeof item !== 'string' || !item.trim() || item.length > 80)) fields.technologies = '20 technologies de 80 caractères maximum.';
    else value.technologies = [...new Set(input.technologies.map(item => item.trim()))];
  }
  if ('featured' in input) { if (typeof input.featured !== 'boolean') fields.featured = 'Booléen requis.'; else value.featured = input.featured; }
  if ('order' in input) { if (!Number.isInteger(input.order) || input.order < 0 || input.order > 10000) fields.order = 'Entier entre 0 et 10000 requis.'; else value.order = input.order; }
  if ('features' in input) {
    if (!Array.isArray(input.features) || input.features.length > 12 || input.features.some(item => !item || typeof item !== 'object' || Object.keys(item).some(key => !['title','description'].includes(key)) || typeof item.title !== 'string' || !item.title.trim() || item.title.length > 100 || typeof item.description !== 'string' || item.description.length > 1000)) fields.features = 'Détails de projet invalides.';
    else value.features = input.features.map(item => ({ title: item.title.trim(), description: item.description.trim() }));
  }
  if ('screenshots' in input) {
    if (!Array.isArray(input.screenshots) || input.screenshots.length > 8 || input.screenshots.some(item => !item || typeof item !== 'object' || Object.keys(item).some(key => !['url','alt'].includes(key)) || !item.url || !httpUrl(item.url) || typeof item.alt !== 'string' || !item.alt.trim() || item.alt.length > 200)) fields.screenshots = '8 captures maximum : URL HTTP(S) et description de 200 caractères maximum.';
    else value.screenshots = input.screenshots.map(item => ({ url: item.url, alt: item.alt.trim() }));
  }
  return { fields, value };
}
