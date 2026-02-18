/**
 * Windows 11 Web - Service Worker
 * Обеспечивает офлайн работу и кэширование
 */

const CACHE_NAME = 'win11-cache-v1';
const STATIC_CACHE = 'win11-static-v1';
const DYNAMIC_CACHE = 'win11-dynamic-v1';

// Базовый URL для GitHub Pages (замените на ваш репозиторий)
const BASE_URL = './';

// Файлы для кэширования при установке
const STATIC_ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './apps.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[Service Worker] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[Service Worker] Installation complete, skipping waiting');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Cache failed:', error);
            })
    );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return cacheName !== STATIC_CACHE && 
                                   cacheName !== DYNAMIC_CACHE &&
                                   cacheName !== CACHE_NAME;
                        })
                        .map((cacheName) => {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activation complete, claiming clients');
                return self.clients.claim();
            })
    );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Игнорируем запросы не из нашей области
    if (url.origin !== location.origin) {
        return;
    }

    // Стратегия: Cache First для статических ресурсов
    if (isStaticAsset(request)) {
        event.respondWith(
            caches.match(request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        console.log('[Service Worker] Serving from cache:', request.url);
                        return cachedResponse;
                    }
                    return fetchAndCache(request, STATIC_CACHE);
                })
                .catch((error) => {
                    console.error('[Service Worker] Fetch failed:', error);
                    // Возвращаем офлайн страницу для навигации
                    if (request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                })
        );
        return;
    }

    // Стратегия: Network First для динамических ресурсов
    event.respondWith(
        fetch(request)
            .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(DYNAMIC_CACHE).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                return caches.match(request)
                    .then((cachedResponse) => {
                        return cachedResponse || caches.match('./index.html');
                    });
            })
    );
});

// Проверка, является ли запрос статическим ресурсом
function isStaticAsset(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    return pathname.endsWith('.html') ||
           pathname.endsWith('.css') ||
           pathname.endsWith('.js') ||
           pathname.endsWith('.json') ||
           pathname.endsWith('.png') ||
           pathname.endsWith('.jpg') ||
           pathname.endsWith('.jpeg') ||
           pathname.endsWith('.svg') ||
           pathname.endsWith('.ico') ||
           pathname.endsWith('.woff') ||
           pathname.endsWith('.woff2') ||
           pathname.includes('/icons/');
}

// Получение из сети с сохранением в кэш
async function fetchAndCache(request, cacheName) {
    const response = await fetch(request);
    if (response && response.status === 200) {
        const cache = await caches.open(cacheName);
        cache.put(request, response.clone());
    }
    return response;
}

// Обработка сообщений от клиента
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.keys().then((cacheNames) => {
            cacheNames.forEach((cacheName) => {
                caches.delete(cacheName);
            });
        });
    }
    
    if (event.data && event.data.type === 'GET_CACHE_STATUS') {
        caches.keys().then((cacheNames) => {
            const status = {};
            Promise.all(
                cacheNames.map(async (cacheName) => {
                    const cache = await caches.open(cacheName);
                    const keys = await cache.keys();
                    status[cacheName] = keys.length;
                })
            ).then(() => {
                event.ports[0].postMessage(status);
            });
        });
    }
});

// Фоновая синхронизация
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Sync event:', event.tag);
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    // Логика синхронизации данных
    console.log('[Service Worker] Syncing data...');
}

// Периодическая фоновая синхронизация
self.addEventListener('periodicsync', (event) => {
    console.log('[Service Worker] Periodic sync:', event.tag);
    if (event.tag === 'periodic-data-sync') {
        event.waitUntil(syncData());
    }
});

// Уведомления
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url === './index.html' && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow('./index.html');
                }
            })
    );
});

// Push уведомления
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Windows 11 Web';
    const options = {
        body: data.body || 'Новое уведомление',
        icon: './icons/icon-192.png',
        badge: './icons/icon-96.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'open',
                title: 'Открыть'
            },
            {
                action: 'close',
                title: 'Закрыть'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

console.log('[Service Worker] Loaded');
