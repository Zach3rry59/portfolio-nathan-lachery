import { useState } from 'react';
import { validateProject } from '../../../shared/project-validation.js';
const empty = { title: '', slug: '', shortDescription: '', description: '', category: 'dev', technologies: [], githubUrl: '', demoUrl: '', imageUrl: '', featured: false, order: 0, year: '', context: '', features: [], role: '', problem: '', challenges: '', solutions: '', screenshots: [] };
export default function ProjectEditor({ project, onSave, onCancel, pending, error }) {
  const [value, setValue] = useState(() => ({ ...empty, ...Object.fromEntries(Object.keys(empty).filter(key => project && key in project).map(key => [key,project[key]])) }));
  const [fields, setFields] = useState({});
  const set = (key, next) => setValue(previous => ({ ...previous, [key]: next }));
  function submit(event) {
    event.preventDefault(); const result = validateProject({ ...value, technologies: value.technologies.filter(Boolean) }); setFields(result.fields);
    if (!Object.keys(result.fields).length) onSave(result.value);
  }
  function input(key, label, max, multiline = false) {
    const props = { id: `project-${key}`, value: value[key], maxLength: max, required: ['title','slug','shortDescription'].includes(key), onChange: e => set(key,e.target.value), 'aria-invalid': Boolean(fields[key]), 'aria-describedby': fields[key] ? `error-${key}` : undefined };
    return <label htmlFor={props.id}>{label}{multiline ? <textarea {...props} rows={key === 'description' ? 5 : 3}/> : <input {...props}/>}<span className="field-error" id={`error-${key}`}>{fields[key]}</span></label>;
  }
  return <section className="admin-panel"><h2>{project ? 'Modifier le projet' : 'Nouveau projet'}</h2><p>Publier uniquement des réalisations réelles et confirmées.</p>
    <form onSubmit={submit}><fieldset disabled={pending}>
      <div className="admin-grid">{input('title','Titre',160)}{input('slug','Identifiant URL (slug)',180)}
        <label>Catégorie<select value={value.category} onChange={e => set('category',e.target.value)}><option value="dev">Développement</option><option value="industry">Industrie</option></select></label>
        <label>Ordre d’affichage<input type="number" min="0" max="10000" step="1" value={value.order} onChange={e => set('order',Number(e.target.value))}/></label>
      </div>
      {input('shortDescription','Résumé',500,true)}{input('description','Description détaillée',5000,true)}
      {input('problem','Besoin initial (facultatif)',1500,true)}{input('role','Rôle personnel (facultatif)',1000,true)}
      {input('challenges','Difficultés techniques (facultatif)',2000,true)}{input('solutions','Solutions apportées (facultatif)',2000,true)}
      <label>Technologies, séparées par des virgules<input value={value.technologies.join(', ')} onChange={e => set('technologies',e.target.value.split(',').map(item => item.trim()))}/><span className="field-error">{fields.technologies}</span></label>
      <div className="admin-grid">{input('year','Date ou année',30)}{input('context','Contexte',200)}{input('githubUrl','Lien GitHub',2048)}{input('demoUrl','Lien de démonstration',2048)}{input('imageUrl','URL de l’image',2048)}<label className="check-label"><input type="checkbox" checked={value.featured} onChange={e => set('featured',e.target.checked)}/>Mettre en avant</label></div>
      <h3>Détails de la réalisation</h3>{value.features.map((feature, index) => <div className="feature-editor" key={index}>
        <label>Titre du détail {index+1}<input value={feature.title} maxLength={100} onChange={e => set('features',value.features.map((item,i) => i === index ? { ...item, title: e.target.value } : item))}/></label>
        <label>Description du détail {index+1}<textarea value={feature.description} maxLength={1000} onChange={e => set('features',value.features.map((item,i) => i === index ? { ...item, description: e.target.value } : item))}/></label>
        <button type="button" onClick={() => set('features',value.features.filter((_,i) => i !== index))}>Retirer ce détail</button>
      </div>)}
      <button type="button" disabled={value.features.length >= 12} onClick={() => set('features',[...value.features,{ title: '', description: '' }])}>Ajouter un détail</button>
      <h3>Captures d’écran</h3><p>Utiliser des captures réelles hébergées sur une URL publique HTTP(S). Leur ordre ici sera celui de la galerie.</p>
      {value.screenshots.map((shot,index)=><div className="feature-editor" key={index}>
        <label>URL de la capture {index+1}<input type="url" required maxLength={2048} value={shot.url} onChange={e=>set('screenshots',value.screenshots.map((item,i)=>i===index?{...item,url:e.target.value}:item))}/></label>
        <label>Description de la capture {index+1}<input required maxLength={200} value={shot.alt} onChange={e=>set('screenshots',value.screenshots.map((item,i)=>i===index?{...item,alt:e.target.value}:item))}/></label>
        <div className="admin-actions"><button type="button" disabled={index===0} aria-label={`Monter la capture ${index+1}`} onClick={()=>{const shots=[...value.screenshots];[shots[index-1],shots[index]]=[shots[index],shots[index-1]];set('screenshots',shots);}}>↑ Monter</button><button type="button" disabled={index===value.screenshots.length-1} aria-label={`Descendre la capture ${index+1}`} onClick={()=>{const shots=[...value.screenshots];[shots[index+1],shots[index]]=[shots[index],shots[index+1]];set('screenshots',shots);}}>↓ Descendre</button><button type="button" onClick={()=>set('screenshots',value.screenshots.filter((_,i)=>i!==index))}>Retirer la capture {index+1}</button></div>
      </div>)}
      <button type="button" disabled={value.screenshots.length>=8} onClick={()=>set('screenshots',[...value.screenshots,{url:'',alt:''}])}>Ajouter une capture</button><p className="field-error" role="alert">{fields.screenshots}</p>
      <p role="alert">{error || fields.form || fields.features || fields.category || fields.order}</p>
      <div className="admin-actions"><button className="button" type="submit">{pending ? 'Enregistrement…' : 'Enregistrer le projet'}</button><button type="button" onClick={onCancel}>Annuler</button></div>
    </fieldset></form>
  </section>;
}
