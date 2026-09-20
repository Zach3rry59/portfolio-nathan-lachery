import { referenceCv } from '../../../shared/cv.js';
import { cvKinds, validateCv } from '../../../shared/cv-validation.js';
import { HttpError } from '../middleware/errors.js';
export function contentRoutes(router,repository,auth){
  const requireKind=(req,res,next)=>{if(!cvKinds.includes(req.params.kind))throw new HttpError(404,'NOT_FOUND','Section introuvable.');next();};
  const requireId=(req,res,next)=>{if(!/^[a-f\d]{24}$/i.test(req.params.id))throw new HttpError(400,'INVALID_ID','Identifiant invalide.');next();};
  const validate=(req,res,next)=>{
    if(!req.is('application/json'))throw new HttpError(415,'JSON_REQUIRED','JSON requis.');
    const result=validateCv(req.params.kind,req.body);
    if(Object.keys(result.fields).length)throw new HttpError(400,'VALIDATION_ERROR','Vérifiez les champs.',result.fields);
    req.validatedCv=result.value;next();
  };
  router.get('/cv',async(req,res)=>{
    const connected=repository.status().connected;
    res.json({data:connected?await repository.cv():referenceCv,meta:{source:connected?'mongodb':'reference'}});
  });
  router.get('/admin/cv',auth.requireAdmin,async(req,res)=>res.json({data:await repository.cv()}));
  router.post('/admin/cv/:kind',auth.requireAdmin,requireKind,validate,async(req,res)=>res.status(201).json({data:await repository.createCv(req.params.kind,req.validatedCv)}));
  router.patch('/admin/cv/:kind/:id',auth.requireAdmin,requireKind,requireId,validate,async(req,res)=>{
    const data=await repository.updateCv(req.params.kind,req.params.id,req.validatedCv);
    if(!data)throw new HttpError(404,'NOT_FOUND','Élément introuvable.');res.json({data});
  });
  router.delete('/admin/cv/:kind/:id',auth.requireAdmin,requireKind,requireId,async(req,res)=>{
    if(!await repository.deleteCv(req.params.kind,req.params.id))throw new HttpError(404,'NOT_FOUND','Élément introuvable.');res.status(204).end();
  });
  router.get('/admin/messages',auth.requireAdmin,async(req,res)=>{
    const page=Number(req.query.page||1);
    if(Object.keys(req.query).some(key=>key!=='page')||!Number.isSafeInteger(page)||page<1||page>10000)throw new HttpError(400,'INVALID_PAGE','Page invalide.');
    res.json(await repository.messages(page));
  });
  router.patch('/admin/messages/:id',auth.requireAdmin,requireId,async(req,res)=>{
    if(!req.is('application/json')||!req.body||Object.keys(req.body).length!==1||typeof req.body.read!=='boolean')throw new HttpError(400,'VALIDATION_ERROR','État lu/non lu invalide.');
    const data=await repository.updateMessage(req.params.id,req.body.read);
    if(!data)throw new HttpError(404,'NOT_FOUND','Message introuvable.');res.json({data});
  });
  router.delete('/admin/messages/:id',auth.requireAdmin,requireId,async(req,res)=>{
    if(!await repository.deleteMessage(req.params.id))throw new HttpError(404,'NOT_FOUND','Message introuvable.');res.status(204).end();
  });
}
