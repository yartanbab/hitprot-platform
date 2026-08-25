import { describe, it, expect, beforeAll, beforeEach } from 'vitest';

// wwwroot/js/apya-kanban.js bir IIFE; jQuery + Sortable + abp + moment'i global
// bekler. Burada YALNIZ kullanılan yüzeyleri sağlanır (apyaTaskRender.test.js ile
// aynı desen). Test edilen davranışlar sürükle-bırak değil, RENDER kararları:
// hangi kolon nereden geliyor, hangi kontrol kime çiziliyor, rozetlere ne yazılıyor.
//
// Sürükleme/ölçme gibi gerçek jQuery isteyen parçalar kapsam dışı — repoda jQuery
// devDependency yok (bkz. apyaTaskConsole.test.js'teki aynı not).

let granted = {};

// _KanbanBoard.cshtml'in birebir yansıması: kolonlar JS'ten basılır, partial
// yalnız kabı ve proje seçili değilken kullanılacak varsayılan adları taşır.
function boardHtml() {
    return `<div class="kanban-board"
        data-col-1="Yapılacak" data-col-2="Sürüyor"
        data-col-3="Testte" data-col-4="Tamamlandı"></div>`;
}

const sysCols = [
    { id: 'c1', statusValue: 1, name: 'Yapılacak', colorClass: 'secondary', order: 0, isSystem: true },
    { id: 'c2', statusValue: 2, name: 'Sürüyor', colorClass: 'warning', order: 1, isSystem: true },
    { id: 'c3', statusValue: 3, name: 'Testte', colorClass: 'info', order: 2, isSystem: true },
    { id: 'c4', statusValue: 4, name: 'Tamamlandı', colorClass: 'success', order: 3, isSystem: true }
];
const customCol = { id: 'x9', statusValue: null, name: 'Hakem değerlendirmesi', colorClass: 'primary', order: 4, isSystem: false };

// load() iki kademeli promise zinciri: kolonlar → görevler. Mikro görevlerin
// akması için birkaç tick yeterli.
async function flush() {
    for (let i = 0; i < 4; i++) { await new Promise((r) => setTimeout(r, 0)); }
}

function mountBoard(cols, tasks) {
    document.body.innerHTML = boardHtml();
    window.apya.platform = {
        tasks: {
            task: {
                getList: () => Promise.resolve({ items: tasks || [] }),
                getActiveTimeLog: () => Promise.resolve(null)
            }
        },
        projects: {
            boardColumn: { getListByProject: () => Promise.resolve(cols) }
        }
    };
}

const col = (statusId) => document.querySelector(`.kanban-column[data-status-id="${statusId}"]`);

beforeAll(async () => {
    global.$ = function () { return { on() { return this; } }; };
    global.$.extend = Object.assign;
    global.jQuery = global.$;
    // Kurulan Sortable örneklerini kaydeder: kolon sürükleme (handle
    // '.kanban-header') YALNIZ yetkili + proje seçili panoda kurulmalı.
    global.Sortable = class {
        constructor(el, opts) { Sortable.calls.push({ el, opts: opts || {} }); }
        destroy() { }
    };
    global.Sortable.calls = [];
    const columnSortables = () => Sortable.calls.filter((c) => c.opts.handle === '.kanban-header');
    global.__columnSortables = columnSortables;
    global.moment = function () { return { diff: () => 9999, format: () => '01 Oca' }; };
    global.abp = {
        auth: { isGranted: (p) => granted[p] === true },
        currentUser: { id: 'u1' },
        notify: { success() { }, error() { }, info() { }, warn() { } }
    };

    await import('../../../js/apya-kanban.js');
});

beforeEach(() => {
    granted = {};
    localStorage.clear();
    Sortable.calls = [];
});

