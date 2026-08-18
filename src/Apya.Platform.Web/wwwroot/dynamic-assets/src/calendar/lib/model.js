/**
 * Takvim veri modeli — sunucudan gelen CalendarItemDto'nun ekranda kullanılan hâli.
 *
 * Sunucu enum'ları SAYI olarak serileşir (projede JsonStringEnumConverter yok —
 * bkz. dashboard/hooks/enums.js). Bileşenler sayı karşılaştırmasıyla kirlenmesin
 * diye çeviri TEK yerde, burada yapılır.
 *
 * ⚠️ Diziler sunucudaki enum SIRASIYLA birebir aynı olmalı
 * (Domain.Shared/Calendars/CalendarSourceType.cs, CalendarRiskLevel.cs).
 */

/** CalendarSourceType — sayısal değer → ekran meta verisi. */
export const SOURCES = {
    1: { key: 'task',    label: 'Görev',           plural: 'görev',          icon: 'fa-circle-check' },
    2: { key: 'invoice', label: 'Fatura',          plural: 'fatura',         icon: 'fa-file-invoice' },
    3: { key: 'grant',   label: 'Hibe',            plural: 'hibe',           icon: 'fa-award' },
    4: { key: 'expense', label: 'Gider',           plural: 'gider',          icon: 'fa-arrow-trend-down' },
    5: { key: 'income',  label: 'Gelir',           plural: 'gelir',          icon: 'fa-arrow-trend-up' },
    6: { key: 'cash',    label: 'Kasa hareketi',   plural: 'kasa hareketi',  icon: 'fa-wallet' },
};

export const SOURCE_ORDER = [1, 2, 3, 4, 5, 6];

/** CalendarRiskLevel */
export const RISK = { NONE: 0, DUE_TODAY: 1, OVERDUE: 2 };

export const isRisky = (item) => item.risk === RISK.OVERDUE || item.risk === RISK.DUE_TODAY;

/* ─── Tarih ─────────────────────────────────────────────────────────────── */

const DAY_MS = 86400000;

