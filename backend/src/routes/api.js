import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { controllers } from '../controllers/api.js';
import { contactValidation, projectIdValidation, categoryValidation, projectValidation } from '../middleware/validation.js';
import { createAuth } from '../services/auth.js';
export function apiRoutes(repository, settings) {
  const router = Router();
  const api = controllers(repository);
  const auth = createAuth(repository, settings);
  const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: { code: 'LOGIN_RATE_LIMITED', message: 'Trop de tentatives de connexion. Réessayez plus tard.' } } });
  const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: { code: 'RATE_LIMITED', message: 'Trop de tentatives. Réessayez dans quelques minutes.' } } });
  router.get('/health', api.health);
  router.get('/projects', categoryValidation, api.projects);
  router.get('/projects/:id', projectIdValidation, api.project);
  router.post('/contact', contactLimiter, contactValidation, api.contact);
  router.post('/auth/login', loginLimiter, auth.login);
  router.get('/auth/me', auth.requireAdmin, auth.me);
  router.post('/auth/logout', auth.requireAdmin, auth.logout);
  router.post('/projects', auth.requireAdmin, projectValidation, api.createProject);
  router.patch('/projects/:id', auth.requireAdmin, projectIdValidation, projectValidation, api.updateProject);
  router.delete('/projects/:id', auth.requireAdmin, projectIdValidation, api.deleteProject);
  return router;
}
