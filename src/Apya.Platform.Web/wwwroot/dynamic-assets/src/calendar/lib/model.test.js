import { describe, expect, it } from 'vitest';
import {
    RISK, buildAgenda, buildDayCell, dayLoad, groupByDay, hourRange, isTimed, isWeekend, isoDay,
    monthGridDays, suggestReschedule, summaryLabel, weekDays,
} from './model';

const item = (over) => ({
    key: `k${Math.random()}`,
    source: 1,
    title: 'Öğe',
    date: '2026-08-14T00:00:00',
    risk: RISK.NONE,
    isDone: false,
    ...over,
});

describe('monthGridDays', () => {
    it('42 hücre üretir ve pazartesi başlar', () => {
        const days = monthGridDays(new Date(2026, 7, 1)); /* Ağustos 2026 */
        expect(days).toHaveLength(42);
        expect(days[0].getDay()).toBe(1); /* pazartesi */
        /* 1 Ağustos 2026 cumartesi → grid 27 Temmuz pazartesiden başlar */
        expect(isoDay(days[0])).toBe('2026-07-27');
    });
});

describe('buildDayCell', () => {
    it('az öğeli günde özet üretmez — hepsi tek tek görünür', () => {
        const items = [item({ key: 'a' }), item({ key: 'b' }), item({ key: 'c' })];
        const cell = buildDayCell(items);
        expect(cell.pills).toHaveLength(3);
        expect(cell.summaries).toHaveLength(0);
    });

    it('yoğun günde riskli öğeler tek tek, gerisi tür başına özetlenir', () => {
        const items = [
            item({ key: 'gec', risk: RISK.OVERDUE, title: 'Gecikmiş' }),
            ...Array.from({ length: 11 }, (_, i) => item({ key: `t${i}`, source: 1 })),
            item({ key: 'f1', source: 2, amount: 100000, currency: 'TRY' }),
            item({ key: 'f2', source: 2, amount: 63400, currency: 'TRY' }),
        ];

        const cell = buildDayCell(items);

        /* Riskli öğe kendi satırını alır. */
        expect(cell.pills.map((p) => p.key)).toContain('gec');
        /* Kalan 13 öğe iki özet satırına iner — hücre taşmaz. */
        expect(cell.summaries).toHaveLength(2);

        const tasks = cell.summaries.find((s) => s.source === 1);
        const invoices = cell.summaries.find((s) => s.source === 2);
        expect(tasks.count).toBe(11);
        expect(invoices.count).toBe(2);
        expect(invoices.amount).toBe(163400);
        expect(summaryLabel(tasks)).toBe('11 görev');
        expect(summaryLabel(invoices)).toMatch(/^2 fatura · /);
    });

    it('tek öğeli kaynağı özetlemez — başlığıyla gösterir', () => {
        const items = [
            ...Array.from({ length: 4 }, (_, i) => item({ key: `t${i}`, source: 1 })),
            item({ key: 'gider', source: 4, title: 'Ofis kirası', amount: 44000 }),
        ];

        const cell = buildDayCell(items);

        /* "1 gider · ₺44B" satır kazandırmaz, yalnız başlığı gizler. */
        expect(cell.summaries.map((s) => s.source)).not.toContain(4);
        expect(cell.pills.map((p) => p.title)).toContain('Ofis kirası');
        /* Çok öğeli kaynak yine özetlenir. */
        expect(cell.summaries.find((s) => s.source === 1).count).toBe(4);
    });

    it('20+ öğeli günde toplam satır sayısı sınırlı kalır', () => {
        const items = Array.from({ length: 24 }, (_, i) => item({ key: `x${i}`, source: (i % 6) + 1 }));
        const cell = buildDayCell(items);
        /* En fazla 2 risk pill + 6 tür özeti = 8 satır; "+N daha" yok. */
        expect(cell.pills.length + cell.summaries.length).toBeLessThanOrEqual(8);
    });
});

describe('dayLoad', () => {
    it('yalnız loadHours dolu öğeleri toplar', () => {
        expect(dayLoad([item({ loadHours: 5 }), item({ loadHours: 2.5 }), item({})])).toBe(7.5);
    });
});

describe('groupByDay', () => {
    it('saat bileşenini atarak gün anahtarına göre gruplar', () => {
        const grouped = groupByDay([
            item({ key: 'a', date: '2026-08-14T14:30:00' }),
            item({ key: 'b', date: '2026-08-14T00:00:00' }),
            item({ key: 'c', date: '2026-08-15T00:00:00' }),
        ]);
        expect(Object.keys(grouped).sort()).toEqual(['2026-08-14', '2026-08-15']);
        expect(grouped['2026-08-14']).toHaveLength(2);
    });
});

