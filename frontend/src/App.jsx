import { useCv } from './hooks/useCv.js';
import { useEffect, useRef, useState } from 'react';
import { profiles } from './data/profiles.js';
import { useEffects } from './hooks/useEffects.js';
import Background from './components/Background.jsx';
import Header from './components/Header.jsx';
import HeroScene from './scenes/HeroScene.jsx';
import { ProfileScene, SkillsScene, JourneyScene } from './scenes/ProfileScenes.jsx';
import PortfolioScene from './scenes/PortfolioScene.jsx';
import ContactScene from './scenes/ContactScene.jsx';
import { useCinema } from './hooks/useCinema.js';
import TimelineControls from './components/TimelineControls.jsx';
import { useProjects } from './hooks/useProjects.js';
import { profileFromPath, profilePath, publicPages, publicSite } from '../../shared/public-pages.js';
export default function App() {
  const [profileKey, setProfileKey] = useState(() => profileFromPath(location.pathname));
  const stageRef = useRef(null);
  const effects = useEffects();
  const category = profileKey === 'dev' ? 'dev' : 'industry';
  const profile = useCv(profiles[profileKey], category);
  const projectState = useProjects(category);
  const projects = projectState.projects;
  const hasProjects = projects.length > 0;
  const ids = ['home', 'profile', 'skills', 'experience', 'training', ...(hasProjects ? ['portfolio'] : []), 'contact'];
  const cinema = useCinema(ids, effects.mode === 'full', stageRef);
  useEffect(() => { document.body.dataset.profile = profileKey; }, [profileKey]);
  useEffect(() => { const back = () => setProfileKey(profileFromPath(location.pathname)); addEventListener('popstate', back); return () => removeEventListener('popstate', back); }, []);
  useEffect(() => {
    const path = location.pathname === '/' ? '/' : profilePath(profileKey);
    const page = publicPages[path]; document.title = page.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', page.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', publicSite + path);
    for (const [key,value] of Object.entries({title:page.title,description:page.description,url:publicSite+path})) document.querySelector(`meta[property="og:${key}"]`)?.setAttribute('content',value);
  }, [profileKey]);
  function changeProfile(key, scene = cinema.active) {
    setProfileKey(key);
    if (!location.pathname.startsWith('/test/')) history.pushState(null, '', `${profilePath(key)}#${scene}`);
  }
  function select(key) { changeProfile(key, 'profile'); cinema.navigate('profile', false); }
  const scenes = {
    home: <HeroScene profileKey={profileKey} onSelect={select} onNavigate={cinema.navigate}/>,
    profile: <ProfileScene profile={profile} profileKey={profileKey} onNavigate={cinema.navigate}/>,
    skills: <SkillsScene profile={profile}/>,
    experience: <JourneyScene profile={profile}/>,
    training: <JourneyScene profile={profile} training/>,
    portfolio: <PortfolioScene key={category} {...projectState} projects={projects} category={category}/>,
    contact: <ContactScene profileKey={profileKey} hasProjects={hasProjects} onNavigate={cinema.navigate}/>,
  };
  return <>
    <a className="skip-link" href="#profile" onClick={e => { e.preventDefault(); cinema.navigate('profile'); }}>Aller au profil</a>
    <Background effects={effects.mode}/>
    <Header profile={profile} profileKey={profileKey} hasProjects={hasProjects} onToggle={() => changeProfile(profileKey === 'dev' ? 'industrie' : 'dev')} effects={effects.mode} onEffectsToggle={effects.toggle} active={cinema.active} onNavigate={cinema.navigate}/>
    <main className="cinema-stage" ref={stageRef} tabIndex={-1} aria-label="Parcours interactif">
      {ids.map(id => <div className="scene-layer" data-scene={id} key={id}><div className="scene-reader">{scenes[id]}</div></div>)}
    </main>
    <TimelineControls ids={ids} active={cinema.active} onStep={cinema.step} onSeek={cinema.seek}/>
  </>;
}
