import ContentManager, { sectionNames } from './ContentManager.jsx';
import { useEffect, useRef, useState } from 'react';
import Login from './Login.jsx';
import ProjectEditor from './ProjectEditor.jsx';
import { request } from '../services/api.js';
import '../styles/admin.css';
export default function Admin() {
  const [session, setSession] = useState(null), [projects, setProjects] = useState([]);
  const [editor, setEditor] = useState(undefined), [pending, setPending] = useState(false), [error, setError] = useState('');
  const [removing, setRemoving] = useState(null), [notice, setNotice] = useState('');
  const confirmation = useRef(null);
  const [section,setSection] = useState('projects');
  useEffect(() => { document.title = 'Administration — Nathan Lachery'; }, []);
  useEffect(() => {
    if (!session) return;
    const timer = setTimeout(() => { setSession(null); setProjects([]); }, Math.max(0, new Date(session.expiresAt) - Date.now()));
    return () => clearTimeout(timer);
  }, [session]);
  async function api(path, options = {}, credentials = session) {
    try { return await request(path, { ...options, headers: { Authorization: `Bearer ${credentials.token}` } }); }
    catch (failure) { if (failure.status === 401) { setSession(null); setProjects([]); } throw failure; }
  }
  async function load(credentials = session) {
    const result = await api('/projects', {}, credentials);
    if (result.meta?.source !== 'mongodb') throw new Error('MongoDB est indisponible. Aucun projet modifiable.');
    setProjects(result.data);
  }
  async function loggedIn(credentials) {
    setSession(credentials); setEditor(undefined); setError(''); setPending(true);
    try { await load(credentials); } catch (failure) { setError(failure.message); } finally { setPending(false); }
  }
  async function save(data) {
    setPending(true); setError(''); setNotice('');
    try { await api(editor ? `/projects/${editor._id}` : '/projects', { method: editor ? 'PATCH' : 'POST', body: JSON.stringify(data) }); setEditor(undefined); await load(); setNotice('Projet enregistré.'); }
    catch (failure) { setError(failure.message); } finally { setPending(false); }
  }
  async function remove() {
    setPending(true); setError('');
    try { await api(`/projects/${removing._id}`, { method: 'DELETE' }); confirmation.current.close(); setRemoving(null); await load(); setNotice('Projet supprimé.'); }
    catch (failure) { setError(failure.message); } finally { setPending(false); }
  }
  async function logout() { try { await api('/auth/logout', { method: 'POST' }); } catch { /* An unreachable server session still expires after one hour. */ } finally { setSession(null); setProjects([]); setEditor(undefined); setError(''); } }
  return <main className="admin-shell"><header className="admin-header"><a href="/">← Retour au portfolio</a>{session && <button onClick={logout}>Se déconnecter</button>}</header>
    {!session ? <Login onLogin={loggedIn}/> : <>
      <nav className="admin-tabs" aria-label="Sections administration">{Object.entries({projects:'Projets',...sectionNames}).map(([key,label])=><button key={key} aria-current={section===key?'page':undefined} onClick={()=>setSection(key)}>{label}</button>)}</nav>
      {section!=='projects'?<ContentManager key={section} kind={section} api={api}/>:<>
      <div className="admin-heading"><div><h1>Mes projets</h1><p>{session.email}</p></div><button className="button" disabled={pending} onClick={() => { setEditor(null); setError(''); }}>Créer un projet</button></div>
      <p role="status">{notice || (pending ? 'Opération en cours…' : '')}</p>
      {editor !== undefined ? <ProjectEditor key={editor?._id || 'new'} project={editor} onSave={save} onCancel={() => { setEditor(undefined); setError(''); }} pending={pending} error={error}/> : <section className="admin-panel" aria-label="Liste des projets">
        <p role="alert">{error}</p>{!projects.length && <p>Aucun projet enregistré.</p>}
        {projects.map(project => <article className="admin-project" key={project._id}><div><h2>{project.title}</h2><p>{project.category === 'dev' ? 'Développement' : 'Industrie'} · Ordre {project.order}{project.featured ? ' · Mis en avant' : ''}</p></div><div className="admin-actions"><button disabled={pending} onClick={() => { setEditor(project); setError(''); }}>Modifier {project.title}</button><button className="danger" disabled={pending} onClick={() => { setRemoving(project); setError(''); confirmation.current.showModal(); }}>Supprimer {project.title}</button></div></article>)}
      </section>}
      <dialog ref={confirmation} className="admin-panel delete-dialog" aria-labelledby="delete-title"><h2 id="delete-title">Supprimer ce projet ?</h2><p>« {removing?.title} » sera retiré du portfolio. Cette suppression est définitive.</p><p role="alert">{error}</p><div className="admin-actions"><button disabled={pending} onClick={() => confirmation.current.close()}>Annuler</button><button className="danger" disabled={pending} onClick={remove}>Confirmer la suppression</button></div></dialog>
    </>}</>}
  </main>;
}
