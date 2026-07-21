/**
 * Persona-default Bento layouts.
 *
 * Her persona için 3 breakpoint (desktop/tablet/mobile) layout'u.
 * react-grid-layout `layouts` prop formatı: { [breakpoint]: ItemLayout[] }.
 *
 * Layout item shape:
 *   { i: widgetId, x, y, w, h, minW, minH, isResizable }
 *
 * Layout filozofi (UX strategy doc § 2):
 *   - Persona en kritik soruya cevap veren widget'ı sol-üste koyar
 *     (kullanıcı ilk dikkati buraya).
 *   - Hiyerarşi: kritik karar > skannable detay > arka plan info.
 *   - Mobile'da 1-col stack, drag/resize KAPALI (küçük ekranda anlamsız).
 */

/* ===== CFO / Finansman persona =====
 * kpi-strip + income-expense: prototip uyumu (HANDOFF §Dashboard "4 KPI
 * kartı" + "Gelir/Gider grouped bar") eklendi (P4 hibrit karar — persona
 * switcher korunur, YALNIZ CFO görünümüne prototip widget'ları eklenir). */
const cfoLayout = {
    desktop: [
        { i: 'kpi-strip',         x: 0, y: 0,  w: 12, h: 2, minW: 8, minH: 2, isResizable: false },
        { i: 'budget-health',     x: 0, y: 2,  w: 6, h: 4, minW: 4, minH: 3 },
        { i: 'cash-flow',         x: 6, y: 2,  w: 6, h: 2, minW: 4, minH: 2 },
        { i: 'income-expense',    x: 6, y: 4,  w: 6, h: 2, minW: 4, minH: 2 },
        { i: 'risk-alerts',       x: 6, y: 6,  w: 6, h: 4, minW: 4, minH: 3 },
        { i: 'pending-approvals', x: 0, y: 6,  w: 6, h: 4, minW: 4, minH: 3 },
        /* AI inbox tam genişlik altta — sessiz feed, kullanıcı iner görür. */
        { i: 'ai-suggestions',    x: 0, y: 10, w: 12, h: 4, minW: 6, minH: 3 },
    ],
    tablet: [
        { i: 'kpi-strip',         x: 0, y: 0,  w: 8, h: 2, minW: 6, minH: 2, isResizable: false },
        { i: 'budget-health',     x: 0, y: 2,  w: 8, h: 4, minW: 4, minH: 3 },
        { i: 'cash-flow',         x: 0, y: 6,  w: 8, h: 2, minW: 4, minH: 2 },
        { i: 'income-expense',    x: 0, y: 8,  w: 8, h: 2, minW: 4, minH: 2 },
        { i: 'risk-alerts',       x: 0, y: 10, w: 8, h: 4, minW: 4, minH: 3 },
        { i: 'pending-approvals', x: 0, y: 14, w: 8, h: 4, minW: 4, minH: 3 },
        { i: 'ai-suggestions',    x: 0, y: 18, w: 8, h: 4, minW: 4, minH: 3 },
    ],
    mobile: [
        { i: 'kpi-strip',         x: 0, y: 0,  w: 1, h: 4, isResizable: false, isDraggable: false },
        { i: 'budget-health',     x: 0, y: 4,  w: 1, h: 4, isResizable: false, isDraggable: false },
        { i: 'cash-flow',         x: 0, y: 8,  w: 1, h: 2, isResizable: false, isDraggable: false },
        { i: 'income-expense',    x: 0, y: 10, w: 1, h: 2, isResizable: false, isDraggable: false },
        { i: 'risk-alerts',       x: 0, y: 12, w: 1, h: 4, isResizable: false, isDraggable: false },
        { i: 'pending-approvals', x: 0, y: 16, w: 1, h: 4, isResizable: false, isDraggable: false },
        { i: 'ai-suggestions',    x: 0, y: 20, w: 1, h: 4, isResizable: false, isDraggable: false },
    ],
};

