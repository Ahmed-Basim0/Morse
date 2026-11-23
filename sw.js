const CACHE = 'morse-v6';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './Icon-192.png',
  './Icon-512.png',
  './Icon-mask-able-512.png',
  './Icon_180.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(ASSETS.map(url => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(cached => {
      if (cached) return cached;
      if (e.request.mode === 'navigate') return caches.match('./index.html');
      return fetch(e.request);
    })
  );
});