describe('kolonların kaynağı', () => {
    it('proje seçiliyken sistem kolonlarının ADI DB kaydından gelir', async () => {
        const renamed = sysCols.map((c) => (c.statusValue === 3 ? { ...c, name: 'Kod İncelemesi' } : c));
        mountBoard(renamed, []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(col(3).querySelector('.kanban-title').textContent).toContain('Kod İncelemesi');
        // Kart kabı SYS id'siyle doğar — render() görevleri buraya yerleştiriyor.
        expect(col(3).querySelector('.kanban-cards').id).toBe('kanban-inreview');
    });

    it('proje seçili DEĞİLKEN adlar partial\'daki varsayılanlardan gelir', async () => {
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: null }).load();
        await flush();

        expect(document.querySelectorAll('.kanban-column').length).toBe(4);
        expect(col(1).querySelector('.kanban-title').textContent).toContain('Yapılacak');
        expect(col(4).querySelector('.kanban-title').textContent).toContain('Tamamlandı');
        // DB kolonu yok → drag status ile taşınmalı, kolon-id yazılmamalı.
        expect(col(1).hasAttribute('data-column-id')).toBe(false);
    });

    it('kolonlar DB Order sırasına göre dizilir (özel kolon sistemin arasına girebilir)', async () => {
        const cols = [
            { ...sysCols[0], order: 0 },
            { ...customCol, order: 1 },
            { ...sysCols[1], order: 2 },
            { ...sysCols[2], order: 3 },
            { ...sysCols[3], order: 4 }
        ];
        mountBoard(cols, []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        const names = Array.from(document.querySelectorAll('.kanban-column:not(.js-add-col) .kanban-title'))
            .map((n) => n.textContent.trim());
        expect(names).toEqual(['Yapılacak', 'Hakem değerlendirmesi', 'Sürüyor', 'Testte', 'Tamamlandı']);
    });

    it('renk hem sistem hem özel kolonda data-column-color ile taşınır', async () => {
        mountBoard(sysCols.concat([customCol]), []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(col(2).getAttribute('data-column-color')).toBe('warning');
        expect(document.querySelector('.js-custom-col').getAttribute('data-column-color')).toBe('primary');
    });
});

describe('kolon düzenleme yetkisi (Projects.Edit)', () => {
    it('yetki YOKSA ⋯ menüsü ve "Kolon ekle" karosu çizilmez — özel kolon yine görünür', async () => {
        mountBoard(sysCols.concat([customCol]), []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        // Kolon duruyor: kartları kaybolmasın diye görünürlük yetkiye bağlı DEĞİL.
        expect(document.querySelector('.js-custom-col')).not.toBeNull();
        expect(document.querySelector('.js-custom-col .kanban-title').textContent).toContain('Hakem değerlendirmesi');

        expect(document.querySelector('.kanban-col-menu')).toBeNull();
        expect(document.querySelector('.js-col-delete')).toBeNull();
        expect(document.querySelector('.js-add-col')).toBeNull();
    });

    it('yetki VARSA her kolonda ⋯ menüsü ve panoda "Kolon ekle" karosu çizilir', async () => {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(sysCols.concat([customCol]), []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(document.querySelectorAll('.kanban-col-menu').length).toBe(5);
        expect(document.querySelector('.js-add-col')).not.toBeNull();
    });

    it('sistem kolonunda SİL kilitli, özel kolonda gerçek sil düğmesi', async () => {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(sysCols.concat([customCol]), []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        // Sistem: tıklanamaz kilit; yeniden adlandırma alternatifi duruyor.
        expect(col(1).querySelector('.apya-console-menu-item.is-locked')).not.toBeNull();
        expect(col(1).querySelector('.js-col-delete')).toBeNull();
        expect(col(1).querySelector('.js-col-rename')).not.toBeNull();

        // Özel: silinebilir.
        const custom = document.querySelector('.js-custom-col');
        expect(custom.querySelector('.js-col-delete')).not.toBeNull();
        expect(custom.querySelector('.apya-console-menu-item.is-locked')).toBeNull();
    });

    it('proje seçili değilken kolon yönetimi hiç render edilmez', async () => {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: null }).load();
        await flush();

        expect(document.querySelector('.kanban-col-menu')).toBeNull();
        expect(document.querySelector('.js-add-col')).toBeNull();
    });

    it('opts.canEditColumns açıkça verilirse izin sorgusunu ezer', async () => {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(sysCols.concat([customCol]), []);
        apya.kanban.create({ projectId: 'p1', canEditColumns: false }).load();
        await flush();

        expect(document.querySelector('.kanban-col-menu')).toBeNull();
        expect(document.querySelector('.js-add-col')).toBeNull();
    });
});

describe('yerinde ad düzenleme (3a)', () => {
    it('yetkili ve DB kaydı olan kolonun başlığı düzenlenebilir işaretlenir', async () => {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(sysCols.concat([customCol]), []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(document.querySelectorAll('.js-col-name.is-editable').length).toBe(5);
        // Düzenleme kutusu tıklanmadan açılmaz.
        expect(document.querySelector('.kanban-col-name-input')).toBeNull();
    });

    it('yetki yoksa başlık düzenlenebilir işaretlenmez', async () => {
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(document.querySelector('.js-col-name.is-editable')).toBeNull();
    });

    it('proje seçili değilken (DB kaydı yok) başlık düzenlenemez', async () => {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: null }).load();
        await flush();

        expect(document.querySelector('.js-col-name.is-editable')).toBeNull();
    });
});

describe('kolon sırası projeye ait (3c-5)', () => {
    it('yetkili + proje seçiliyken kolon sürükleme kurulur', async () => {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(__columnSortables().length).toBe(1);
    });

    it('yetki yoksa kolon sürükleme hiç kurulmaz', async () => {
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(__columnSortables().length).toBe(0);
    });

    it('proje seçili değilken kurulmaz (kaydedilecek yer yok)', async () => {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: null }).load();
        await flush();

        expect(__columnSortables().length).toBe(0);
    });

    it('sıra localStorage\'a YAZILMAZ (artık sunucuda)', async () => {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(localStorage.getItem('apya-kanban-order-p1')).toBeNull();
    });
});

