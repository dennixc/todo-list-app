// Service Worker 版本和快取名稱
const CACHE_NAME = 'todo-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/script.js',
  '/style.css',
  '/manifest.json'
];

// 安裝事件：快取靜態資源
self.addEventListener('install', (event) => {
  console.log('[Service Worker] 安裝中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] 快取資源');
        return cache.addAll(ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] 安裝完成');
        return self.skipWaiting(); // 立即啟用新的 Service Worker
      })
  );
});

// 啟動事件：清理舊快取
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] 啟動中...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[Service Worker] 刪除舊快取:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] 啟動完成');
        return self.clients.claim(); // 立即控制所有頁面
      })
  );
});

// Fetch 事件：快取優先策略（Cache First, Network Fallback）
self.addEventListener('fetch', (event) => {
  // 只處理 GET 請求
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // 如果快取中有資源，直接返回
        if (cachedResponse) {
          console.log('[Service Worker] 從快取載入:', event.request.url);
          return cachedResponse;
        }

        // 快取中沒有，從網路取得
        console.log('[Service Worker] 從網路載入:', event.request.url);
        return fetch(event.request)
          .then((networkResponse) => {
            // 檢查是否為有效回應
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // 複製回應並加入快取
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch((error) => {
            console.error('[Service Worker] Fetch 失敗:', error);
            // 可以在這裡返回一個離線頁面
            return new Response('離線模式：無法載入資源', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// 監聽訊息事件（可用於手動觸發快取更新）
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
