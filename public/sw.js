const CACHE_NAME = 'calcfy-v1'
const urlsToCache = [
  '/',
  '/manifest.json'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        // Cache only essential resources that definitely exist
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.log('Failed to cache:', url, err)
              // Don't fail the entire cache operation if one URL fails
              return Promise.resolve()
            })
          })
        )
      })
      .catch(err => {
        console.log('Cache installation failed:', err)
      })
  )
})

// Fetch event - serve from cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response
        }
        
        return fetch(event.request).catch(err => {
          console.log('Fetch failed:', event.request.url, err)
          // Return a basic offline page or let the browser handle it
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
        })
      })
      .catch(err => {
        console.log('Cache match failed:', err)
        return fetch(event.request)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
