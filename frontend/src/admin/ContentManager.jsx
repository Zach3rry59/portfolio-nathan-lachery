import { useEffect, useRef, useState } from 'react';
import { cvFields, validateCv } from '../../../shared/cv-validation.js';
import { newestFirst } from '../data/chronology.js';
export const sectionNames={experiences:'Expériences',training:'Formations',skills:'Compétences',messages:'Messages'};
export default function ContentManager({kind,api}){
  const messages=kind==='messages';
  const [entries,setEntries]=useState([]),[editor,setEditor]=useState(null),[removing,setRemoving]=useState(null);
  const [busy,setBusy]=useState(true),[error,setError]=useState(''),[notice,setNotice]=useState('');
  const [page,setPage]=useState(1),[total,setTotal]=useState(0);
  const dialog=useRef(null);
  async function load(currentPage=page){
    const result=await api(messages?`/admin/messages?page=${currentPage}`:'/admin/cv');
    const data=messages?result.data:result.data[kind];
    setEntries(['experiences','training'].includes(kind)?newestFirst(data):data);
    if(messages)setTotal(result.total);
  }
  useEffect(()=>{let active=true;setBusy(true);load().catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setBusy(false);});return()=>{active=false;};},[page]);
  async function act(operation,message){setBusy(true);setError('');setNotice('');try{await operation();await load();setNotice(message);}catch(e){setError(e.message);}finally{setBusy(false);}}
  const path=entry=>messages?`/admin/messages/${entry._id}`:`/admin/cv/${kind}${entry?._id?`/${entry._id}`:''}`;
  function add(){setEditor(Object.fromEntries(Object.keys(cvFields[kind]).map(key=>[key,key==='items'?[]:key==='category'?'dev':''])));setError('');}
  function save(event){
    event.preventDefault();const values=Object.fromEntries(Object.keys(cvFields[kind]).map(key=>[key,editor[key]]));
    const result=validateCv(kind,values);
    if(Object.keys(result.fields).length){setError(Object.values(result.fields).join(' '));return;}
    void act(async()=>{await api(path(editor),{method:editor._id?'PATCH':'POST',body:JSON.stringify(result.value)});setEditor(null);},'Élément enregistré. Le portfolio public sera actualisé à son ouverture ou retour au premier plan.');
  }
  return <section aria-label={sectionNames[kind]}>
    <div className="admin-heading"><h1>{sectionNames[kind]}</h1>{!messages&&<button disabled={busy} onClick={add}>Ajouter</button>}</div>
    <p role="status">{busy?'Chargement…':notice}</p><p role="alert">{error}</p>
    {editor?<form className="admin-panel" onSubmit={save}><h2>{editor._id?'Modifier':'Ajouter'}</h2><fieldset disabled={busy}>
      {Object.entries(cvFields[kind]).map(([key,label])=><label key={key}>{label}{key==='category'?<select value={editor[key]} onChange={e=>setEditor({...editor,[key]:e.target.value})}><option value="dev">Dev</option><option value="industry">Industrie</option></select>:['description','detail','items'].includes(key)?<textarea required rows={key==='items'?7:4} value={key==='items'?editor.items.join('\n'):editor[key]} onChange={e=>setEditor({...editor,[key]:key==='items'?e.target.value.split('\n'):e.target.value})}/>:<input required maxLength={250} value={editor[key]} onChange={e=>setEditor({...editor,[key]:e.target.value})}/>}</label>)}
      <div className="admin-actions"><button type="submit">Enregistrer</button><button type="button" onClick={()=>{setEditor(null);setError('');}}>Annuler</button></div>
    </fieldset></form>:<div className="admin-panel">
      {!busy&&!entries.length&&<p>Aucun élément.</p>}
      {entries.map(entry=><article className="admin-content-entry" key={entry._id}>
        <h2>{messages?entry.subject:entry.title||entry.label}</h2>
        {messages?<><p>{entry.name} · <a href={`mailto:${entry.email}`}>{entry.email}</a> · {new Date(entry.createdAt).toLocaleString('fr-FR')} · {entry.read?'Lu':'Non lu'}</p><p className="message-body">{entry.message}</p></>:kind==='skills'?<><p>{entry.category==='dev'?'Dev':'Industrie'}</p><p>{entry.items.join(' · ')}</p></>:<><p>{entry.date} · {entry.organization}</p><p className="message-body">{entry.description||entry.detail}</p></>}
        <div className="admin-actions">{messages?<button disabled={busy} onClick={()=>act(()=>api(path(entry),{method:'PATCH',body:JSON.stringify({read:!entry.read})}),'État du message enregistré.')}>Marquer {entry.read?'non lu':'lu'}</button>:<button disabled={busy} onClick={()=>{setEditor({...entry});setError('');}}>Modifier {entry.title||entry.label}</button>}<button className="danger" disabled={busy} onClick={()=>{setRemoving(entry);dialog.current.showModal();}}>Supprimer {messages?'le message':entry.title||entry.label}</button></div>
      </article>)}
      {messages&&<nav className="admin-actions" aria-label="Pages des messages"><button disabled={busy||page===1} onClick={()=>setPage(page-1)}>Précédent</button><span>{page} / {Math.max(1,Math.ceil(total/25))} · {total} message(s)</span><button disabled={busy||page*25>=total} onClick={()=>setPage(page+1)}>Suivant</button></nav>}
    </div>}
    <dialog ref={dialog} className="admin-panel delete-dialog" aria-labelledby="content-delete-title"><h2 id="content-delete-title">Confirmer la suppression ?</h2><p>{removing?.title||removing?.label||removing?.subject}</p><p>Cette suppression est définitive.</p><div className="admin-actions"><button disabled={busy} onClick={()=>dialog.current.close()}>Annuler</button><button className="danger" disabled={busy} onClick={()=>act(async()=>{await api(path(removing),{method:'DELETE'});dialog.current.close();setRemoving(null);},'Élément supprimé.')}>Confirmer la suppression</button></div><p role="alert">{error}</p></dialog>
  </section>;
}
