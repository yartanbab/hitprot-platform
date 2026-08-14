/**
 * Grafik yardımcıları — tüm grafikler saf SVG, viewBox 0 0 100 40 tabanlı ve
 * `preserveAspectRatio="none"` ile kabına yayılır. Böylece kart yeniden
 * boyutlandığında JS ölçüm gerekmez.
 *
 * Renkler ASLA sabit yazılmaz: `--apya-*` token'ları `currentColor` veya
 * doğrudan var() ile okunur, dolayısıyla koyu tema bedava gelir.
 */

export const VIEWBOX_W = 100;
export const VIEWBOX_H = 40;

/** Seri renkleri — token adlarıyla, sırayla dağıtılır. */
export const SERIES_TOKENS = [
    'var(--apya-brand-500)',
    'var(--apya-positive-500)',
    'var(--apya-warning-500)',
    'var(--apya-negative-500)',
    'var(--apya-ai-500)',
];

/** Değerleri viewBox yüksekliğine oturtur. Tüm değerler 0 ise düz taban çizgisi. */
export function scaleY(values, height = VIEWBOX_H, padding = 2) {
    const max = Math.max(...values, 0);
    if (max <= 0) return values.map(() => height - padding);
    const usable = height - padding * 2;
    return values.map((v) => padding + usable - (v / max) * usable);
}

/** n noktayı viewBox genişliğine eşit aralıklı yayar. Tek nokta ortalanır. */
export function spreadX(count, width = VIEWBOX_W) {
    if (count <= 1) return [width / 2];
    const step = width / (count - 1);
    return Array.from({ length: count }, (_, i) => i * step);
}

/** Düz çizgi path'i (eğri yok — küçük ölçekte eğri veriyi yalan söyletiyor). */
export function linePath(xs, ys) {
    if (!xs.length) return '';
    return xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${round(x)} ${round(ys[i])}`).join(' ');
}

/** Aynı çizginin altını dolduran kapalı alan path'i. */
export function areaPath(xs, ys, height = VIEWBOX_H) {
    if (!xs.length) return '';
    return `${linePath(xs, ys)} L ${round(xs[xs.length - 1])} ${height} L ${round(xs[0])} ${height} Z`;
}

function round(n) {
    return Math.round(n * 100) / 100;
}

/**
 * Her grafik türünün ızgaradaki asgari boyutu (kolon × 64px satır).
 * Altına inilirse kart NumberTrend'e düşer — grafik kırılmaz.
 */
export const CHART_MIN_SIZE = {
    NumberTrend: { minW: 2, minH: 2 },
    AreaSpark:   { minW: 2, minH: 2 },
    LineMulti:   { minW: 4, minH: 3 },
    GroupedBar:  { minW: 3, minH: 3 },
    StackedBar:  { minW: 3, minH: 3 },
    FullStacked: { minW: 3, minH: 3 },
    RankBar:     { minW: 3, minH: 3 },
    Donut:       { minW: 2, minH: 3 },
    Gauge:       { minW: 2, minH: 2 },
    Heatmap:     { minW: 3, minH: 3 },
    Burndown:    { minW: 4, minH: 3 },
    MiniGantt:   { minW: 3, minH: 3 },
    Waterfall:   { minW: 4, minH: 3 },
    RiskMatrix:  { minW: 3, minH: 3 },
    Funnel:      { minW: 3, minH: 3 },
    Bullet:      { minW: 3, minH: 2 },
};

/** Kart verilen boyutta grafiği taşıyabiliyor mu — taşıyamıyorsa NumberTrend'e düşülür. */
export function fitsChart(chartType, w, h) {
    const min = CHART_MIN_SIZE[chartType];
    if (!min) return true;
    return w >= min.minW && h >= min.minH;
}
