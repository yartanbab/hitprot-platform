/**
 * react-query oturum önbelleğinin (sessionStorage) anahtarı ve yazma aralığı — BAĞIMLILIKSIZ.
 *
 * Neden queryPersister.js'te değil: o dosya @tanstack/query-sync-storage-persister'ı içe
 * aktarır (query-vendor parçası). Ada hata sınırı (components/ui/IslandErrorBoundary.jsx)
 * TÜM adalara girer; anahtarı oradan alsaydı react-query kullanmayan adalar (cari, formlar,
 * form oluşturucu, yanıtlar, herkese açık form) da query-vendor'u yüklerdi. Anahtar ve yazma
 * aralığı tek kaynakta: biri değişirse sınırın sildiği anahtar kaymasın.
 */

export const QUERY_CACHE_STORAGE_KEY = 'apya-rq-cache';

/** Kalıcılaştırıcının kısıt süresi (throttleTime): son önbellek olayından en geç bu kadar sonra yazar. */
export const PERSIST_THROTTLE_MS = 1000;

/** Oturum önbelleğini siler. Gizli sekmede / site verisi kapalıyken erişim fırlatır: sessizce geçilir. */
export function clearPersistedQueryCache() {
    try {
        window.sessionStorage.removeItem(QUERY_CACHE_STORAGE_KEY);
    } catch {
        /* depolama kapalı: silinecek önbellek de yok */
    }
}
