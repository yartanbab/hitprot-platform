import { useCallback, useEffect, useRef, useState } from 'react';
import { onDataChanged } from '../lib/api/dataChanged';

/**
 * Panel sekmesi İLK kez gösterildi mi — TEMBEL yüklemenin anahtarı.
 * ProjectDetails.js switchView her panel açılışında `apya:project-panel-shown`
 * yayınlar; kök yalnız kendi kind'ını dinler. Derin bağlantıda panel mount
 * anında zaten görünür olabilir → d-none yokluğu da "gösterildi" sayılır.
 * Bir kez true olunca bir daha dinlenmez (veri tazeleme reload()'un işi
 * → sonraki gösterimler ve görev değişikliği: usePanelRefresh).
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
 * refresh() arka plan tazelemesidir (usePanelRefresh): veri varken hata olursa
 * eldeki veri KORUNUR — açık belge düzenleyicisi hata ekranına dönmesin.
 * İkisinde de son istek kazanır: geç dönen eski yanıt ekrana yazılmaz.
 */
export function useAsyncData(fetcher, enabled) {
    const [state, setState] = useState({ status: 'idle', data: null, error: null });
    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;
    const lastRun = useRef(0);

    const run = useCallback((keepDataOnError) => {
        const mine = ++lastRun.current;
        setState((s) => ({ ...s, status: s.data ? 'reloading' : 'loading', error: null }));
        return fetcherRef.current().then(
            (data) => { if (mine === lastRun.current) setState({ status: 'ready', data, error: null }); },
            (error) => {
                if (mine !== lastRun.current) return;
                setState((s) => (keepDataOnError && s.data
                    ? { status: 'ready', data: s.data, error: null }
                    : { status: 'error', data: null, error }));
            },
        );
    }, []);

    const reload = useCallback(() => run(false), [run]);
    const refresh = useCallback(() => run(true), [run]);

    useEffect(() => {
        if (enabled && state.status === 'idle') { reload(); }
    }, [enabled, state.status, reload]);

    return { ...state, reload, refresh };
}

/**
 * Yüklenmiş paneli arka planda tazeler (status 'reloading', veri ekranda kalır):
 *  - panel yeniden gösterilince (`apya:project-panel-shown`, kendi kind'ı),
 *  - görev değişince (`apya:data-changed`, entity 'task') — YALNIZ görünürse;
 *    gizli panel boşuna istek atmaz, gösterildiğinde tazelenir.
 * Aynı tick'teki olaylar (ör. reloadAll'un panel-shown + data-changed'i) tek
 * isteğe iner. İlk yükleme bitmeden tetiklenmez.
 */
export function usePanelRefresh(kind, mountEl, panel) {
    const loaded = ['ready', 'reloading', 'error'].includes(panel.status);
    const { refresh } = panel;

    useEffect(() => {
        if (!loaded) return undefined;
        let timer = null;
        const schedule = () => {
            if (timer !== null) return;
            timer = setTimeout(() => { timer = null; refresh(); }, 0);
        };
        const onShown = (e) => { if (e?.detail?.kind === kind) schedule(); };
        document.addEventListener('apya:project-panel-shown', onShown);
        const offChanged = onDataChanged(() => {
            if (!mountEl || !mountEl.classList.contains('d-none')) schedule();
        }, 'task');
        return () => {
            if (timer !== null) clearTimeout(timer);
            document.removeEventListener('apya:project-panel-shown', onShown);
            offChanged();
        };
    }, [kind, mountEl, loaded, refresh]);
}
