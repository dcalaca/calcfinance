// Service Worker desabilitado temporariamente para resolver problemas de cache
// const CACHE_NAME = 'calcfy-v1'

// Instalar service worker
self.addEventListener('install', (event) => {
  // Não fazer cache para evitar problemas de MIME type
  event.waitUntil(
    Promise.resolve()
  )
})

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  // Sempre buscar da rede, sem cache
  event.respondWith(
    fetch(event.request)
  )
})
