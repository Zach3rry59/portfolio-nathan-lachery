import test from 'node:test';
import assert from 'node:assert/strict';
import { readProjects, saveProjects, validProjects, cacheKey, referenceFor, sortProjects } from '../src/services/project-cache.js';
import { referenceProjects } from '../../shared/projects.js';
const memory = () => { const values = new Map(); return { getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value) }; };
test('Unknown category has no loading flash; fallback contains two real Dev projects only', () => {
  assert.equal(readProjects(null,'dev'),null);
  assert.equal(referenceFor('dev').length,2); assert.deepEqual(referenceFor('industry'),[]);
  assert.equal(referenceProjects.some(project=>JSON.stringify(project).includes('onerror')),false);
  assert.equal(referenceProjects.find(p=>p.githubUrl.endsWith('/projet_stage')).category,'dev');
});
test('Empty category cache and category boundaries are preserved; obsolete cache is ignored', () => {
  const storage=memory(); saveProjects(storage,[],'industry');
  assert.deepEqual(readProjects(storage,'industry'),[]); assert.equal(readProjects(storage,'dev'),null);
  storage.setItem('publicProjects.v1',JSON.stringify({savedAt:Date.now(),data:[{...referenceProjects[0],title:'<img src=x onerror=alert(1)>'}]}));
  assert.equal(readProjects(storage,'dev'),null);
  saveProjects(storage,referenceProjects,'industry'); assert.deepEqual(readProjects(storage,'industry'),[]);
  storage.setItem(`${cacheKey}.industry`,JSON.stringify({savedAt:0,data:[]})); assert.equal(readProjects(storage,'industry'),null);
});
test('Project order is numeric and invalid cache data is rejected', () => {
  assert.equal(sortProjects([...referenceProjects].reverse())[0].order,0);
  assert.equal(validProjects([{...referenceProjects[0],category:'unknown'}]),false);
  assert.equal(validProjects([{...referenceProjects[0],githubUrl:'javascript:alert(1)'}]),false);
  assert.equal(validProjects(referenceProjects),true);
});
