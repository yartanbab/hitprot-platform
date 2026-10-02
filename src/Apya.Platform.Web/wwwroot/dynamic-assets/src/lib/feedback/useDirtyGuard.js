import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useDirtyGuard — kaydedilmemiş değişiklik koruması (görev detayı V3/v2, Dokümanlar).
 *
 * Bütün çıkış yolları (✕, Esc, arka plan, "Vazgeç", başka göreve/belgeye/sekmeye geçiş)
 * requestClose'dan geçer; hiçbiri eylemi doğrudan çalıştırmaz. Temizken eylem hemen
 * çalışır; kirliyken saklanır ve `pendingClose` true olur.
 *
 * SÖZLEŞME — hook'u kullanan bileşen pencereyi ÇİZMEK ZORUNDADIR:
 *   <UnsavedChangesDialog open={guard.pendingClose} … />   (components/ui)
 * Çizmezse kirli formda her çıkış sessizce yutulur (CON-01). Kilit: dirtyGuard.wiring.test.js.
 *
 * Pencerenin yanıtı resolvePendingClose ile bildirilir:
 *   'stay'    → hiçbir şey olmaz, kirli kalır.
 *   'discard' → bekleyen eylem çalışır. Çağıran KENDİ formunu da temizler (ör. form.reset());
 *               yoksa kirli bayrağını eşitleyen effect korumayı yeniden kirletir.
 *   'saved'   → çağıran kaydı BAŞARIYLA bitirdikten sonra çağırır; bekleyen eylem çalışır.
 *               Hook kaydetmez: kayıt eşzamansızdır ve düşebilir — düşerse pencere açık kalır.
 *
 * lib/feedback/index.js'ten dışa aktarılmaz (Toast'u çekmesin); dosya yolundan içe aktarılır.
 */
export function useDirtyGuard() {
    const [isDirty, setIsDirty] = useState(false);
    const [pendingClose, setPendingClose] = useState(false);
    const pendingCloseFn = useRef(null);
    /* Pencere açık mı — state'in yanında ref: aynı render içinde gelen ikinci istek de görsün. */
    const isPendingRef = useRef(false);
    /* Kullanıcı ayrılmayı seçti ('discard' / 'saved'). Sayfa sunumunda bekleyen eylem
       history.back() / location'dır ve React yeniden çizmeden koşar: beforeunload
       dinleyicisi hâlâ bağlıdır, bayrak olmasa tarayıcı ikinci kez sorardı. */
    const leavingRef = useRef(false);

    const markDirty = useCallback(() => setIsDirty(true), []);
    const markClean = useCallback(() => {
        leavingRef.current = false;
        setIsDirty(false);
    }, []);

    /* Sekme kapatma / yenileme — tarayıcının kendi uyarısı. Yalnız kirliyken
       bağlanır; sürekli bağlı kalırsa bazı tarayıcılar bfcache'i devre dışı bırakır. */
    useEffect(() => {
        if (!isDirty) return undefined;
        const handler = (e) => {
            /* Oturum penceresinde "Giriş sayfasına git" (apya.dirtyGuard.allowUnload):
               pencere kaybı zaten söyledi, tarayıcı ikinci kez sormaz. Ortak koruma o
               sayfada yüklü olmayabilir → isteğe bağlı zincir. */
            if (leavingRef.current || window.apya?.dirtyGuard?.isUnloadAllowed?.()) return;
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [isDirty]);

    const requestClose = useCallback((onClose) => {
        if (!isDirty) {
            onClose?.();
            return;
        }
        /* Pencere açıkken gelen ikinci istek yok sayılır: İLK bekleyen eylem korunur
           (pencereye geçen odak alttaki modalda "dışarı etkileşim" üretir; o istek
           bekleyen "göreve geç" eylemini "kapat" ile ezmesin). */
        if (isPendingRef.current) return;
        isPendingRef.current = true;
        pendingCloseFn.current = onClose ?? null;
        setPendingClose(true);
    }, [isDirty]);

    const resolvePendingClose = useCallback((action) => {
        if (!isPendingRef.current) return;
        isPendingRef.current = false;
        const onClose = pendingCloseFn.current;
        pendingCloseFn.current = null;
        setPendingClose(false);

        if (action === 'discard' || action === 'saved') {
            leavingRef.current = true;
            setIsDirty(false);
            onClose?.();
        }
        /* 'stay' → hiçbir şey yapma, kirli kal. */
    }, []);

    return { isDirty, markDirty, markClean, requestClose, pendingClose, resolvePendingClose };
}
