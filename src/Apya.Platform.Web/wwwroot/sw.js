/* =============================================================================
   Apya Service Worker — minimal, dependency-free.
   -----------------------------------------------------------------------------
   Strateji:
     - App shell precache  : install sırasında kritik route'un statik asset'leri
     - /js/*, /css/*, /icons/*, /manifest.webmanifest → stale-while-revalidate
       (önbellekteki varsa hemen onu dön, arka planda tazesini çekip önbelleği
       güncelle — bir sonraki istek güncel gelir)
     - /api/* → network-first (offline fallback yok; ABP error envelope kullanıcıya iletilir)
     - HTML navigations → network-first + offline fallback ('/offline.html' ya da
       cached '/Dashboard')

   Neden cache-first DEĞİL: dashboard.js gibi asp-append-version'lı dosyalar
   URL'sinde ?v= taşır ve düzgün cache-bust eder, ama Vite'ın ürettiği paylaşılan
   chunk'lar (react-vendor.js, grid-vendor.js, query-vendor.js, signalr-vendor.js,
   ui-vendor.js, httpClient.js — dashboard.js'in kendi import() graph'ından,
   manualChunks ile BİLİNÇLİ sabit/hash'siz isimlendirilmiş, bkz vite.config.js)
   HİÇBİR versiyon query string'i taşımaz. Cache-first altında bu dosyalar ilk
   önbelleklendiği haliyle KALICI OLARAK kilitlenir — yeni bir build sonrası
   içerik değişse de URL aynı kaldığı için eski sürüm sonsuza dek sunulur ve
   React island'ı sessizce boş kalabilir. Stale-while-revalidate bu sınıfı kökten
   kapatır: en kötü ihtimalle bir sonraki reload günceli getirir.

   Versiyonlama: CACHE_VERSION değişince eski cache'ler activate sırasında temizlenir
   (mevcut kullanıcıları anında temiz sayfaya döndürmek için deploy'da artırılabilir).

   ABP route'ları: /Account/Login gibi guarded sayfalar offline'da çalışmaz —
   service worker auth'a karışmaz, browser session yönetir.
   ============================================================================= */

const CACHE_VERSION = 'v3';
const CACHE_SHELL   = `apya-shell-${CACHE_VERSION}`;
const CACHE_ASSETS  = `apya-assets-${CACHE_VERSION}`;
const CACHE_RUNTIME = `apya-runtime-${CACHE_VERSION}`;

/* Precache: dashboard'un mutlak gereksinimleri. Eksik dosya install'u BAŞARISIZ
   yapar (atomic) — eski SW aktif kalır. */
const SHELL_URLS = [
    '/manifest.webmanifest',
    '/icons/apya-icon.svg',
];

/* Pending SW'ı aktive et (registerServiceWorker.js'ten gelen mesaj) */
self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_SHELL)
            .then((cache) => cache.addAll(SHELL_URLS))
            .then(() => self.skipWaiting()),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keep = new Set([CACHE_SHELL, CACHE_ASSETS, CACHE_RUNTIME]);
        const names = await caches.keys();
        await Promise.all(
            names.filter((n) => !keep.has(n)).map((n) => caches.delete(n)),
        );
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return; /* cross-origin'i bypass'la */

    if (url.pathname.startsWith('/js/') || url.pathname.startsWith('/icons/') ||
        url.pathname === '/manifest.webmanifest' || url.pathname.endsWith('.css')) {
        event.respondWith(staleWhileRevalidate(event, CACHE_ASSETS));
        return;
    }

    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkOnly(req));
        return;
    }

    if (req.mode === 'navigate') {
        event.respondWith(networkFirst(req, CACHE_RUNTIME));
        return;
    }
});

async function staleWhileRevalidate(event, cacheName) {
    const req = event.request;
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    const update = fetch(req)
        .then((fresh) => {
            if (fresh.ok) cache.put(req, fresh.clone());
            return fresh;
        })
        .catch(() => null);
    if (cached) {
        event.waitUntil(update);
        return cached;
    }
    const fresh = await update;
    return fresh || new Response('Offline', { status: 503, statusText: 'Offline' });
}

