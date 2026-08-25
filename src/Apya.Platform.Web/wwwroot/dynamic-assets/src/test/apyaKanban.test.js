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
// Araç çubuğu da partial'da: "Grupla" kulvar açık panoda, "Kolonları düzenle"
// yetki + proje seçiliyken görünür (ikisi de JS tarafından açılıp kapanıyor).
function boardHtml(canBulk) {
    canBulk = canBulk === false ? 'false' : 'true';
    return `<div class="kanban-wrap">
        <div class="kanban-toolbar js-kanban-toolbar d-none">
            <label class="kanban-group js-kanban-group d-none">
                <select class="kanban-group-select js-group-select">
                    <option value="">Kulvar yok</option>
                    <option value="project">Projeye göre</option>
                    <option value="assignee">Atanana göre</option>
                </select>
            </label>
            <button type="button" class="kanban-edit-cols js-edit-cols d-none">Kolonları düzenle</button>
        </div>
        <div class="kanban-board"
            data-col-1="Yapılacak" data-col-2="Sürüyor"
            data-col-3="Testte" data-col-4="Tamamlandı"
            data-can-bulk="${canBulk}"></div>
        <div class="apya-console-bulkbar d-none js-kb-bar">
            <span class="js-kb-count">0 kart seçili</span>
            <div class="js-kb-move-menu"></div>
            <div class="js-kb-assign-menu"></div>
            <button type="button" class="js-kb-cancel-tasks">İptal et</button>
            <button type="button" class="js-kb-delete">Sil</button>
            <button type="button" class="js-kb-undo d-none">Geri al</button>
            <button type="button" class="js-kb-clear">x</button>
        </div>
    </div>`;
}
const hidden = (sel) => document.querySelector(sel).classList.contains('d-none');

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

// Kolon servisine giden çağrılar burada birikir: panel "tek kaydet"te YALNIZ
// değişen satırları göndermeli, sıra değişmediyse reorder'a hiç dokunmamalı.
let colCalls;

