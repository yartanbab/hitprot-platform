/* =============================================================================
   Apya Service Worker — minimal, dependency-free.
   -----------------------------------------------------------------------------
   Strateji:
     - App shell precache  : install sırasında kritik route'un statik asset'leri
     - /js/*, /css/*, /icons/*, /brand/*, /manifest.webmanifest → stale-while-revalidate
       (önbellekteki varsa hemen onu dön, arka planda tazesini çekip önbelleği
       güncelle — bir sonraki istek güncel gelir)
     - /api/* → network-first (offline fallback yok; ABP error envelope kullanıcıya iletilir)
     - HTML navigations → network-first + offline fallback ('/offline.html' ya da
       cached '/Dashboard')

   Neden cache-first DEĞİL: dashboard.js gibi asp-append-version'lı dosyalar
   URL'sinde ?v= taşır; Vite chunk'ları ise artık İSMİNDE hash taşır
   (react-vendor-<hash>.js — bkz. vite.config.js chunkFileNames). Yani /js/
   URL'leri pratikte içerikle birlikte değişir. SWR yine de korunuyor:
   elle eklenen hash'siz dosyalar (chart.umd.min.js gibi) ve olası istisnalar
   için "en kötü ihtimalle bir sonraki reload günceli getirir" güvencesi kalsın.
   (Tarihçe: chunk'lar hash'sizken deploy sonrası ilk yükleme SWR'den eski
   vendor + yeni entry karışımı servis ediyordu — island boş/bozuk açılıyordu.
   Hash bu sınıfı kökten kapattı; v5 bump'ı eski hash'siz chunk önbelleklerini
   activate'te temizler.)

   Versiyonlama: CACHE_VERSION değişince eski cache'ler activate sırasında temizlenir
   (mevcut kullanıcıları anında temiz sayfaya döndürmek için deploy'da artırılabilir).

   Kimlik route'ları (/Account/*, /connect/*) SW'a HİÇ uğramaz — ne önbellekten
   servis edilir ne önbelleğe yazılır. Sebep: bu sayfaların formunda antiforgery
   token'ı GÖMÜLÜ gelir ve sunucudaki .AspNetCore.Antiforgery çerezine eşlidir.
   Cache API, ASP.NET'in bu yanıtlara koyduğu "Cache-Control: no-store"u
   UMURSAMAZ; dolayısıyla networkFirst mobil şebekede ağ her takıldığında
   önbellekteki BAYAT login sayfasını servis ediyor, çerez o arada yenilendiği
   için POST gövdesiz 400 alıyor ve kullanıcı "[400] Hata!" ekranını görüyordu.
   ============================================================================= */

const CACHE_VERSION = 'v5';
const CACHE_SHELL   = `apya-shell-${CACHE_VERSION}`;
const CACHE_ASSETS  = `apya-assets-${CACHE_VERSION}`;
const CACHE_RUNTIME = `apya-runtime-${CACHE_VERSION}`;

/* Precache: dashboard'un mutlak gereksinimleri. Eksik dosya install'u BAŞARISIZ
   yapar (atomic) — eski SW aktif kalır. */
const SHELL_URLS = [
    '/manifest.webmanifest',
    '/brand/icon-192.png',
    '/brand/notification-badge.png',
];

/* Kimlik route'ları — SW bunlara dokunmaz (gerekçe: baştaki açıklama).
   Yol karşılaştırması küçük harfe indirilir: ASP.NET routing büyük/küçük harfe
   duyarsızdır, "/account/login" de aynı sayfayı açar. */
const AUTH_PATH_PREFIXES = ['/account/', '/connect/'];

