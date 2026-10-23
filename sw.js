```javascript
const CACHE_NAME = 'minimal-pwa-cache-v1';
// List all essential files your PWA needs to work offline
const urlsToCache = [
  '/',
  '/index.html', 
  '/main.css', 
  '/e.png', // Make sure this icon file is in your project
  // Add any other critical assets here (like fonts, images)
];

// Install event: Cache the necessary files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: Serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return the cached response
        if (response) {
          return response;
        }
        // Not in cache, go to the network
        return fetch(event.request);
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

With these three files (`index.html`, `manifest.json`, and `service-worker.js`) in your root directory, you will have a fully functional PWA setup that can be tested!