describe('buildAgenda', () => {
    const today = new Date(2026, 7, 14);

    it('gecikmişleri ayrı bloğa alır, tamamlananları listeye almaz', () => {
        const { overdue, days } = buildAgenda([
            item({ key: 'gec', date: '2026-08-12T00:00:00', risk: RISK.OVERDUE }),
            item({ key: 'bugun', date: '2026-08-14T00:00:00', risk: RISK.DUE_TODAY }),
            item({ key: 'kapali', date: '2026-08-11T00:00:00', risk: RISK.NONE, isDone: true }),
            item({ key: 'ileri', date: '2026-08-17T00:00:00' }),
        ], today);

        expect(overdue.map((i) => i.key)).toEqual(['gec']);
        expect(days.map((d) => d.key)).toEqual(['2026-08-14', '2026-08-17']);
        expect(days[0].isToday).toBe(true);
        /* Tamamlanan öğe hiçbir blokta yok. */
        const all = [...overdue, ...days.flatMap((d) => d.items)];
        expect(all.map((i) => i.key)).not.toContain('kapali');
    });

    it('günleri tarih sırasına dizer', () => {
        const { days } = buildAgenda([
            item({ key: 'c', date: '2026-09-01T00:00:00' }),
            item({ key: 'a', date: '2026-08-14T00:00:00' }),
            item({ key: 'b', date: '2026-08-20T00:00:00' }),
        ], today);
        expect(days.map((d) => d.key)).toEqual(['2026-08-14', '2026-08-20', '2026-09-01']);
    });
});

describe('weekDays', () => {
    it('pazartesiden başlayan 7 gün üretir', () => {
        /* 14 Ağustos 2026 cuma → hafta 10 Ağustos pazartesi başlar. */
        const days = weekDays(new Date(2026, 7, 14));
        expect(days).toHaveLength(7);
        expect(isoDay(days[0])).toBe('2026-08-10');
        expect(isoDay(days[6])).toBe('2026-08-16');
    });
});

describe('hourRange', () => {
    it('etkinlik yokken makul bir çalışma günü gösterir', () => {
        expect(hourRange([])).toEqual({ start: 8, end: 18 });
    });

    it('erken ve geç etkinlikleri kapsayacak şekilde genişler', () => {
        const range = hourRange([
            { startTime: '2026-08-14T06:30:00', endTime: '2026-08-14T07:15:00' },
            { startTime: '2026-08-14T20:00:00', endTime: '2026-08-14T21:30:00' },
        ]);
        expect(range.start).toBe(6);
        expect(range.end).toBe(22);
    });

    it('saatsiz (gün bazlı) öğeleri hesaba katmaz', () => {
        /* APYA öğeleri saat ızgarasına inmez — aralığı da genişletmemeli. */
        expect(hourRange([{ startTime: null, date: '2026-08-14T00:00:00' }])).toEqual({ start: 8, end: 18 });
    });
});

describe('isTimed', () => {
    it('yalnız saatli öğeleri ızgaraya alır', () => {
        expect(isTimed({ startTime: '2026-08-14T09:00:00' })).toBe(true);
        expect(isTimed({ startTime: null })).toBe(false);
    });
});

describe('suggestReschedule', () => {
    const today = new Date(2026, 7, 14); // 14 Ağustos 2026, Cuma

    const overdue = (key, opts = {}) => item({
        key,
        date: '2026-08-10T00:00:00',
        risk: RISK.OVERDUE,
        canReschedule: true,
        ...opts,
    });

    it('gecikmis ogeleri is gunlerine dagitir, hafta sonunu atlar', () => {
        const { suggestions } = suggestReschedule(
            [overdue('a', { loadHours: 8 }), overdue('b', { loadHours: 8 })],
            { today, capacity: 8 },
        );

        expect(suggestions).toHaveLength(2);
        // 14 Ağustos cuma dolduktan sonra sıradaki iş günü 17 Ağustos PAZARTESİ.
        expect(isoDay(suggestions[0].date)).toBe('2026-08-14');
        expect(isoDay(suggestions[1].date)).toBe('2026-08-17');
        expect(suggestions.map((s) => isWeekend(s.date))).toEqual([false, false]);
    });

    it('mevcut yuku hesaba katar — oneriler dolu gunun ustune yigilmaz', () => {
        const items = [
            // Bugün zaten kapasiteyi doldurmuş bir görev var.
            item({ key: 'dolu', date: '2026-08-14T00:00:00', loadHours: 8 }),
            overdue('gec', { loadHours: 4 }),
        ];

        const { suggestions } = suggestReschedule(items, { today, capacity: 8 });

        expect(isoDay(suggestions[0].date)).not.toBe('2026-08-14');
    });

    it('tasinamayan ogeleri ONERMEZ, ayri listeler', () => {
        const { suggestions, fixed } = suggestReschedule(
            [overdue('gorev'), overdue('fatura', { source: 2, canReschedule: false })],
            { today, capacity: 8 },
        );

        expect(suggestions.map((s) => s.item.key)).toEqual(['gorev']);
        expect(fixed.map((f) => f.key)).toEqual(['fatura']);
    });

    it('tamamlanmis gecikmis oge onerilmez', () => {
        const { suggestions } = suggestReschedule(
            [overdue('kapali', { isDone: true })],
            { today, capacity: 8 },
        );

        expect(suggestions).toHaveLength(0);
    });

    it('kapasite kapaliyken gun basina sinirli oge koyar', () => {
        const items = Array.from({ length: 5 }, (_, i) => overdue(`t${i}`));

        const { suggestions } = suggestReschedule(items, { today, capacity: null, fallbackPerDay: 2 });

        // Hepsi bugüne yığılmamalı.
        const firstDay = suggestions.filter((s) => isoDay(s.date) === '2026-08-14');
        expect(firstDay.length).toBe(2);
        expect(new Set(suggestions.map((s) => isoDay(s.date))).size).toBeGreaterThan(1);
    });
});