async function networkFirst(req, cacheName) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        if (fresh.ok) cache.put(req, fresh.clone());
        return fresh;
    } catch (err) {
        const cached = await cache.match(req);
        if (cached) return cached;
        /* Bundle cached olmasa da react-vendor + dashboard.js cache'te olabilir;
           browser kendi import resolution'unu yapar — minimal fallback. */
        return new Response(
            '<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>Çevrimdışı</title></head><body><h1>Çevrimdışısınız</h1><p>İnternete bağlandığınızda otomatik yenilenecek.</p></body></html>',
            { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
        );
    }
}

async function networkOnly(req) {
    return fetch(req);
}

/* --- Push notification (APYA-97 SignalR'a alternatif/ek; saha kullanım için) ---
   Server payload contract:
     {
       title, body, tag, severity, url,
       approval: { id },                          // varsa onay-detay deep-link
       actions: [                                 // notification action button'ları
         { action: 'approve', title: 'Onayla' },
         { action: 'reject',  title: 'Reddet' },
       ],
       idempotencyKey,                            // server tarafı: aynı key tekrarlanırsa NOOP
     }
*/
self.addEventListener('push', (event) => {
    if (!event.data) return;
    let payload = {};
    try { payload = event.data.json(); } catch (_) { payload = { title: 'Apya', body: event.data.text() }; }

    const title = payload.title || 'Apya';
    /* Onay deep-link'i URL'e enjekte et — bildirim tap'inde dashboard direkt
       ApprovalDetailSheet açar (BentoDashboard ?approval=ID okur). */
    const approvalId = payload.approval?.id;
    const url = approvalId
        ? `/Dashboard?approval=${encodeURIComponent(approvalId)}`
        : (payload.url || '/Dashboard');

    const options = {
        body: payload.body,
        icon: '/icons/apya-icon.svg',
        badge: '/icons/apya-icon.svg',
        tag: payload.tag,                          /* aynı tag → mevcut bildirim güncellenir, spam önlenir */
        renotify: false,
        requireInteraction: payload.severity === 'critical',
        data: {
            url,
            approvalId,
            idempotencyKey: payload.idempotencyKey,
        },
        actions: payload.actions || [],
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const data = event.notification.data || {};
    const action = event.action;

    /* Approve/Reject inline action — uygulamayı açmaya gerek YOK, doğrudan
       endpoint'e POST. Server idempotencyKey ile double-tap koruması. Hata
       durumunda yeni bir notification ile kullanıcıyı uyar. */
    if ((action === 'approve' || action === 'reject') && data.approvalId) {
        event.waitUntil(performApprovalAction(action, data.approvalId, data.idempotencyKey));
        return;
    }

    /* Default: bildirimi aç. Aynı URL'i taşıyan client varsa odakla, yoksa yeni pencere. */
    const url = data.url || '/Dashboard';
    event.waitUntil((async () => {
        const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const c of clientList) {
            if (c.url.includes(url) && 'focus' in c) return c.focus();
        }
        if (self.clients.openWindow) return self.clients.openWindow(url);
    })());
});

async function performApprovalAction(action, id, idempotencyKey) {
    const endpoint = `/api/app/approvals/${encodeURIComponent(id)}/${action}`;
    const headers = { 'Content-Type': 'application/json' };
    if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
    try {
        const res = await fetch(endpoint, { method: 'POST', credentials: 'include', headers });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await self.registration.showNotification('Apya', {
            body: action === 'approve' ? 'Onaylandı.' : 'Reddedildi.',
            icon: '/icons/apya-icon.svg',
            tag: `approval-result-${id}`,
            silent: true,                          /* kullanıcıyı tekrar uyarma */
        });
    } catch (err) {
        await self.registration.showNotification('Apya — işlem başarısız', {
            body: 'Onay/red gönderilemedi. Uygulamayı açıp tekrar dene.',
            icon: '/icons/apya-icon.svg',
            tag: `approval-error-${id}`,
            requireInteraction: true,
            data: { url: `/Dashboard?approval=${encodeURIComponent(id)}` },
        });
    }
}
