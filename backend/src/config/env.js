import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
dotenv.config({ path: fileURLToPath(new URL('../../../.env', import.meta.url)), quiet: true });
const port = Number(process.env.PORT || 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT invalide.');
export const config = {
  port, host: process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1'),
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '',
  trustProxy: process.env.TRUST_PROXY === '1' ? 1 : false,
  mongoUri: process.env.MONGODB_URI || '',
  origins: (process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5173,http://localhost:5173').split(',').map(value => value.trim()).filter(Boolean),
};
for (const origin of config.origins) {
  try { const url = new URL(origin); if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) throw new Error(); }
  catch { throw new Error('CLIENT_ORIGIN doit contenir des origines HTTP(S) exactes, séparées par des virgules.'); }
}
