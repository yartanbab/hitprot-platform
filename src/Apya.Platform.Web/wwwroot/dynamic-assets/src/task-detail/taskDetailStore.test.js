import { describe, it, expect, vi, beforeEach } from 'vitest';
import { taskDetailStore } from './taskDetailStore';

const TASK_ID = '11111111-2222-3333-4444-555555555555';

beforeEach(() => {
    taskDetailStore.reset();
});

describe('taskDetailStore', () => {
    it('baslangicta kapali', () => {
        expect(taskDetailStore.getSnapshot()).toBeNull();
    });

    it('open string id kabul eder', () => {
        taskDetailStore.open(TASK_ID);
        expect(taskDetailStore.getSnapshot()).toBe(TASK_ID);
    });

    it('open({id}) nesne formunu da kabul eder (abp.ModalManager uyumu)', () => {
        taskDetailStore.open({ id: TASK_ID });
        expect(taskDetailStore.getSnapshot()).toBe(TASK_ID);
    });

    it('close snapshoti nulla dondurur', () => {
        taskDetailStore.open(TASK_ID);
        taskDetailStore.close();
        expect(taskDetailStore.getSnapshot()).toBeNull();
    });

    it('subscribe degisimde tetiklenir', () => {
        const cb = vi.fn();
        const unsub = taskDetailStore.subscribe(cb);
        taskDetailStore.open(TASK_ID);
        expect(cb).toHaveBeenCalledTimes(1);
        unsub();
        taskDetailStore.close();
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('onResult dinleyicileri emitResult ile cagrilir', () => {
        const fn1 = vi.fn();
        const fn2 = vi.fn();
        taskDetailStore.onResult(fn1);
        taskDetailStore.onResult(fn2);
        taskDetailStore.emitResult();
        expect(fn1).toHaveBeenCalledTimes(1);
        expect(fn2).toHaveBeenCalledTimes(1);
    });

    it('gecersiz id yok sayilir', () => {
        taskDetailStore.open(undefined);
        expect(taskDetailStore.getSnapshot()).toBeNull();
    });

    // Additional coverage for destructured subscribe/getSnapshot (useSyncExternalStore compat)
    it('subscribe ve getSnapshot destructure edildiginde calisir', () => {
        const { subscribe, getSnapshot } = taskDetailStore;
        const cb = vi.fn();
        const unsub = subscribe(cb);
        taskDetailStore.open(TASK_ID);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(getSnapshot()).toBe(TASK_ID);
        unsub();
    });
});
