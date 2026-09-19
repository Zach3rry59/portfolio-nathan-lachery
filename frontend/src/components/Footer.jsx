export default function Footer({ onNavigate, hasProjects }) {
  const link = (event, id) => { event.preventDefault(); onNavigate(id); };
  return <footer className="footer container" id="footer" tabIndex={-1}>
    <div className="footer-top"><a className="brand" href="#home" onClick={e => link(e, 'home')} aria-label="Retour à l’accueil">NL<span>.</span></a><p>Nathan Lachery<span>Développement d’applications × Maintenance industrielle</span></p><a href="#home" className="back-top" onClick={e => link(e, 'home')}>Retour en orbite <span aria-hidden="true">↑</span></a></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Nathan Lachery</span>
      <nav aria-label="Navigation de pied de page"><a href="#profile" onClick={e => link(e, 'profile')}>Profil</a>{hasProjects && <a href="#portfolio" onClick={e => link(e, 'portfolio')}>Portfolio</a>}<a href="mailto:lachery.nathan59@gmail.com">Email ↗</a><a href="https://github.com/Zach3rry59" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/nathan-lachery/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="/privacy">Confidentialité</a></nav>
      <span className="footer-signature" aria-hidden="true">{'</>'} <span>×</span> ⚙</span>
    </div>
  </footer>;
}
