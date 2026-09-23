import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Tags } from './Scene.jsx';
import '../styles/project-detail.css';

function Capture({ shot }) {
  const [failed, setFailed] = useState(false);
  return failed ? <span className="capture-unavailable">Capture indisponible — {shot.alt}</span> : <img src={shot.url} alt={shot.alt} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)}/>;
}

export default function ProjectDetail({ project, onClose, returnFocus }) {
  const dialog = useRef(null);
  const [zoom, setZoom] = useState(null);
  const zoomTrigger = useRef(null);
  const backButton = useRef(null);
  useLayoutEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => { element.close(); returnFocus?.focus({ preventScroll: true }); };
  }, [returnFocus]);
  useLayoutEffect(() => {
    if (zoom !== null) backButton.current?.focus({ preventScroll: true });
    else zoomTrigger.current?.focus({ preventScroll: true });
  }, [zoom]);
  function closeZoom() { setZoom(null); }
  const paragraphs = [
    ['Contexte', project.context],
    ['Le besoin', project.problem],
    ['Mon rôle', project.role],
    ['Difficultés techniques', project.challenges],
    ['Solutions apportées', project.solutions],
  ].filter(([, text]) => text?.trim());
  return createPortal(<dialog ref={dialog} className="project-detail" aria-labelledby="project-detail-title"
    onCancel={event => { event.preventDefault(); if (zoom !== null) closeZoom(); else onClose(); }}
    onKeyDown={event => event.stopPropagation()} onWheel={event => event.stopPropagation()}>
    <div className="project-detail-bar" inert={zoom !== null}><span className="mono">PROJET / {project.category === 'dev' ? 'DÉVELOPPEMENT' : 'INDUSTRIE'}</span><button className="detail-close" autoFocus onClick={onClose} aria-label="Fermer les détails du projet">Fermer <span aria-hidden="true">×</span></button></div>
    <div className="project-detail-content" inert={zoom !== null}>
      <header className="project-detail-heading"><span className="mono">{project.date}</span><h2 id="project-detail-title">{project.title}</h2><p className="detail-lead">{project.description}</p>
        <div className="detail-links">{project.repository && <a className="button" href={project.repository} target="_blank" rel="noopener noreferrer">Explorer le code ↗</a>}{project.demo && <a className="text-link" href={project.demo} target="_blank" rel="noopener noreferrer">Voir la démo ↗</a>}</div>
      </header>
      {project.longDescription?.trim() && project.longDescription !== project.description && <section className="detail-overview"><h3>Le projet en détail</h3><p>{project.longDescription}</p></section>}
      {paragraphs.length > 0 && <div className="detail-facts">{paragraphs.map(([title,text]) => <section key={title}><h3>{title}</h3><p>{text}</p></section>)}</div>}
      {project.features.some(([title,text])=>title?.trim() && text?.trim()) && <section className="detail-section"><h3>La réalisation</h3><div className="detail-features">{project.features.filter(([title,text])=>title?.trim() && text?.trim()).map(([title,text],index)=><section key={`${title}-${index}`}><span className="mono" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><h4>{title}</h4><p>{text}</p></section>)}</div></section>}
      {project.stack.length > 0 && <section className="detail-section"><h3>Stack technique</h3><Tags items={project.stack}/></section>}
      {project.screenshots.length > 0 && <section className="detail-section"><h3>Captures d’écran</h3><p className="detail-gallery-hint">Sélectionner une capture pour l’agrandir.</p><div className="detail-gallery">{project.screenshots.map((shot,index)=><button key={`${shot.url}-${index}`} aria-label={`Agrandir : ${shot.alt}`} onClick={event=>{zoomTrigger.current=event.currentTarget;setZoom(index);}}><Capture shot={shot}/><span>{shot.alt}</span></button>)}</div></section>}
    </div>
    {zoom !== null && <div className="detail-zoom" role="region" aria-label="Capture agrandie"><button ref={backButton} className="detail-close" onClick={closeZoom}>← Retour à la fiche</button><figure><Capture shot={project.screenshots[zoom]}/><figcaption>{project.screenshots[zoom].alt}</figcaption></figure></div>}
  </dialog>, document.body);
}
