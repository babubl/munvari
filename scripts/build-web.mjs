// Copies the website into www/ for the Android app. No bundler needed.
import { cpSync, rmSync, mkdirSync } from 'node:fs';
const out = 'www';
rmSync(out, { recursive: true, force: true });
mkdirSync(out);
for (const f of ['index.html', 'privacy.html', 'terms.html', 'manifest.webmanifest', 'assets']) {
  cpSync(f, `${out}/${f}`, { recursive: true });
}
console.log('Web files copied to www/');
