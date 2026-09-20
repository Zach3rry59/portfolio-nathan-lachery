import { useEffect, useState } from 'react';
import { request } from '../services/api.js';
import { referenceCv } from '../../../shared/cv.js';
import { validCvCatalog } from '../../../shared/cv-validation.js';
import { newestFirst } from '../data/chronology.js';
const key='publicCv.v1';
function stored(){try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&Date.now()-saved.time<7*86400000&&validCvCatalog(saved.data))return saved.data;}catch{/* Stockage facultatif. */}return referenceCv;}
export function useCv(profile,category){
  const [data,setData]=useState(stored);
  useEffect(()=>{
    let controller;
    const refresh=()=>{
      controller?.abort();controller=new AbortController();
      const active=controller;
      request('/cv',{signal:active.signal}).then(result=>{
        if(active.signal.aborted||result.meta?.source==='reference'||!validCvCatalog(result.data))return;
        setData(result.data);
        if(result.meta?.source==='mongodb')try{localStorage.setItem(key,JSON.stringify({time:Date.now(),data:result.data}));}catch{/* Stockage facultatif. */}
      }).catch(()=>{});
    };
    refresh();addEventListener('focus',refresh);
    return()=>{controller?.abort();removeEventListener('focus',refresh);};
  },[]);
  return {...profile,experiences:newestFirst(data.experiences),training:newestFirst(data.training),skills:data.skills.filter(group=>group.category===category).sort((a,b)=>a.label.localeCompare(b.label,'fr'))};
}
