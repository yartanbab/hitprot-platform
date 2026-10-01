import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Veri-değişti köprüsü — React tarafı.
 *
 * Sözleşme wwwroot/js/apya-data-changed.js (global demet) ile AYNIDIR; iki sabit
 * src/test/apyaDataChanged.test.js ile birebir kilitli:
 *  - document üzerinde CustomEvent('apya:data-changed', { detail: { entity, ids?, action? } })
 *  - sessionStorage['apya-data-changed-at'] = son yazmanın zamanı (ms); sayfalar
 *    arası kalıcı önbellek (QueryProvider restore'u) bu damgaya bakar.
 * jQuery sayfaları yayınlar ama dinlemez; buradaki dinleyiciler yeniden
 * YAYINLAMAZ — döngü olmasın.
 *
 * Kapsam (isTaskDerivedQuery) BİLEREK dar:
 *  - ['task-detail', …] ve ['task-predecessors', …] YOK: rebase olmadan refetch
 *    açık formu kirletir; görev detayının tazeliği kendi politikasında
 *    (meta.persist:false + staleTime 0, bkz. queryPersister.js).
 *  - Dış takvim ve iCal (['calendar','external'] — Google/Outlook çağrısı) ile
 *    lookup'lar YOK: görev yazmasından türemezler, çağrıları pahalı.
 *  - Pano düzeni (['dashboard','layout']) YOK: görev verisi değil.
 */
export const DATA_CHANGED_EVENT = 'apya:data-changed';
export const DATA_CHANGED_STAMP_KEY = 'apya-data-changed-at';

/** Yalnız damga yazar. Kendi mutasyonunu zaten geçersizleyen ada kullanır;
 *  olay yayınlasa aynı ekran ikinci kez çekerdi. */
export function markDataChanged() {
    try { window.sessionStorage.setItem(DATA_CHANGED_STAMP_KEY, String(Date.now())); } catch { /* gizli sekme */ }
}

/** Damga + sayfa içi olay. */
export function emitDataChanged(detail = {}) {
    markDataChanged();
    document.dispatchEvent(new CustomEvent(DATA_CHANGED_EVENT, { detail }));
}

/** entity verilmişse yalnız detail.entity eşleşince çağırır. Abonelikten çıkma fonksiyonu döner. */
export function onDataChanged(handler, entity) {
    const listener = (e) => {
        const detail = e?.detail ?? {};
        if (entity && detail.entity !== entity) return;
        handler(detail);
    };
    document.addEventListener(DATA_CHANGED_EVENT, listener);
    return () => document.removeEventListener(DATA_CHANGED_EVENT, listener);
}

/** Görev yazmasından türeyen sorgu mu: Pano bölümleri (düzen hariç), takvim akışı ve ekip yükü. */
export function isTaskDerivedQuery(queryKey) {
    const [root, part] = queryKey ?? [];
    if (root === 'dashboard') return part !== 'layout';
    return root === 'calendar' && (part === 'feed' || part === 'team-load');
}

function lastChangeAt() {
    try { return Number(window.sessionStorage.getItem(DATA_CHANGED_STAMP_KEY)) || 0; } catch { return 0; }
}

/** Restore sonrası: son yazmadan ESKİ görev türevi sorguları bayat işaretler
 *  (ilk kare önbellekten gelir, abone olunca tazelenir). Damga yoksa dokunmaz. */
export function invalidateOlderThanLastChange(queryClient) {
    const since = lastChangeAt();
    if (!since) return;
    queryClient.invalidateQueries({
        predicate: (q) => isTaskDerivedQuery(q.queryKey) && q.state.dataUpdatedAt < since,
    });
}

/** Sayfa içi: görev olayı gelince görev türevi sorguları geçersizler (takvim ve Pano ortak). */
export function useInvalidateTaskDerivedOnChange() {
    const queryClient = useQueryClient();
    useEffect(() => onDataChanged(() => {
        queryClient.invalidateQueries({ predicate: (q) => isTaskDerivedQuery(q.queryKey) });
    }, 'task'), [queryClient]);
}
