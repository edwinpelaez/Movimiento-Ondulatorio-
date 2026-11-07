// Service Worker para el Cuaderno Virtual Universitario de Física 3
const CACHE_NAME = 'fisica3-ondas-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css',
  './css/notebook.css',
  './js/app.js',
  './js/math-engine.js',
  './js/wave-model.js',
  './js/graph-renderer.js',
  './js/didactic-presets.js',
  './js/virtual-keyboard.js',
  './js/notebook-content.js',
  './js/mindmap.js',
  './js/timeline.js',
  './js/simulations-lab.js',
  './js/notebook-app.js',
  './manifest.json',
  './vendor/katex/katex.min.css',
  './vendor/katex/katex.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Algunos recursos no pudieron ser precacheados:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request)
          .then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => cached)
      );
    })
  );
});
