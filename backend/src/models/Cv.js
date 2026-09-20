import mongoose from 'mongoose';
const text=(max=250)=>({type:String,required:true,trim:true,maxlength:max});
const options={timestamps:true,versionKey:false,strict:'throw'};
export const Experience=mongoose.model('Experience',new mongoose.Schema({date:text(),title:text(),organization:text(),description:text(3000)},options));
export const Training=mongoose.model('Training',new mongoose.Schema({date:text(),title:text(),organization:text(),detail:text(3000)},options));
export const Skill=mongoose.model('Skill',new mongoose.Schema({category:{type:String,required:true,enum:['dev','industry']},label:text(),items:{type:[String],required:true}},options));
export const CvMigration=mongoose.model('CvMigration',new mongoose.Schema({_id:String,completedAt:Date},{versionKey:false}));
export const cvModels={experiences:Experience,training:Training,skills:Skill};
