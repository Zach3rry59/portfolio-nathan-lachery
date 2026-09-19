import { useState } from 'react';
import { Tags } from './Scene.jsx';

function KeyIllustration({ year }) {
  return <>
    <div className="art-grid" aria-hidden="true"/>
    <div className="art-top mono"><span>01 / APPLICATION WEB</span><span>{year}</span></div>
    <div className="key-system" aria-hidden="true">
      <span className="system-orbit"/><span className="system-orbit system-orbit--two"/>
      <div className="key-core"><svg viewBox="0 0 100 100" fill="none"><circle cx="36" cy="35" r="19"/><path d="m49 49 31 31m-11-11 10-10m-1 19 10-10"/><circle cx="33" cy="32" r="4"/></svg></div>
      <span className="system-node node-users">Utilisateurs</span><span className="system-node node-access">Droits d’accès</span><span className="system-node node-live"><i/>Temps réel</span>
    </div>
    <div className="art-bottom"><strong>Une clé.<br/>Le bon accès.</strong><span className="mono">ILLUSTRATION DU PROJET<br/>CAPTURE RÉELLE À AJOUTER</span></div>
  </>;
}

export default function ProjectCard({ project }) {
  const [imageFailed, setImageFailed] = useState(false);
  return <article className="featured-project">
    <div className="project-art" aria-label={project.image && !imageFailed ? 'Aperçu du projet' : 'Illustration conceptuelle du projet, pas une capture de l’application'}>
      {project.image && !imageFailed ? <img className="project-image" src={project.image} alt={`Aperçu de ${project.title}`} onError={() => setImageFailed(true)}/> : project.isKeyProject ? <KeyIllustration year={project.date}/> : <div className="generic-art"><strong>{project.title}</strong><span className="mono">APERÇU À AJOUTER</span></div>}
    </div>
    <div className="project-info">
      <div className="project-meta"><span className="mono">{project.isKeyProject ? 'DÉVELOPPEMENT FULL STACK' : 'PROJET'}</span><span className="project-year">{project.date}</span></div>
      <h3>{project.title}</h3><p className="project-context">{project.context}</p><p>{project.description}</p>
      <div className="project-tags"><Tags items={project.stack}/></div>
      {project.repository && <a className="button" href={project.repository} target="_blank" rel="noopener noreferrer">Explorer le code <span aria-hidden="true">↗</span></a>}
      {project.demo && <a className="text-link" href={project.demo} target="_blank" rel="noopener noreferrer">Voir la démo ↗</a>}
      {project.features.length > 0 && <details className="project-details"><summary>Le travail réalisé <span aria-hidden="true">+</span></summary><dl>{project.features.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl></details>}
    </div>
  </article>;
}
