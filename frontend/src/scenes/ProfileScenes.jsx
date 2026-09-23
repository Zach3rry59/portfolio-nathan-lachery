import Scene, { Tags, Certificate } from '../components/Scene.jsx';
export function ProfileScene({ profile, profileKey, onNavigate }) {
  return <Scene id="profile" title="01 — LE PROFIL" caption={profile.caption} className="profile-section"><div className="profile-intro"><h2 id="profile-title">{profile.title[0]}<br/><span className="muted">{profile.title[1]}</span></h2><div className="intro-columns"><div className="profile-identity"><span className="profile-symbol" aria-hidden="true">{profile.icon}</span><h3>{profile.role}</h3><span className="mono">DOUAI (59) · PERMIS B</span></div><div className="profile-copy"><p>{profile.introduction}</p><p className="objective"><span className="status-dot"/>{profile.objective}</p><a className="text-link" href={`/cv/${profileKey}.pdf`} target="_blank" rel="noopener noreferrer">Consulter le CV {profile.label} ↗</a><a className="text-link profile-contact" href="#contact" onClick={event => { event.preventDefault(); onNavigate("contact"); }}>Me contacter ↗</a></div></div></div></Scene>;
}
export function SkillsScene({ profile }) {
  return <Scene id="skills" title="02 — LES COMPÉTENCES" caption="LA TECHNIQUE AU SERVICE DU CONCRET"><div className="skills-block"><div className="subheading"><span className="mono">LES COMPÉTENCES</span><h2 id="skills-title">La technique,<br/><span className="muted">au service du concret.</span></h2><p>{profile.skillsNote}</p><Certificate/></div><div className="skill-groups">{profile.skills.map(group => <div className="skill-group" key={group.label}><h3>{group.label}</h3><Tags items={group.items}/></div>)}</div></div></Scene>;
}
function Timeline({ entries, training, maintenance }) { return entries.map(entry => <article className="timeline-entry" data-relevant={maintenance ? /maintenance|mécanicien/i.test(entry.title) : /développeur|développement/i.test(entry.title)} key={`${entry.date}-${entry.title}`}><div className="entry-date">{entry.date}</div><div><h3>{entry.title}</h3><p className="entry-organization">{entry.organization}</p><p className="entry-description">{training ? entry.detail : entry.description}</p></div></article>); }
export function JourneyScene({ profile, training = false }) {
  const id = training ? 'training' : 'experience';
  return <Scene id={id} title={training ? '04 — LES FORMATIONS' : '03 — LES EXPÉRIENCES'} caption="APPRENDRE · PRATIQUER · ÉVOLUER">
    <div className="journey">
      <div className="journey-label"><span className="mono">LE PARCOURS</span>
        <h2 id={`${id}-title`}>Apprendre.<br/>{' '}{training ? 'Construire.' : 'Pratiquer.'}<br/>{' '}<span className="gradient-text">Évoluer.</span></h2>
        <p>{profile.note}</p>
      </div>
      <div className="journey-content"><div className="timeline-group"><h3 className="timeline-title">{training ? 'Formations' : 'Expériences'} <span>{training ? '02' : '01'}</span></h3><Timeline entries={training ? profile.training : profile.experiences} training={training} maintenance={profile.label === "Industrie"}/></div></div>
    </div>
  </Scene>;
}
