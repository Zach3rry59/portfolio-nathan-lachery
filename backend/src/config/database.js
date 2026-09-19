import mongoose from 'mongoose';
mongoose.set('bufferCommands', false);
let configured = false;
let retryTimer;
let stopping = false;
export function databaseStatus() {
  return { configured, connected: mongoose.connection.readyState === 1, state: !configured ? 'not_configured' : ['disconnected','connected','connecting','disconnecting'][mongoose.connection.readyState] || 'unknown' };
}
export async function connectDatabase(uri) {
  configured = Boolean(uri);
  if (!uri) return false;
  stopping = false;
  try { await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, maxPoolSize: 5 }); return true; }
  catch {
    console.warn('MongoDB indisponible. Nouvelle tentative dans 30 secondes ; écritures désactivées.');
    if (!stopping) retryTimer = setTimeout(() => { void connectDatabase(uri); }, 30000).unref();
    return false;
  }
}
export const disconnectDatabase = () => { stopping = true; clearTimeout(retryTimer); return mongoose.disconnect(); };
