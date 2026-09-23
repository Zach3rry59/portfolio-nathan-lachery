import { useState } from 'react';
import Scene from '../components/Scene.jsx';
import Footer from '../components/Footer.jsx';
import ContactForm from '../components/ContactForm.jsx';
export default function ContactScene({ profileKey, hasProjects, onNavigate }) {
  const [copy, setCopy] = useState('');
  async function copyEmail() { try { await navigator.clipboard.writeText('lachery.nathan59@gmail.com'); setCopy('Adresse email copiée.'); } catch { setCopy('Sélectionnez l’adresse ci-dessus pour la copier.'); } }
  return <>
    <Scene id="contact" title={`${hasProjects ? '06' : '05'} — ET LA SUITE ?`} caption="FAISONS CONNAISSANCE" className="contact-section">
      <div className="contact-orbit" aria-hidden="true"/>
      <div className="contact-content">
        <p className="contact-prelude">{profileKey === 'industrie' ? 'Un stage au sein de votre équipe maintenance ?' : 'Un poste junior ? Un projet web ?'}</p>
        <h2 id="contact-title">Parlons<span className="gradient-text">-en.</span><a href="mailto:lachery.nathan59@gmail.com" className="contact-arrow" aria-label="Écrire à Nathan Lachery">↗</a></h2>
        <p>{profileKey === 'industrie' ? 'Échangeons sur vos activités de maintenance et les possibilités de stage dans le cadre de ma formation TSMI.' : 'Échangeons sur vos projets applicatifs et la manière dont je pourrais contribuer à votre équipe de développement.'}</p>
        <div className="contact-links"><a className="email-link" href="mailto:lachery.nathan59@gmail.com">lachery.nathan59@gmail.com <span aria-hidden="true">↗</span></a><button className="copy-button" onClick={copyEmail} aria-label="Copier l’adresse email">Copier ⧉</button></div>
        <span className="copy-status" role="status">{copy}</span>
        <div className="contact-meta"><span><span className="status-dot"/>Douai (59), France</span><a href="https://github.com/Zach3rry59" target="_blank" rel="noopener noreferrer">GitHub / Zach3rry59 ↗</a><a href="https://www.linkedin.com/in/nathan-lachery/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a className="cv-link" href={`/cv/${profileKey}.pdf`} target="_blank" rel="noopener noreferrer">Consulter mon CV ↗</a><ContactForm/></div>
      </div>
    </Scene>
    <Footer onNavigate={onNavigate} hasProjects={hasProjects}/>
  </>;
}
