import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';

// wwwroot/js/apya-task-console.js bir IIFE; jQuery'yi global bekler.
// Burada YALNIZ saf mantık test ediliyor: filtre state'i ↔ URL senkronu ve
// sıralı çalıştırma. Chip/toplu seçim/yoğunluk gibi DOM'a bağlı parçalar tam
// bir jQuery gerektirdiği için canlı QA ile doğrulanıyor (repoda jQuery
// devDependency yok, paket eklemek ayrı bir karar).
let taskConsole;

beforeAll(async () => {
    global.jQuery = { extend: Object.assign };
    global.$ = global.jQuery;
    await import('../../../js/apya-task-console.js');
    taskConsole = window.apya.taskConsole;
});

const DEFAULTS = { status: '', assignee: '', overdue: false, mine: false };

describe('createState — URL senkronu', () => {
    beforeEach(() => {
        history.replaceState(null, '', '/Tasks');
    });

    it('boolean alanı URLde 1 olarak yazar, metin alanını ham yazar', () => {
        const s = taskConsole.createState(DEFAULTS);
        s.set('status', '2').set('overdue', true);
        s.writeUrl();

        const p = new URLSearchParams(location.search);
        expect(p.get('status')).toBe('2');
        expect(p.get('overdue')).toBe('1');
    });

    it('boş alanları URLe hiç yazmaz', () => {
        const s = taskConsole.createState(DEFAULTS);
        s.set('status', '2');
        s.writeUrl();

        const p = new URLSearchParams(location.search);
        expect(p.has('assignee')).toBe(false);
        expect(p.has('overdue')).toBe(false);
    });

    it('görev derin bağlantısını (?task=) KORUR', () => {
        history.replaceState(null, '', '/Tasks?task=abc-123');
        const s = taskConsole.createState(DEFAULTS);
        s.set('status', '3');
        s.writeUrl();

        const p = new URLSearchParams(location.search);
        expect(p.get('task')).toBe('abc-123');
        expect(p.get('status')).toBe('3');
    });

    it('temizlenen filtreyi URLden siler', () => {
        history.replaceState(null, '', '/Tasks?status=2&overdue=1');
        const s = taskConsole.createState(DEFAULTS);
        s.reset();
        s.writeUrl();

        expect(location.search).toBe('');
    });

    it('readUrl URLdeki değerleri state\'e alır', () => {
        history.replaceState(null, '', '/Tasks?status=4&mine=1');
        const s = taskConsole.createState(DEFAULTS);
        s.readUrl();

        expect(s.get('status')).toBe('4');
        expect(s.get('mine')).toBe(true);
        expect(s.get('overdue')).toBe(false);
    });

    it('readUrl bilinmeyen anahtarları state\'e SIZDIRMAZ', () => {
        history.replaceState(null, '', '/Tasks?status=1&evil=surprise');
        const s = taskConsole.createState(DEFAULTS);
        s.readUrl();

        expect(Object.keys(s.values).sort()).toEqual(['assignee', 'mine', 'overdue', 'status']);
    });
});

describe('createState — hasActive', () => {
    it('hiç filtre yokken false', () => {
        const s = taskConsole.createState(DEFAULTS);
        expect(s.hasActive()).toBe(false);
    });

    it('yalnız boolean bir toggle açıkken bile true', () => {
        const s = taskConsole.createState(DEFAULTS);
        s.set('overdue', true);
        expect(s.hasActive()).toBe(true);
    });

    it('reset sonrası tekrar false', () => {
        const s = taskConsole.createState(DEFAULTS);
        s.set('status', '2').set('mine', true);
        s.reset();
        expect(s.hasActive()).toBe(false);
    });
});

