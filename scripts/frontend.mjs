import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const cwd = fileURLToPath(new URL('../frontend/', import.meta.url));
const cli = fileURLToPath(new URL('../frontend/node_modules/vite/bin/vite.js', import.meta.url));
const args = process.argv[2] === 'build' ? ['build'] : ['--host', '127.0.0.1'];
const child = spawn(process.execPath, [cli, ...args], { cwd, stdio: 'inherit' });
child.on('exit', code => { process.exitCode = code ?? 1; });
child.on('error', () => { console.error('Vite indisponible. Installer les dépendances du projet.'); process.exitCode = 1; });