describe('kolon silme onayı için gereken veri', () => {
    it('kart durumunu taşır (hedef kolonu isimlendirmek için)', async () => {
        mountBoard(sysCols, [{ id: 't1', code: 'GRV-1', title: 'A', status: 2, priority: 2 }]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(document.querySelector('.kanban-card').getAttribute('data-status')).toBe('2');
    });

    it('sistem kolonunun kilitli sil düğmesi gerekçe için işaretli', async () => {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(col(1).querySelector('.js-col-delete-locked')).not.toBeNull();
    });
});

describe('proje seçilmemiş uyarısı (3c-4)', () => {
    it('yetkiliye "proje seç" karosu gösterilir, "Kolon ekle" gösterilmez', async () => {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: null }).load();
        await flush();

        const note = document.querySelector('.kanban-note-col');
        expect(note).not.toBeNull();
        expect(note.textContent).toContain('Özel kolonlar projeye ait');
        expect(document.querySelector('.js-add-col')).toBeNull();
    });

    it('yetkisiz kullanıcıya hiç gösterilmez', async () => {
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: null }).load();
        await flush();

        expect(document.querySelector('.kanban-note-col')).toBeNull();
    });

    it('proje seçilince karo yerini "Kolon ekle"ye bırakır', async () => {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(sysCols, []);
        const kb = apya.kanban.create({ projectId: null });
        kb.load();
        await flush();
        expect(document.querySelector('.kanban-note-col')).not.toBeNull();

        kb.setProject('p1');
        await flush();

        expect(document.querySelector('.kanban-note-col')).toBeNull();
        expect(document.querySelector('.js-add-col')).not.toBeNull();
    });
});

