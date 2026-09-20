import { migrateCv } from './services/migrate-cv.js';
import { createApp } from './app.js';
import { config } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
const server = createApp().listen(config.port, config.host, () => {
  console.log(`API : http://${config.host}:${config.port}`);
  if (!config.mongoUri) console.log('MongoDB non configuré : projets de référence disponibles, contacts indisponibles.');
});
server.on('error', error => { console.error(`Impossible de démarrer l’API (${error.code || 'erreur'}).`); process.exitCode = 1; });
void connectDatabase(config.mongoUri, migrateCv);
async function shutdown() { server.close(); await disconnectDatabase(); }
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
