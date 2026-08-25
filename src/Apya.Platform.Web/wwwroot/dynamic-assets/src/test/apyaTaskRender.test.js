import { describe, it, expect, beforeAll } from 'vitest';

// wwwroot/js/apya-task-render.js bir IIFE'dir: window.apyaTask'a yazar ve
// jQuery + moment'i global bekler. Burada ikisinin de YALNIZ kullanılan yüzeyi
// sağlanır. esc() sahte değil, gerçek DOM ile kaçışını yapar — XSS testi anlamlı.
let apyaTask;

beforeAll(async () => {
    global.$ = function () {
        const el = document.createElement('div');
        return {
            text(s) { el.textContent = s; return this; },
            html() { return el.innerHTML; }
        };
    };
    global.moment = function () {
        return { format: () => '01 Oca 2026', diff: () => 720 };
    };

    await import('../../../js/apya-task-render.js');
    apyaTask = window.apyaTask;
});

describe('subtaskToggle', () => {
    it('alt görevi olmayan satırda buton değil, aynı genişlikte yer tutucu döner', () => {
        const html = apyaTask.subtaskToggle({ id: 'a1', subTaskCount: 0 });
        expect(html).toContain('is-empty');
        expect(html).not.toContain('<button');
    });

    it('alt görevi olan satırda kapalı chevron butonu döner', () => {
        const html = apyaTask.subtaskToggle({ id: 'a1', subTaskCount: 3 });
        expect(html).toContain('<button');
        expect(html).toContain('data-subtask-toggle="a1"');
        expect(html).toContain('aria-expanded="false"');
    });

    it('row yoksa patlamaz, yer tutucu döner', () => {
        expect(apyaTask.subtaskToggle(null)).toContain('is-empty');
    });
});

describe('subtaskCountBadge', () => {
    it('tamamlanan/toplam gösterir', () => {
        const html = apyaTask.subtaskCountBadge({ subTaskCount: 5, completedSubTaskCount: 2 });
        expect(html).toContain('>2/5<');
    });

    it('alt görev yoksa boş döner', () => {
        expect(apyaTask.subtaskCountBadge({ subTaskCount: 0 })).toBe('');
    });
});

describe('statusChip', () => {
    it('TaskStatus değerini Türkçe chip olarak basar', () => {
        expect(apyaTask.statusChip(4)).toContain('Tamamlandı');
        expect(apyaTask.statusChip(4)).toContain('apya-chip-positive');
        expect(apyaTask.statusChip(2)).toContain('Sürüyor');
    });

    it('özel kolon adını durumun YANINDA gösterir (pano ile rapor ayrışmasın)', () => {
        const html = apyaTask.statusChip(1, 'İncelemede');
        expect(html).toContain('İncelemede');
        // Durum çipi KALIR: "Yapılacak" filtresi bu kartı hâlâ bulabilmeli.
        expect(html).toContain('Yapılacak');
    });
});

describe('subtaskRows', () => {
    const sub = {
        id: 's1', code: 'GRV-12', title: 'Alt görev', status: 2,
        dueDate: '2026-01-01', assigneeName: 'Ayşe Yılmaz'
    };

    it('alt görev yoksa boş durum metnini basar', () => {
        expect(apyaTask.subtaskRows([])).toContain('Alt görev bulunamadı.');
    });

    it('her alt görev için tıklanabilir bir satır üretir', () => {
        const html = apyaTask.subtaskRows([sub]);
        expect(html).toContain('data-subtask-id="s1"');
        expect(html).toContain('GRV-12');
        expect(html).toContain('Alt görev');
        expect(html).toContain('role="button"');
    });

    it('tamamlanmış alt görevin başlığını üstü çizili işaretler', () => {
        const html = apyaTask.subtaskRows([{ ...sub, status: 4 }]);
        expect(html).toContain('apya-subtask-title is-done');
    });

    it('başlıktaki HTML kaçırılır (XSS)', () => {
        const html = apyaTask.subtaskRows([{ ...sub, title: '<img src=x onerror=alert(1)>' }]);
        expect(html).not.toContain('<img');
        expect(html).toContain('&lt;img');
    });
});