function mountBoard(cols, tasks, canBulk) {
    document.body.innerHTML = boardHtml(canBulk);
    colCalls = { update: [], reorder: [], create: [], delete: [], map: [], assign: [], priority: [], cancel: [], restore: [] };
    window.apya.platform = {
        tasks: {
            task: {
                getList: () => Promise.resolve({ items: tasks || [] }),
                getActiveTimeLog: () => Promise.resolve(null),
                getUsersLookup: () => Promise.resolve({ items: [{ id: 'u1', userName: 'burak' }, { id: 'u2', userName: 'selin' }] }),
                setAssignee: (id, uid) => { colCalls.assign.push({ id, uid }); return Promise.resolve(); },
                setPriority: (id, p) => { colCalls.priority.push({ id, p }); return Promise.resolve(); },
                cancel: (id, reason) => { colCalls.cancel.push({ id, reason }); return Promise.resolve(); },
                restoreFromCancel: (id) => { colCalls.restore.push(id); return Promise.resolve(); }
            }
        },
        projects: {
            boardColumn: {
                getListByProject: () => Promise.resolve(cols),
                update: (id, dto) => { colCalls.update.push({ id, dto }); return Promise.resolve({}); },
                reorder: (pid, ids) => { colCalls.reorder.push({ pid, ids }); return Promise.resolve(); },
                create: (dto) => { colCalls.create.push(dto); return Promise.resolve({}); },
                delete: (id) => { colCalls.delete.push(id); return Promise.resolve(); },
                setStatusMapping: (id, dto) => { colCalls.map.push({ id, dto }); return Promise.resolve({}); }
            }
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

        // 4 durum kolonu + İptal kolonu (Faz 4b, daraltılmış).
        expect(document.querySelectorAll('.kanban-column').length).toBe(5);
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

        const names = Array.from(document.querySelectorAll('.kanban-column:not(.js-add-col):not(.kanban-cancel-col) .kanban-title'))
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

// ── 3b "Kolonları düzenle" paneli ───────────────────────────────────────────
// Panel olaylarını jQuery delegasyonuyla DEĞİL doğrudan bağlıyor; bu yüzden
// panonun aksine etkileşimleri de burada doğrulanabiliyor.
describe('3b kolon paneli', () => {
    const rows = () => document.querySelectorAll('.kanban-panel-row');
    const nameInput = (i) => rows()[i].querySelector('.js-p-name');
    const wipInput = (i) => rows()[i].querySelector('.js-p-wip');
    const dirtyText = () => document.querySelector('.js-p-dirty').textContent;
    const saveBtn = () => document.querySelector('.js-p-save');

    async function openPanel(cols, tasks) {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(cols, tasks);
        const kb = apya.kanban.create({ projectId: 'p1' });
        kb.load();
        await flush();
        kb.openColumnPanel();
        await flush();
        return kb;
    }

    it('her kolon için satır açar, DB sırasını korur', async () => {
        await openPanel(sysCols.concat([customCol]), []);

        expect(rows().length).toBe(5);
        expect(nameInput(0).value).toBe('Yapılacak');
        expect(nameInput(4).value).toBe('Hakem değerlendirmesi');
        expect(document.querySelector('.kanban-panel-sub').textContent).toBe('5 kolon');
    });

    it('sistem satırında Kilit, özel satırında Sil düğmesi', async () => {
        await openPanel(sysCols.concat([customCol]), []);

        expect(rows()[0].querySelector('.kanban-panel-lock')).not.toBeNull();
        expect(rows()[0].querySelector('.js-p-del')).toBeNull();
        expect(rows()[4].querySelector('.js-p-del')).not.toBeNull();
        expect(rows()[4].querySelector('.kanban-panel-lock')).toBeNull();
    });

    it('meta satırı durumu ve kart sayısını söyler', async () => {
        await openPanel(sysCols.concat([customCol]), [
            { id: 't1', code: 'GRV-1', title: 'A', status: 2, priority: 2 },
            { id: 't2', code: 'GRV-2', title: 'B', status: 2, priority: 2 }
        ]);

        expect(rows()[1].querySelector('.js-p-meta').textContent).toBe('Sistem · durum: Sürüyor · 2 kart');
        expect(rows()[4].querySelector('.js-p-meta').textContent).toBe('Özel kolon · durumu değiştirmez · 0 kart');
    });

    it('açılışta değişiklik yok, kaydet kapalı', async () => {
        await openPanel(sysCols, []);

        expect(dirtyText()).toBe('Değişiklik yok');
        expect(saveBtn().disabled).toBe(true);
    });

    it('ad değişince sayaç ve kaydet düğmesi uyanır', async () => {
        await openPanel(sysCols, []);

        nameInput(2).value = 'Kod İncelemesi';
        nameInput(2).dispatchEvent(new Event('input'));

        expect(dirtyText()).toBe('1 değişiklik bekliyor');
        expect(saveBtn().disabled).toBe(false);
        expect(rows()[2].querySelector('.js-p-counter').textContent).toBe('14/64');
    });

    it('WIP limiti mevcut kart sayısının altına inince uyarır (ama engellemez)', async () => {
        await openPanel(sysCols, [
            { id: 't1', code: 'GRV-1', title: 'A', status: 2, priority: 2 },
            { id: 't2', code: 'GRV-2', title: 'B', status: 2, priority: 2 },
            { id: 't3', code: 'GRV-3', title: 'C', status: 2, priority: 2 }
        ]);

        const warn = rows()[1].querySelector('.js-p-warn');
        expect(warn.classList.contains('d-none')).toBe(true);

        wipInput(1).value = '2';
        wipInput(1).dispatchEvent(new Event('input'));

        expect(warn.classList.contains('d-none')).toBe(false);
        expect(warn.textContent).toContain('3 kart var');
        expect(warn.textContent).toContain('engellenmez');
    });

    it('kaydet YALNIZ değişen satırı gönderir, ad+renk+WIP birlikte gider', async () => {
        await openPanel(sysCols, []);

        nameInput(2).value = 'Kod İncelemesi';
        nameInput(2).dispatchEvent(new Event('input'));
        saveBtn().click();
        await flush();

        expect(colCalls.update.length).toBe(1);
        expect(colCalls.update[0].id).toBe('c3');
        // UpdateBoardColumnDto üç alanı BİRLİKTE ister; biri eksikse diğeri sıfırlanır.
        expect(colCalls.update[0].dto).toEqual({ name: 'Kod İncelemesi', colorClass: 'info', wipLimit: null });
    });

    it('sıra değişmediyse reorder çağrılmaz', async () => {
        await openPanel(sysCols, []);

        nameInput(0).value = 'Sırada';
        nameInput(0).dispatchEvent(new Event('input'));
        saveBtn().click();
        await flush();

        expect(colCalls.reorder.length).toBe(0);
    });

    it('renk seçimi tek kaydetmede ada eşlik eder', async () => {
        await openPanel(sysCols, []);

        rows()[0].querySelector('.js-col-color[data-color="danger"]').click();
        saveBtn().click();
        await flush();

        expect(colCalls.update.length).toBe(1);
        expect(colCalls.update[0].dto.colorClass).toBe('danger');
        expect(colCalls.update[0].dto.name).toBe('Yapılacak');
    });

    it('Vazgeç hiçbir şey göndermez ve paneli kapatır', async () => {
        await openPanel(sysCols, []);

        nameInput(1).value = 'Değişti';
        nameInput(1).dispatchEvent(new Event('input'));
        document.querySelector('.js-p-cancel').click();

        expect(document.querySelector('.kanban-panel')).toBeNull();
        expect(colCalls.update.length).toBe(0);
        expect(colCalls.reorder.length).toBe(0);
    });

    it('yetki yoksa panel hiç açılmaz', async () => {
        mountBoard(sysCols, []);
        const kb = apya.kanban.create({ projectId: 'p1' });
        kb.load();
        await flush();
        kb.openColumnPanel();
        await flush();

        expect(document.querySelector('.kanban-panel')).toBeNull();
    });

    it('proje seçili değilken panel açılmaz', async () => {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(sysCols, []);
        const kb = apya.kanban.create({ projectId: null });
        kb.load();
        await flush();
        kb.openColumnPanel();
        await flush();

        expect(document.querySelector('.kanban-panel')).toBeNull();
    });
});

// ── Faz 3: kart standardı (genel pano ↔ proje panosu farkı) ────────────────
describe('kartta proje adı', () => {
    const projTask = { id: 't1', code: 'GRV-1', title: 'A', status: 1, priority: 2, projectName: 'Finans Modülü' };

    it('genel panoda renkli şeritli proje adı basılır', async () => {
        mountBoard(sysCols, [projTask]);
        apya.kanban.create({ projectId: 'p1', showProjectName: true }).load();
        await flush();

        const p = document.querySelector('.kanban-card-project');
        expect(p).not.toBeNull();
        expect(p.textContent).toBe('Finans Modülü');
        // Ton sınıfı taşır (şerit rengi CSS'ten gelir); Bootstrap text-* KULLANILMAZ.
        expect(p.className).toContain('is-');
        expect(p.className).not.toContain('text-primary');
    });

    it('proje panosunda kartta proje adı görünmez', async () => {
        mountBoard(sysCols, [projTask]);
        apya.kanban.create({ projectId: 'p1', showProjectName: false }).load();
        await flush();

        expect(document.querySelector('.kanban-card-project')).toBeNull();
    });
});

describe('çizilmeyen özel kolon bilgisi', () => {
    const inCustom = {
        id: 't1', code: 'GRV-1', title: 'A', status: 2, priority: 2,
        boardColumnId: 'x9', boardColumnName: 'Hakem değerlendirmesi'
    };

    it('özel kolon bu panoda yokken kartta nerede olduğu yazar', async () => {
        // Proje seçili değil → özel kolonlar çizilmiyor, kart durum kolonunda duruyor.
        mountBoard(sysCols, [inCustom]);
        apya.kanban.create({ projectId: null }).load();
        await flush();

        const note = document.querySelector('.kanban-card-colnote');
        expect(note).not.toBeNull();
        expect(note.textContent).toContain('Projede özel kolon: Hakem değerlendirmesi');
    });

    it('özel kolon panoda çiziliyken bilgi tekrarlanmaz', async () => {
        mountBoard(sysCols.concat([customCol]), [inCustom]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(document.querySelector('.kanban-card-colnote')).toBeNull();
        // Kart özel kolonun içinde duruyor.
        expect(document.querySelector('#kanban-col-x9 .kanban-card')).not.toBeNull();
    });
});

// ── Faz 3: kulvarlar (kolon içi gruplama) ──────────────────────────────────
describe('kulvarlar', () => {
    const tasks = [
        { id: 't1', code: 'GRV-1', title: 'A', status: 1, priority: 2, projectName: 'Finans', assigneeName: 'Burak Y.' },
        { id: 't2', code: 'GRV-2', title: 'B', status: 1, priority: 2, projectName: 'Altyapı', assigneeName: 'Burak Y.' },
        { id: 't3', code: 'GRV-3', title: 'C', status: 1, priority: 2, projectName: 'Finans' },
        { id: 't4', code: 'GRV-4', title: 'D', status: 2, priority: 2, projectName: 'Finans', assigneeName: 'Selin E.' }
    ];
    const laneNames = (statusId) =>
        Array.from(col(statusId).querySelectorAll('.kanban-lane-name')).map((n) => n.textContent);

    beforeEach(() => { localStorage.removeItem('apya-kanban-group'); });

    it('kulvar kapalıyken başlık basılmaz', async () => {
        mountBoard(sysCols, tasks);
        apya.kanban.create({ projectId: null, showProjectName: true, enableLanes: true }).load();
        await flush();

        expect(document.querySelector('.kanban-lane-head')).toBeNull();
    });

    it('projeye göre gruplar, kolon içinde alfabetik sıralar', async () => {
        mountBoard(sysCols, tasks);
        const kb = apya.kanban.create({ projectId: null, showProjectName: true, enableLanes: true });
        kb.load();
        await flush();
        kb.setGrouping('project');
        await flush();

        expect(laneNames(1)).toEqual(['Altyapı', 'Finans']);
        expect(laneNames(2)).toEqual(['Finans']);
        // Sayaç kulvardaki kart sayısını gösterir.
        const counts = Array.from(col(1).querySelectorAll('.kanban-lane-count')).map((n) => n.textContent);
        expect(counts).toEqual(['1', '2']);
    });

    it('projeye göre gruplanınca kart üstündeki proje adı kalkar', async () => {
        mountBoard(sysCols, tasks);
        const kb = apya.kanban.create({ projectId: null, showProjectName: true, enableLanes: true });
        kb.load();
        await flush();
        expect(document.querySelector('.kanban-card-project')).not.toBeNull();

        kb.setGrouping('project');
        await flush();

        expect(document.querySelector('.kanban-card-project')).toBeNull();
    });

    it('atanana göre gruplar, atanmamışları sona koyar', async () => {
        mountBoard(sysCols, tasks);
        const kb = apya.kanban.create({ projectId: null, showProjectName: true, enableLanes: true });
        kb.load();
        await flush();
        kb.setGrouping('assignee');
        await flush();

        expect(laneNames(1)).toEqual(['Burak Y.', 'Atanmamış']);
    });

    it('kulvar başlığı kart sayılmaz — kolon sayacı bozulmaz', async () => {
        mountBoard(sysCols, tasks);
        const kb = apya.kanban.create({ projectId: null, showProjectName: true, enableLanes: true });
        kb.load();
        await flush();
        kb.setGrouping('project');
        await flush();

        expect(col(1).querySelector('.kanban-count').textContent).toBe('3');
    });

    it('seçim localStorage\'da kalır ve seçici onu yansıtır', async () => {
        mountBoard(sysCols, tasks);
        const kb = apya.kanban.create({ projectId: null, showProjectName: true, enableLanes: true });
        kb.load();
        await flush();
        kb.setGrouping('assignee');
        await flush();

        expect(localStorage.getItem('apya-kanban-group')).toBe('assignee');
        expect(kb.getGrouping()).toBe('assignee');
    });

});

describe('araç çubuğu görünürlüğü', () => {
    it('kulvar açık panoda "Grupla" görünür, "Kolonları düzenle" yetkisizde gizli', async () => {
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: null, enableLanes: true }).load();
        await flush();

        expect(hidden('.js-kanban-toolbar')).toBe(false);
        expect(hidden('.js-kanban-group')).toBe(false);
        expect(hidden('.js-edit-cols')).toBe(true);
    });

    it('proje panosunda "Grupla" gizli — tek proje zaten var', async () => {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(hidden('.js-kanban-group')).toBe(true);
        expect(hidden('.js-edit-cols')).toBe(false);
        expect(hidden('.js-kanban-toolbar')).toBe(false);
    });

    it('ne kulvar ne kolon yetkisi varsa çubuğun tamamı gizlenir', async () => {
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(hidden('.js-kanban-toolbar')).toBe(true);
    });

    it('genel panoda proje seçilince "Kolonları düzenle" açılır', async () => {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(sysCols, []);
        const kb = apya.kanban.create({ projectId: null, enableLanes: true });
        kb.load();
        await flush();
        expect(hidden('.js-edit-cols')).toBe(true);

        kb.setProject('p1');
        await flush();

        expect(hidden('.js-edit-cols')).toBe(false);
    });
});

// ── Faz 4a: özel kolon → durum eşlemesi ────────────────────────────────────
describe('eşlemeli özel kolon', () => {
    // statusValue DOLU ama isSystem false: kendi kolonu olarak yaşamalı.
    const mapped = {
        id: 'x9', statusValue: 3, name: 'Hakem değerlendirmesi',
        colorClass: 'primary', order: 4, isSystem: false
    };

    it('sistem kolonuna karışmaz, kendi kolonu olarak çizilir', async () => {
        mountBoard(sysCols.concat([mapped]), []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        // Beş ayrı kolon: eşleme "Testte"ye olsa da kolon kendi başına duruyor.
        expect(document.querySelectorAll('.kanban-column:not(.js-add-col):not(.kanban-cancel-col)').length).toBe(5);
        const own = document.querySelector('.js-custom-col');
        expect(own).not.toBeNull();
        expect(own.hasAttribute('data-status-id')).toBe(false);
        expect(own.querySelector('.kanban-cards').id).toBe('kanban-col-x9');
        // Sistem "Testte" kolonu hâlâ tek ve kendi kabına sahip.
        expect(document.querySelectorAll('.kanban-column[data-status-id="3"]').length).toBe(1);
        expect(col(3).querySelector('.kanban-cards').id).toBe('kanban-inreview');
    });

    it('eşlemeli kolondaki kart o kolonda durur (durum kolonunda değil)', async () => {
        mountBoard(sysCols.concat([mapped]), [
            { id: 't1', code: 'GRV-1', title: 'A', status: 3, priority: 2, boardColumnId: 'x9', boardColumnName: 'Hakem değerlendirmesi' }
        ]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(document.querySelector('#kanban-col-x9 .kanban-card')).not.toBeNull();
        expect(document.querySelector('#kanban-inreview .kanban-card')).toBeNull();
    });

    it('silme kilidi yalnız sistem kolonunda — eşlemeli özel kolon silinebilir', async () => {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(sysCols.concat([mapped]), []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        const own = document.querySelector('.js-custom-col');
        expect(own.querySelector('.js-col-delete')).not.toBeNull();
        expect(own.querySelector('.apya-console-menu-item.is-locked')).toBeNull();
    });
});

describe('panelde durum eşlemesi', () => {
    const rows = () => document.querySelectorAll('.kanban-panel-row');
    const saveBtn = () => document.querySelector('.js-p-save');

    async function openPanel(cols, tasks) {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(cols, tasks);
        const kb = apya.kanban.create({ projectId: 'p1' });
        kb.load();
        await flush();
        kb.openColumnPanel();
        await flush();
        return kb;
    }

    it('eşleme seçici yalnız özel kolon satırında çıkar', async () => {
        await openPanel(sysCols.concat([customCol]), []);

        expect(rows()[0].querySelector('.js-p-status')).toBeNull();   // sistem
        expect(rows()[4].querySelector('.js-p-status')).not.toBeNull(); // özel
    });

    it('meta satırı eşlemeyi yansıtır', async () => {
        await openPanel(sysCols.concat([customCol]), []);
        const row = rows()[4];
        expect(row.querySelector('.js-p-meta').textContent).toContain('durumu değiştirmez');

        const sel = row.querySelector('.js-p-status');
        sel.value = '3';
        sel.dispatchEvent(new Event('change'));

        expect(row.querySelector('.js-p-meta').textContent).toContain('durum: Testte');
    });

    it('"mevcut kartları da güncelle" yalnız kart varken sorulur', async () => {
        await openPanel(sysCols.concat([customCol]), []);
        const row = rows()[4];
        const sel = row.querySelector('.js-p-status');
        sel.value = '3';
        sel.dispatchEvent(new Event('change'));

        // Kolon boş → seçenek anlamsız.
        expect(row.querySelector('.js-p-apply-wrap').classList.contains('d-none')).toBe(true);
    });

    it('kartı olan kolonda seçenek çıkar ve kaydete taşınır', async () => {
        await openPanel(sysCols.concat([customCol]), [
            { id: 't1', code: 'GRV-1', title: 'A', status: 2, priority: 2, boardColumnId: 'x9', boardColumnName: 'Hakem değerlendirmesi' }
        ]);
        const row = rows()[4];
        const sel = row.querySelector('.js-p-status');
        sel.value = '3';
        sel.dispatchEvent(new Event('change'));

        const wrap = row.querySelector('.js-p-apply-wrap');
        expect(wrap.classList.contains('d-none')).toBe(false);

        const box = row.querySelector('.js-p-apply');
        box.checked = true;
        box.dispatchEvent(new Event('change'));

        saveBtn().click();
        await flush();

        expect(colCalls.map.length).toBe(1);
        expect(colCalls.map[0].id).toBe('x9');
        expect(colCalls.map[0].dto).toEqual({ statusValue: 3, applyToExistingTasks: true });
        // Eşleme AYRI uçtan gitti; ad/renk/WIP güncellemesi tetiklenmedi.
        expect(colCalls.update.length).toBe(0);
    });

    it('eşleme değişmediyse ayrı uç hiç çağrılmaz', async () => {
        await openPanel(sysCols.concat([customCol]), []);
        const nameInput = rows()[4].querySelector('.js-p-name');
        nameInput.value = 'Yeni ad';
        nameInput.dispatchEvent(new Event('input'));

        saveBtn().click();
        await flush();

        expect(colCalls.update.length).toBe(1);
        expect(colCalls.map.length).toBe(0);
    });

    it('eşleme değişikliği de "n değişiklik bekliyor" sayacına girer', async () => {
        await openPanel(sysCols.concat([customCol]), []);
        const sel = rows()[4].querySelector('.js-p-status');
        sel.value = '2';
        sel.dispatchEvent(new Event('change'));

        expect(document.querySelector('.js-p-dirty').textContent).toBe('1 değişiklik bekliyor');
        expect(saveBtn().disabled).toBe(false);
    });
});

// ── Faz 5: panoda toplu seçim (4c) ─────────────────────────────────────────
describe('panoda toplu seçim', () => {
    const tasks = [
        { id: 't1', code: 'GRV-1', title: 'A', status: 1, priority: 2 },
        { id: 't2', code: 'GRV-2', title: 'B', status: 1, priority: 2 },
        { id: 't3', code: 'GRV-3', title: 'C', status: 1, priority: 2 },
        { id: 't4', code: 'GRV-4', title: 'D', status: 2, priority: 2 }
    ];
    const card = (id) => document.querySelector(`.kanban-card[data-id="${id}"]`);
    const bar = () => document.querySelector('.js-kb-bar');

    it('yetki yoksa kartta onay kutusu çizilmez', async () => {
        mountBoard(sysCols, tasks, false);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(document.querySelector('.kanban-card-check')).toBeNull();
    });

    it('yetki varsa her kartta onay kutusu olur, çubuk başta gizli', async () => {
        mountBoard(sysCols, tasks);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(document.querySelectorAll('.kanban-card-check').length).toBe(4);
        expect(bar().classList.contains('d-none')).toBe(true);
    });

    it('taşı menüsü panodaki kolonlardan doldurulur (özel kolon dâhil)', async () => {
        mountBoard(sysCols.concat([customCol]), tasks);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        const items = Array.from(document.querySelectorAll('.js-kb-move-menu .js-kb-move'))
            .map((b) => b.textContent);
        expect(items).toEqual(['Yapılacak', 'Sürüyor', 'Testte', 'Tamamlandı', 'Hakem değerlendirmesi']);
        // Proje seçiliyken sistem kolonlarının da DB kaydı var: taşıma hepsinde
        // kolon ucundan gider (MoveTaskToColumnAsync sistemde durumu değiştirip
        // bağı temizliyor, özel kolonda bağı koruyor).
        expect(document.querySelector('.js-kb-move[data-column-id="x9"]')).not.toBeNull();
        expect(document.querySelectorAll('.js-kb-move[data-column-id]').length).toBe(5);
        expect(document.querySelectorAll('.js-kb-move[data-status-id]').length).toBe(0);
    });

    it('proje seçili değilken taşı hedefleri durum üzerinden kurulur', async () => {
        mountBoard(sysCols, tasks);
        apya.kanban.create({ projectId: null }).load();
        await flush();

        // DB kolonu yok → data-column-id hiç yazılmamalı, hepsi durum hedefi.
        expect(document.querySelectorAll('.js-kb-move[data-column-id]').length).toBe(0);
        expect(document.querySelectorAll('.js-kb-move[data-status-id]').length).toBe(4);
    });

    it('kartlar seçim için gereken durumu taşır (geri alma anlık görüntüsü)', async () => {
        mountBoard(sysCols, tasks);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(card('t4').getAttribute('data-status')).toBe('2');
        expect(card('t1').closest('.kanban-column').getAttribute('data-status-id')).toBe('1');
    });

    it('geri al düğmesi işlem yapılmadan görünmez', async () => {
        mountBoard(sysCols, tasks);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(document.querySelector('.js-kb-undo').classList.contains('d-none')).toBe(true);
    });
});

describe('toplu ata / öncelik', () => {
    it('Ata menüsü kullanıcı listesinden dolar, başına "Atamayı kaldır" gelir', async () => {
        mountBoard(sysCols, [{ id: 't1', code: 'GRV-1', title: 'A', status: 1, priority: 2 }]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        const items = Array.from(document.querySelectorAll('.js-kb-assign-menu .js-kb-assign'))
            .map((b) => b.textContent);
        expect(items).toEqual(['Atamayı kaldır', 'burak', 'selin']);
        // "Atamayı kaldır" kullanıcı id'si taşımaz → null gider.
        expect(document.querySelector('.js-kb-assign').hasAttribute('data-user-id')).toBe(false);
    });

    it('kullanıcı listesi her render\'da yeniden istenmez', async () => {
        mountBoard(sysCols, []);
        const kb = apya.kanban.create({ projectId: 'p1' });
        kb.load();
        await flush();
        kb.load();
        await flush();

        expect(document.querySelectorAll('.js-kb-assign-menu .js-kb-assign').length).toBe(3);
    });
});

// ── Faz 6 (4b): İptal kolonu ───────────────────────────────────────────────
describe('İptal kolonu', () => {
    const cancelled = {
        id: 'tc', code: 'GRV-9', title: 'Eski hibe formu migrasyonu', status: 0, priority: 2,
        cancelReason: 'kapsam dışı bırakıldı', cancelledDate: '2026-08-12T00:00:00Z'
    };
    const cancelCol = () => document.querySelector('.kanban-cancel-col');

    beforeEach(() => { localStorage.removeItem('apya-kanban-cancelled'); });

    it('panoda daima var ve varsayılan daraltılmış', async () => {
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(cancelCol()).not.toBeNull();
        expect(cancelCol().classList.contains('is-collapsed')).toBe(true);
        expect(cancelCol().getAttribute('data-status-id')).toBe('0');
    });

    it('iptal edilen kart artık düşmüyor — İptal kolonunda render ediliyor', async () => {
        // Eskiden SYS haritasında 0 yoktu; kart sessizce kayboluyordu.
        mountBoard(sysCols, [cancelled]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(document.querySelector('#kanban-cancelled .kanban-card')).not.toBeNull();
        expect(cancelCol().querySelector('.kanban-count').textContent).toBe('1');
    });

    it('kartta iptal tarihi, sebebi ve geri alma düğmesi bulunur', async () => {
        mountBoard(sysCols, [cancelled]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        const note = document.querySelector('.kanban-cancel-note');
        expect(note.querySelector('.kanban-cancel-when').textContent).toContain('İPTAL');
        expect(note.querySelector('.kanban-cancel-why').textContent).toBe('Sebep: kapsam dışı bırakıldı');
        expect(note.querySelector('.js-restore-task')).not.toBeNull();
    });

    it('sebepsiz iptalde sebep satırı basılmaz', async () => {
        mountBoard(sysCols, [{ ...cancelled, cancelReason: null }]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(document.querySelector('.kanban-cancel-why')).toBeNull();
        expect(document.querySelector('.kanban-cancel-when')).not.toBeNull();
    });

    it('tercih açıkken kolon genişlemiş gelir', async () => {
        localStorage.setItem('apya-kanban-cancelled', '1');
        mountBoard(sysCols, [cancelled]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(cancelCol().classList.contains('is-collapsed')).toBe(false);
    });

    it('toplu "Taşı" hedefleri arasında YOKTUR (iptal sebep sorar)', async () => {
        mountBoard(sysCols, [cancelled]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        const items = Array.from(document.querySelectorAll('.js-kb-move')).map((b) => b.textContent);
        expect(items).not.toContain('İptal edildi');
    });
});

describe('araç çubuğu markup konumuna dayanıklı', () => {
    it('çubuk sarmalayıcının DIŞINDA olsa da açılır (canlı QA regresyonu)', async () => {
        // Gerçek partial'da çubuk bir ara .kanban-wrap dışına taşınmıştı ve
        // board.parentNode araması onu bulamayıp sessizce gizli bırakmıştı.
        mountBoard(sysCols, []);
        const wrap = document.querySelector('.kanban-wrap');
        const bar = document.querySelector('.js-kanban-toolbar');
        wrap.parentNode.insertBefore(bar, wrap);   // çubuğu dışarı taşı

        apya.kanban.create({ projectId: null, enableLanes: true }).load();
        await flush();

        expect(bar.classList.contains('d-none')).toBe(false);
        expect(bar.querySelector('.js-kanban-group').classList.contains('d-none')).toBe(false);
    });
});

// ── Faz 7: risk dili + kart meta rozetleri ─────────────────────────────────
describe('risk dili ve kart meta', () => {
    const gecmis = new Date(Date.now() - 3 * 864e5).toISOString();
    const ileri = new Date(Date.now() + 10 * 864e5).toISOString();

    beforeEach(() => {
        // moment stub'ı gerçek tarih farkı hesaplasın (gün sayısı testi için).
        global.moment = (d) => ({
            diff: (other, unit) => {
                const a = d ? new Date(d).getTime() : Date.now();
                const b = other && other.__t ? other.__t : Date.now();
                const ms = a - b;
                return unit === 'days' ? Math.trunc(ms / 864e5) : Math.trunc(ms / 36e5);
            },
            format: () => '01 Oca',
            __t: d ? new Date(d).getTime() : Date.now()
        });
    });

    it('gecikmiş kartta gün sayısı yazar', async () => {
        mountBoard(sysCols, [{ id: 't1', code: 'GRV-1', title: 'A', status: 1, priority: 2, dueDate: gecmis }]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        const chip = document.querySelector('.kanban-chip-late');
        expect(chip).not.toBeNull();
        expect(chip.textContent).toBe('3 gün gecikti');
    });

    it('zamanı gelmemiş kartta gecikme rozeti olmaz', async () => {
        mountBoard(sysCols, [{ id: 't1', code: 'GRV-1', title: 'A', status: 1, priority: 2, dueDate: ileri }]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(document.querySelector('.kanban-chip-late')).toBeNull();
    });

    it('tamamlanmış kart gecikmiş sayılmaz', async () => {
        mountBoard(sysCols, [{ id: 't1', code: 'GRV-1', title: 'A', status: 4, priority: 2, dueDate: gecmis }]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(document.querySelector('.kanban-chip-late')).toBeNull();
    });

    it('engelli kart bekleten görevin kodunu taşır', async () => {
        mountBoard(sysCols, [{ id: 't1', code: 'GRV-1', title: 'A', status: 2, priority: 2, blockedByCodes: ['GRV-12', 'GRV-15'] }]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(document.querySelector('.kanban-chip-blocked').textContent).toContain('Engelli · GRV-12, GRV-15');
    });

    it('yorum, ek ve alt görev sayaçları basılır; sıfır olanlar basılmaz', async () => {
        mountBoard(sysCols, [{
            id: 't1', code: 'GRV-1', title: 'A', status: 1, priority: 2,
            commentCount: 2, attachmentCount: 0, subTaskCount: 8, completedSubTaskCount: 3
        }]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        const meta = document.querySelector('.kanban-card-meta').textContent;
        expect(meta).toContain('2');
        expect(meta).toContain('3/8');
        expect(document.querySelectorAll('.kanban-card-metaitem').length).toBe(2); // ek yok
    });

    it('kolon başlığı gecikmiş/engelli özetini gösterir', async () => {
        mountBoard(sysCols, [
            { id: 't1', code: 'GRV-1', title: 'A', status: 1, priority: 2, dueDate: gecmis },
            { id: 't2', code: 'GRV-2', title: 'B', status: 1, priority: 2, dueDate: gecmis },
            { id: 't3', code: 'GRV-3', title: 'C', status: 1, priority: 2, blockedByCodes: ['GRV-9'] }
        ]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        const sum = col(1).querySelector('.kanban-col-summary');
        expect(sum.querySelector('.is-late').textContent).toBe('2 gecikmiş');
        expect(sum.querySelector('.is-blocked').textContent).toBe('1 engelli');
    });

    it('pano üstü uyarı şeridi toplamları söyler, risk yokken hiç çizilmez', async () => {
        mountBoard(sysCols, [
            { id: 't1', code: 'GRV-1', title: 'A', status: 1, priority: 2, dueDate: gecmis },
            { id: 't2', code: 'GRV-2', title: 'B', status: 2, priority: 2, blockedByCodes: ['GRV-9'] }
        ]);
        const kb = apya.kanban.create({ projectId: 'p1' });
        kb.load();
        await flush();
        expect(document.querySelector('.kanban-risk-strip').textContent)
            .toContain('1 görev gecikmiş, 1 görev engelli.');

        // Riskler kalkınca şerit de kalkmalı.
        mountBoard(sysCols, [{ id: 't3', code: 'GRV-3', title: 'C', status: 1, priority: 2 }]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();
        expect(document.querySelector('.kanban-risk-strip')).toBeNull();
    });
});
