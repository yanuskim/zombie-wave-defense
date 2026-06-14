const CACHE_NAME = "zwd-test-app-v20";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=zwd16",
  "./game.js?v=zwd16",
  "./manifest.webmanifest",
  "./icon.svg",
  "./assets/images/hero-base.png",
  "./assets/images/location-sheet.png",
  "./assets/images/job-cards.png",
  "./assets/images/world-map-reference.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
