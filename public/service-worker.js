'use strict';

// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v1';

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
  '/offline.html'
];

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
  // CODELAB: Precache static resources here.
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(FILES_TO_CACHE);
      })
  );

  self.skipWaiting(); // finishes the install event
});

self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  // CODELAB: Remove previous cached data from disk.
  evt.waitUntil(
    caches.keys()
      .then(keylist => {
        return Promise.all(keylist.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }));
      })
  );

  self.clients.claim(); // finishes the activate event
});

self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Fetch', evt.request.url);
  // CODELAB: Add fetch event handler here.
  if (evt.request.mode !== 'navigate') {
    return; // not a page navigation
  }

  evt.respondWith(
    fetch(evt.request)
      .catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        return cache.match('offline.html');
      })
  );
});
