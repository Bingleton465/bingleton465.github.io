self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('offline-cache').then(cache => cache.addAll([
      '/nowifi.html'
    ]))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match('/nowifi.html')
    )
  );
});
