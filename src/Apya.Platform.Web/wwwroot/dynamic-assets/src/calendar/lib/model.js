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
    7: { key: 'external', label: 'Dış etkinlik',   plural: 'dış etkinlik',   icon: 'fa-calendar-days' },
};

export const SOURCE_ORDER = [1, 2, 3, 4, 5, 6, 7];

/** Ray'da anahtarı olan (izne bağlı) iç kaynaklar — dış etkinlik ayrı bölümde. */
export const INTERNAL_SOURCE_ORDER = [1, 2, 3, 4, 5, 6];

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

/* ─── Hafta / Gün ───────────────────────────────────────────────────────── */

/** Verilen günü içeren haftanın 7 günü (pazartesi başlar). */
export function weekDays(date) {
    const start = mondayOf(stripTime(date));
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

const timeFmt = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' });

/** Saat etiketi — dış etkinliklerde "09:00" biçimi. */
export const timeLabel = (iso) => (iso ? timeFmt.format(new Date(iso)) : '');

/** Gün başlangıcından itibaren dakika — saat ızgarasında konumlandırma için. */
export function minutesOfDay(iso) {
    const d = new Date(iso);
    return d.getHours() * 60 + d.getMinutes();
}

/**
 * Saat ızgarasının kapsayacağı aralık. Sabit 00–24 çizmek ekranın çoğunu boş
 * bırakır; etkinliklerin gerçek aralığına göre daraltılır, en az 08–18 gösterilir.
 */
export function hourRange(events) {
    let min = 8, max = 18;
    for (const ev of events ?? []) {
        if (!ev.startTime) continue;
        min = Math.min(min, Math.floor(minutesOfDay(ev.startTime) / 60));
        max = Math.max(max, Math.ceil(minutesOfDay(ev.endTime ?? ev.startTime) / 60));
    }
    return { start: Math.max(0, min), end: Math.min(24, Math.max(max, min + 4)) };
}

/** Saatli (dış) öğe mi? APYA öğeleri gün bazlıdır ve ızgaraya inmez. */
export const isTimed = (item) => !!item.startTime;

/* ─── Akıllı toplu erteleme ─────────────────────────────────────────────── */

/** Hafta sonu mu? Öneriler iş gününe dağıtılır. */
export const isWeekend = (d) => d.getDay() === 0 || d.getDay() === 6;

/**
 * Gecikmiş öğeler için yeni tarih önerir.
 *
 * Kurallar (tasarım §5):
 * - Yalnız AÇIK, GECİKMİŞ ve taşınabilir öğeler önerilir.
 * - Fatura/gider vadeleri ve hibe son tarihleri DEĞİŞMEZ; listede "değişmez"
 *   olarak ayrı gösterilir ki kullanıcı neden ertelenmediğini görsün.
 * - Öğeler bugünden itibaren BOŞ günlere dağıtılır: bir günün mevcut yükü +
 *   eklenenler kapasiteyi aşarsa sonraki güne geçilir.
 * - Kapasite kapalıysa (null) gün başına en fazla `fallbackPerDay` öğe konur —
 *   yoksa hepsi bugüne yığılır ve "akıllı" olmaz.
 * - Hafta sonları atlanır.
 *
 * Girdi olarak aralıktaki TÜM öğeler beklenir: mevcut yük onlardan hesaplanır.
 */
export function suggestReschedule(items, { today, capacity = null, horizonDays = 21, fallbackPerDay = 3 } = {}) {
    const todayKey = isoDay(today);
    const open = (items ?? []).filter((i) => !i.isDone);

    const overdue = open.filter((i) => i.date.slice(0, 10) < todayKey && i.risk === RISK.OVERDUE);
    const movable = overdue.filter((i) => i.canReschedule);
    const fixed = overdue.filter((i) => !i.canReschedule);

    /* Bugünden ileriye mevcut yük — öneriler var olan planın üstüne yığılmasın. */
    const loadByDay = {};
    const countByDay = {};
    for (const item of open) {
        const key = item.date.slice(0, 10);
        if (key < todayKey) continue;
        loadByDay[key] = (loadByDay[key] ?? 0) + (item.loadHours ?? 0);
        countByDay[key] = (countByDay[key] ?? 0) + 1;
    }

    const suggestions = [];
    let cursor = 0;

    for (const item of movable) {
        let placed = null;

        while (cursor < horizonDays) {
            const day = addDays(today, cursor);
            if (isWeekend(day)) { cursor += 1; continue; }

            const key = isoDay(day);
            const load = loadByDay[key] ?? 0;
            const count = countByDay[key] ?? 0;
            const itemLoad = item.loadHours ?? 0;

            /* Kendi başına kapasiteyi aşan öğe HİÇBİR güne sığmaz (68 saatlik görev,
               6 saatlik kapasite). Kapasite kuralında ısrar etmek hepsini ufuk
               gününe yığar — yani "bugüne yığma" hatasının başka güne taşınmışı.
               Böyle öğelerde gün başına ADET kuralına düşülür ki yine dağılsınlar. */
            const tooBigForAnyDay = capacity && itemLoad > capacity;
            const fits = capacity && !tooBigForAnyDay
                ? load + itemLoad <= capacity
                : count < fallbackPerDay;

            if (fits) {
                loadByDay[key] = load + itemLoad;
                countByDay[key] = count + 1;
                placed = day;
                break;
            }
            cursor += 1;
        }

        /* Ufuk dolduysa son iş gününe koy — öneri üretmeden bırakmak, kullanıcıyı
           gecikmiş öğeyle baş başa bırakmak olurdu. */
        if (!placed) {
            let day = addDays(today, horizonDays);
            while (isWeekend(day)) day = addDays(day, 1);
            placed = day;
        }

        suggestions.push({ item, date: placed });
    }

    return { suggestions, fixed };
}