export const stripTime = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** ISO gün anahtarı (yerel saat) — sunucu tarihleriyle aynı "YYYY-MM-DD" biçimi. */
export function isoDay(d) {
    const p = (n) => (n < 10 ? '0' : '') + n;
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Haftanın pazartesisi — TR takvimi pazartesi başlar. */
export function mondayOf(d) {
    const off = (d.getDay() + 6) % 7;
    return new Date(d.getTime() - off * DAY_MS);
}

/** Ay grid'inin ilk hücresi (görünen ayın 1'ini içeren haftanın pazartesisi). */
export const monthGridStart = (month) => mondayOf(new Date(month.getFullYear(), month.getMonth(), 1));

/** Ay grid'i 6 hafta × 7 gün = 42 hücre; ay uzunluğundan bağımsız sabit yükseklik. */
export const MONTH_CELLS = 42;

export function monthGridDays(month) {
    const start = monthGridStart(month);
    return Array.from({ length: MONTH_CELLS }, (_, i) => new Date(start.getTime() + i * DAY_MS));
}

/* ─── Biçimlendirme ─────────────────────────────────────────────────────── */

const monthTitleFmt = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' });
const dayTitleFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
const dayShortFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short' });

export const fmt = {
    monthTitle: (d) => monthTitleFmt.format(d),
    dayTitle: (d) => dayTitleFmt.format(d),
    dayShort: (d) => dayShortFmt.format(d),
    /** Tam tutar — panel ve ajanda satırlarında. */
    money: (value, currency = 'TRY') => {
        try {
            return new Intl.NumberFormat('tr-TR', {
                style: 'currency', currency: currency || 'TRY', maximumFractionDigits: 0,
            }).format(value ?? 0);
        } catch {
            return `${value ?? 0} ${currency || 'TRY'}`;
        }
    },
    /** Kısa tutar — dar ay hücresinde ("₺163,4B"). */
    moneyCompact: (value, currency = 'TRY') => {
        try {
            return new Intl.NumberFormat('tr-TR', {
                style: 'currency', currency: currency || 'TRY',
                notation: 'compact', maximumFractionDigits: 1,
            }).format(value ?? 0);
        } catch {
            return `${value ?? 0} ${currency || 'TRY'}`;
        }
    },
    hours: (h) => `${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 }).format(h)} sa`,
};

/* ─── Gruplama ──────────────────────────────────────────────────────────── */

/** Öğeleri gün anahtarına göre grupla: { "2026-08-14": [item, ...] } */
export function groupByDay(items) {
    const byDay = {};
    for (const item of items ?? []) {
        const key = (item.date || '').slice(0, 10);
        if (!key) continue;
        (byDay[key] ??= []).push(item);
    }
    return byDay;
}

/** Günün toplam yükü (saat) — yalnız açık görevlerden gelir (sunucu doldurur). */
export const dayLoad = (items) =>
    (items ?? []).reduce((sum, i) => sum + (i.loadHours ?? 0), 0);

/**
 * Ay hücresinin içeriği. Tasarım kuralı: yoğun günde tek tek pill YOKTUR —
 * riskli öğeler kendi satırını ve rengini alır, gerisi tür başına özetlenir.
 *
 * Az öğeli günde (≤ maxPills) özet üretmek bilgi kaybıdır: hepsi tek tek gösterilir.
 */
export function buildDayCell(items, { maxPills = 3, maxRiskPills = 2 } = {}) {
    const list = items ?? [];
    if (list.length === 0) return { pills: [], summaries: [] };
    if (list.length <= maxPills) return { pills: list, summaries: [] };

    const risky = list.filter(isRisky);
    const pills = risky.slice(0, maxRiskPills);
    const shown = new Set(pills.map((i) => i.key));

    const bySource = new Map();
    for (const item of list) {
        if (shown.has(item.key)) continue;
        const bucket = bySource.get(item.source)
            ?? { source: item.source, count: 0, amount: 0, hasAmount: false, only: null };
        bucket.count += 1;
        bucket.only = bucket.count === 1 ? item : null;
        if (item.amount != null) {
            bucket.amount += item.amount;
            bucket.hasAmount = true;
        }
        bySource.set(item.source, bucket);
    }

    const summaries = [];
    for (const source of SOURCE_ORDER) {
        const bucket = bySource.get(source);
        if (!bucket) continue;
        /* Tek öğeli kaynağı özetlemek bilgi kaybıdır ve satır kazandırmaz —
           "1 gider · ₺44B" yerine giderin kendi başlığı gösterilir. */
        if (bucket.count === 1 && bucket.only) pills.push(bucket.only);
        else summaries.push(bucket);
    }

    return { pills, summaries };
}

/** Özet satırı metni: "12 görev" / "2 fatura · ₺163,4B" */
export function summaryLabel(summary, { compact = true } = {}) {
    const meta = SOURCES[summary.source];
    const base = `${summary.count} ${meta ? meta.plural : 'öğe'}`;
    if (!summary.hasAmount) return base;
    const money = compact ? fmt.moneyCompact(summary.amount) : fmt.money(summary.amount);
    return `${base} · ${money}`;
}

/**
 * Ajanda blokları: gecikmişler en üstte tek blok, sonra günü gününe.
 * Tamamlanmış öğeler listeye alınmaz (baskı çıktısıyla aynı kural).
 */
export function buildAgenda(items, today) {
    const todayKey = isoDay(today);
    const open = (items ?? []).filter((i) => !i.isDone);

    const overdue = open.filter((i) => i.date.slice(0, 10) < todayKey && i.risk === RISK.OVERDUE);
    const rest = open.filter((i) => i.date.slice(0, 10) >= todayKey);

    const byDay = groupByDay(rest);
    const days = Object.keys(byDay).sort().map((key) => ({
        key,
        date: new Date(`${key}T00:00:00`),
        isToday: key === todayKey,
        items: byDay[key],
    }));

    return { overdue, days };
}
