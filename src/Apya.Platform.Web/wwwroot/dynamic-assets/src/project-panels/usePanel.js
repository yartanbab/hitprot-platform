import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Panel sekmesi İLK kez gösterildi mi — TEMBEL yüklemenin anahtarı.
 * ProjectDetails.js switchView her panel açılışında `apya:project-panel-shown`
 * yayınlar; kök yalnız kendi kind'ını dinler. Derin bağlantıda panel mount
 * anında zaten görünür olabilir → d-none yokluğu da "gösterildi" sayılır.
 * Bir kez true olunca bir daha dinlenmez (veri tazeleme reload()'un işi).
 */
export function usePanelShown(kind, mountEl) {
    const [shown, setShown] = useState(
        () => !!mountEl && !mountEl.classList.contains('d-none'),
    );

    useEffect(() => {
        if (shown) return undefined;
        const onShown = (e) => { if (e?.detail?.kind === kind) setShown(true); };
        document.addEventListener('apya:project-panel-shown', onShown);
        return () => document.removeEventListener('apya:project-panel-shown', onShown);
    }, [kind, shown]);

    return shown;
}

/**
 * Basit async veri kancası — React Query BİLEREK yok (documents-project
 * island'ıyla aynı sadelik): enabled olana dek beklemede, yazma sonrası
 * reload() ile tazelenir (eşzamanlılık kuralı: son yazan kazanır + yazma
 * sonrası tazele).
 */
export function useAsyncData(fetcher, enabled) {
    const [state, setState] = useState({ status: 'idle', data: null, error: null });
    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;

    const reload = useCallback(() => {
        setState((s) => ({ ...s, status: s.data ? 'reloading' : 'loading', error: null }));
        return fetcherRef.current().then(
            (data) => setState({ status: 'ready', data, error: null }),
            (error) => setState({ status: 'error', data: null, error }),
        );
    }, []);

    useEffect(() => {
        if (enabled && state.status === 'idle') { reload(); }
    }, [enabled, state.status, reload]);

    return { ...state, reload };
}
