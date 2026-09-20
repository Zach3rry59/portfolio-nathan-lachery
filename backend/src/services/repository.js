import { cvModels } from '../models/Cv.js';
import { Project } from '../models/Project.js';
import { Contact } from '../models/Contact.js';
import { databaseStatus } from '../config/database.js';
import { AdminSession } from '../models/AdminSession.js';
export const repository = {
  status: databaseStatus,
  cv: async () => Object.fromEntries(await Promise.all(Object.entries(cvModels).map(async ([kind,Model])=>[kind,await Model.find().sort({_id:1}).lean()]))),
  createCv: (kind,data) => cvModels[kind].create(data),
  updateCv: (kind,id,data) => cvModels[kind].findByIdAndUpdate(id,{$set:data},{new:true,runValidators:true}).lean(),
  deleteCv: (kind,id) => cvModels[kind].findByIdAndDelete(id).lean(),
  messages: async page => ({data:await Contact.find().sort({createdAt:-1,_id:-1}).skip((page-1)*25).limit(25).lean(),total:await Contact.countDocuments(),page}),
  updateMessage: (id,read) => Contact.findByIdAndUpdate(id,{$set:{read}},{new:true,runValidators:true}).lean(),
  deleteMessage: id => Contact.findByIdAndDelete(id).lean(),
  projects: category => Project.find(category ? { category } : {}).sort({ order: 1, _id: 1 }).limit(100).lean(),
  project: id => Project.findById(id).lean(),
  createProject: data => Project.create(data),
  updateProject: (id, data) => Project.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean(),
  deleteProject: id => Project.findByIdAndDelete(id).lean(),
  contact: data => Contact.create(data),
  createSession: data => AdminSession.create(data),
  session: tokenHash => AdminSession.findOne({ tokenHash }).lean(),
  deleteSession: tokenHash => AdminSession.deleteOne({ tokenHash }),
};
