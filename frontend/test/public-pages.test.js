import test from 'node:test';
import assert from 'node:assert/strict';
import { profileFromPath, profilePath, initialScene, publicPages } from '../../shared/public-pages.js';
test('Direct candidature routes select the right profile, including trailing slash',()=>{
  for(const path of ['/maintenance','/maintenance/']) { assert.equal(profileFromPath(path),'industrie');assert.equal(initialScene(path),'profile'); }
  assert.equal(profileFromPath('/dev'),'dev');assert.equal(initialScene('/dev'),'profile');assert.equal(initialScene('/'),'home');
  assert.equal(profilePath('industrie'),'/maintenance');assert.equal(profilePath('dev'),'/dev');
  assert.match(publicPages['/maintenance'].description,/stage/);assert.match(publicPages['/dev'].description,/junior/);
});
