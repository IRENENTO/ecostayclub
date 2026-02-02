const CACHE_NAME = 'ecostay-v5';
const ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/admin.html',
  '/styles.css',
  '/script.js',
  '/img/ecostay-logo.png',
  '/img/niyigaba-heritier.jpeg',
  '/img/rebecca-byukusenge.jpeg',
  '/img/jean-dedier.jpeg',
  '/img/diane-uwase.jpeg',
  '/img/irene-irumva.jpg',
  '/img/claudine-niyonsenga.jpeg',
  '/img/gaspard-rwanyiziri.jpeg',
  '/img/photo-1542601906990-b4d3fb778b09.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
