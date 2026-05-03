import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * ThemeProvider
 * -----------------------------------------------------------------------------
 * Sorumluluklar:
 *  1) Mevcut tema'yı (`light` | `dark` | `system`) `localStorage`'da tutar.
 *  2) `system` seçilirse `prefers-color-scheme` MediaQuery'ı dinler.
 *  3) `<html data-theme="...">` attribute'unu set eder — Tailwind ve token CSS
 *     bu attribute'a göre dark mode'a girer.
 *  4) FOUC engelleme: ilk render'dan ÖNCE inline script ile data-theme set
 *     edilmeli (bk. _Layout.cshtml veya index.html). Bu component yalnızca
 *     SONRA gelir; yoksa kullanıcı bir flash görür.
 *
 * SSR/MVC notu: ABP Razor sayfalarına entegre edilirken inline-script kuralını
 * `_Layout.cshtml`'e ekle:
 *   <script>
 *     (function () {
 *       try {
 *         var stored = localStorage.getItem('apya-theme');
 *         var prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
 *         var resolved = stored === 'dark' || (stored !== 'light' && prefers) ? 'dark' : 'light';
 *         document.documentElement.setAttribute('data-theme', resolved);
 *       } catch (_) {}
 *     })();
 *   </script>
 */

const STORAGE_KEY = 'apya-theme';   // 'light' | 'dark' | 'system'
const DEFAULT_PREFERENCE = 'system';

const ThemeContext = createContext({
    preference: DEFAULT_PREFERENCE,
    resolvedTheme: 'light',
    setPreference: () => { },
    toggle: () => { },
});

function readStoredPreference() {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCE;
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
            return stored;
        }
    } catch (_) {
        /* localStorage erişimi engellenmişse (private mode, quota) sessizce default'a düş. */
    }
    return DEFAULT_PREFERENCE;
}

function systemPrefersDark() {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolveTheme(preference) {
    if (preference === 'dark') return 'dark';
    if (preference === 'light') return 'light';
    return systemPrefersDark() ? 'dark' : 'light';
}

function applyThemeToDocument(resolved) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-theme', resolved);
    /* Tailwind 'class' fallback — dark mode hem class hem attribute ile çalışır. */
    if (resolved === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
    /* LeptonX class mirror (APYA-100) — Razor sayfalarındaki .card / .table /
       sidebar / topbar Apya theme'i takip eder. */
    root.classList.remove('lpx-theme-light', 'lpx-theme-dark', 'lpx-theme-dim');
    root.classList.add(resolved === 'dark' ? 'lpx-theme-dark' : 'lpx-theme-light');
}

export function ThemeProvider({ children, defaultPreference = DEFAULT_PREFERENCE }) {
    const [preference, setPreferenceState] = useState(() => {
        const stored = readStoredPreference();
        return stored ?? defaultPreference;
    });

    const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(preference));

    /* Preference değişince DOM'a uygula + persist et. */
    const setPreference = useCallback((next) => {
        if (next !== 'light' && next !== 'dark' && next !== 'system') return;
        setPreferenceState(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch (_) { /* storage yoksa devam et */ }
        const resolved = resolveTheme(next);
        setResolvedTheme(resolved);
        applyThemeToDocument(resolved);
    }, []);

    /* `system` seçili iken OS-level değişikliği canlı dinle. */
    useEffect(() => {
        if (preference !== 'system' || typeof window === 'undefined' || !window.matchMedia) {
            return undefined;
        }
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handle = () => {
            const next = systemPrefersDark() ? 'dark' : 'light';
            setResolvedTheme(next);
            applyThemeToDocument(next);
        };
        mq.addEventListener('change', handle);
        return () => mq.removeEventListener('change', handle);
    }, [preference]);

    /* Mount sırasında ilk uygulamayı yap — FOUC inline script yoksa fallback. */
    useEffect(() => {
        applyThemeToDocument(resolveTheme(preference));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggle = useCallback(() => {
        /* Toggle siklik: light → dark → system → light. UX olarak basit ama
           "system" seçeneğini erişilebilir tutar. Power user'a açık. */
        const order = ['light', 'dark', 'system'];
        const currentIndex = order.indexOf(preference);
        const next = order[(currentIndex + 1) % order.length];
        setPreference(next);
    }, [preference, setPreference]);

    const value = useMemo(
        () => ({ preference, resolvedTheme, setPreference, toggle }),
        [preference, resolvedTheme, setPreference, toggle],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * useTheme — preference (kullanıcı tercihi) ve resolvedTheme (gerçek aktif tema)
 * ayrı ayrı dönülür; component'ler genelde resolvedTheme'e bakar.
 */
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error('useTheme must be used inside a <ThemeProvider>.');
    }
    return ctx;
}
