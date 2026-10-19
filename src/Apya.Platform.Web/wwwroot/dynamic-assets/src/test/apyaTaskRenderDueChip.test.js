import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';

// QA-07 · Son tarih çipi gün düzeyinde: bugün biten görev kırmızı "gecikmiş" çip
// almaz (görev panosu ve Zaman Çizelgesi ile aynı kural). moment yalnız kullanılan
// yüzeyiyle sağlanır; gecikme kararı moment'e değil yerel takvim gününe bakar.
let apyaTask;

beforeAll(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 19, 10, 0, 0));
    global.$ = function () {
        const el = document.createElement('div');
        return {
            text(s) { el.textContent = s; return this; },
            html() { return el.innerHTML; }
        };
    };
    // diff gerçek saat farkını verir: eski saat düzeyindeki kural bu taklitle de yakalanır.
    global.moment = function (d) {
        const t = d ? new Date(d) : new Date();
        return { t, format: () => '19 Eki 2026', diff: (o) => (t - o.t) / 3600000 };
    };
    await import('../../../js/apya-task-render.js');
    apyaTask = window.apyaTask;
});

afterAll(() => {
    vi.useRealTimers();
});

describe('dueDateChip', () => {
    it('bugün biten açık görev gecikmiş çipi almaz', () => {
        expect(apyaTask.dueDateChip('2026-10-19T00:00:00', 1)).not.toContain('apya-chip-negative');
    });

    it('dün biten açık görev gecikmiştir', () => {
        expect(apyaTask.dueDateChip('2026-10-18T00:00:00', 1)).toContain('apya-chip-negative');
    });

    it('iptal edilen görev tarihi geçse de gecikmiş sayılmaz', () => {
        expect(apyaTask.dueDateChip('2026-10-18T00:00:00', 0)).not.toContain('apya-chip-negative');
    });
});
