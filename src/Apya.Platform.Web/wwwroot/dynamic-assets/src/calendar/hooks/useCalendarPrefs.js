import { useCallback, useEffect, useState } from 'react';
import { SOURCE_ORDER } from '../lib/model';

/**
 * Görünüm ve kaynak tercihleri.
 *
 * İki katman: query string PAYLAŞILABİLİR durumdur (birine link atınca aynı
 * görünüm açılır), localStorage ise CİHAZ hafızasıdır. Okuma sırası
 * query > localStorage > varsayılan; kullanıcı değiştirince ikisi de yazılır.
 * (Projeler konsolundaki liste ⇄ kart anahtarıyla aynı ray.)
 */

const VIEW_KEY = 'apya.calendar.view';
const SOURCES_KEY = 'apya.calendar.sources';

export const VIEWS = ['month', 'agenda'];

function readStorage(key) {
    try { return window.localStorage.getItem(key); } catch { return null; }
}

function writeStorage(key, value) {
    try { window.localStorage.setItem(key, value); } catch { /* özel mod: sessizce geç */ }
}

/** Kullanıcının açık bir tercihi var mı? Varsa duyarlı varsayılan onu EZMEZ. */
function explicitView() {
    const fromQuery = new URLSearchParams(window.location.search).get('view');
    if (VIEWS.includes(fromQuery)) return fromQuery;
    const stored = readStorage(VIEW_KEY);
    return VIEWS.includes(stored) ? stored : null;
}

function initialSources() {
    const stored = readStorage(SOURCES_KEY);
    if (!stored) return new Set(SOURCE_ORDER);
    const parsed = stored.split(',').map(Number).filter((n) => SOURCE_ORDER.includes(n));
    /* Boş liste "hiçbir kaynak" demek DEĞİL, bozuk kayıt demektir: hepsi açılır. */
    return parsed.length ? new Set(parsed) : new Set(SOURCE_ORDER);
}

export function useCalendarPrefs({ defaultView = 'month' } = {}) {
    const [explicit] = useState(explicitView);
    const [view, setViewState] = useState(() => explicit ?? defaultView);
    const [enabledSources, setEnabledSources] = useState(initialSources);

    /* Görünüm URL'e yazılır ama GEÇMİŞE yığılmaz: geri tuşu takvimde tur atmaz. */
    useEffect(() => {
        const url = new URL(window.location.href);
        if (url.searchParams.get('view') === view) return;
        url.searchParams.set('view', view);
        window.history.replaceState({}, '', url);
    }, [view]);

    const setView = useCallback((next) => {
        if (!VIEWS.includes(next)) return;
        setViewState(next);
        writeStorage(VIEW_KEY, next);
    }, []);

    const toggleSource = useCallback((source) => {
        setEnabledSources((prev) => {
            const next = new Set(prev);
            if (next.has(source)) next.delete(source); else next.add(source);
            writeStorage(SOURCES_KEY, [...next].join(','));
            return next;
        });
    }, []);

    /**
     * Duyarlı varsayılan — kap ÖLÇÜLDÜKTEN sonra uygulanır.
     * İlk render'da kap genişliği bilinmez (0), bu yüzden "dar ekranda ajanda"
     * kuralı useState başlangıcında karara bağlanamaz. Kullanıcının açık tercihi
     * varsa dokunulmaz ve localStorage'a YAZILMAZ: ekran genişliği bir tercih değil,
     * o andaki bağlamdır.
     */
    const applyResponsiveDefault = useCallback((next) => {
        if (explicit) return;
        if (!VIEWS.includes(next)) return;
        setViewState((current) => (current === next ? current : next));
    }, [explicit]);

    const resetSources = useCallback(() => {
        const all = new Set(SOURCE_ORDER);
        setEnabledSources(all);
        writeStorage(SOURCES_KEY, [...all].join(','));
    }, []);

    return { view, setView, applyResponsiveDefault, enabledSources, toggleSource, resetSources };
}
