import { describe, it, expect, beforeAll, beforeEach } from 'vitest';

// wwwroot/js/apya-kanban.js bir IIFE; jQuery + Sortable + abp + moment'i global
// bekler. Burada YALNIZ kullanılan yüzeyleri sağlanır (apyaTaskRender.test.js ile
// aynı desen). Test edilen davranışlar sürükle-bırak değil, RENDER kararları:
// hangi kontrol kime çiziliyor, rozetlere ne yazılıyor.
//
// Sürükleme/ölçme gibi gerçek jQuery isteyen parçalar kapsam dışı — repoda jQuery
// devDependency yok (bkz. apyaTaskConsole.test.js'teki aynı not).

let granted = {};

// _KanbanBoard.cshtml'in birebir yansıması. Partial değişirse burası da değişmeli;
// WIP rozeti markup'ı orada bulunmazsa updateCounts sessizce hiçbir şey yapmaz.
function boardHtml() {
    const col = (status, id, tone, title) =>
        `<div class="kanban-column" data-status-id="${status}">
            <div class="kanban-header">
                <span class="kanban-title"><i class="fa fa-circle me-2"></i>${title}</span>
                <span class="d-flex align-items-center gap-2">
                    <span class="apya-chip apya-chip-${tone} kanban-count">0</span>
                    <span class="kanban-wip d-none" title="WIP limiti"></span>
                </span>
            </div>
            <div class="kanban-cards" id="${id}"></div>
        </div>`;
    return `<div class="kanban-board">
        ${col(1, 'kanban-todo', 'neutral', 'Yapılacak')}
        ${col(2, 'kanban-inprogress', 'warning', 'Sürüyor')}
        ${col(3, 'kanban-inreview', 'brand', 'Testte')}
        ${col(4, 'kanban-done', 'positive', 'Tamamlandı')}
    </div>`;
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

beforeAll(async () => {
    global.$ = function () { return { on() { return this; } }; };
    global.$.extend = Object.assign;
    global.jQuery = global.$;
    global.Sortable = class { destroy() { } };
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
});

describe('kolon düzenleme yetkisi (Projects.Edit)', () => {
    it('yetki YOKSA ⋯ menüsü ve "Kolon ekle" karosu çizilmez — özel kolon yine görünür', async () => {
        mountBoard(sysCols.concat([customCol]), []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        // Kolon duruyor: kartları kaybolmasın diye görünürlük yetkiye bağlı DEĞİL.
        expect(document.querySelector('.js-custom-col')).not.toBeNull();
        expect(document.querySelector('.js-custom-col .js-col-name').textContent).toContain('Hakem değerlendirmesi');

        // Düzenleme yüzeyi yok.
        expect(document.querySelector('.kanban-col-menu')).toBeNull();
        expect(document.querySelector('.js-col-delete')).toBeNull();
        expect(document.querySelector('.js-col-wip-save')).toBeNull();
        expect(document.querySelector('.js-add-col')).toBeNull();
    });

    it('yetki VARSA ⋯ menüsü ve "Kolon ekle" karosu çizilir', async () => {
        granted['Platform.Projects.Edit'] = true;
        mountBoard(sysCols.concat([customCol]), []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        expect(document.querySelector('.kanban-col-menu')).not.toBeNull();
        expect(document.querySelector('.js-col-rename')).not.toBeNull();
        expect(document.querySelector('.js-col-delete')).not.toBeNull();
        expect(document.querySelector('.js-add-col')).not.toBeNull();
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

describe('sistem kolonunda WIP rozeti', () => {
    it('limit gelince "n / limit" yazar, aşımda is-over sınıfı alır', async () => {
        const cols = sysCols.map((c) => (c.statusValue === 2 ? { ...c, wipLimit: 1 } : c));
        mountBoard(cols, [
            { id: 't1', code: 'GRV-1', title: 'A', status: 2, priority: 2 },
            { id: 't2', code: 'GRV-2', title: 'B', status: 2, priority: 2 }
        ]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        const wip = document.querySelector('.kanban-column[data-status-id="2"] .kanban-wip');
        expect(wip.classList.contains('d-none')).toBe(false);
        expect(wip.textContent).toBe('2 / 1');
        expect(wip.classList.contains('is-over')).toBe(true);
    });

    it('limiti olmayan sistem kolonunda rozet gizli kalır', async () => {
        mountBoard(sysCols, []);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        const wip = document.querySelector('.kanban-column[data-status-id="1"] .kanban-wip');
        expect(wip.classList.contains('d-none')).toBe(true);
    });

    it('proje seçimi kalkınca sistem kolonundaki bayat WIP limiti silinir', async () => {
        const cols = sysCols.map((c) => (c.statusValue === 2 ? { ...c, wipLimit: 1 } : c));
        mountBoard(cols, [{ id: 't1', code: 'GRV-1', title: 'A', status: 2, priority: 2 }]);
        const kb = apya.kanban.create({ projectId: 'p1' });
        kb.load();
        await flush();

        const col = document.querySelector('.kanban-column[data-status-id="2"]');
        expect(col.getAttribute('data-wip-limit')).toBe('1');

        kb.setProject(null);
        await flush();

        expect(col.hasAttribute('data-wip-limit')).toBe(false);
        expect(col.querySelector('.kanban-wip').classList.contains('d-none')).toBe(true);
    });
});

describe('kart kimlik rozeti', () => {
    it('görev kodunu basar (liste satırıyla aynı kimlik)', async () => {
        mountBoard(sysCols, [{ id: 'aaaa-bbbb', code: 'GRV-17', title: 'Kart', status: 1, priority: 2 }]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        const badge = document.querySelector('#kanban-todo .kanban-card small');
        expect(badge.textContent).toContain('GRV-17');
    });

    it('kod yoksa GUID kısaltmasına düşer', async () => {
        mountBoard(sysCols, [{ id: 'aaaa-bbbb', title: 'Kart', status: 1, priority: 2 }]);
        apya.kanban.create({ projectId: 'p1' }).load();
        await flush();

        const badge = document.querySelector('#kanban-todo .kanban-card small');
        expect(badge.textContent).toContain('#aaaa');
    });
});