function isAuthRoute(pathname) {
    const path = pathname.toLowerCase();
    return AUTH_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
}

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

        /* Bu düzeltmeden ÖNCEKİ sürümlerin önbelleğe aldığı kimlik sayfalarını at.
           Yeni kod oraya zaten bakmıyor; amaç zehirli kopyayı depoda bırakmamak.
           CACHE_VERSION bump'ı yerine hedefli temizlik: tüm asset önbelleğini
           silip herkese gereksiz bir yeniden indirme yüklemesin. */
        const runtime = await caches.open(CACHE_RUNTIME);
        const staleAuth = (await runtime.keys())
            .filter((request) => isAuthRoute(new URL(request.url).pathname));
        await Promise.all(staleAuth.map((request) => runtime.delete(request)));

        await self.clients.claim();
    })());
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return; /* cross-origin'i bypass'la */

    if (url.pathname.startsWith('/js/') || url.pathname.startsWith('/icons/') || url.pathname.startsWith('/brand/') ||
        url.pathname === '/manifest.webmanifest' || url.pathname.endsWith('.css')) {
        event.respondWith(staleWhileRevalidate(event, CACHE_ASSETS));
        return;
    }

    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkOnly(req));
        return;
    }

    if (req.mode === 'navigate') {
        /* respondWith ÇAĞIRMIYORUZ → istek doğrudan ağa gider, SW aradan çekilir.
           Böylece login sayfası ne önbellekten okunur ne önbelleğe yazılır. */
        if (isAuthRoute(url.pathname)) return;

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

/* --- Push notification (NTF-08 Faz 2) --------------------------------------
   Abonelik notification-bell.js'te kurulur (kullanıcı masaüstü bildirimine izin
   verip bu cihazda açık bıraktıysa); sunucu WebPushNotificationHandler →
   WebPushJob → WebPushSender zinciriyle gönderir. Gövde YALNIZ BAŞLIK taşır
   (WebPushPayload): `body` alanı gelmez, ayrıntı uygulama içindedir.
   Sayfa AÇIKKEN masaüstü bildirimi buraya gerek duymuyor; onu SignalR olayından
   notification-bell.js gösteriyor.

   Sunucu payload sözleşmesi, çekirdek bildirimle AYNI alan adlarını kullanır
   (SignalRNotificationEventHandler ile aynı sözlük):
     { notificationId, title, body, tag, severity, url }
   `severity` sayıdır — Domain.Shared/NotificationSeverity: Info=1 … Critical=4.

   Tarihçe: burada bir onay/red aksiyon sözleşmesi vardı (`payload.approval`,
   `actions: [approve, reject]`, `POST /api/app/approvals/{id}/{action}`).
   O uçlar kod tabanında HİÇ VAR OLMADI ve `?approval=` derin linkini okuyan
   istemci de yok; abonelik açıldığı gün kullanıcıya 404 üreten düğme
   göstereceği için çıkarıldı. Bildirim üzerinden onay istenirse ayrı bir iş
   olarak, uçlarıyla birlikte planlanır. */

const SEVERITY_HIGH = 3;
const SEVERITY_CRITICAL = 4;

self.addEventListener('push', (event) => {
    if (!event.data) return;
    let payload = {};
    try { payload = event.data.json(); } catch (_) { payload = { title: 'Apya', body: event.data.text() }; }

    event.waitUntil(showPushNotification(payload));
});

/* Uygulama gözün önündeyse bildirim GÖSTERİLMEZ: aynı olay SignalR üzerinden
   zaten geldi, sayfa anlık uyarı + zil rozetiyle söyledi. Bu karar bilinçli
   olarak sunucudaki bir "presence" kaydına bırakılmadı — sunucu soketin açık
   olduğunu bilir, sekmenin GÖRÜNÜR olduğunu bilmez; bunu yalnız burası bilir
   (ve çoklu sunucu örneğinde de doğru kalır).
   Kritik bildirim istisnadır: sessize alınmaz. */
/* N-02 · Bastırma yalnız uygulama ODAKTAYKEN: kullanıcı o an uygulamaya bakıyorsa olay zaten
   SignalR balonuyla ve zil sayacıyla geldi. Eskiden "görünür" (visibilityState) yetiyordu: başka bir
   uygulamanın arkasında kalan ya da ikinci ekrandaki görünür pencere bildirimi tamamen yutuyordu. */
async function showPushNotification(payload) {
    const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const isFocused = clientList.some((client) => client.focused);

    if (isFocused && payload.severity !== SEVERITY_CRITICAL) return;

    const important = (payload.severity || 0) >= SEVERITY_HIGH;
    const tag = payload.tag || (payload.notificationId ? `apya-${payload.notificationId}` : undefined);

    await self.registration.showNotification(payload.title || 'Apya', {
        body: payload.body,
        /* icon: renkli uygulama ikonu. badge: Android yalnız saydamlığı okur (tek renk siluet),
           renkli ikon orada içi dolu bir kare olarak görünür → ayrı beyaz mikro işaret. */
        icon: '/brand/icon-192.png',
        badge: '/brand/notification-badge.png',
        /* Aynı tag → mevcut bildirim güncellenir, yığılmaz. Gruplanan bildirimin tekrarı (ikinci yorum,
           ikinci mesaj) AYNI tag'le gelir; renotify olmadan sessizce üzerine yazılıyordu (N-02). */
        tag,
        renotify: Boolean(tag),
        /* Önemli (Yüksek/Kritik) bildirim kullanıcı kapatana dek ekranda kalır ve titreşir (telefon). */
        requireInteraction: important,
        vibrate: important ? [200, 100, 200] : undefined,
        data: { url: payload.url || '/Dashboard' },
    });
}

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    /* Aynı adresi taşıyan pencere varsa odakla, yoksa yeni pencere aç.
       Adres sunucuda türetilir (NotificationTypeRegistry.BuildDeepLink) —
       service worker tür→adres kuralını ikinci kez bilmek zorunda değil. */
    const url = event.notification.data?.url || '/Dashboard';
    event.waitUntil((async () => {
        const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const c of clientList) {
            if (c.url.includes(url) && 'focus' in c) return c.focus();
        }
        /* N-02 · Uygulama açık ama başka sayfadaysa o pencere kayda götürülür (yeni sekme yığılmaz);
           pencere bu service worker'ın denetiminde değilse gezinme reddedilir → yeni pencere. */
        for (const c of clientList) {
            if ('navigate' in c) {
                try {
                    const moved = await c.navigate(url);
                    if (moved) return moved.focus();
                } catch (_) { /* denetimsiz pencere */ }
            }
        }
        if (self.clients.openWindow) return self.clients.openWindow(url);
    })());
});
