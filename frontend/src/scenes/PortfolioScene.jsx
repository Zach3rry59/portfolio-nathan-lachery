import Scene from '../components/Scene.jsx';
import ProjectCarousel from '../components/ProjectCarousel.jsx';
export default function PortfolioScene({ projects, status, retry, category }) {
  return <Scene id="portfolio" title="05 — PORTFOLIO" caption={category === 'dev' ? 'DE L’IDÉE À L’APPLICATION' : 'TECHNIQUE & RÉALISATIONS'} className="portfolio-section">
    {status === 'loading' && <span className="sr-only project-loading" role="status">Actualisation des projets…</span>}
    <div className="portfolio-heading"><h2 id="portfolio-title">Du concret.<br/><span className="muted">{category === 'dev' ? 'Du code.' : 'De la technique.'} {projects.length > 1 ? 'Des projets.' : 'Un projet.'}</span></h2><p>De la conception<br/>à la réalisation.</p></div>
    {status === 'fallback' && <p className="api-notice" role="status">Connexion indisponible. La dernière sélection disponible reste consultable. <button onClick={retry}>Réessayer</button></p>}
    <ProjectCarousel projects={projects}/>
    {category === 'dev' && <a className="github-band" href="https://github.com/Zach3rry59" target="_blank" rel="noopener noreferrer"><span className="mono">POUR ALLER PLUS LOIN</span><span>Retrouvez mon univers sur GitHub.</span><span aria-hidden="true">↗</span></a>}
  </Scene>;
}
