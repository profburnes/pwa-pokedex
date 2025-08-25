const CACHE_NAME = 'meu-pwa-cache-v1';
const URLS_TO_CACHE = [
  'index.html',
  'offline.html',
  'manifest.json',
  'images/icon-192.png',
  'images/icon-512.png',
  'images/logo.png',
  'images/offline.jpg',
  'css/style.css'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }))
    )
  );
});

// Interceptar requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request).then(response => {
        // Se não tiver no cache, tenta mostrar o offline.html (somente para documentos HTML)
        if (event.request.mode === 'navigate') {
          return caches.match('offline.html');
        }
        return response;
      }))
  );
});

self.addEventListener('push', function (event) {
  let data = {
    title: 'Notificação Padrão',
    body: 'Você recebeu uma nova mensagem!',
  };

  // Tenta converter em JSON, com fallback
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text(); // Usa como texto simples
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'icon-192.png',
      badge: 'icon-192.png'
    })
  );
});