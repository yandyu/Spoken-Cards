// Service Worker：离线缓存。升级卡组/代码时把 CACHE 版本号 +1 即可强制刷新。
const CACHE = "spoken-cards-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./apple-touch-icon.png",
  "./data/toc.js?v=3",
  "./data/deck-topic-01.js?v=3",
  "./data/deck-topic-02.js?v=3",
  "./data/deck-topic-03.js?v=3",
  "./data/deck-topic-04.js?v=3",
  "./data/deck-topic-05.js?v=3",
  "./data/deck-topic-06.js?v=3",
  "./data/deck-topic-07.js?v=3"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 缓存优先：离线可用；忽略查询串，版本号变化也能命中已缓存资源
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return resp;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
