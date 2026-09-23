import { Project } from '../models/Project.js';
import { CvMigration as Migration } from '../models/Cv.js';
import { sofipScreenshots } from '../../../shared/project-details.js';

export async function migrateProjectCaptures(Projects = Project, Markers = Migration) {
  const _id = 'sofip-captures-v1';
  if (await Markers.exists({ _id })) return;
  const slug = 'gestion-de-cles-sofip';
  await Projects.updateOne({ slug, $or: [{ screenshots: { $exists: false } }, { screenshots: [] }] }, { $set: { screenshots: sofipScreenshots } }, { runValidators: true });
  await Projects.updateOne({ slug, $or: [{ imageUrl: { $exists: false } }, { imageUrl: '' }] }, { $set: { imageUrl: sofipScreenshots[0].url } }, { runValidators: true });
  await Markers.updateOne({ _id }, { $setOnInsert: { completedAt: new Date() } }, { upsert: true });
}
