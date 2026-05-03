import React from 'react';
import { useTheme } from '../../lib/theme/ThemeProvider';

/**
 * ThemeToggle
 * -----------------------------------------------------------------------------
 * Light / Dark / System siklik. Inline SVG kullanır — `lucide-react` gibi
 * bir icon library'e bağımlılık eklemiyoruz (henüz). 3 ikon kendi içinde:
 *   - Sun        → preference = 'light'
 *   - Moon       → preference = 'dark'
 *   - Monitor    → preference = 'system'
 *
 * Erişilebilirlik:
 *   - role="button" implicit (button element)
 *   - aria-label dinamik
 *   - klavye: Enter/Space (button default)
 *   - focus-visible halkası — token'dan
 *
 * Stil yaklaşımı: `font-tabular` veya semantic class kullanmıyor; pure
 * surface/border/text token'ları üzerinden.
 */

const LABELS = {
    light:  'Açık tema (Sıradaki: Koyu)',
    dark:   'Koyu tema (Sıradaki: Sistem)',
    system: 'Sistem teması (Sıradaki: Açık)',
};

export function ThemeToggle({ className = '' }) {
    const { preference, toggle } = useTheme();

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={LABELS[preference] ?? 'Tema değiştir'}
            title={LABELS[preference] ?? 'Tema değiştir'}
            className={[
                'inline-flex items-center justify-center',
                'h-10 w-10 rounded-md',
                'bg-surface-raised text-text-secondary',
                'border border-default',
                'hover:bg-surface-elevated hover:text-text-primary',
                'focus-visible:outline-none focus-visible:shadow-focus',
                'transition-colors duration-fast ease-standard',
                className,
            ].join(' ')}
        >
            {preference === 'light' && <SunIcon />}
            {preference === 'dark' && <MoonIcon />}
            {preference === 'system' && <MonitorIcon />}
        </button>
    );
}

/* -------------------- Inline Icons (no deps) -------------------- */
/* 24x24 viewBox, currentColor. Stroke 1.75 — Inter visual weight'i ile uyumlu. */

function SunIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}

function MonitorIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <path d="M8 21h8M12 17v4" />
        </svg>
    );
}
