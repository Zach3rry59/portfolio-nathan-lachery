import { validateContact } from '../../../shared/contact.js';
import { HttpError } from './errors.js';
import { categories, validateProject } from '../../../shared/project-validation.js';
export function contactValidation(req, res, next) {
  if (!req.is('application/json')) return next(new HttpError(415, 'JSON_REQUIRED', 'Un contenu JSON est requis.'));
  const { value, fields } = validateContact(req.body);
  if (Object.keys(fields).length) return next(new HttpError(400, 'VALIDATION_ERROR', 'Vérifiez les champs du formulaire.', fields));
  req.validatedContact = value;
  next();
}
export function projectIdValidation(req, res, next) {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) return next(new HttpError(400, 'INVALID_ID', 'Identifiant de projet invalide.'));
  next();
}
export function categoryValidation(req, res, next) {
  if (Object.keys(req.query).some(key => key !== 'category') || (req.query.category !== undefined && !categories.includes(req.query.category))) return next(new HttpError(400, 'INVALID_CATEGORY', 'Catégorie invalide.'));
  next();
}
export function projectValidation(req, res, next) {
  if (!req.is('application/json')) return next(new HttpError(415, 'JSON_REQUIRED', 'Un contenu JSON est requis.'));
  const { value, fields } = validateProject(req.body, req.method === 'PATCH');
  if (Object.keys(fields).length) return next(new HttpError(400, 'VALIDATION_ERROR', 'Vérifiez les champs du projet.', fields));
  req.validatedProject = value;
  next();
}
