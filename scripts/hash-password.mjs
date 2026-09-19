import { emitKeypressEvents } from 'node:readline';
import { hashPassword } from '../backend/src/services/password.js';
if (!process.stdin.isTTY) throw new Error('Utiliser un terminal interactif. Aucun mot de passe dans une commande.');
process.stdout.write('Nouveau mot de passe admin (14 caractères minimum, saisie masquée) : ');
emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
let password = '';
process.stdin.on('keypress', async (text, key) => {
  if (key?.ctrl && key.name === 'c') { process.stdin.setRawMode(false); process.exit(130); }
  if (key?.name === 'return') {
    process.stdin.setRawMode(false); process.stdin.pause(); process.stdout.write('\n');
    try { process.stdout.write(`ADMIN_PASSWORD_HASH='${await hashPassword(password)}'\n`); } catch (error) { console.error(error.message); process.exitCode = 1; }
    password = '';
  } else if (key?.name === 'backspace') { password = password.slice(0,-1); }
  else if (text && !key?.ctrl && !key?.meta) password += text;
});
