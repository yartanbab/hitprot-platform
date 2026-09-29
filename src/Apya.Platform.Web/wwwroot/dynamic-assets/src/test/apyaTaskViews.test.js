import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { installJqueryShim } from './jqueryShim';

/*
 * Görevler konsolunun üç yeni görünümü: Takvim / Gösterge Paneli / Dosya Galerisi.
 * Üçü de wwwroot/js altında IIFE; jQuery + abp global bekliyorlar (jqueryShim).
 *
 * Test edilen: RENDER kararları ve veri kuralları — hangi gün hangi olayı alır,
 * hangi görev "gecikmiş" sayılır, uzun kuyruk nasıl toplanır, boş durumda ne
 * yazar. Grafik çizimi (Chart.js) kapsam dışı: bileşen kütüphane yokken
 * sayaçları basıp grafik alanına açık bir mesaj koyuyor, test onu doğruluyor.
 */

let mount;
let pointsResult;      // Takvim + Gösterge Paneli → getPoints (yalın uç, DÜZ DİZİ)
let galleryResult;    // Dosya Galerisi → getGallery
let pointsImpl;        // varsayılan: pointsResult ile çözülür; yükleme hatası testleri ezer
let galleryImpl;

beforeAll(async () => {
    installJqueryShim();
    global.abp = {
        localization: { getResource: () => (k) => k },
        notify: { success() {}, error() {} }
    };
    global.apya = {
        platform: { tasks: { task: {
            getPoints: (...args) => pointsImpl(...args),
            getGallery: (...args) => galleryImpl(...args)
        } } }
    };

    // Global demette görünümlerden ÖNCE yüklenir: create() apya.latest'i, hata dalı
    // apya.loadState.errorHtml'i çağırıyor.
    await import('../../../js/apya-latest.js');
    await import('../../../js/apya-load-state.js');
    await import('../../../js/apya-task-calendar.js');
    await import('../../../js/apya-task-dashboard.js');
    await import('../../../js/apya-task-gallery.js');
});

beforeEach(() => {
    document.body.innerHTML = '<div id="mount"></div>';
    mount = document.getElementById('mount');
    pointsResult = [];
    galleryResult = [];
    pointsImpl = () => Promise.resolve(pointsResult);
    galleryImpl = () => Promise.resolve(galleryResult);
});

const flush = () => new Promise((r) => setTimeout(r, 0));

/* Konsol takvimi BUGÜNÜN ayından açılır (görev detayındaki takvimden farklı:
   orada görevin kendi ayı mantıklı, konsolda bugün). Test verisi de bu ayda
   olmalı, yoksa sabit bir tarih ay değiştikçe testi kırar. */
