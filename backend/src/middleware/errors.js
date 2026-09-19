export class HttpError extends Error {
  constructor(status, code, message, fields) { super(message); this.status = status; this.code = code; this.fields = fields; }
}
export function notFound(req, res, next) { next(new HttpError(404, 'NOT_FOUND', 'Ressource introuvable.')); }
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.type === 'entity.parse.failed') error = new HttpError(400, 'INVALID_JSON', 'Le JSON envoyé est invalide.');
  if (error.type === 'entity.too.large') error = new HttpError(413, 'BODY_TOO_LARGE', 'La requête est trop volumineuse.');
  if (error.code === 11000) error = new HttpError(409, 'DUPLICATE_SLUG', 'Cet identifiant de projet est déjà utilisé.');
  if (error.name === 'ValidationError' || error.name === 'StrictModeError') error = new HttpError(400, 'VALIDATION_ERROR', 'Données invalides.');
  const status = error instanceof HttpError ? error.status : 500;
  res.status(status).json({ error: { code: status === 500 ? 'INTERNAL_ERROR' : error.code, message: status === 500 ? 'Une erreur interne est survenue.' : error.message, ...(error.fields ? { fields: error.fields } : {}) } });
}
