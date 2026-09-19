import { Project } from '../models/Project.js';
import { Contact } from '../models/Contact.js';
import { databaseStatus } from '../config/database.js';
import { AdminSession } from '../models/AdminSession.js';
export const repository = {
  status: databaseStatus,
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
