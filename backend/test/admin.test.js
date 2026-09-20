import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, digest } from '../src/services/password.js';
import { server, memoryRepository } from './helpers.mjs';
const password = 'Only-for-automated-tests-2026';
const settings = { adminEmail: 'admin@example.test', adminPasswordHash: await hashPassword(password) };
const project = { title: 'Fixture technique', slug: 'fixture-test', shortDescription: 'Données de test isolées, non publiées.', category: 'industry', technologies: ['Test'], order: 0, featured: false };
async function login(api) { const response = await api('/auth/login','POST',{ email: settings.adminEmail,password }); assert.equal(response.status,200); return (await response.json()).token; }
test('Admin login, CRUD, category filters and logout use a revocable session', async t => {
  const repository = memoryRepository(), api = await server(t,repository,settings), token = await login(api);
  assert.equal((await api('/auth/me','GET',undefined,token)).status,200);
  const created = await api('/projects','POST',project,token); assert.equal(created.status,201);
  const data = (await created.json()).data;
  assert.equal((await (await api('/projects?category=industry')).json()).data.length,1);
  assert.equal((await (await api('/projects?category=dev')).json()).data.length,0);
  assert.equal((await api('/projects','POST',project,token)).status,409);
  const changed = await api(`/projects/${data._id}`,'PATCH',{ category:'dev', featured:true, order:7 },token);
  const updated = (await changed.json()).data;
  assert.equal(updated.category,'dev'); assert.equal(updated.order,7); assert.equal(updated.featured,true);
  assert.equal((await (await api('/projects?category=industry')).json()).data.length,0);
  assert.equal((await api(`/projects/${data._id}`,'DELETE',undefined,token)).status,204);
  assert.equal((await api(`/projects/${data._id}`)).status,404);
  assert.equal((await api('/auth/logout','POST',undefined,token)).status,204);
  assert.equal((await api('/projects','POST',project,token)).status,401);
});
test('Unauthenticated writes, invalid tokens, expired sessions and password rotation are rejected', async t => {
  const repository = memoryRepository(), mutable = { ...settings }, api = await server(t,repository,mutable);
  for (const method of ['POST','PATCH','DELETE']) assert.equal((await api(`/projects${method==='POST'?'':'/000000000000000000000001'}`,method,project)).status,401);
  assert.equal((await api('/auth/me','GET',undefined,'0'.repeat(64))).status,401);
  const token = await login(api), session = await repository.session(digest(token));
  session.expiresAt = new Date(0); assert.equal((await api('/auth/me','GET',undefined,token)).status,401);
  const rotated = await login(api); mutable.adminPasswordHash = await hashPassword('Another-test-password-2026');
  assert.equal((await api('/auth/me','GET',undefined,rotated)).status,401);
});
test('Wrong credentials, NoSQL login injection and repeated login attempts fail', async t => {
  const api = await server(t,memoryRepository(),settings);
  assert.equal((await api('/auth/login','POST',{email:{$ne:null},password})).status,400);
  assert.equal((await api('/auth/login','POST',{email:settings.adminEmail,password:'wrong'})).status,401);
  assert.equal((await api('/auth/login','POST',{email:'wrong@example.test',password})).status,401);
  let response;
  for (let i=0;i<8;i++) response = await api('/auth/login','POST',{});
  assert.equal(response.status,429);
});
test('Project validation rejects operators, unexpected fields, categories, URLs and invalid ids', async t => {
  const api = await server(t,memoryRepository(),settings), token = await login(api);
  for (const payload of [{...project,title:{$gt:''}},{...project,category:'sql'},{...project,githubUrl:'javascript:alert(1)'},{...project,githubUrl:'https://user:pass@example.com'},{...project,$set:{featured:true}},{...project,order:1.2},{...project,technologies:[{}]}]) assert.equal((await api('/projects','POST',payload,token)).status,400);
  assert.equal((await api('/projects/invalid','PATCH',{title:'Valid title'},token)).status,400);
  assert.equal((await api('/projects?category[$ne]=dev')).status,400);
  assert.equal((await api('/projects?category=unknown')).status,400);
  assert.equal((await api('/projects?category=dev&category=industry')).status,400);
});
