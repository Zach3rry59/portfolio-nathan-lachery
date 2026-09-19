import mongoose from 'mongoose';
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, trim: true, maxlength: 254 },
  subject: { type: String, required: true, trim: true, minlength: 3, maxlength: 140 },
  message: { type: String, required: true, trim: true, minlength: 20, maxlength: 5000 },
  read: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false }, versionKey: false, strict: 'throw' });
contactSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 * 24 * 60 * 60 });
export const Contact = mongoose.model('Contact', contactSchema);