describe('kolon başlığındaki ＋ (görev ekle)', () => {
    it('createModal verilmezse çizilmez', async () => {
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(document.querySelector('.js-col-add-task')).toBeNull();
    });

    it('createModal + proje varsa her kolonda çizilir', async () => {
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: 'p1', createModal: { open() { } } }).load();
        await flush();

        expect(document.querySelectorAll('.js-col-add-task').length).toBe(4);
    });

    it('proje seçili değilken çizilmez (görev bir projeye açılır)', async () => {
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: null, createModal: { open() { } } }).load();
        await flush();

        expect(document.querySelector('.js-col-add-task')).toBeNull();
    });
});

describe('boş kolon metni', () => {
    it('kartı olmayan kolonda görünür, dolu kolonda görünmez', async () => {
        mountBoard(sysCols, [{ id: 't1', code: 'GRV-1', title: 'A', status: 1, priority: 2 }]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(col(1).querySelector('.kanban-empty')).toBeNull();
        expect(col(2).querySelector('.kanban-empty')).not.toBeNull();
        expect(col(3).querySelector('.kanban-empty-title').textContent).toBe('Test bekleyen iş yok');
    });

    it('boş metin kart sayılmaz — sayaç 0 kalır', async () => {
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(col(2).querySelector('.kanban-count').textContent).toBe('0');
    });

    it('özel kolonun kendi genel metni olur', async () => {
        mountBoard(sysCols.concat([customCol]), []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        const custom = document.querySelector('.js-custom-col');
        expect(custom.querySelector('.kanban-empty-title').textContent).toBe('Bu kolon boş');
    });
});

describe('sistem kolonunda WIP rozeti', () => {
    it('limit gelince "n / limit" yazar, aşımda is-over sınıfı alır', async () => {
        const cols = sysCols.map((c) => (c.statusValue === 2 ? { ...c, wipLimit: 1 } : c));
        mountBoard(cols, [
            { id: 't1', code: 'GRV-1', title: 'A', status: 2, priority: 2 },
            { id: 't2', code: 'GRV-2', title: 'B', status: 2, priority: 2 }
        ]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        const wip = col(2).querySelector('.kanban-wip');
        expect(wip.classList.contains('d-none')).toBe(false);
        expect(wip.textContent).toBe('2 / 1');
        expect(wip.classList.contains('is-over')).toBe(true);
    });

    it('limiti olmayan sistem kolonunda rozet gizli kalır', async () => {
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(col(1).querySelector('.kanban-wip').classList.contains('d-none')).toBe(true);
    });

    it('proje seçimi kalkınca sistem kolonunda bayat WIP limiti kalmaz', async () => {
        const cols = sysCols.map((c) => (c.statusValue === 2 ? { ...c, wipLimit: 1 } : c));
        mountBoard(cols, [{ id: 't1', code: 'GRV-1', title: 'A', status: 2, priority: 2 }]);
        const kb = apya.kanban.create({ projectId: 'p1' });
        kb.load();
        await flush();
        expect(col(2).getAttribute('data-wip-limit')).toBe('1');

        kb.setProject(null);
        await flush();

        // Board baştan çizilir; kolonu YENİDEN sorgula (eski düğüm artık kopuk).
        expect(col(2).hasAttribute('data-wip-limit')).toBe(false);
        expect(col(2).querySelector('.kanban-wip').classList.contains('d-none')).toBe(true);
    });
});

describe('kart kimlik rozeti', () => {
    it('görev kodunu basar (liste satırıyla aynı kimlik)', async () => {
        mountBoard(sysCols, [{ id: 'aaaa-bbbb', code: 'GRV-17', title: 'Kart', status: 1, priority: 2 }]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(document.querySelector('#kanban-todo .kanban-card small').textContent).toContain('GRV-17');
    });

    it('kod yoksa GUID kısaltmasına düşer', async () => {
        mountBoard(sysCols, [{ id: 'aaaa-bbbb', title: 'Kart', status: 1, priority: 2 }]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(document.querySelector('#kanban-todo .kanban-card small').textContent).toContain('#aaaa');
    });
});
