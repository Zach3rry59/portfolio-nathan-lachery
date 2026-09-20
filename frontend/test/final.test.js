import test from 'node:test';
import assert from 'node:assert/strict';
import { profiles } from '../src/data/profiles.js';
import { newestFirst } from '../src/data/chronology.js';
import { wrapProject, swipeDirection } from '../src/components/carousel.js';
import { remapProgress } from '../src/hooks/navigation.js';
test('Both profiles share reverse chronology, including ongoing training first', () => {
  assert.deepEqual(profiles.dev.training, profiles.industrie.training);
  assert.deepEqual(profiles.dev.experiences, profiles.industrie.experiences);
  assert.deepEqual(profiles.dev.training.map(p=>p.date),['En cours','2024','2022','2016','2015']);
  assert.deepEqual(newestFirst(profiles.dev.experiences),profiles.dev.experiences);
});
test('Carousel loops both ways with exactly the true project count', () => {
  for (const count of [2,3,7]) { assert.equal(wrapProject(count,count),0); assert.equal(wrapProject(-1,count),count-1); }
  assert.equal(wrapProject(5,1),0);
  assert.equal(swipeDirection(-120,12,800),1); assert.equal(swipeDirection(110,10,390),-1);
  assert.equal(swipeDirection(10,150,390),0);
});
test('Removing Portfolio remaps its active position to Contact', () => {
  assert.equal(remapProgress(2,['home','training','portfolio','contact'],['home','training','contact']),2);
});
