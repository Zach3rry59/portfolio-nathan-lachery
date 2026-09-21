import test from 'node:test';
import assert from 'node:assert/strict';
import { memoryRepository, server } from './helpers.mjs';
import { hashPassword } from '../src/services/password.js';
import { validateProject } from '../../shared/project-validation.js';
import { referenceProjects, baseProjects } from '../../shared/projects.js';
import { migrateProjectDetails } from '../src/services/migrate-project-details.js';
import { Project } from '../src/models/Project.js';

test('Project details: optional legacy fields, strict screenshots and safe URLs', async () => {
  for (const project of [...baseProjects,...referenceProjects]) {
    const { _id, ...input } = project;
    assert.deepEqual(validateProject(input).fields, {});
    await new Project(project).validate();
  }
  for (const screenshots of [null, {}, [{url:'javascript:alert(1)',alt:'Image'}], [{url:'https://example.test/image.png',alt:''}], [{url:'https://example.test/a',alt:'Image',extra:true}], Array(9).fill({url:'https://example.test/a',alt:'Image'})]) {
    assert.ok(validateProject({ screenshots },true).fields.screenshots);
  }
  assert.ok(validateProject({ role:{$ne:null} },true).fields.role);
});

test('Project detail CRUD persists, reorders and removes screenshots through existing protected API',async t=>{
  const password='Project-detail-test-only';
  const api=await server(t,memoryRepository(),{adminEmail:'admin@example.test',adminPasswordHash:await hashPassword(password)});
  const {_id,...data}=referenceProjects[0];
  const {token}=await(await api('/auth/login','POST',{email:'admin@example.test',password})).json();
  const created=await api('/projects','POST',data,token);assert.equal(created.status,201);
  const id=(await created.json()).data._id;
  const screenshots=[{url:'https://example.test/one.png',alt:'Première capture isolée'},{url:'https://example.test/two.png',alt:'Seconde capture isolée'}];
  assert.equal((await api(`/projects/${id}`,'PATCH',{screenshots})).status,401);
  for(const shots of [screenshots,[...screenshots].reverse(),[]]){
    const response=await api(`/projects/${id}`,'PATCH',{screenshots:shots,role:'Rôle isolé'},token);assert.equal(response.status,200);
    const actual=(await(await api(`/projects/${id}`)).json()).data;
    assert.deepEqual(actual.screenshots,shots);assert.equal(actual.role,'Rôle isolé');
  }
  assert.equal((await api(`/projects/${id}`,'PATCH',{screenshots:[{url:'data:text/html,test',alt:'Unsafe'}]},token)).status,400);
});

test('Detail migration preserves edits, never creates projects and does not restore removed content',async()=>{
  const rows=structuredClone(baseProjects);
  rows[1].description='Description éditée dans l’admin';
  const markers=new Set();
  const Model={updateOne:async(filter,update)=>{
    const row=rows.find(p=>p.slug===filter.slug);if(!row)return;
    const matches=filter.$or.some(condition=>Object.entries(condition).every(([key,expected])=>expected?.$exists===false?!(key in row):JSON.stringify(row[key])===JSON.stringify(expected)));
    if(matches)Object.assign(row,update.$set);
  }};
  const Marker={exists:async({_id})=>markers.has(_id),updateOne:async({_id})=>markers.add(_id)};
  await migrateProjectDetails(Model,Marker);
  assert.equal(rows.length,2);assert.equal(rows[0].description,referenceProjects[0].description);
  assert.equal(rows[1].description,'Description éditée dans l’admin');
  rows[0].role='';rows.splice(1,1);
  await migrateProjectDetails(Model,Marker);
  assert.equal(rows[0].role,'');assert.equal(rows.length,1);
});
