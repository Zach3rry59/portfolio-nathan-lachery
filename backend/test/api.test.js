import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
import { referenceProjects } from '../../shared/projects.js';
const contact = { name: 'Test local', email: 'test@example.com', subject: 'Vérification locale', message: 'Message de test local pour vérifier la validation.' };
async function server(t, repository) {
  const listener = createApp({ repository }).listen(0, '127.0.0.1');
  await new Promise(resolve => listener.once('listening', resolve));
  t.after(() => new Promise(resolve => { listener.closeAllConnections(); listener.close(resolve); }));
  return `http://127.0.0.1:${listener.address().port}/api`;
}
const offline = { status: () => ({ connected: false, state: 'not_configured' }) };
test('API starts without MongoDB; reads reference data and reports degraded health', async t => {
  const url = await server(t, offline);
  const health = await (await fetch(`${url}/health`)).json();
  assert.equal(health.status, 'degraded'); assert.equal(health.contactAvailable, false);
  const list = await (await fetch(`${url}/projects/`)).json();
  assert.equal(list.meta.source, 'reference'); assert.equal(list.data[0].title, 'Gestion de clés');
  const detail = await (await fetch(`${url}/projects/${referenceProjects[0]._id}`)).json();
  assert.equal(detail.data.slug, referenceProjects[0].slug);
  assert.equal((await fetch(`${url}/projects/invalid`)).status, 400);
  assert.equal((await fetch(`${url}/projects/000000000000000000000000`)).status, 404);
});
test('Missing database never acknowledges an unrecorded contact', async t => {
  const url = await server(t, offline);
  const response = await fetch(`${url}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contact) });
  assert.equal(response.status, 503); assert.equal((await response.json()).error.code, 'CONTACT_UNAVAILABLE');
});
test('Contact is allowlisted, validated, persisted before acknowledgement; persistence failure is not success', async t => {
  const saved = [];
  const url = await server(t, { status: () => ({ connected: true, state: 'connected' }), contact: async data => { saved.push(data); } });
  const post = data => fetch(`${url}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  assert.equal((await post({ ...contact, read: true })).status, 400);
  assert.equal((await post({ ...contact, email: 'invalid', message: 'x' })).status, 400);
  assert.equal((await post({ ...contact, name: { $ne: null } })).status, 400);
  assert.equal((await post(contact)).status, 201); assert.deepEqual(saved, [contact]);
  const failing = await server(t, { status: () => ({ connected: true }), contact: async () => { throw new Error('internal-secret-do-not-expose'); } });
  const failure = await fetch(`${failing}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contact) });
  assert.equal(failure.status, 500); assert.equal((await failure.text()).includes('internal-secret'), false);
});
test('MongoDB repository results including empty list are preserved', async t => {
  const url = await server(t, { status: () => ({ connected: true }), projects: async () => [], project: async () => null });
  assert.deepEqual((await (await fetch(`${url}/projects`)).json()).data, []);
  assert.equal((await fetch(`${url}/projects/${referenceProjects[0]._id}`)).status, 404);
});
test('CORS, JSON limit, malformed bodies and future writes are protected', async t => {
  const url = await server(t, offline);
  assert.equal((await fetch(`${url}/projects`, { headers: { Origin: 'https://untrusted.example' } })).status, 403);
  const allowed = await fetch(`${url}/projects`, { headers: { Origin: 'http://127.0.0.1:5173' } });
  assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://127.0.0.1:5173');
  assert.equal(allowed.headers.get('x-content-type-options'), 'nosniff');
  assert.equal((await fetch(`${url}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })).status, 400);
  assert.equal((await fetch(`${url}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'x'.repeat(13000) }) })).status, 413);
  for (const method of ['POST','PATCH','DELETE']) assert.equal((await fetch(`${url}/projects${method === 'POST' ? '' : '/000000000000000000000059'}`, { method })).status, 401);
});
test('Contact requests are rate limited', async t => {
  const url = await server(t, offline);
  let response;
  for (let i=0; i<6; i++) response = await fetch(`${url}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(response.status, 429);
});
