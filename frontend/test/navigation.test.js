import test from 'node:test';
import assert from 'node:assert/strict';
import { wheelProgress, remapProgress, scenePose } from '../src/hooks/navigation.js';
const dev = ['home','profile','skills','experience','training','portfolio','contact'];
const industry = dev.filter(id => id !== 'portfolio');
test('Negative wheel delta advances continuously; positive delta goes back and endpoints clamp', () => {
  const first = wheelProgress(0,-100,7);
  assert.ok(first > 0 && first < 1);
  assert.ok(Math.abs(wheelProgress(first,100,7)) < .00001);
  assert.equal(wheelProgress(0,500,7),0); assert.equal(wheelProgress(6,-500,7),6);
});
test('Profile changes preserve equivalent scene and fractional phase', () => {
  assert.equal(remapProgress(2.2,dev,industry),2.2);
  assert.equal(remapProgress(6,dev,industry),5);
  assert.equal(remapProgress(5,dev,industry),5);
  assert.equal(remapProgress(5,industry,dev),6);
});
test('Full FX supports depth without vertical translation; reduced FX retains every scene', () => {
  assert.match(scenePose(.3,true).transform, /translate3d\([^,]+,0,/);
  assert.ok(scenePose(.3,true).opacity > 0);
  assert.equal(scenePose(0,false).opacity,1);
  assert.equal(scenePose(1,false).opacity,0);
  assert.equal(scenePose(.5,false).opacity,1);
  assert.equal(scenePose(-.5,false).opacity,0);
  for (let i=0; i<7; i++) assert.equal(scenePose(i-i,false).opacity,1);
});
