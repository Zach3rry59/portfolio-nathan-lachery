import { createApp } from '../src/app.js';
import { contentMemory } from './content-memory.mjs';
import { hashPassword } from '../src/services/password.js';
if(process.env.NODE_ENV!=='test')throw new Error('NODE_ENV=test obligatoire.');
const settings={adminEmail:'admin@example.test',adminPasswordHash:await hashPassword('Isolated-test-password-2026')};
createApp({repository:contentMemory(),origins:['http://127.0.0.1:5175'],settings}).listen(3002,'127.0.0.1',()=>console.log('Preview admin isolée : 3002. Aucune connexion MongoDB.'));
