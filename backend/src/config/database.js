import mongoose from 'mongoose';
mongoose.set('bufferCommands', false);
mongoose.set('autoCreate', false);
mongoose.set('autoIndex', false);
let configured = false;
let initialized = false;
let retryTimer;
let stopping = false;
export function databaseStatus() {
  return { configured, connected: initialized && mongoose.connection.readyState === 1, state: !configured ? 'not_configured' : ['disconnected','connected','connecting','disconnecting'][mongoose.connection.readyState] || 'unknown' };
}
export async function connectDatabase(uri, initialize = async () => {}) {
  configured = Boolean(uri);
  if (!uri) return false;
  stopping = false;
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, maxPoolSize: 5 });
    for (const model of Object.values(mongoose.models)) {
      await model.createCollection();
      await model.createIndexes();
    }
    await initialize();
    initialized = true;
    return true;
  }
  catch {
    initialized = false;
    console.warn('MongoDB indisponible. Nouvelle tentative dans 30 secondes ; écritures désactivées.');
    if (!stopping) retryTimer = setTimeout(() => { void connectDatabase(uri, initialize); }, 30000).unref();
    return false;
  }
}
export const disconnectDatabase = () => { stopping = true; clearTimeout(retryTimer); return mongoose.disconnect(); };
