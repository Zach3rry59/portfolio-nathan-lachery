import { randomBytes } from 'node:crypto';
import { digest, verifyPassword, validHash } from './password.js';
import { HttpError } from '../middleware/errors.js';
export function createAuth(repository, settings) {
  let verifying = false;
  const configured = () => settings.adminEmail && validHash(settings.adminPasswordHash || '');
  const available = () => {
    if (!configured() || !repository.status().connected) throw new HttpError(503, 'ADMIN_UNAVAILABLE', 'Administration temporairement indisponible.');
  };
  return {
    async login(req, res) {
      available();
      const body = req.body;
      if (!req.is('application/json') || !body || Object.keys(body).some(key => !['email','password'].includes(key)) || typeof body.email !== 'string' || body.email.length > 254 || typeof body.password !== 'string' || body.password.length > 200) throw new HttpError(400, 'INVALID_LOGIN', 'Identifiants invalides.');
      if (verifying) throw new HttpError(429, 'LOGIN_BUSY', 'Réessayez dans quelques instants.');
      verifying = true;
      let valid;
      try { valid = await verifyPassword(body.password, settings.adminPasswordHash); } finally { verifying = false; }
      if (!valid || body.email.trim().toLowerCase() !== settings.adminEmail.toLowerCase()) throw new HttpError(401, 'INVALID_LOGIN', 'Identifiants invalides.');
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await repository.createSession({ tokenHash: digest(token), credentialVersion: digest(settings.adminPasswordHash), expiresAt });
      res.json({ token, expiresAt, email: settings.adminEmail });
    },
    async requireAdmin(req, res, next) {
      const match = /^Bearer ([a-f0-9]{64})$/.exec(req.get('authorization') || '');
      if (!match) throw new HttpError(401, 'AUTH_REQUIRED', 'Connexion administrateur requise.');
      available();
      const tokenHash = digest(match[1]);
      const session = await repository.session(tokenHash);
      if (!session || new Date(session.expiresAt) <= new Date() || session.credentialVersion !== digest(settings.adminPasswordHash)) throw new HttpError(401, 'SESSION_EXPIRED', 'Session expirée. Reconnectez-vous.');
      req.adminTokenHash = tokenHash;
      next();
    },
    async logout(req, res) { await repository.deleteSession(req.adminTokenHash); res.status(204).end(); },
    me(req, res) { res.json({ email: settings.adminEmail }); },
  };
}
