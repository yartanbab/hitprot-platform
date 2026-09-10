import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { installJqueryShim } from './jqueryShim';

/*
 * /Tasks "Finans" paneli (PR-3b): proje gruplu harcamalar, Genel gider havuzu,
 * para birimi başına toplamlar, koyu genel toplam bandı. Sunucu sözleşmesi
 * ExpenseAppService.GetProjectGroupedAsync — burada stub'lanır; test edilen
 * RENDER kararlarıdır (grup sırası, amber havuz, kısmi satır notu, katlama,
 * kapsam diyaloğu köprüsü).
 */

let mount;
let groupedResult;
let scopeOpen;
let setProjectSpy;

beforeAll(async () => {
    installJqueryShim();
    global.abp = {
        localization: { getResource: () => (k) => k },
        notify: { success() {}, error() {} }
    };
    scopeOpen = vi.fn();
    global.apya = {
        financeScope: { open: (o) => scopeOpen(o) },
        platform: { expenses: { expense: {
            getProjectGrouped: () => Promise.resolve(groupedResult)
        } } }
    };

    await import('../../../js/apya-task-finance.js');
});

const GROUPS = () => ({
    groups: [
        {
            projectId: 'p1', projectName: 'Yeşil Enerji', projectCode: 'PRJ-014',
            totalCount: 3,
            totals: [{ currency: 'TRY', total: 11650, count: 3 }],
            rows: [
                { id: 'e1', title: 'Sunucu kiralama', amount: 11650, currency: 'TRY', expenseDate: '2026-09-01T00:00:00', category: 5, taskId: 't1', taskTitle: 'Test ortamı' },
                { id: 'e2', title: 'Lisans', amount: 900, currency: 'TRY', expenseDate: '2026-09-02T00:00:00', category: 5, taskId: null, taskTitle: null }
            ]
        },
        {
            projectId: null, projectName: 'Genel gider', projectCode: null,
            totalCount: 1,
            totals: [{ currency: 'TRY', total: 940, count: 1 }],
            rows: [
                { id: 'e3', title: 'Kargo giderleri', amount: 940, currency: 'TRY', expenseDate: '2026-09-03T00:00:00', category: 0, taskId: null, taskTitle: null }
            ]
        }
    ],
    grandTotals: [
        { currency: 'TRY', total: 12590, count: 4 },
        { currency: 'EUR', total: 250, count: 1 }
    ],
    rowsTruncated: false
});

function create() {
    setProjectSpy = vi.fn();
    const fin = global.apya.taskFinance.create({
        mount: '#mount',
        getProject: () => '',
        setProject: setProjectSpy,
        getProjects: () => [{ id: 'p1', name: 'Yeşil Enerji', code: 'PRJ-014' }],
        openTask: vi.fn()
    });
    return fin;
}

const flush = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => {
    document.body.innerHTML = '<div id="mount"></div>';
    mount = document.getElementById('mount');
    groupedResult = GROUPS();
    scopeOpen.mockClear?.();
});

describe('apya.taskFinance', () => {
    it('proje gruplarini ara toplam ve kod pilliyle basar', async () => {
        await create().load(); await flush();

        expect(mount.textContent).toContain('Yeşil Enerji');
        expect(mount.textContent).toContain('PRJ-014');
        expect(mount.textContent).toContain('ara toplam');
        expect(mount.textContent).toContain('11.650,00 ₺');
        expect(mount.querySelectorAll('.apya-fin-group').length).toBe(2);
    });

    it('Genel gider havuzu amber gruptur, butceye sayilmaz pili tasir ve SONDADIR', async () => {
        await create().load(); await flush();

        const groups = mount.querySelectorAll('.apya-fin-group');
        const last = groups[groups.length - 1];
        expect(last.classList.contains('is-pool')).toBe(true);
        expect(last.textContent).toContain('bütçeye sayılmaz');
        expect(last.textContent).toContain('havuz toplamı');
    });

    it('koyu bant para birimi BASINA toplam yazar — kur uydurulmaz', async () => {
        await create().load(); await flush();

        const grand = mount.querySelector('.apya-fin-grand');
        expect(grand.textContent).toContain('12.590,00 ₺');
        expect(grand.textContent).toContain('250,00 EUR');
    });

    it('grupta gorunen satir sayisi toplamdan azsa kismi liste notu basar', async () => {
        groupedResult.groups[0].totalCount = 60; // rows: 2
        await create().load(); await flush();

        expect(mount.textContent).toContain('Son 2 kayıt gösteriliyor');
        expect(mount.textContent).toContain('60 kayıttan');
    });

    it('grup basligina tiklama grubu katlar', async () => {
        await create().load(); await flush();
        expect(mount.querySelectorAll('.apya-fin-row').length).toBe(3);

        mount.querySelector('[data-fin="toggle"][data-key="p1"]').click();
        await flush();

        // p1 kapandı → yalnız havuz satırı kaldı; toplamlar başlıkta durur.
        expect(mount.querySelectorAll('.apya-fin-row').length).toBe(1);
        expect(mount.textContent).toContain('11.650,00 ₺');
    });

    it('İliskiyi degistir satiri paylasilan diyalogu proje secenekleriyle acar', async () => {
        await create().load(); await flush();

        mount.querySelector('[data-fin="change-scope"]').click();

        expect(scopeOpen).toHaveBeenCalledTimes(1);
        const arg = scopeOpen.mock.calls[0][0];
        expect(arg.kind).toBe('expense');
        expect(arg.record.id).toBe('e1');
        expect(arg.projectOptions.length).toBe(1);
    });

    it('proje pill menusunden secim konsol state ine yazilir', async () => {
        await create().load(); await flush();

        const items = mount.querySelectorAll('[data-fin="project-pick"]');
        // [0] = Tümü, [1] = Yeşil Enerji
        items[1].click();
        expect(setProjectSpy).toHaveBeenCalledWith('p1');
    });

    it('hic grup yokken bos durumu basar', async () => {
        groupedResult = { groups: [], grandTotals: [], rowsTruncated: false };
        await create().load(); await flush();

        expect(mount.querySelector('.apya-console-state')).not.toBeNull();
        expect(mount.textContent).toContain('Tasks:Finance:Empty');
    });
});
