/* YADA — Service Worker : mise en cache pour installation PWA + hors-ligne.
   Cache-first sur les ressources de l'app, repli sur precompta.html. */
var CACHE = 'yada-v1';
var ASSETS = [
  './',
  './index.html',
  './precompta.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(ASSETS.map(function (u) {
        return c.add(u).catch(function () {}); /* ne pas échouer si une ressource manque */
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (resp) {
        try {
          var copy = resp.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        } catch (err) {}
        return resp;
      }).catch(function () {
        if (req.mode === 'navigate') return caches.match('./precompta.html');
        return new Response('', { status: 504, statusText: 'Hors-ligne' });
      });
    })
  );
});
