import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useDirtyGuard — kaydedilmemiş değişiklik koruması.
 *
 * Üç çıkış yolu da (✕ butonu, ESC, backdrop) requestClose'dan geçer; hiçbiri
 * doğrudan onClose çağırmaz. Bu, "kaydetmeden çıkış yapılamaz" şartının tek
 * uygulama noktası olmasını sağlar.
 *
 * `save` aksiyonu burada kaydetmez — çağıran tarafın kaydedip sonra
 * markClean() + onClose() çağırması beklenir (kaydetme async ve hata verebilir).
 */
export function useDirtyGuard() {
    const [isDirty, setIsDirty] = useState(false);
    const [pendingClose, setPendingClose] = useState(false);
    const pendingCloseFn = useRef(null);

    const markDirty = useCallback(() => setIsDirty(true), []);
    const markClean = useCallback(() => setIsDirty(false), []);

    /* Sekme kapatma / yenileme — tarayıcının kendi uyarısı. Yalnız kirliyken
       bağlanır; sürekli bağlı kalırsa bazı tarayıcılar bfcache'i devre dışı bırakır. */
    useEffect(() => {
        if (!isDirty) return undefined;
        const handler = (e) => {
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
        pendingCloseFn.current = onClose ?? null;
        setPendingClose(true);
    }, [isDirty]);

    const resolvePendingClose = useCallback((action) => {
        const onClose = pendingCloseFn.current;
        setPendingClose(false);
        pendingCloseFn.current = null;

        if (action === 'discard') {
            setIsDirty(false);
            onClose?.();
        }
        /* 'stay' → hiçbir şey yapma, kirli kal.
           'save' → çağıran kaydeder; başarılı olursa markClean()+onClose() çağırır. */
        return action === 'save' ? onClose : null;
    }, []);

    return { isDirty, markDirty, markClean, requestClose, pendingClose, resolvePendingClose };
}
