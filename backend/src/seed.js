import { config } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { Project } from './models/Project.js';
import { referenceProjects } from '../../shared/projects.js';
if (!config.mongoUri || !await connectDatabase(config.mongoUri)) {
  console.error('Configurer MONGODB_URI avant d’initialiser le projet SOFIP.'); process.exitCode = 1;
} else {
  try {
    for (const project of referenceProjects) await Project.updateOne({ slug: project.slug }, { $setOnInsert: project }, { upsert: true, runValidators: true });
    console.log('Projet de référence initialisé. Les projets existants n’ont pas été modifiés.');
  } finally { await disconnectDatabase(); }
}
