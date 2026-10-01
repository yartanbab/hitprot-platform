import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { projectTasks } from './api';

/* STA-15: paylaşılan görev listesi önbelleği hiç temizlenmiyordu; yeni ya da
   değişen görev panellerde '(görünmeyen görev)' / eski durumla kalıyordu. */

const dataChanged = (entity) =>
    document.dispatchEvent(new CustomEvent('apya:data-changed', { detail: { entity } }));

let getList;
beforeEach(() => {
    // Testler arası önbellek sızmasın: modül önbelleği görev olayıyla boşalır.
    dataChanged('task');
    getList = vi.fn(() => Promise.resolve({ items: [{ id: 't1' }] }));
    window.apya = { platform: { tasks: { task: { getList } } } };
});
afterEach(() => { delete window.apya; });

describe('projectTasks önbelleği', () => {
    it('aynı proje için tek istek atar', async () => {
        await projectTasks('p1');
        await projectTasks('p1');

        expect(getList).toHaveBeenCalledTimes(1);
    });

    it('görev olayı önbelleği düşürür, sonraki çağrı tazeden çeker', async () => {
        await projectTasks('p1');
        dataChanged('task');
        await projectTasks('p1');

        expect(getList).toHaveBeenCalledTimes(2);
    });

    it('başka entity olayı önbelleği temizlemez', async () => {
        await projectTasks('p1');
        dataChanged('invoice');
        await projectTasks('p1');

        expect(getList).toHaveBeenCalledTimes(1);
    });
});
