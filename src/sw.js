const CACHE_NAME = "2025-05-06 12:35";
const urlsToCache = [
  "/chess-clock/",
  "/chess-clock/mp3/warning1.mp3",
  "/chess-clock/mp3/menu1.mp3",
  "/chess-clock/mp3/decision3.mp3",
  "/chess-clock/index.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
});
