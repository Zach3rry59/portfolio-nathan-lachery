export const contactLimits = { name: [2,100], email: [3,254], subject: [3,140], message: [20,5000] };
export function validateContact(input) {
  const fields = {};
  const value = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { fields: { form: 'Objet attendu.' } };
  for (const [key, [min,max]] of Object.entries(contactLimits)) {
    if (typeof input[key] !== 'string') { fields[key] = 'Ce champ est obligatoire.'; continue; }
    value[key] = input[key].trim();
    if (value[key].length < min || value[key].length > max) fields[key] = `Entre ${min} et ${max} caractères attendus.`;
  }
  if (value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) fields.email = 'Adresse email invalide.';
  if (Object.keys(input).some(key => !(key in contactLimits))) fields.form = 'La requête contient des champs non autorisés.';
  return { value, fields };
}
