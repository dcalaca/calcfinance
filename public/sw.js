// Service Worker básico e seguro
const CACHE_NAME = 'calcfy-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
]

// Instalar service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
      })
  )
})

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retornar do cache se disponível, senão buscar da rede
        return response || fetch(event.request)
      })
  )
})
