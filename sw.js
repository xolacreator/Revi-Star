// Doodle Stars service worker — offline app shell caching.
// Bump CACHE when any shell file changes so clients pull fresh copies.
const CACHE = 'little-legends-a1-v46';
const SHELL = [
  './',
  './index.html',
  './a1.js',
  './a1.css',
  './harbor.js',
  './harbor.css',
  './harbor-slice.html',
  './vendor/three.module.min.js',
  './vendor/three.core.min.js',
  './vendor/GLTFLoader.js',
  './vendor/BufferGeometryUtils.js',
  './vendor/SkeletonUtils.js',
  './demo-explore.html',
  './world3d.js',
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

// Strategy:
//  - HTML / JS (navigations + app code): NETWORK-FIRST, so new deploys show up
//    immediately; fall back to cache only when offline.
//  - Everything else (vendored Three.js, images, fonts): CACHE-FIRST for speed.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const isAppCode = e.request.mode === 'navigate' ||
    /\.(html|js|webmanifest)$/.test(url.pathname) && !url.pathname.includes('/vendor/');

  if (isAppCode) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request).then((hit) => hit || caches.match('./index.html')))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      }))
    );
  }
});
