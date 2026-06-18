const CACHE_NAME = "jkh-opulence-cache-v1";
const OFFLINE_URL = "/index.html";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.png",
  "/apple-touch-icon.png",
  "/placeholder.svg",
  "/robots.txt"
];

// Install event - pre-cache critical shell resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching app shell");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - cache-first with network fallback for static assets, network-first for documents
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Exclude API requests (like Pollinations, Gemini, etc.) and hot module reloading scripts
  if (
    url.hostname.includes("generativelanguage.googleapis.com") ||
    url.hostname.includes("gen.pollinations.ai") ||
    url.hostname.includes("media.pollinations.ai") ||
    url.pathname.includes("@vite") ||
    url.pathname.includes("hot-update")
  ) {
    return;
  }

  // Network-first for main document or page navigations to always load fresh code if online
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match(OFFLINE_URL) || caches.match(event.request);
        })
    );
    return;
  }

  // Cache-first for images, styles, scripts, and fonts
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in the background to update cache (stale-while-revalidate)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => { /* ignore background sync errors */ });
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
          return networkResponse;
        }

        // Cache the dynamically fetched assets
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Return default placeholder images if offline
        if (event.request.destination === "image") {
          return caches.match("/placeholder.svg");
        }
      });
    })
  );
});
