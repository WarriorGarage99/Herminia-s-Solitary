// sw.js - Service Worker ligero y funcional
const CACHE_NAME = 'herminia-solitaire-v1';
const urlsToCache = [
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

self.addEventListener('install', event => {
  console.log('✅ SW instalado');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Archivos cacheados');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('❌ Error al cachear:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('✅ SW activado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('🗑️ Eliminando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => new Response('Error de red', { status: 503 }))
  );
});
