import { config } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { Project } from './models/Project.js';
import { seedProjects } from './services/seed-projects.js';
import { referenceProjects } from '../../shared/projects.js';
if (!config.mongoUri || !await connectDatabase(config.mongoUri)) {
  console.error('Configurer MONGODB_URI avant d’initialiser les projets de référence.'); process.exitCode = 1;
} else {
  try {
    await seedProjects(Project, referenceProjects);
    console.log('Projets de référence initialisés. Les projets existants n’ont pas été modifiés.');
  } finally { await disconnectDatabase(); }
}
