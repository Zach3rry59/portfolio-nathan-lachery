import { Project } from '../models/Project.js';
import { CvMigration as Migration } from '../models/Cv.js';
import { baseProjects } from '../../../shared/projects.js';
import { projectDetails } from '../../../shared/project-details.js';

// Une migration de contenu unique : aucune création ni remplacement d'une édition admin.
export async function migrateProjectDetails(Projects = Project, Markers = Migration) {
  const _id = 'project-details-v1';
  if (await Markers.exists({ _id })) return;
  for (const original of baseProjects) {
    for (const [field, value] of Object.entries(projectDetails[original.slug])) {
      const unchanged = [{ [field]: { $exists: false } }];
      if (field in original) unchanged.push({ [field]: original[field] });
      await Projects.updateOne({ slug: original.slug, $or: unchanged }, { $set: { [field]: value } }, { runValidators: true });
    }
  }
  await Markers.updateOne({ _id }, { $setOnInsert: { completedAt: new Date() } }, { upsert: true });
}
