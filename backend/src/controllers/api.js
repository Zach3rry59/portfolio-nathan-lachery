import { referenceProjects } from '../../../shared/projects.js';
import { HttpError } from '../middleware/errors.js';
export function controllers(repository) {
  return {
    health(req, res) { const database = repository.status(); res.json({ status: database.connected ? 'ok' : 'degraded', database: { state: database.state, connected: database.connected }, contactAvailable: database.connected }); },
    async projects(req, res) {
      const connected = repository.status().connected;
      const category = req.query.category;
      const data = connected ? await repository.projects(category) : referenceProjects.filter(project => !category || project.category === category);
      res.json({ data, meta: { source: connected ? 'mongodb' : 'reference' } });
    },
    async project(req, res) {
      const connected = repository.status().connected;
      const data = connected ? await repository.project(req.params.id) : referenceProjects.find(project => project._id === req.params.id);
      if (!data) throw new HttpError(404, 'PROJECT_NOT_FOUND', 'Projet introuvable.');
      res.json({ data, meta: { source: connected ? 'mongodb' : 'reference' } });
    },
    async contact(req, res) {
      if (!repository.status().connected) throw new HttpError(503, 'CONTACT_UNAVAILABLE', 'Le formulaire est temporairement indisponible. Vous pouvez utiliser l’adresse email affichée.');
      await repository.contact(req.validatedContact);
      res.status(201).json({ message: 'Votre message a été enregistré. Merci !' });
    },
    async createProject(req, res) { const data = await repository.createProject(req.validatedProject); res.status(201).json({ data }); },
    async updateProject(req, res) {
      const data = await repository.updateProject(req.params.id, req.validatedProject);
      if (!data) throw new HttpError(404, 'PROJECT_NOT_FOUND', 'Projet introuvable.');
      res.json({ data });
    },
    async deleteProject(req, res) {
      const data = await repository.deleteProject(req.params.id);
      if (!data) throw new HttpError(404, 'PROJECT_NOT_FOUND', 'Projet introuvable.');
      res.status(204).end();
    },
  };
}
