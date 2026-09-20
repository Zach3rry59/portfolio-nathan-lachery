import test from 'node:test';
import assert from 'node:assert/strict';
import { server } from './helpers.mjs';
import { contentMemory } from './content-memory.mjs';
import { hashPassword } from '../src/services/password.js';
import { referenceCv } from '../../shared/cv.js';
const settings={adminEmail:'admin@example.test',adminPasswordHash:await hashPassword('Isolated-test-password-2026')};
async function authorized(t){const api=await server(t,contentMemory(),settings);const {token}=await (await api('/auth/login','POST',{email:settings.adminEmail,password:'Isolated-test-password-2026'})).json();return {api,token};}
test('CV CRUD preserves fields, edits public content, keeps empty lists and separates skill categories',async t=>{
 const {api,token}=await authorized(t);
 assert.deepEqual((await (await api('/cv')).json()).data,referenceCv);
 for(const kind of ['experiences','training','skills']){
  const {_id,...data}=referenceCv[kind][0];
  const created=await api(`/admin/cv/${kind}`,'POST',data,token);assert.equal(created.status,201);const id=(await created.json()).data._id;
  const edited={...data,...(kind==='skills'?{category:'industry',items:['Compétence isolée']}:{title:'Modification isolée'})};
  assert.equal((await api(`/admin/cv/${kind}/${id}`,'PATCH',edited,token)).status,200);
  const visible=(await (await api('/cv')).json()).data[kind].find(v=>v._id===id);
  assert.equal(kind==='skills'?visible.category:visible.title,kind==='skills'?'industry':'Modification isolée');
  assert.equal((await api(`/admin/cv/${kind}/${id}`,'DELETE',undefined,token)).status,204);
  assert.equal((await api(`/admin/cv/${kind}/${id}`,'DELETE',undefined,token)).status,404);
 }
 const skills=(await (await api('/cv')).json()).data.skills;
 for(const entry of skills)await api(`/admin/cv/skills/${entry._id}`,'DELETE',undefined,token);
 assert.deepEqual((await (await api('/cv')).json()).data.skills,[]);
});
test('CV and messages admin reject unauthorized reads/writes and invalid payloads',async t=>{
 const {api,token}=await authorized(t);
 for(const path of ['/admin/cv','/admin/messages'])assert.equal((await api(path)).status,401);
 for(const kind of ['experiences','training','skills'])for(const method of ['POST','PATCH','DELETE'])assert.equal((await api(`/admin/cv/${kind}${method==='POST'?'':'/100000000000000000000001'}`,method,{})).status,401);
 for(const method of ['PATCH','DELETE'])assert.equal((await api('/admin/messages/400000000000000000000001',method,{read:true})).status,401);
 for(const data of [{title:{$ne:null}},{...referenceCv.experiences[0]},{$set:{title:'Injected'}}])assert.equal((await api('/admin/cv/experiences','POST',data,token)).status,400);
 assert.equal((await api('/admin/cv/unknown','POST',{},token)).status,404);
 assert.equal((await api('/admin/cv/training/not-an-id','DELETE',undefined,token)).status,400);
 assert.equal((await api('/admin/cv/skills','POST',{label:'Test',items:['Test'],category:'other'},token)).status,400);
 for(const query of ['page=-1','page=1.5','page[$ne]=1'])assert.equal((await api(`/admin/messages?${query}`,'GET',undefined,token)).status,400);
});
test('Contact messages remain private, complete, markable and deletable',async t=>{
 const {api,token}=await authorized(t);
 const result=await (await api('/admin/messages','GET',undefined,token)).json();assert.equal(result.total,1);
 const message=result.data[0];for(const key of ['name','email','subject','message','createdAt'])assert.ok(message[key]);
 assert.equal(JSON.stringify((await (await api('/cv')).json())).includes(message.email),false);
 assert.equal((await api(`/admin/messages/${message._id}`,'PATCH',{read:{$ne:false}},token)).status,400);
 assert.equal((await api(`/admin/messages/${message._id}`,'PATCH',{read:true,email:'other@example.test'},token)).status,400);
 for(const read of [true,false])assert.equal((await (await api(`/admin/messages/${message._id}`,'PATCH',{read},token)).json()).data.read,read);
 assert.equal((await api(`/admin/messages/${message._id}`,'DELETE',undefined,token)).status,204);
 assert.equal((await (await api('/admin/messages','GET',undefined,token)).json()).total,0);
});
