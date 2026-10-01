import { spawn } from 'node:child_process';

let syncing = false;
let syncProcess;
function syncProfiles() {
  if (syncing) return Promise.resolve();
  syncing = true;
  return new Promise((resolve) => {
    syncProcess = spawn(process.execPath, ['scripts/sync-profile-stats.mjs'], { stdio: 'inherit' });
    syncProcess.on('error', (error) => console.error('Profile sync failed:', error.message));
    syncProcess.on('close', () => { syncing = false; resolve(); });
  });
}

await syncProfiles();
const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', ...process.argv.slice(2)], { stdio: 'inherit' });
const timer = setInterval(syncProfiles, 5 * 60 * 1000);
function cleanup() {
  clearInterval(timer);
  syncProcess?.kill();
  vite.kill();
}
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
vite.on('error', (error) => { console.error(error.message); cleanup(); process.exitCode = 1; });
vite.on('close', (code) => { clearInterval(timer); syncProcess?.kill(); process.exitCode = code ?? 0; });
