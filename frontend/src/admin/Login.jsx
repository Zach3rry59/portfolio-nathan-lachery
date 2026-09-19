import { useState } from 'react';
import { request } from '../services/api.js';
export default function Login({ onLogin }) {
  const [pending, setPending] = useState(false), [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault(); setPending(true); setError('');
    const form = event.currentTarget;
    try {
      const result = await request('/auth/login', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      form.reset(); onLogin(result);
    } catch (failure) { setError(failure.message); } finally { setPending(false); }
  }
  return <section className="admin-panel login-panel"><h1>Administration</h1><p>Gestion des projets du portfolio.</p>
    <form onSubmit={submit}><fieldset disabled={pending}>
      <label>Email<input name="email" type="email" required autoComplete="username" maxLength={254}/></label>
      <label>Mot de passe<input name="password" type="password" required autoComplete="current-password" maxLength={200}/></label>
      <p role="alert">{error}</p><button className="button" type="submit">{pending ? 'Connexion…' : 'Se connecter'}</button>
    </fieldset></form><p className="admin-note">La session expire après une heure. Recharger cette page demande une nouvelle connexion.</p>
  </section>;
}
