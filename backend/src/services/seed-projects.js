// L'identité stable est le slug ; une relance ne remplace jamais une édition admin.
export async function seedProjects(Project, projects) {
  for (const project of projects) await Project.updateOne({ slug: project.slug }, { $setOnInsert: project }, { upsert: true, runValidators: true });
}
