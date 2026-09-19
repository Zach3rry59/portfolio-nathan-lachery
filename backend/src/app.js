import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { repository as databaseRepository } from './services/repository.js';
import { apiRoutes } from './routes/api.js';
import { HttpError, notFound, errorHandler } from './middleware/errors.js';
export function createApp({ repository = databaseRepository, origins = config.origins, settings = config } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', settings.trustProxy || false);
  app.use(helmet());
  app.use(cors({ origin(origin, callback) { if (!origin || origins.includes(origin)) callback(null, true); else callback(new HttpError(403, 'ORIGIN_DENIED', 'Origine non autorisée.')); }, methods: ['GET','POST','PATCH','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'], credentials: false }));
  app.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  app.use(express.json({ limit: '12kb', strict: true }));
  app.use('/api', apiRoutes(repository, settings));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
