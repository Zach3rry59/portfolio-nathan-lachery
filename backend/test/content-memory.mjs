import { memoryRepository } from './helpers.mjs';
import { referenceCv } from '../../shared/cv.js';
import { referenceProjects } from '../../shared/projects.js';
export function contentMemory(){
  const cv=structuredClone(referenceCv),messages=[{_id:'400000000000000000000001',name:'Contact isolé',email:'test@example.test',subject:'Message de test',message:'Message complet uniquement en mémoire locale.',read:false,createdAt:'2026-09-20T10:00:00.000Z'}];
  let next=100;
  const repository=memoryRepository();
  return Object.assign(repository,{
    cv:async()=>structuredClone(cv),
    createCv:async(kind,data)=>{const value={...data,_id:String(next++).padStart(24,'0')};cv[kind].push(value);return value;},
    updateCv:async(kind,id,data)=>{const index=cv[kind].findIndex(v=>v._id===id);if(index===-1)return null;return cv[kind][index]={...cv[kind][index],...data};},
    deleteCv:async(kind,id)=>{const index=cv[kind].findIndex(v=>v._id===id);return index===-1?null:cv[kind].splice(index,1)[0];},
    messages:async page=>({data:messages.slice((page-1)*25,page*25),page,total:messages.length}),
    updateMessage:async(id,read)=>{const value=messages.find(m=>m._id===id);if(value)value.read=read;return value;},
    deleteMessage:async id=>{const index=messages.findIndex(v=>v._id===id);return index===-1?null:messages.splice(index,1)[0];},
    projects:async category=>structuredClone(referenceProjects.filter(p=>!category||p.category===category)),
  });
}
