// Service Worker：离线缓存。升级卡组/代码时把 CACHE 版本号 +1 即可强制刷新。
const CACHE = "spoken-cards-v20";
const ASSETS = [
  "./",
  "./index.html",
  "./progress.css?v=20",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./apple-touch-icon.png",
  "./data/toc.js?v=20",
  "./data/deck-topic-01.js?v=20",
  "./data/deck-topic-02.js?v=20",
  "./data/deck-topic-03.js?v=20",
  "./data/deck-topic-04.js?v=20",
  "./data/deck-topic-05.js?v=20",
  "./data/deck-topic-06.js?v=20",
  "./data/deck-topic-07.js?v=20",
  "./data/deck-topic-08.js?v=20",
  "./data/deck-topic-09.js?v=20",
  "./data/deck-topic-10.js?v=20",
  "./data/deck-topic-11.js?v=20",
  "./data/deck-topic-12.js?v=20",
  "./data/deck-topic-13.js?v=20",
  "./data/deck-topic-14.js?v=20",
  "./data/deck-topic-15.js?v=20",
  "./data/deck-topic-16.js?v=20",
  "./data/deck-topic-17.js?v=20",
  "./data/deck-topic-18.js?v=20",
  "./data/deck-topic-19.js?v=20",
  "./data/deck-topic-20.js?v=20",
  "./data/deck-topic-21.js?v=20",
  "./data/deck-topic-22.js?v=20",
  "./data/deck-topic-23.js?v=20",
  "./data/deck-topic-24.js?v=20",
  "./data/deck-topic-25.js?v=20",
  "./data/deck-topic-26.js?v=20",
  "./data/deck-topic-27.js?v=20",
  "./data/deck-topic-28.js?v=20",
  "./data/deck-topic-29.js?v=20",
  "./data/deck-topic-30.js?v=20",
  "./data/deck-topic-31.js?v=20",
  "./data/deck-topic-32.js?v=20",
  "./data/deck-topic-33.js?v=20",
  "./data/deck-topic-34.js?v=20",
  "./data/deck-topic-35.js?v=20",
  "./data/deck-topic-36.js?v=20",
  "./data/deck-topic-37.js?v=20",
  "./data/deck-topic-38.js?v=20",
  "./data/deck-topic-39.js?v=20",
  "./data/deck-topic-40.js?v=20",
  "./data/deck-topic-41.js?v=20",
  "./data/deck-topic-42.js?v=20",
  "./data/deck-topic-43.js?v=20",
  "./data/deck-topic-44.js?v=20",
  "./data/deck-topic-45.js?v=20",
  "./data/deck-topic-46.js?v=20",
  "./data/deck-topic-47.js?v=20",
  "./data/deck-topic-48.js?v=20",
  "./data/deck-topic-49.js?v=20",
  "./data/deck-topic-50.js?v=20",
  "./data/deck-topic-51.js?v=20",
  "./data/deck-topic-52.js?v=20",
  "./data/deck-topic-53.js?v=20",
  "./data/deck-topic-54.js?v=20",
  "./data/deck-topic-55.js?v=20",
  "./data/deck-topic-56.js?v=20",
  "./data/deck-topic-57.js?v=20",
  "./data/deck-topic-58.js?v=20",
  "./data/deck-topic-59.js?v=20",
  "./data/deck-topic-60.js?v=20",
  "./data/deck-topic-61.js?v=20",
  "./data/deck-topic-62.js?v=20",
  "./data/deck-topic-63.js?v=20",
  "./data/deck-topic-64.js?v=20",
  "./data/deck-topic-65.js?v=20",
  "./data/deck-topic-66.js?v=20",
  "./data/deck-topic-67.js?v=20",
  "./data/deck-topic-68.js?v=20",
  "./data/deck-topic-69.js?v=20",
  "./data/deck-topic-70.js?v=20",
  "./data/deck-topic-71.js?v=20",
  "./data/deck-topic-72.js?v=20",
  "./data/deck-topic-73.js?v=20",
  "./data/deck-topic-74.js?v=20",
  "./data/deck-topic-75.js?v=20",
  "./data/deck-topic-76.js?v=20",
  "./data/deck-topic-77.js?v=20",
  "./data/deck-topic-78.js?v=20",
  "./data/deck-topic-79.js?v=20",
  "./data/deck-topic-80.js?v=20",
  "./data/deck-topic-81.js?v=20",
  "./data/deck-topic-82.js?v=20",
  "./data/deck-topic-83.js?v=20",
  "./data/deck-topic-84.js?v=20",
  "./data/deck-topic-85.js?v=20",
  "./data/deck-topic-86.js?v=20",
  "./data/deck-topic-87.js?v=20",
  "./data/deck-topic-88.js?v=20",
  "./data/deck-topic-89.js?v=20",
  "./data/deck-topic-90.js?v=20",
  "./data/deck-topic-91.js?v=20",
  "./data/deck-topic-92.js?v=20",
  "./data/deck-topic-93.js?v=20",
  "./data/deck-topic-94.js?v=20",
  "./data/deck-topic-95.js?v=20",
  "./data/deck-topic-96.js?v=20"
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

// HTML 联网优先；资源严格匹配版本，避免新页面拿到旧样式。
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(e.request);
    if (e.request.mode !== "navigate" && cached) return cached;
    try {
      const response = await fetch(e.request);
      if (response.ok) await cache.put(e.request, response.clone());
      if (!response.ok && cached) return cached;
      return response;
    } catch (error) {
      if (cached) return cached;
      if (e.request.mode === "navigate") {
        const page = await cache.match("./index.html");
        if (page) return page;
      }
      throw error;
    }
  })());
});
