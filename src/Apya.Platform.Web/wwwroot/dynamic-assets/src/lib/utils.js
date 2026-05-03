import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn — className composer.
 * clsx ile koşullu sınıfları birleştirir, twMerge ile Tailwind çakışmalarını
 * dedup'lar (örn. `cn('p-2', cond && 'p-4')` → 'p-4', `p-2`'yi atar).
 *
 * shadcn/ui ekosisteminin standardı; tüm primitive'ler bunu kullanır.
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Para formatı — Intl.NumberFormat tabanlı, locale-aware.
 * Finansal sayılar için tabular-nums utility'siyle kombine kullan.
 *
 * @param {number} amount
 * @param {string} currency  ISO 4217 (TRY, USD, EUR)
 * @param {string} [locale='tr-TR']
 * @returns {string}
 */
export function formatMoney(amount, currency, locale = 'tr-TR') {
    if (typeof amount !== 'number' || !Number.isFinite(amount)) return '—';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        currencyDisplay: 'symbol',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Compact format — büyük sayıları K/M/B'a indirger (₺1.2M, ₺450K).
 * Dashboard widget'larında "glance" seviyesi için.
 */
export function formatMoneyCompact(amount, currency, locale = 'tr-TR') {
    if (typeof amount !== 'number' || !Number.isFinite(amount)) return '—';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(amount);
}

/**
 * Yüzde delta — pozitif/negatif yön ikonlu metin formu üretir.
 * Renk uygulanmaz (caller'ın sorumluluğu); semantic class ile birleştirilir.
 *
 * @returns {{ sign: '+'|'−'|'', symbol: '▲'|'▼'|'•', text: string }}
 */
export function formatDelta(value, locale = 'tr-TR') {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        return { sign: '', symbol: '•', text: '—' };
    }
    const abs = Math.abs(value);
    const formatted = new Intl.NumberFormat(locale, {
        style: 'percent',
        maximumFractionDigits: 1,
    }).format(abs / 100);

    if (value > 0) return { sign: '+', symbol: '▲', text: formatted };
    if (value < 0) return { sign: '−', symbol: '▼', text: formatted };
    return { sign: '', symbol: '•', text: formatted };
}