describe('runSequential', () => {
    it('istekleri SIRAYLA çalıştırır (paralel değil)', async () => {
        const order = [];
        const start = [];

        await taskConsole.runSequential([1, 2, 3], (n) => {
            start.push(n);
            return new Promise((r) => setTimeout(() => { order.push(n); r(); }, 10 - n));
        });

        // Paralel olsaydı gecikmeler yüzünden order [3,2,1] olurdu.
        expect(order).toEqual([1, 2, 3]);
        expect(start).toEqual([1, 2, 3]);
    });

    it('boş listede sorunsuz biter', async () => {
        await expect(taskConsole.runSequential([], () => Promise.reject(new Error('çağrılmamalı'))))
            .resolves.toEqual({ failed: [], error: null });
    });

    /* STA-11: ilk ret zinciri kesiyordu; kalan kalemler denenmiyor, özet/yenileme
       hiç çalışmıyordu. Kanban toplu akışıyla aynı semantik: her kalem denenir. */
    it('bir kalem reddedince kalanlar YİNE denenir; başarısızlar ve ilk hata döner', async () => {
        const called = [];
        const err2 = { message: 'ikinci reddedildi' };
        const result = await taskConsole.runSequential([1, 2, 3], (n) => {
            called.push(n);
            return n === 2 ? Promise.reject(err2) : Promise.resolve();
        });

        expect(called).toEqual([1, 2, 3]);
        expect(result).toEqual({ failed: [2], error: err2 });
    });

    it('fn senkron fırlatsa da kalanlar denenir', async () => {
        const called = [];
        const result = await taskConsole.runSequential(['a', 'b', 'c'], (x) => {
            called.push(x);
            if (x === 'a') { throw new Error('senkron'); }
            return Promise.resolve();
        });

        expect(called).toEqual(['a', 'b', 'c']);
        expect(result.failed).toEqual(['a']);
        expect(result.error.message).toBe('senkron');
    });

    it('hepsi reddedilse de promise resolve olur ve ilk hata korunur', async () => {
        const result = await taskConsole.runSequential([1, 2], (n) => Promise.reject({ message: 'h' + n }));

        expect(result.failed).toEqual([1, 2]);
        expect(result.error).toEqual({ message: 'h1' });
    });
});

describe('notifyBulkResult', () => {
    let notify;
    beforeEach(() => {
        notify = { success: vi.fn(), error: vi.fn() };
        global.abp = { notify };
    });
    afterEach(() => { delete global.abp; });

    it('tamamen başarılı → yalnız başarı bildirimi', () => {
        taskConsole.notifyBulkResult(['a', 'b', 'c'], { failed: [], error: null }, 'görev silindi.');

        expect(notify.success).toHaveBeenCalledWith('3 görev silindi.');
        expect(notify.error).not.toHaveBeenCalled();
    });

    it('kısmi başarı → başarısızlar KODUYLA ve sebeple, başarılılar sayıyla', () => {
        const labelOf = (id) => ({ id2: 'GRV-2' }[id] || id);
        taskConsole.notifyBulkResult(['id1', 'id2', 'id3'], { failed: ['id2'], error: { message: 'Sebep' } },
            'görev silindi.', labelOf);

        expect(notify.error).toHaveBeenCalledWith('GRV-2 işlenemedi. Sebep');
        expect(notify.success).toHaveBeenCalledWith('2 görev silindi.');
    });

    it('labelOf yoksa kimliğin ilk 8 karakteri yazılır', () => {
        taskConsole.notifyBulkResult(['3fa85f64-5717-4562-b3fc-2c963f66afa6', 'x'],
            { failed: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'], error: null }, 'görevin durumu güncellendi.');

        expect(notify.error).toHaveBeenCalledWith('3fa85f64 işlenemedi.');
        expect(notify.success).toHaveBeenCalledWith('1 görevin durumu güncellendi.');
    });

    it('tamamen başarısız → yalnız hata bildirimi', () => {
        taskConsole.notifyBulkResult(['a', 'b'], { failed: ['a', 'b'], error: { message: 'Yetki yok' } },
            'görev silindi.', (id) => id.toUpperCase());

        expect(notify.error).toHaveBeenCalledWith('A, B işlenemedi. Yetki yok');
        expect(notify.success).not.toHaveBeenCalled();
    });

    it('hata gövdesinde message yoksa (ABP dışı jqXHR) sebep eklenmez', () => {
        taskConsole.notifyBulkResult(['a', 'b'], { failed: ['a'], error: { status: 0, statusText: 'error' } },
            'görev silindi.', (id) => id.toUpperCase());

        expect(notify.error).toHaveBeenCalledWith('A işlenemedi.');
    });
});
