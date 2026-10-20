// Офлайн: навигация — сеть, затем кэш; ассеты (с хэшем в имени) — кэш, затем сеть.
// ponytail: старые хэшированные ассеты копятся в кэше; чистить по версии, если начнёт мешать.
const CACHE = 'planner-v2';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    if (r.mode === 'navigate') {
      try { const res = await fetch(r); c.put('./', res.clone()); return res; }
      catch { return (await c.match('./')) || Response.error(); }
    }
    const hit = await c.match(r); if (hit) return hit;
    const res = await fetch(r); if (res.ok) c.put(r, res.clone()); return res;
  }));
});
