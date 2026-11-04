import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';

// Mobil görev kartı parçaları: göreli tarih, durum halkası, özet satırı.
// Gecikme kararı dueDateChip ile aynı: yerel takvim günü. moment yalnız biçim için.
let apyaTask;

beforeAll(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 4, 10, 0, 0)); // 4 Kas 2026
    global.$ = function () {
        const el = document.createElement('div');
        return {
            text(s) { el.textContent = s; return this; },
            html() { return el.innerHTML; }
        };
    };
    global.moment = function (d) {
        const t = d ? new Date(d) : new Date();
        return { t, format: (f) => f, diff: (o) => (t - o.t) / 3600000 };
    };
    await import('../../../js/apya-task-render.js');
    apyaTask = window.apyaTask;
});

afterAll(() => {
    vi.useRealTimers();
});

describe('dueRelative', () => {
    it('geçmiş tarih gecikme gün sayısıyla yazılır', () => {
        const html = apyaTask.dueRelative('2026-08-23T00:00:00', 3);
        expect(html).toContain('73 gün gecikti');
        expect(html).toContain('is-negative');
    });

    it('bugün ve yarın sözle yazılır, gecikmiş sayılmaz', () => {
        expect(apyaTask.dueRelative('2026-11-04T00:00:00', 1)).toContain('Bugün');
        expect(apyaTask.dueRelative('2026-11-05T00:00:00', 2)).toContain('Yarın');
        expect(apyaTask.dueRelative('2026-11-04T00:00:00', 1)).not.toContain('is-negative');
    });

    it('uzak tarih bu yıl içindeyse yılsız, değilse yıllı biçimlenir', () => {
        expect(apyaTask.dueRelative('2026-11-12T00:00:00', 1)).toContain('>D MMM<');
        expect(apyaTask.dueRelative('2027-01-12T00:00:00', 1)).toContain('D MMM YYYY');
    });

    it('tamamlanan görevde tamamlanma günü yazılır, vurgu yok', () => {
        const html = apyaTask.dueRelative('2026-08-23T00:00:00', 4, '2026-11-02T00:00:00');
        expect(html).not.toContain('gecikti');
        expect(html).not.toContain('is-');
    });

    it('iptal edilen görev tarihi geçse de gecikmiş sayılmaz', () => {
        expect(apyaTask.dueRelative('2026-08-23T00:00:00', 0)).not.toContain('gecikti');
    });

    it('son tarih yoksa boş döner', () => {
        expect(apyaTask.dueRelative(null, 1)).toBe('');
    });
});

describe('statusRing', () => {
    it('tamamlanabilen görevde halka Tamamla düğmesidir ve önceki durumu taşır', () => {
        const html = apyaTask.statusRing({ id: 'g1', status: 3 }, true);
        expect(html).toMatch(/^<button/);
        expect(html).toContain('data-complete-id="g1"');
        expect(html).toContain('data-prev-status="3"');
        expect(html).toContain('is-s3');
        expect(html).toContain('durum: Testte');
    });

    it('yetki yoksa halka yalnız durumu gösterir, düğme değildir', () => {
        const html = apyaTask.statusRing({ id: 'g1', status: 2 }, false);
        expect(html).toMatch(/^<span/);
        expect(html).not.toContain('data-complete-id');
        expect(html).toContain('Durum: Sürüyor');
    });

    it('tamamlanan görevde onay işareti çizilir', () => {
        expect(apyaTask.statusRing({ id: 'g1', status: 4 }, false)).toContain('fa-check');
    });
});

describe('mobileMeta', () => {
    it('durum, etiket, alt görev ve yorum tek satırda birleşir', () => {
        const html = apyaTask.mobileMeta({
            status: 3, priority: 2, tags: [{ name: 'saha' }],
            subTaskCount: 5, completedSubTaskCount: 2, comments: [{}, {}, {}]
        });
        expect(html).toContain('Testte · saha · 2/5 alt görev · ');
        expect(html).toContain('fa-comment');
    });

    it('Yüksek/Kritik öncelik ekran okuyucuya metin olarak söylenir', () => {
        expect(apyaTask.mobileMeta({ status: 1, priority: 3 })).toContain('Yüksek öncelik');
        expect(apyaTask.mobileMeta({ status: 1, priority: 2 })).not.toContain('öncelik');
    });

    it('etiket adı kaçışlanır', () => {
        expect(apyaTask.mobileMeta({ status: 1, tags: [{ name: '<b>x</b>' }] })).toContain('&lt;b&gt;x&lt;/b&gt;');
    });
});
