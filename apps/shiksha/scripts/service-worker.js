/* CACHE, BASE and PAGES are emitted by offline.mjs. */
const PREFIX = 'shiksha-study-';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith(PREFIX) && key !== CACHE).map((key) => caches.delete(key))
  )).then(() => self.clients.claim()));
});

async function remember(path, response) {
  if (response.ok && !response.redirected && response.headers.get('content-type')?.includes('text/html')) {
    const cache = await caches.open(CACHE);
    await cache.put(path, response.clone());
  }
}

self.addEventListener('message', (event) => {
  const path = event.data?.studyPath;
  if (event.source?.url && new URL(event.source.url).pathname === path && PAGES.has(path)) {
    event.waitUntil(fetch(path).then((response) => remember(path, response)).catch(() => {}));
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || request.method !== 'GET') return;

  if (request.mode === 'navigate' && PAGES.has(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const response = await fetch(request);
        await remember(url.pathname, response);
        return response;
      } catch {
        const localized = url.pathname.startsWith('/hi/') ? '/hi/offline/' : '/offline/';
        return (await cache.match(url.pathname)) ?? (await cache.match(localized)) ?? Response.error();
      }
    })());
  } else if (BASE.includes(url.pathname) && request.mode !== 'navigate') {
    event.respondWith(caches.open(CACHE).then((cache) => cache.match(url.pathname)).then((response) => response ?? fetch(request)));
  }
});
