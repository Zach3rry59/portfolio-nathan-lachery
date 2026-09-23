export const publicSite = 'https://portfolio-nathan-lachery.pages.dev';
export const publicPages = {
  '/': { title: 'Nathan Lachery — Développement × Maintenance', description: 'Deux parcours complémentaires : développement d’applications et maintenance industrielle. Découvrez mes expériences, formations, projets et CV.' },
  '/dev': { title: 'Nathan Lachery — Développeur d’applications junior', description: 'Développeur d’applications junior à Douai, diplômé CDA. Projets React et Node.js, expériences, compétences et CV.' },
  '/maintenance': { title: 'Nathan Lachery — Recherche de stage en maintenance industrielle', description: 'En formation TSMI à l’AFPI de Hénin-Beaumont, je recherche un stage en maintenance industrielle. Parcours mécanique, CV et contact.' },
};
export function profileFromPath(path) { return path.replace(/\/$/, '') === '/maintenance' ? 'industrie' : 'dev'; }
export function profilePath(profile) { return profile === 'industrie' ? '/maintenance' : '/dev'; }
export function initialScene(path) { return ['/dev','/maintenance'].includes(path.replace(/\/$/, '')) ? 'profile' : 'home'; }
