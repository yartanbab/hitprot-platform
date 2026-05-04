import React, { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from 'react';

/**
 * Device mode — semantic kullanım modu, fiziksel breakpoint değil.
 *
 *   decision  : 0–767px      → tek karar, tek CTA (mobile)
 *   triage    : 768–1279px   → liste + detay (tablet)
 *   analysis  : 1280–1919px  → çoklu panel (desktop)
 *   command   : ≥1920px      → çoklu pano, kilitlenebilir (wide)
 *
 * Sınırlar tailwind.config.js'teki `screens` ile bilerek hizalı tutulmuştur.
 * İkisini birden değiştirirken senkron kalmak zorunlu.
 */
const QUERIES = {
    triage:   '(min-width: 768px)',
    analysis: '(min-width: 1280px)',
    command:  '(min-width: 1920px)',
};

const ORDER = ['decision', 'triage', 'analysis', 'command'];

function resolveMode() {
    /* SSR / pre-hydration safe default. ABP Razor sayfası React-island
       mount edene kadar `analysis` varsayılır — bizim primary surface.
       Hydration'da useSyncExternalStore tek render'da düzeltir. */
    if (typeof window === 'undefined' || !window.matchMedia) return 'analysis';
    if (window.matchMedia(QUERIES.command).matches)  return 'command';
    if (window.matchMedia(QUERIES.analysis).matches) return 'analysis';
    if (window.matchMedia(QUERIES.triage).matches)   return 'triage';
    return 'decision';
}

const DeviceModeContext = createContext(null);

/**
 * DeviceModeProvider — tek matchMedia listener, tüm tree'ye dağıtır.
 *
 * `override` prop'u test/storybook için: belirli bir mod zorlanmak istendiğinde
 * gerçek breakpoint'i bypass eder. Production'da set edilmemeli.
 */
export function DeviceModeProvider({ children, override }) {
    const subscribe = useCallback((cb) => {
        if (typeof window === 'undefined' || !window.matchMedia) return () => {};
        const mqls = Object.values(QUERIES).map((q) => window.matchMedia(q));
        mqls.forEach((m) => m.addEventListener('change', cb));
        return () => mqls.forEach((m) => m.removeEventListener('change', cb));
    }, []);

    /* useSyncExternalStore — resize event'inden hafif, concurrent-safe.
       getServerSnapshot ile React strict-mode warning'leri susturulur. */
    const detected = useSyncExternalStore(subscribe, resolveMode, () => 'analysis');
    const mode = override ?? detected;

    /* CSS cascade'ine de yay — `[data-device-mode="decision"] .x { ... }`
       ile JS okumadan stil branchleyebilelim. */
    useEffect(() => {
        if (typeof document === 'undefined') return;
        document.documentElement.dataset.deviceMode = mode;
    }, [mode]);

    return <DeviceModeContext.Provider value={mode}>{children}</DeviceModeContext.Provider>;
}

export function useDeviceMode() {
    const ctx = useContext(DeviceModeContext);
    if (ctx === null) {
        throw new Error('useDeviceMode must be used within <DeviceModeProvider>.');
    }
    return ctx;
}

/** "En azından şu mod" — örn. analysis veya command'da split-view göster. */
export function useIsAtLeast(mode) {
    return ORDER.indexOf(useDeviceMode()) >= ORDER.indexOf(mode);
}

/** "En fazla şu mod" — örn. triage ve altında bottom-sheet kullan. */
export function useIsAtMost(mode) {
    return ORDER.indexOf(useDeviceMode()) <= ORDER.indexOf(mode);
}

export const DEVICE_MODES = ORDER;
