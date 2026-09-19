import test from 'node:test';
import assert from 'node:assert/strict';
import { readProjects, saveProjects, validProjects, cacheKey } from '../src/services/project-cache.js';
import { referenceProjects } from '../../shared/projects.js';
test('Public fallback is immediate and contains no invented industry project', () => {
  assert.deepEqual(readProjects(null),referenceProjects);
  assert.equal(referenceProjects.some(p=>p.category==='industry'),false);
});
test('An authoritative empty catalog remains empty offline until cache expiration', () => {
  const values = new Map(), storage = { getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value) };
  saveProjects(storage,[]); assert.deepEqual(readProjects(storage),[]);
  storage.setItem(cacheKey,JSON.stringify({savedAt:0,data:[]})); assert.deepEqual(readProjects(storage),referenceProjects);
});
test('Malformed or dangerous cached projects are discarded', () => {
  assert.equal(validProjects([{...referenceProjects[0],category:'unknown'}]),false);
  assert.equal(validProjects([{...referenceProjects[0],githubUrl:'javascript:alert(1)'}]),false);
  assert.equal(validProjects([{...referenceProjects[0],title:{$ne:null}}]),false);
  assert.equal(validProjects(referenceProjects),true);
});
