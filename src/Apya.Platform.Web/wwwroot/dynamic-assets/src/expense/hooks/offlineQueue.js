/**
 * Saha harcama kuyruğu (tasarım 1d) — bağlantı yokken kayıt CİHAZDA durur,
 * bağlantı gelince gönderilir.
 *
 * NEDEN localStorage, IndexedDB değil: kuyrukta tutulan şey birkaç yüz baytlık
 * düz JSON (tutar, tarih, tedarikçi, kalem id'si). IndexedDB'nin asenkron
 * şeması ve sürüm göçü bu yük için gereksiz karmaşıklık. FOTOĞRAF KUYRUĞA
 * GİRMEZ — birkaç MB'lık dosyayı localStorage'a koymak kotayı patlatır ve
 * kaydın tamamını kaybettirir; offline çekilen fişin fotoğrafı gönderilmez,
 * kayıt "belgesiz" olarak oluşur ve eşleştirme ekranından belge bağlanır.
 *
 * ÇİFT KAYIT KORUMASI: her girdinin kendi ürettiği bir clientId'si vardır ve
 * gönderim BAŞARILI olmadan kuyruktan düşmez. Aynı girdi iki kez gönderilirse
 * sunucuda iki gider oluşur — bu yüzden flush() aynı anda tek seferlik çalışır
 * (isFlushing kilidi) ve başarısız girdiyi kuyrukta bırakır.
 */

import { scopedStorageKey } from '../../lib/storageScope';

/* Kuyruk kiracı + kullanıcıya bağlı. Eski kullanıcısız anahtardaki ('apya.expenseQueue.v1')
   kayıtların kime ait olduğu bilinmediği için otomatik gönderilmez; orada durur. */
const KEY_BASE = 'apya.expenseQueue.v1';
const REJECTED_BASE = 'apya.expenseQueue.rejected.v1';
export const queueKey = () => scopedStorageKey(KEY_BASE);
export const rejectedKey = () => scopedStorageKey(REJECTED_BASE);

function read(key = queueKey()) {
    try {
        const raw = window.localStorage.getItem(key);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        // Bozuk/erişilemeyen depo kaydı engellememeli; kuyruk boş sayılır.
        return [];
    }
}

function write(items, key = queueKey()) {
    try {
        window.localStorage.setItem(key, JSON.stringify(items));
        return true;
    } catch {
        // Kota dolu ya da özel pencere: kuyruğa alamadık. Çağıran bunu
        // kullanıcıya SÖYLEMELİ, sessizce yutmamalı.
        return false;
    }
}

function newClientId() {
    // crypto.randomUUID her tarayıcıda yok; zaman + rastgele yeterince benzersiz.
    return 'q_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
}

export const offlineQueue = {
    /** Kuyruktaki kayıtlar (en eski önce). */
    list: read,

    count() {
        return read().length;
    },

    /**
     * Kuyruğa ekler. Depoya yazılamadıysa false döner — çağıran kullanıcıya
     * "kaydedemedik" demeli, "kaydedildi" DEMEMELİ.
     */
    enqueue(payload) {
        const items = read();
        items.push({ clientId: newClientId(), queuedAt: new Date().toISOString(), payload });
        return write(items);
    },

    remove(clientId) {
        write(read().filter(x => x.clientId !== clientId));
    },

    /** Sunucunun kalıcı olarak reddettiği (4xx) kayıtlar — silinmez, ayrı tutulur. */
    rejected() {
        return read(rejectedKey());
    },

    clear() {
        write([]);
    },
};

let isFlushing = false;

/**
 * Kuyruğu sırayla gönderir. AĞ hatasında DURUR: sıradaki kayıtlar da büyük
 * ihtimalle aynı sebepten düşecektir (bağlantı gitti) ve denemeye devam etmek
 * aynı hatayı N kez üretir. Sunucu kaydı KALICI olarak reddettiyse (4xx: doğrulama,
 * yetki) kayıt reddedilenler listesine taşınır ve sıradakilere geçilir — eskiden
 * başta takılı kalıp arkasındaki geçerli kayıtların hiçbirini göndermiyordu.
 *
 * @returns {Promise<{sent:number, failed:number, rejected:number, remaining:number}>}
 */
export async function flushQueue(send) {
    if (isFlushing) { return { sent: 0, failed: 0, remaining: offlineQueue.count() }; }
    isFlushing = true;

    let sent = 0;
    let failed = 0;
    let rejected = 0;
    try {
        for (const item of offlineQueue.list()) {
            try {
                await send(item.payload);
                offlineQueue.remove(item.clientId);
                sent++;
            } catch (err) {
                const status = err?.status;
                if (status >= 400 && status < 500) {
                    write(read(rejectedKey()).concat({ ...item, rejectedAt: new Date().toISOString(), error: err?.message ?? null }), rejectedKey());
                    offlineQueue.remove(item.clientId);
                    rejected++;
                    continue;
                }
                failed++;
                break;
            }
        }
    } finally {
        isFlushing = false;
    }

    return { sent, failed, rejected, remaining: offlineQueue.count() };
}
