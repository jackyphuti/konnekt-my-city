// Service Worker for Konnekt My City PWA
// Handles offline support, caching, and background sync

const CACHE_NAME = 'konnekt-v1';
const urlsToCache = [
  '/',
  '/issues',
  '/updates',
  '/report',
  '/dashboard',
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching files');
      return cache.addAll(urlsToCache).catch((error) => {
        console.log('Service Worker: Cache addAll error:', error);
        // Continue even if some files fail to cache
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, then cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests and API calls (let them fail gracefully)
  if (url.origin !== location.origin) {
    return;
  }

  // Network-first strategy for dynamic content
  if (request.method === 'GET') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200) {
            return response;
          }

          // Clone the response
          const responseClone = response.clone();

          // Cache successful responses for offline use
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });

          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(request).then((response) => {
            if (response) {
              return response;
            }
            // If no cache, return offline page
            if (request.destination === 'document') {
              return caches.match('/offline.html');
            }
          });
        })
    );
  }
});

// Handle background sync for issue reports
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reports') {
    event.waitUntil(
      // Sync pending issue reports with server
      (async () => {
        try {
          const cache = await caches.open(CACHE_NAME);
          const pendingReports = await cache.match('/pending-reports');
          if (pendingReports) {
            // Sync logic here
            console.log('Service Worker: Syncing reports...');
          }
        } catch (error) {
          console.error('Service Worker: Sync error:', error);
        }
      })()
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: data.tag || 'notification',
    requireInteraction: data.requireInteraction || false,
    actions: [
      {
        action: 'view',
        title: 'View',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
