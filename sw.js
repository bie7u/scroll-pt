/* Scroll PT – service worker: działanie bez internetu.
   Zmień VERSION przy zmianie listy plików w SHELL, żeby telefony pobrały nową wersję. */
const VERSION = 'scroll-pt-2026-11-24f';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png',
               './icons/apple-touch-icon.png', './icons/favicon-32.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('scroll-pt') && k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Bez pośrednictwa: konto i zapis (Supabase), YouTube, wideo (przeglądarka pobiera je kawałkami)
  if (/supabase\.co$/.test(url.hostname) || /youtube|ytimg|googlevideo/.test(url.hostname) || url.pathname.endsWith('.mp4')) return;
  // Strona: najpierw sieć (zawsze świeża wersja), bez internetu ostatnia zapisana
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req)
      .then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  // Zdjęcia, ikony i biblioteka logowania z CDN: od razu z pamięci, w tle odświeżenie
  if (url.origin === self.location.origin || url.hostname === 'cdn.jsdelivr.net') {
    e.respondWith(caches.open(VERSION).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
  }
});