const thisMonthDay = (day) => {
    const d = new Date();
    const safe = Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate());
    const p2 = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(safe)}T00:00:00Z`;
};

/* ─────────────────────────── Takvim ─────────────────────────── */

describe('apya.taskCalendar', () => {
    it('gun anahtarini ISO metninden keser — saat dilimi kaydirmaz', () => {
        // UTC gece yarisi + TZ farki = yerel gun kayabilir. Metinden kesmek eler.
        expect(apya.taskCalendar.isoDayKey('2026-08-20T00:00:00Z')).toBe('2026-08-20');
        expect(apya.taskCalendar.isoDayKey('2026-08-20')).toBe('2026-08-20');
        expect(apya.taskCalendar.isoDayKey('')).toBeNull();
        expect(apya.taskCalendar.isoDayKey(null)).toBeNull();
    });

    it('gorevi hem baslangic hem termin gununde gosterir', async () => {
        pointsResult = [{ id: 't1', title: 'Sözleşme', status: 2, startDate: thisMonthDay(3), dueDate: thisMonthDay(20) }];
        const cal = apya.taskCalendar.create({ mount: '#mount', getFilter: () => ({}) });
        await cal.load();
        await flush();

        const items = mount.querySelectorAll('.apya-cal-item');
        expect(items.length).toBe(2);
        expect(items[0].getAttribute('title')).toContain('başlangıç');
        expect(items[1].getAttribute('title')).toContain('termin');
    });

    it('tarihsiz gorevi HIC basmaz', async () => {
        pointsResult = [{ id: 't1', title: 'Tarihsiz', status: 1, startDate: null, dueDate: null }];
        const cal = apya.taskCalendar.create({ mount: '#mount', getFilter: () => ({}) });
        await cal.load();
        await flush();

        expect(mount.querySelectorAll('.apya-cal-item').length).toBe(0);
        // Boş durum ortak konsol kartına taşındı (tasarım 3a, PR-2a).
        expect(mount.querySelector('.apya-console-state')).not.toBeNull();
    });

    it('baslikta XSS kacisi yapar', async () => {
        pointsResult = [{ id: 't1', title: '<img src=x onerror=alert(1)>', status: 1, dueDate: thisMonthDay(20) }];
        const cal = apya.taskCalendar.create({ mount: '#mount', getFilter: () => ({}) });
        await cal.load();
        await flush();

        expect(mount.querySelector('img')).toBeNull();
        expect(mount.querySelector('.apya-cal-item').textContent).toContain('<img');
    });

    it('ay ileri ve geri gider, basladigi aya doner', async () => {
        pointsResult = [{ id: 't1', title: 'x', status: 1, dueDate: thisMonthDay(10) }];
        const cal = apya.taskCalendar.create({ mount: '#mount', getFilter: () => ({}) });
        await cal.load();
        await flush();

        // Acilis ayi BUGUNdur (takvim gorunumu gunluk kullanim icin bugunden acilir).
        const title = () => mount.querySelector('.apya-cal-title').textContent;
        const before = title();
        mount.querySelector('[data-cal="next"]').click();
        expect(title()).not.toBe(before);
        mount.querySelector('[data-cal="prev"]').click();
        expect(title()).toBe(before);
    });

    it('olaya tiklayinca gorev detayini acar', async () => {
        pointsResult = [{ id: 't1', title: 'Aç beni', status: 1, dueDate: thisMonthDay(20) }];
        const open = vi.fn();
        const cal = apya.taskCalendar.create({ mount: '#mount', getFilter: () => ({}), editModal: { open } });
        await cal.load();
        await flush();

        mount.querySelector('.apya-cal-item').click();
        expect(open).toHaveBeenCalledWith('t1');
    });
});

/* ────────────────────── Gösterge paneli ────────────────────── */

describe('apya.taskDashboard', () => {
    const load = async () => {
        const d = apya.taskDashboard.create({ mount: '#mount', getFilter: () => ({}) });
        await d.load();
        await flush();
        return d;
    };

    const statValue = (label) => {
        const nodes = Array.from(mount.querySelectorAll('.apya-dash-stat'));
        const hit = nodes.find((n) => n.querySelector('.apya-dash-stat-label').textContent === label);
        return hit ? hit.querySelector('.apya-dash-stat-value').textContent : null;
    };

    it('toplam ve tamamlanan sayilarini basar', async () => {
        pointsResult = [
            { id: '1', status: 4, priority: 2 },
            { id: '2', status: 1, priority: 3 },
            { id: '3', status: 4, priority: 1 }
        ];
        await load();
        expect(statValue('Tasks:Dashboard:Total')).toBe('3');
        expect(statValue('Tasks:Dashboard:Done')).toBe('2');
    });

    it('gecikmis: yalniz ACIK ve termini GECMIS gorevler sayilir', async () => {
        const dun = new Date(Date.now() - 86400000).toISOString();
        const yarin = new Date(Date.now() + 86400000).toISOString();
        pointsResult = [
            { id: '1', status: 1, priority: 2, dueDate: dun },    // acik + gecmis → sayilir
            { id: '2', status: 4, priority: 2, dueDate: dun },    // TAMAMLANMIS → sayilmaz
            { id: '3', status: 2, priority: 2, dueDate: yarin },  // gelecek → sayilmaz
            { id: '4', status: 2, priority: 2, dueDate: null }    // terminsiz → sayilmaz
        ];
        await load();
        expect(statValue('Tasks:Dashboard:Overdue')).toBe('1');
    });

    it('bugun termini olan gorev GECIKMIS sayilmaz (gun bazinda olculur)', async () => {
        const bugun = new Date();
        bugun.setHours(9, 0, 0, 0);
        pointsResult = [{ id: '1', status: 1, priority: 2, dueDate: bugun.toISOString() }];
        await load();
        expect(statValue('Tasks:Dashboard:Overdue')).toBe('0');
    });

    it('gorev yoksa bos durum yazar, sayac kartlari basmaz', async () => {
        pointsResult = [];
        await load();
        // Boş durum ortak konsol kartına taşındı (tasarım 3a, PR-2a).
        expect(mount.querySelector('.apya-console-state')).not.toBeNull();
        expect(mount.querySelectorAll('.apya-dash-stat').length).toBe(0);
    });

    it('Chart yokken sayaclar durur, grafik alani sessizce BOS kalmaz', async () => {
        pointsResult = [{ id: '1', status: 1, priority: 2 }];
        await load();
        expect(statValue('Tasks:Dashboard:Total')).toBe('1');
        expect(mount.querySelector('.apya-dash-charts').textContent).toContain('Grafik bileşeni yüklenemedi');
    });
});

/* ────────────────────── Dosya galerisi ────────────────────── */

describe('apya.taskGallery', () => {
    const load = async (editModal) => {
        const g = apya.taskGallery.create({ mount: '#mount', getFilter: () => ({}), editModal });
        await g.load();
        await flush();
        return g;
    };

    it('gorselleri kart olarak basar', async () => {
        galleryResult = [
            { taskId: 't1', taskTitle: 'Kapak', taskCode: 'GRV-1', attachmentId: 'a1', fileName: 'plan.png', fileSize: 4096, downloadUrl: '/file/get/1', uploaderName: 'Ali' }
        ];
        await load();
        const card = mount.querySelector('.apya-gal-card');
        expect(card).not.toBeNull();
        expect(card.querySelector('img').getAttribute('src')).toBe('/file/get/1');
        expect(card.querySelector('.apya-gal-code').textContent).toBe('GRV-1');
        expect(card.querySelector('.apya-gal-size').textContent).toContain('4 KB');
        expect(card.querySelector('.apya-gal-size').textContent).toContain('Ali');
    });

    it('gorsel yoksa bos durum yazar', async () => {
        galleryResult = [];
        await load();
        // Boş durum ortak konsol kartına taşındı (tasarım 3a, PR-2a).
        expect(mount.querySelector('.apya-console-state')).not.toBeNull();
    });

    it('gorev basligina tiklayinca detay acar', async () => {
        galleryResult = [
            { taskId: 't9', taskTitle: 'Aç', taskCode: 'GRV-9', attachmentId: 'a1', fileName: 'x.png', fileSize: 10, downloadUrl: '/f/1', uploaderName: 'Ali' }
        ];
        const open = vi.fn();
        await load({ open });
        mount.querySelector('.apya-gal-task').click();
        expect(open).toHaveBeenCalledWith('t9');
    });

    it('dosya adinda XSS kacisi yapar', async () => {
        galleryResult = [
            { taskId: 't1', taskTitle: '"><script>alert(1)</script>', taskCode: 'GRV-1', attachmentId: 'a1', fileName: 'x.png', fileSize: 10, downloadUrl: '/f/1', uploaderName: 'Ali' }
        ];
        await load();
        expect(mount.querySelector('script')).toBeNull();
        expect(mount.querySelector('.apya-gal-title').textContent).toContain('<script>');
    });
});

/* ───────────── Yükleme hatası (CON-04, STA-08 — Faz 4) ─────────────
   Eskiden ret dalı yoktu: iskelet sonsuza dek parlıyordu, Tekrar dene yolu yoktu.
   Hata dalı biletle birlikte gelir: süzgeç hızla değişince geç düşen eski istek
   yeni başarının üstüne hata kartı basmamalı. */
function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
}

describe.each([
    ['takvim', () => apya.taskCalendar, 'points', '.js-cal-retry'],
    ['gösterge paneli', () => apya.taskDashboard, 'points', '.js-dash-retry'],
    ['dosya galerisi', () => apya.taskGallery, 'gallery', '.js-gal-retry']
])('%s: yükleme hatası', (name, view, source, retrySel) => {
    const setImpl = (fn) => {
        if (source === 'points') { pointsImpl = fn; } else { galleryImpl = fn; }
    };
    const create = () => view().create({ mount: '#mount', getFilter: () => ({}) });
    const card = () => mount.querySelector('.apya-console-state[role="alert"]');

    it('ret: iskelet kalmaz, hata kartı + Tekrar dene; istek ABP penceresini açmaz', async () => {
        const params = [];
        setImpl((filter, ajaxParams) => { params.push(ajaxParams); return Promise.reject({ status: 500 }); });

        await create().load();
        await flush();

        expect(mount.querySelector('.apya-skeleton')).toBeNull();
        expect(card()).not.toBeNull();
        expect(card().querySelector(retrySel)).not.toBeNull();
        expect(params[0]).toEqual({ abpHandleError: false });
    });

    it('Tekrar dene yeni istek atar; başarıda hata kartı kalkar', async () => {
        let fail = true;
        let calls = 0;
        setImpl(() => { calls += 1; return fail ? Promise.reject({}) : Promise.resolve([]); });
        await create().load();
        await flush();

        fail = false;
        mount.querySelector(retrySel).click();
        await flush();

        expect(calls).toBe(2);
        expect(card()).toBeNull();
        expect(mount.querySelector('.apya-console-state')).not.toBeNull(); // gerçek boş durum
    });

    it('geç düşen eski istek yeni başarının üstüne hata basmaz', async () => {
        const first = deferred();
        let n = 0;
        setImpl(() => { n += 1; return n === 1 ? first.promise : Promise.resolve([]); });
        const v = create();

        v.load();
        await v.load();
        first.reject({});
        await flush();

        expect(card()).toBeNull();
        expect(mount.querySelector('.apya-console-state')).not.toBeNull();
    });
});
