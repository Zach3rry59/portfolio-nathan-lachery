export const cvKinds = ['experiences','training','skills'];
export const cvFields = {
  experiences: { date:'Date / période', title:'Intitulé', organization:'Organisation', description:'Description' },
  training: { date:'Date / période', title:'Intitulé', organization:'Établissement', detail:'Détail' },
  skills: { category:'Profil', label:'Groupe', items:'Compétences (une par ligne)' },
};
export function validateCv(kind, data) {
  const fields={}, value={};
  if (!cvKinds.includes(kind) || !data || typeof data !== 'object' || Array.isArray(data)) return {value,fields:{form:'Contenu invalide.'}};
  const allowed=Object.keys(cvFields[kind]);
  if(Object.keys(data).some(key=>!allowed.includes(key))) fields.form='Champ inconnu.';
  for(const key of allowed){
    const input=data[key];
    if(key==='items'){
      if(!Array.isArray(input)||input.length>50||input.length<1||input.some(item=>typeof item!=='string'||!item.trim()||item.length>150)) fields.items='Renseigner de 1 à 50 compétences (150 caractères maximum chacune).';
      else value.items=input.map(item=>item.trim());
    }else if(key==='category'){
      if(!['dev','industry'].includes(input))fields.category='Profil invalide.';else value.category=input;
    }else{
      const limit=['description','detail'].includes(key)?3000:250;
      if(typeof input!=='string'||!input.trim()||input.length>limit)fields[key]=`Champ requis, ${limit} caractères maximum.`;
      else value[key]=input.trim();
    }
  }
  return {value,fields};
}
export function validCvCatalog(data){
  return data && cvKinds.every(kind=>Array.isArray(data[kind]) && data[kind].every(({_id,createdAt:_createdAt,updatedAt:_updatedAt,...entry})=>/^[a-f\d]{24}$/i.test(_id)&&Object.keys(validateCv(kind,entry).fields).length===0));
}
