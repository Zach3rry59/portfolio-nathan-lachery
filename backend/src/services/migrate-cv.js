import { cvModels, CvMigration } from '../models/Cv.js';
import { referenceCv } from '../../../shared/cv.js';
// Les upserts reprennent une migration interrompue sans écraser les éditions.
// Le marqueur final empêche toute réinsertion après une suppression admin.
export async function migrateCv(){
  if(await CvMigration.exists({_id:'cv-v1'}))return;
  for(const [kind,Model] of Object.entries(cvModels)){
    for(const entry of referenceCv[kind])await Model.updateOne({_id:entry._id},{$setOnInsert:entry},{upsert:true,runValidators:true});
  }
  await CvMigration.updateOne({_id:'cv-v1'},{$setOnInsert:{completedAt:new Date()}},{upsert:true});
}
