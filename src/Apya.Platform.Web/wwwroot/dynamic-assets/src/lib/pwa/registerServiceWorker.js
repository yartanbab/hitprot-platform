/**
 * registerServiceWorker
 * - SW destekleniyor mu kontrol eder
 * - /sw.js'i scope='/' ile register eder
 * - Update bulunursa onUpdate callback'ini çağırır (UI'a "yeni sürüm var,
 *   yenile" toast'i göstermesi için).
 *
 * Auto-install banner (beforeinstallprompt) yakalanır; deferred prompt
 * `window.__apyaInstallPrompt` üzerinden UI'a sunulur (kullanıcı 2. ziyarette
 * "Ana ekrana ekle" butonuna basınca tetiklenir — saldırgan değil).
 */
export function registerServiceWorker({ onUpdate, onReady } = {}) {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return;
    }

    /* beforeinstallprompt — Chrome/Edge install promptunu yakala, deferred et */
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window.__apyaInstallPrompt = e;
    });

    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

            if (registration.waiting) {
                onUpdate?.(registration);
            }

            registration.addEventListener('updatefound', () => {
                const installing = registration.installing;
                if (!installing) return;
                installing.addEventListener('statechange', () => {
                    if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                        onUpdate?.(registration);
                    } else if (installing.state === 'activated') {
                        onReady?.(registration);
                    }
                });
            });

            onReady?.(registration);
        } catch (err) {
            console.warn('[SW] register failed:', err?.message);
        }
    });
}

/**
 * Bekleyen SW'ı aktive et — kullanıcı "Yenile" butonuna basınca çağrılır.
 * controllerchange sonrası sayfa reload edilir.
 */
export function activatePendingServiceWorker(registration) {
    if (!registration?.waiting) return;
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
    });
}
