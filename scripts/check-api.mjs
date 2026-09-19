import assert from 'node:assert/strict';
const base = process.argv[2] || 'http://127.0.0.1:3001';
const response = await fetch(`${base}/api/health`);
assert.equal(response.status,200);
assert.equal((await response.json()).database.connected,true);
for (const category of ['dev','industry']) {
  const projects = await fetch(`${base}/api/projects?category=${category}`);
  assert.equal(projects.status,200);
  assert.equal((await projects.json()).meta.source,'mongodb');
}
console.log('API et connexion MongoDB vérifiées.');
