import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { readTaskIdFromUrl, useTaskUrlSync, clearTaskUrl } from './useTaskUrlSync';

const TASK_ID = '11111111-2222-3333-4444-555555555555';

beforeEach(() => {
    window.history.replaceState(null, '', '/Tasks');
});

describe('readTaskIdFromUrl', () => {
    it('task parametresi yoksa null', () => {
        expect(readTaskIdFromUrl()).toBeNull();
    });

    it('task parametresini okur', () => {
        window.history.replaceState(null, '', `/Tasks?task=${TASK_ID}`);
        expect(readTaskIdFromUrl()).toBe(TASK_ID);
    });

    it('gecersiz guid formatini reddeder', () => {
        window.history.replaceState(null, '', '/Tasks?task=not-a-guid');
        expect(readTaskIdFromUrl()).toBeNull();
    });
});

describe('useTaskUrlSync', () => {
    it('taskId verilince URLe ?task ekler', () => {
        renderHook(() => useTaskUrlSync(TASK_ID, () => {}));
        expect(window.location.search).toBe(`?task=${TASK_ID}`);
    });

    it('mevcut query parametrelerini korur', () => {
        window.history.replaceState(null, '', '/Tasks?view=kanban');
        renderHook(() => useTaskUrlSync(TASK_ID, () => {}));
        expect(window.location.search).toContain('view=kanban');
        expect(window.location.search).toContain(`task=${TASK_ID}`);
    });

    it('taskId null iken URLe dokunmaz', () => {
        renderHook(() => useTaskUrlSync(null, () => {}));
        expect(window.location.search).toBe('');
    });

    it('popstate onPopClose tetikler', () => {
        const onPopClose = vi.fn();
        renderHook(() => useTaskUrlSync(TASK_ID, onPopClose));
        act(() => { window.dispatchEvent(new PopStateEvent('popstate', { state: null })); });
        expect(onPopClose).toHaveBeenCalledTimes(1);
    });
});

describe('clearTaskUrl', () => {
    it('task parametresini kaldirir, digerlerini birakir', () => {
        window.history.replaceState(null, '', `/Tasks?view=kanban&task=${TASK_ID}`);
        clearTaskUrl();
        expect(window.location.search).toBe('?view=kanban');
    });
});
