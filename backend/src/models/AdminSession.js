import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  tokenHash: { type: String, required: true, unique: true },
  credentialVersion: { type: String, required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
}, { strict: 'throw', versionKey: false });
export const AdminSession = mongoose.model('AdminSession', schema);
