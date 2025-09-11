// Service Worker básico e seguro
const CACHE_NAME = 'calcfy-v1'

// Instalar service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Só fazer cache da página principal
        return cache.add('/')
      })
      .catch((error) => {
        console.log('Service Worker: Erro ao fazer cache inicial:', error)
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
