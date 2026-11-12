/* MunVari service worker: works offline after the first visit.
   Bump VERSION whenever any file changes so users get the update. */
const VERSION = 'munvari-v3.0.1';
const CORE = [
  './', 'index.html', 'manifest.webmanifest',
  'assets/css/app.css?v=3.0.1',
  'assets/js/rules-fy2026-27.js?v=3.0.1', 'assets/js/engine.js?v=3.0.1',
  'assets/js/i18n.js?v=3.0.1', 'assets/js/app.js?v=3.0.1',
  'assets/fonts/montserrat-latin.woff2', 'assets/fonts/montserrat-latin-ext.woff2',
  'assets/icons/favicon.svg', 'assets/icons/icon-192.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // Pages: network first so rate updates arrive, cached copy when offline
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put('index.html', copy)); return res; })
      .catch(() => caches.match('index.html')));
    return;
  }
  // Assets: cache first
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  })));
});
