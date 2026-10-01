import { useCallback, useEffect, useRef, useState } from 'react';
import { scopedStorageKey } from '../../lib/storageScope';
import { isPermanentRejection } from '../../lib/api/permanentRejection';

/**
 * Çevrimdışı kuyruk — bağlantı yokken yapılan değişiklikler kaybolmasın.
 *
 * Tasarım (§8): "Çevrimdışı: değişiklikler kuyrukta, bağlantı gelince gönderilir."
 *
 * Kuyruk localStorage'da tutulur: sekme kapanıp açılsa bile bekleyen taşıma
 * kaybolmaz. Bellekte tutmak, çevrimdışıyken sekmeyi yenileyen kullanıcının
 * işini sessizce silmek olurdu.
 *
 * Kuyruk yalnız TAŞIMA (reschedule) taşır: tamamlama gibi geri alınamaz
 * eylemleri çevrimdışı kuyruğa almak, kullanıcı görmeden uygulanmaları
 * demektir — onlar bağlantı isteyip hata verir.
 */
/* Kiracı + kullanıcıya bağlı: sabit anahtarla sonraki kullanıcı öncekinin taşımalarını
   kendi adına gönderiyordu (bkz. lib/storageScope.js). */
const storageKey = () => scopedStorageKey('apya.calendar.offlineQueue');

function readQueue() {
    try {
        const raw = window.localStorage.getItem(storageKey());
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeQueue(queue) {
    try {
        window.localStorage.setItem(storageKey(), JSON.stringify(queue));
    } catch { /* kota dolu / özel mod: sessizce geç */ }
}

export function useOfflineQueue({ onFlush }) {
    const [isOnline, setIsOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
    const [pendingCount, setPendingCount] = useState(() => readQueue().length);
    const flushing = useRef(false);

    const enqueue = useCallback((entry) => {
        const queue = readQueue();
        /* Aynı öğe için tek kayıt: kullanıcı çevrimdışıyken bir öğeyi üç kez
           taşıdıysa sunucuya SON hâli gitmeli, üç ayrı istek değil. */
        const next = queue.filter((q) => q.key !== entry.key).concat(entry);
        writeQueue(next);
        setPendingCount(next.length);
    }, []);

    const flush = useCallback(async () => {
        if (flushing.current) return;
        const queue = readQueue();
        if (queue.length === 0) return;

        flushing.current = true;
        try {
            const remaining = [];
            for (const entry of queue) {
                try {
                    await onFlush(entry);
                } catch (err) {
                    /* Sunucu kalıcı olarak reddettiyse (yetki, geçersiz tarih) tekrar
                       denemek her sayfa açılışında aynı hatayı üretir — bırakılır; ekran
                       sunucudaki gerçek hâli gösterir. Ağ hatasında, oturum düşmüşken (401)
                       ya da belirteç bayatken (gövdesiz 400) kuyrukta KALIR. */
                    if (!isPermanentRejection(err)) remaining.push(entry);
                }
            }
            writeQueue(remaining);
            setPendingCount(remaining.length);
        } finally {
            flushing.current = false;
        }
    }, [onFlush]);

    useEffect(() => {
        const goOnline = () => { setIsOnline(true); flush(); };
        const goOffline = () => setIsOnline(false);

        window.addEventListener('online', goOnline);
        window.addEventListener('offline', goOffline);

        /* Sayfa çevrimiçi açıldıysa bekleyenleri hemen gönder. */
        if (navigator.onLine) flush();

        return () => {
            window.removeEventListener('online', goOnline);
            window.removeEventListener('offline', goOffline);
        };
    }, [flush]);

    return { isOnline, pendingCount, enqueue, flush };
}
