import { describe, it, expect } from 'vitest';
import { groupByTask, blockedEdges } from './grouping';

const T = (id, extra = {}) => ({ id, title: 'Görev ' + id, ...extra });

describe('groupByTask', () => {
    it('gorev sirasini korur, kayitsiz gorev grup uretmez', () => {
        const tasks = [T('a'), T('b'), T('c')];
        const records = [{ taskId: 'c' }, { taskId: 'a' }, { taskId: 'a' }];

        const groups = groupByTask(tasks, records, (r) => r.taskId);

        expect(groups.map((g) => g.task.id)).toEqual(['a', 'c']);
        expect(groups[0].records).toHaveLength(2);
    });

    /** Yarış: panel açıkken görev silindi/taşındı — kayıt SESSİZCE kaybolmamalı. */
    it('listede olmayan taskId nin kaydi task:null grubunda sona duser', () => {
        const groups = groupByTask([T('a')], [{ taskId: 'a' }, { taskId: 'yok' }], (r) => r.taskId);

        expect(groups).toHaveLength(2);
        expect(groups[1].task).toBeNull();
        expect(groups[1].records[0].taskId).toBe('yok');
    });

    it('bos kayit listesi bos grup listesi doner', () => {
        expect(groupByTask([T('a')], [], (r) => r.taskId)).toEqual([]);
    });
});

describe('blockedEdges — handoff kurali: oncul Done degil VE termini gecti', () => {
    const now = new Date(2026, 8, 10); // 10 Eyl 2026
    const past = '2026-09-01T00:00:00';
    const future = '2026-09-20T00:00:00';
    const byId = (tasks) => new Map(tasks.map((t) => [t.id, t]));

    it('gecikmis acik oncul bloke sayilir', () => {
        const tasks = [T('p', { status: 2, dueDate: past }), T('s', { status: 1 })];
        const edges = [{ taskId: 's', predecessorTaskId: 'p' }];

        expect(blockedEdges(edges, byId(tasks), now)).toHaveLength(1);
    });

    it('tamamlanmis oncul gecikmis olsa da bloke SAYILMAZ', () => {
        const tasks = [T('p', { status: 4, dueDate: past }), T('s', { status: 1 })];
        expect(blockedEdges([{ taskId: 's', predecessorTaskId: 'p' }], byId(tasks), now)).toHaveLength(0);
    });

    it('termini gelmemis veya tarihsiz oncul bloke sayilmaz', () => {
        const tasks = [
            T('p1', { status: 2, dueDate: future }),
            T('p2', { status: 2, dueDate: null }),
            T('s', { status: 1 }),
        ];
        const edges = [
            { taskId: 's', predecessorTaskId: 'p1' },
            { taskId: 's', predecessorTaskId: 'p2' },
        ];
        expect(blockedEdges(edges, byId(tasks), now)).toHaveLength(0);
    });

    it('haritada olmayan oncul (gorunmeyen gorev) bloke sayilmaz', () => {
        expect(blockedEdges([{ taskId: 's', predecessorTaskId: 'yok' }], new Map(), now)).toHaveLength(0);
    });
});