/* ===== Project Manager persona ===== */
const pmLayout = {
    desktop: [
        { i: 'risk-alerts',       x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
        { i: 'pending-approvals', x: 6, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
        { i: 'budget-health',     x: 0, y: 4, w: 6, h: 3, minW: 4, minH: 3 },
        { i: 'cash-flow',         x: 6, y: 4, w: 6, h: 3, minW: 4, minH: 2 },
        { i: 'ai-suggestions',    x: 0, y: 7, w: 12, h: 4, minW: 6, minH: 3 },
    ],
    tablet: [
        { i: 'risk-alerts',       x: 0, y: 0,  w: 8, h: 4 },
        { i: 'pending-approvals', x: 0, y: 4,  w: 8, h: 4 },
        { i: 'budget-health',     x: 0, y: 8,  w: 8, h: 3 },
        { i: 'cash-flow',         x: 0, y: 11, w: 8, h: 2 },
        { i: 'ai-suggestions',    x: 0, y: 13, w: 8, h: 4 },
    ],
    mobile: [
        { i: 'risk-alerts',       x: 0, y: 0,  w: 1, h: 4, isResizable: false, isDraggable: false },
        { i: 'pending-approvals', x: 0, y: 4,  w: 1, h: 4, isResizable: false, isDraggable: false },
        { i: 'budget-health',     x: 0, y: 8,  w: 1, h: 4, isResizable: false, isDraggable: false },
        { i: 'cash-flow',         x: 0, y: 12, w: 1, h: 2, isResizable: false, isDraggable: false },
        { i: 'ai-suggestions',    x: 0, y: 14, w: 1, h: 4, isResizable: false, isDraggable: false },
    ],
};

/* ===== Field user (saha çalışanı, mobile-only) =====
 * Sadece kritik aksiyon widget'ları. Bütçe/cashflow gizli — saha kullanıcısının
 * decision'a etkisi yok, cognitive load gereksiz. */
const fieldLayout = {
    desktop: [
        /* Saha personası desktop'ta da erişebilsin diye basit layout */
        { i: 'pending-approvals', x: 0, y: 0, w: 8, h: 4 },
        { i: 'risk-alerts',       x: 8, y: 0, w: 4, h: 4 },
    ],
    tablet: [
        { i: 'pending-approvals', x: 0, y: 0, w: 8, h: 4 },
        { i: 'risk-alerts',       x: 0, y: 4, w: 8, h: 3 },
    ],
    mobile: [
        { i: 'pending-approvals', x: 0, y: 0, w: 1, h: 5, isResizable: false, isDraggable: false },
        { i: 'risk-alerts',       x: 0, y: 5, w: 1, h: 4, isResizable: false, isDraggable: false },
    ],
};

export const PERSONA_LAYOUTS = {
    cfo:   cfoLayout,
    pm:    pmLayout,
    field: fieldLayout,
};

/* Anahtar + Türkçe fallback; çözüm render'da t() ile yapılır (modül seviyesinde
   t() abp yüklenmeden değerlendirilip fallback'e kilitlenirdi). */
export const PERSONA_LABELS = {
    cfo:   { key: 'Persona:Cfo',   fallback: 'CFO / Finansman' },
    pm:    { key: 'Persona:Pm',    fallback: 'Proje Yöneticisi' },
    field: { key: 'Persona:Field', fallback: 'Saha Kullanıcısı' },
};

/* react-grid-layout breakpoint config'i — Tailwind ile ALANLA aynı eşik. */
export const GRID_BREAKPOINTS = {
    desktop: 1280,
    tablet:  768,
    mobile:  0,
};

export const GRID_COLS = {
    desktop: 12,
    tablet:  8,
    mobile:  1,
};

export const GRID_ROW_HEIGHT = 64;
export const GRID_MARGIN     = [12, 12]; /* x, y px */

/**
 * Kullanıcı tercihini localStorage'dan oku.
 * Yoksa default 'cfo' (en yaygın kurumsal kullanım).
 */
const STORAGE_KEY_PERSONA = 'apya-dashboard-persona';
const STORAGE_KEY_LAYOUT  = 'apya-dashboard-layout-overrides';

export function readPersonaPreference() {
    if (typeof window === 'undefined') return 'cfo';
    try {
        const v = window.localStorage.getItem(STORAGE_KEY_PERSONA);
        if (v && PERSONA_LAYOUTS[v]) return v;
    } catch (_) { /* ignore */ }
    return 'cfo';
}

export function writePersonaPreference(persona) {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY_PERSONA, persona);
    } catch (_) { /* ignore */ }
}

/* Kullanıcı drag/resize ile layout'u değiştirdiğinde override'ı kaydet.
   Persona değişince override sıfırlanır. */
export function readLayoutOverrides(persona) {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(`${STORAGE_KEY_LAYOUT}-${persona}`);
        return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
}

export function writeLayoutOverrides(persona, layouts) {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(
            `${STORAGE_KEY_LAYOUT}-${persona}`,
            JSON.stringify(layouts),
        );
    } catch (_) { /* quota exceeded — sessizce devam */ }
}

export function clearLayoutOverrides(persona) {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.removeItem(`${STORAGE_KEY_LAYOUT}-${persona}`);
    } catch (_) { /* ignore */ }
}
