import mongoose from 'mongoose';
import { httpUrl } from '../../../shared/project-validation.js';
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  category: { type: String, required: true, enum: ['dev', 'industry'] },
  slug: { type: String, required: true, unique: true, maxlength: 180, match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
  shortDescription: { type: String, required: true, maxlength: 500 }, description: { type: String, maxlength: 5000 },
  technologies: [{ type: String, maxlength: 80 }],
  githubUrl: { type: String, validate: httpUrl, default: '' }, demoUrl: { type: String, validate: httpUrl, default: '' }, imageUrl: { type: String, validate: httpUrl, default: '' },
  featured: { type: Boolean, default: false }, order: { type: Number, default: 0, min: 0, max: 10000, validate: Number.isInteger },
  year: { type: String, maxlength: 30 }, context: { type: String, maxlength: 200 },
  features: [{ _id: false, title: { type: String, maxlength: 100 }, description: { type: String, maxlength: 1000 } }],
}, { timestamps: true, versionKey: false, strict: 'throw' });
projectSchema.index({ category: 1, order: 1, _id: 1 });
export const Project = mongoose.model('Project', projectSchema);
