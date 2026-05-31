// Doodle Stars service worker — offline app shell caching.
// Bump CACHE when any shell file changes so clients pull fresh copies.
const CACHE = 'starbound-hunters-v4';
const SHELL = [
  './',
  './index.html',
  './world3d.js',
  './vendor/three.module.min.js',
  './vendor/three.core.min.js',
  './styles.css',
  './classic.html',
  './characters.js',
  './assets.js',
  './game.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache-first for the app shell; fall back to network for everything else.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});
