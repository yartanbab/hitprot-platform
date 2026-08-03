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

    it('replaceState kullanarak parametreyi kaldirma (pushState degil)', () => {
        const pushSpy = vi.spyOn(window.history, 'pushState');
        const replaceSpy = vi.spyOn(window.history, 'replaceState');

        window.history.replaceState(null, '', `/Tasks?view=kanban&task=${TASK_ID}`);
        // beforeEach'deki replaceState'i reset et
        pushSpy.mockClear();
        replaceSpy.mockClear();

        clearTaskUrl();

        expect(replaceSpy).toHaveBeenCalledTimes(1);
        expect(pushSpy).not.toHaveBeenCalled();

        pushSpy.mockRestore();
        replaceSpy.mockRestore();
    });
});

describe('useTaskUrlSync deep-link guard', () => {
    it('derin baglantida (URL zaten task parametresi varsa) pushState cagrilmaz', () => {
        const pushSpy = vi.spyOn(window.history, 'pushState');

        // URL'de zaten task parametresi var olarak ayarla
        window.history.replaceState(null, '', `/Tasks?task=${TASK_ID}`);

        // Ayni task ID ile hook'u render et
        renderHook(() => useTaskUrlSync(TASK_ID, () => {}));

        // pushState cagrilmamis olmali
        expect(pushSpy).not.toHaveBeenCalled();

        pushSpy.mockRestore();
    });

    it('pushState kullanarak URL guncelleme (replaceState degil)', () => {
        const pushSpy = vi.spyOn(window.history, 'pushState');
        const replaceSpy = vi.spyOn(window.history, 'replaceState');

        // URL'de task parametresi yok (beforeEach'de zaten /Tasks olur)
        // Spy'ları reset et, beforeEach'deki replaceState çağrısını sayma
        pushSpy.mockClear();
        replaceSpy.mockClear();

        // Hook'u taskId ile render et
        renderHook(() => useTaskUrlSync(TASK_ID, () => {}));

        // pushState cagrilmis olmali, replaceState degil
        expect(pushSpy).toHaveBeenCalledTimes(1);
        expect(replaceSpy).not.toHaveBeenCalled();

        // pushState'e gecilen URL'yi dogrula
        expect(pushSpy.mock.calls[0][2]).toContain(`task=${TASK_ID}`);

        pushSpy.mockRestore();
        replaceSpy.mockRestore();
    });
});

describe('useTaskUrlSync popstate listener stability', () => {
    it('popstate dinleyicisi bir kez eklenir ve callback guncellenmesi izlenir', () => {
        const addSpy = vi.spyOn(window, 'addEventListener');
        const removeSpy = vi.spyOn(window, 'removeEventListener');

        const callbackA = vi.fn();
        const callbackB = vi.fn();

        // Callback A ile render et
        const { rerender } = renderHook(
            ({ callback }) => useTaskUrlSync(TASK_ID, callback),
            { initialProps: { callback: callbackA } }
        );

        // addEventListener tam bir kez cagrilmis olmali
        const listenerCallCount = addSpy.mock.calls.filter(call => call[0] === 'popstate').length;
        expect(listenerCallCount).toBe(1);

        // Callback B ile rerender et
        rerender({ callback: callbackB });

        // popstate icin addEventListener hala bir kez olmali (yeni ekleme yok)
        const listenerCallCountAfterRerender = addSpy.mock.calls.filter(call => call[0] === 'popstate').length;
        expect(listenerCallCountAfterRerender).toBe(1);

        // popstate event'i gonder
        act(() => { window.dispatchEvent(new PopStateEvent('popstate', { state: null })); });

        // Sadece callbackB cagrilmis olmali, callbackA degil
        expect(callbackB).toHaveBeenCalledTimes(1);
        expect(callbackA).not.toHaveBeenCalled();

        addSpy.mockRestore();
        removeSpy.mockRestore();
    });
});
