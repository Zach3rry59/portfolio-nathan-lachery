import { useEffect, useRef, useState } from 'react';
import { sendContact } from '../services/api.js';
import { contactLimits, validateContact } from '../../../shared/contact.js';
const labels = { name: 'Nom', email: 'Email', subject: 'Sujet', message: 'Message' };
export default function ContactForm() {
  const dialog = useRef(null);
  const opener = useRef(null);
  const [fields, setFields] = useState({});
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  useEffect(() => { const element = dialog.current; const close = () => opener.current?.focus(); element.addEventListener('close', close); return () => element.removeEventListener('close', close); }, []);
  async function submit(event) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const validation = validateContact(data);
    setFields(validation.fields); setStatus('');
    if (Object.keys(validation.fields).length) return;
    setSending(true);
    try { const response = await sendContact(validation.value); setStatus(response.message); form.reset(); }
    catch (error) { setFields(error.fields || {}); setStatus(error.name === 'AbortError' ? 'Le service ne répond pas. Réessayez ou utilisez l’email.' : error.message); }
    finally { setSending(false); }
  }
  return <><button className="contact-form-trigger" ref={opener} onClick={() => dialog.current.showModal()}>Écrire un message ↗</button><dialog ref={dialog} className="contact-dialog" aria-labelledby="form-title"><div className="dialog-heading"><h2 id="form-title">Parlons-en.</h2><button onClick={() => dialog.current.close()} aria-label="Fermer le formulaire">×</button></div><p>Vous pouvez aussi écrire à <a href="mailto:lachery.nathan59@gmail.com">lachery.nathan59@gmail.com</a>.</p><form onSubmit={submit}>{Object.entries(contactLimits).map(([key,[min,max]]) => <label key={key} htmlFor={`contact-${key}`}>{labels[key]}{key === 'message' ? <textarea id={`contact-${key}`} name={key} required minLength={min} maxLength={max} rows={4} aria-invalid={Boolean(fields[key])} aria-describedby={fields[key] ? `error-${key}` : undefined}/> : <input id={`contact-${key}`} name={key} required type={key === 'email' ? 'email' : 'text'} autoComplete={key === 'email' ? 'email' : key === 'name' ? 'name' : 'off'} minLength={min} maxLength={max} aria-invalid={Boolean(fields[key])} aria-describedby={fields[key] ? `error-${key}` : undefined}/>}<span className="field-error" id={`error-${key}`}>{fields[key]}</span></label>)}<p className="form-status" role="status">{status || fields.form}</p><button className="button" type="submit" disabled={sending}>{sending ? 'Enregistrement…' : 'Envoyer le message ↗'}</button><p className="form-privacy">Ces informations servent uniquement à répondre à votre message. <a href="/privacy">Confidentialité</a></p></form></dialog></>;
}
