import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const children = [
  spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1'], { cwd: `${root}frontend`, stdio: 'inherit' }),
  spawn(process.execPath, ['--watch', 'src/server.js'], { cwd: `${root}backend`, stdio: 'inherit' }),
];
let stopping = false;
function stop() { if (stopping) return; stopping = true; children.forEach(child => child.kill()); }
children.forEach(child => { child.on('error', () => { process.exitCode = 1; stop(); }); child.on('exit', code => { if (code) process.exitCode = code; stop(); }); });
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
