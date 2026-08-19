import { describe, expect, it } from 'vitest';
import {
    RISK, buildAgenda, buildDayCell, dayLoad, groupByDay, hourRange, isTimed, isoDay,
    monthGridDays, summaryLabel, weekDays,
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
