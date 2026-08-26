import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

/**
 * react-query önbelleğinin sayfa yüklemeleri arasında yaşaması.
 *
 * Neden gerekli: uygulama Razor Pages üzerinde duruyor, sayfalar arası her geçiş
 * TAM SAYFA YÜKLEMESİ. Bellekteki query cache her geçişte ölüyordu; staleTime
 * (30-60 sn) fiilen hiç işlemiyordu — aynı ekrana ikinci kez girmek ilk kez
 * girmekle aynı maliyeti ödüyordu.
 *
 * NEDEN sessionStorage, localStorage DEĞİL:
 *  - Çözmek istediğimiz sorun tam olarak "aynı sekmede sayfa değiştirince cache
 *    ölüyor"; sessionStorage bunu tamamen çözer, sekme kapanınca temizlenir.
 *  - Kasa/fatura/cari rakamları kullanıcının diskinde KALICI iz bırakmaz.
 *    Ortak kullanılan bir makinede localStorage, oturum kapandıktan sonra da
 *    veriyi tutardı.
 *
 * Güvenlik: buster kullanıcı+kiracıya bağlı. Farklı bir kullanıcı aynı sekmede
 * giriş yaparsa buster değişir ve persist edilmiş önbellek RESTORE EDİLMEZ,
 * silinir. Anonim bağlamda hiç yazılmaz.
 *
 * Bilinen sınır: yayın (deploy) oturum ORTASINDA olursa, DTO şekli değişmiş bir
 * yanıt eski şekliyle bir kare boyunca render edilebilir. staleTime kısa
 * olduğundan hemen arkasından tazeleme gelir; sekme kapanınca da iz kalmaz.
 */

const CACHE_KEY = 'apya-rq-cache';

/** gcTime ile AYNI olmalı — bkz. createApyaQueryClient. */
export const PERSIST_MAX_AGE_MS = 60 * 60 * 1000;

/** sessionStorage gizli sekmede / site verisi kapalıyken ERİŞİMDE fırlatır. */
function usableStorage() {
    try {
        const storage = window.sessionStorage;
        const probe = '__apya_probe__';
        storage.setItem(probe, '1');
        storage.removeItem(probe);
        return storage;
    } catch {
        return null;
    }
}

/**
 * PersistQueryClientProvider'ın persistOptions'ı — kalıcılaştırma mümkün
 * değilse null döner ve çağıran düz QueryClientProvider'a düşer.
 */
export function createApyaPersistOptions() {
    const storage = usableStorage();
    if (!storage) return null;

    const user = typeof window !== 'undefined' ? window.abp?.currentUser : null;
    if (!user?.id) return null;

    return {
        persister: createSyncStoragePersister({
            storage,
            key: CACHE_KEY,
            /* Her mutasyonda değil, saniyede bir yaz — ana iş parçacığını meşgul etme. */
            throttleTime: 1000,
        }),
        maxAge: PERSIST_MAX_AGE_MS,
        buster: `${user.tenantId ?? 'host'}:${user.id}`,
        dehydrateOptions: {
            /* Hatalı ya da yüklenmekte olan sorgu saklanmaz: bir sonraki açılışta
               hata ekranını "önbellekten" göstermenin anlamı yok. */
            shouldDehydrateQuery: (query) => query.state.status === 'success',
        },
    };
}
