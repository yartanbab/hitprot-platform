import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    DATA_CHANGED_EVENT,
    DATA_CHANGED_STAMP_KEY,
    markDataChanged,
    emitDataChanged,
    onDataChanged,
    isTaskDerivedQuery,
    invalidateOlderThanLastChange,
    useInvalidateTaskDerivedOnChange,
} from './dataChanged';

const fire = (detail) => document.dispatchEvent(new CustomEvent(DATA_CHANGED_EVENT, { detail }));
const invalidated = (qc, key) => qc.getQueryState(key)?.isInvalidated === true;

beforeEach(() => window.sessionStorage.clear());

describe('onDataChanged', () => {
    it('eşleşen entity\'de çağrılır; farklı entity\'de ve abonelikten çıkınca çağrılmaz', () => {
        const handler = vi.fn();
        const off = onDataChanged(handler, 'task');

        fire({ entity: 'task', ids: ['t1'] });
        fire({ entity: 'invoice' });
        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith({ entity: 'task', ids: ['t1'] });

        off();
        fire({ entity: 'task' });
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('entity verilmezse her olayda çağrılır', () => {
        const handler = vi.fn();
        const off = onDataChanged(handler);
        fire({ entity: 'task' });
        fire({ entity: 'invoice' });
        off();
        expect(handler).toHaveBeenCalledTimes(2);
    });
});

describe('emitDataChanged / markDataChanged', () => {
    it('emitDataChanged damga yazar ve olay yayınlar', () => {
        const handler = vi.fn();
        const off = onDataChanged(handler, 'task');

        emitDataChanged({ entity: 'task', action: 'create' });
        off();

        expect(Number(window.sessionStorage.getItem(DATA_CHANGED_STAMP_KEY))).toBeGreaterThan(0);
        expect(handler).toHaveBeenCalledWith({ entity: 'task', action: 'create' });
    });

    it('markDataChanged yalnız damga yazar, olay YAYINLAMAZ', () => {
        const handler = vi.fn();
        const off = onDataChanged(handler);

        markDataChanged();
        off();

        expect(Number(window.sessionStorage.getItem(DATA_CHANGED_STAMP_KEY))).toBeGreaterThan(0);
        expect(handler).not.toHaveBeenCalled();
    });
});

describe('isTaskDerivedQuery', () => {
    it.each([
        [['dashboard', 'summary', {}], true],
        [['dashboard', 'layout', 'v'], false],
        [['calendar', 'feed', 'a', 'b'], true],
        [['calendar', 'team-load', 'a', 'b'], true],
        [['calendar', 'external', 'a', 'b'], false],
        [['task-detail', 't1'], false],
        [['task-detail', 'users-lookup'], false],
        [['task-predecessors', 't1', []], false],
    ])('%j → %s', (key, expected) => {
        expect(isTaskDerivedQuery(key)).toBe(expected);
    });
});

describe('invalidateOlderThanLastChange', () => {
    const OLD = 1_000;
    const STAMP = 2_000;
    const NEW = 3_000;

    function seed() {
        const qc = new QueryClient();
        qc.setQueryData(['dashboard', 'summary', { r: 'eski' }], 'x', { updatedAt: OLD });
        qc.setQueryData(['dashboard', 'summary', { r: 'yeni' }], 'x', { updatedAt: NEW });
        qc.setQueryData(['dashboard', 'layout', 'v'], 'x', { updatedAt: OLD });
        qc.setQueryData(['task-detail', 't1'], 'x', { updatedAt: OLD });
        qc.setQueryData(['calendar', 'external', 'a', 'b'], 'x', { updatedAt: OLD });
        return qc;
    }

    it('yalnız damgadan ESKİ görev türevi sorguyu bayat işaretler', () => {
        const qc = seed();
        window.sessionStorage.setItem(DATA_CHANGED_STAMP_KEY, String(STAMP));

        invalidateOlderThanLastChange(qc);

        expect(invalidated(qc, ['dashboard', 'summary', { r: 'eski' }])).toBe(true);
        expect(invalidated(qc, ['dashboard', 'summary', { r: 'yeni' }])).toBe(false);
        expect(invalidated(qc, ['dashboard', 'layout', 'v'])).toBe(false);
        expect(invalidated(qc, ['task-detail', 't1'])).toBe(false);
        expect(invalidated(qc, ['calendar', 'external', 'a', 'b'])).toBe(false);
    });

    it('damga yoksa hiçbir şeye dokunmaz', () => {
        const qc = seed();

        invalidateOlderThanLastChange(qc);

        expect(invalidated(qc, ['dashboard', 'summary', { r: 'eski' }])).toBe(false);
    });
});

describe('useInvalidateTaskDerivedOnChange', () => {
    function setup() {
        const qc = new QueryClient();
        qc.setQueryData(['calendar', 'feed', 'a', 'b'], 'x');
        qc.setQueryData(['dashboard', 'summary', {}], 'x');
        qc.setQueryData(['dashboard', 'layout', 'v'], 'x');
        // .js dosyası (JSX yok): sarmalayıcı createElement ile.
        const wrapper = ({ children }) => React.createElement(QueryClientProvider, { client: qc }, children);
        const hook = renderHook(() => useInvalidateTaskDerivedOnChange(), { wrapper });
        return { qc, hook };
    }

    it('görev olayı feed ve pano özetini geçersizler, düzene dokunmaz', () => {
        const { qc } = setup();

        act(() => { fire({ entity: 'task' }); });

        expect(invalidated(qc, ['calendar', 'feed', 'a', 'b'])).toBe(true);
        expect(invalidated(qc, ['dashboard', 'summary', {}])).toBe(true);
        expect(invalidated(qc, ['dashboard', 'layout', 'v'])).toBe(false);
    });

    it('başka entity olayı hiçbir şey yapmaz', () => {
        const { qc } = setup();

        act(() => { fire({ entity: 'invoice' }); });

        expect(invalidated(qc, ['calendar', 'feed', 'a', 'b'])).toBe(false);
        expect(invalidated(qc, ['dashboard', 'summary', {}])).toBe(false);
    });

    it('unmount sonrası olay hiçbir şey yapmaz', () => {
        const { qc, hook } = setup();
        hook.unmount();

        act(() => { fire({ entity: 'task' }); });

        expect(invalidated(qc, ['calendar', 'feed', 'a', 'b'])).toBe(false);
    });
});
