import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDirtyGuard } from './useDirtyGuard';

describe('useDirtyGuard', () => {
    it('baslangicta temiz', () => {
        const { result } = renderHook(() => useDirtyGuard());
        expect(result.current.isDirty).toBe(false);
    });

    it('markDirty sonrasi kirli', () => {
        const { result } = renderHook(() => useDirtyGuard());
        act(() => result.current.markDirty());
        expect(result.current.isDirty).toBe(true);
    });

    it('temizken requestClose dogrudan kapatir', () => {
        const onClose = vi.fn();
        const { result } = renderHook(() => useDirtyGuard());
        act(() => result.current.requestClose(onClose));
        expect(onClose).toHaveBeenCalledTimes(1);
        expect(result.current.pendingClose).toBe(false);
    });

    it('kirliyken requestClose kapatmaz, onay bekler', () => {
        const onClose = vi.fn();
        const { result } = renderHook(() => useDirtyGuard());
        act(() => result.current.markDirty());
        act(() => result.current.requestClose(onClose));
        expect(onClose).not.toHaveBeenCalled();
        expect(result.current.pendingClose).toBe(true);
    });

    it('discard secilince kapatir ve temizler', () => {
        const onClose = vi.fn();
        const { result } = renderHook(() => useDirtyGuard());
        act(() => result.current.markDirty());
        act(() => result.current.requestClose(onClose));
        act(() => result.current.resolvePendingClose('discard'));
        expect(onClose).toHaveBeenCalledTimes(1);
        expect(result.current.isDirty).toBe(false);
    });

    it('stay secilince kapatmaz ve kirli kalir', () => {
        const onClose = vi.fn();
        const { result } = renderHook(() => useDirtyGuard());
        act(() => result.current.markDirty());
        act(() => result.current.requestClose(onClose));
        act(() => result.current.resolvePendingClose('stay'));
        expect(onClose).not.toHaveBeenCalled();
        expect(result.current.isDirty).toBe(true);
        expect(result.current.pendingClose).toBe(false);
    });

    it('kirliyken beforeunload dinleyicisi kurulur', () => {
        const addSpy = vi.spyOn(window, 'addEventListener');
        const { result } = renderHook(() => useDirtyGuard());
        act(() => result.current.markDirty());
        expect(addSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    });

    it('kirliyken unmount sonrasi beforeunload dinleyicisi kaldirilir', () => {
        const addSpy = vi.spyOn(window, 'addEventListener');
        const removeSpy = vi.spyOn(window, 'removeEventListener');
        const { result, unmount } = renderHook(() => useDirtyGuard());

        // Mark dirty to attach listener
        act(() => result.current.markDirty());
        expect(addSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));

        // Capture the handler function that was added
        const addedHandler = addSpy.mock.calls[0][1];

        // Unmount the hook
        unmount();

        // Verify the same handler function was removed
        expect(removeSpy).toHaveBeenCalledWith('beforeunload', addedHandler);
    });

    it('temiz duruma donunce beforeunload dinleyicisi kaldirilir', () => {
        const addSpy = vi.spyOn(window, 'addEventListener');
        const removeSpy = vi.spyOn(window, 'removeEventListener');
        const { result } = renderHook(() => useDirtyGuard());

        // Mark dirty to attach listener
        act(() => result.current.markDirty());
        expect(addSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));

        // Capture the handler function that was added
        const addedHandler = addSpy.mock.calls[0][1];

        // Mark clean to trigger effect cleanup
        act(() => result.current.markClean());

        // Verify the same handler function was removed
        expect(removeSpy).toHaveBeenCalledWith('beforeunload', addedHandler);
    });
});

/* Faz 5 — pencere sözleşmesi: 'saved', yeniden giriş koruması, ayrılma bayrağı. */
describe('useDirtyGuard — bekleyen eylem', () => {
    const dirtyWithPending = (action) => {
        const view = renderHook(() => useDirtyGuard());
        act(() => view.result.current.markDirty());
        act(() => view.result.current.requestClose(action));
        return view;
    };

    it('saved bekleyen eylemi calistirir ve kirli bayragini indirir', () => {
        const onClose = vi.fn();
        const { result } = dirtyWithPending(onClose);
        expect(onClose).not.toHaveBeenCalled();

        act(() => result.current.resolvePendingClose('saved'));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(result.current.isDirty).toBe(false);
        expect(result.current.pendingClose).toBe(false);
    });

    it('pencere acikken ikinci requestClose ilk bekleyen eylemi EZMEZ', () => {
        const switchTask = vi.fn();
        const closeNow = vi.fn();
        const { result } = dirtyWithPending(switchTask);

        act(() => result.current.requestClose(closeNow));
        act(() => result.current.resolvePendingClose('discard'));

        expect(switchTask).toHaveBeenCalledTimes(1);
        expect(closeNow).not.toHaveBeenCalled();
    });

    it('pencere kapandiktan sonra yeni istek yeniden pencere acar', () => {
        const first = vi.fn();
        const second = vi.fn();
        const { result } = dirtyWithPending(first);
        act(() => result.current.resolvePendingClose('stay'));

        act(() => result.current.requestClose(second));
        expect(result.current.pendingClose).toBe(true);
        act(() => result.current.resolvePendingClose('discard'));

        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalledTimes(1);
    });

    it('bekleyen yokken resolvePendingClose no-op', () => {
        const { result } = renderHook(() => useDirtyGuard());
        act(() => result.current.markDirty());

        act(() => result.current.resolvePendingClose('discard'));
        act(() => result.current.resolvePendingClose('saved'));

        expect(result.current.isDirty).toBe(true);
        expect(result.current.pendingClose).toBe(false);
    });

    it('eski save eylemi kaldirildi: bekleyen eylem calismaz, deger donmez', () => {
        const onClose = vi.fn();
        const { result } = dirtyWithPending(onClose);
        let returned;
        act(() => { returned = result.current.resolvePendingClose('save'); });
        expect(returned).toBeUndefined();
        expect(onClose).not.toHaveBeenCalled();
        expect(result.current.isDirty).toBe(true);
    });
});

describe('useDirtyGuard — beforeunload', () => {
    afterEach(() => { delete window.apya; });

    /** Tarayıcının sayfadan ayrılma olayı; engellendiyse true. */
    const unloadBlocked = () => {
        const event = new Event('beforeunload', { cancelable: true });
        window.dispatchEvent(event);
        return event.defaultPrevented;
    };

    it('kirliyken engeller, temizken engellemez', () => {
        const { result } = renderHook(() => useDirtyGuard());
        expect(unloadBlocked()).toBe(false);
        act(() => result.current.markDirty());
        expect(unloadBlocked()).toBe(true);
        act(() => result.current.markClean());
        expect(unloadBlocked()).toBe(false);
    });

    it.each(['discard', 'saved'])('%s ile calisan eylemin icinde tetiklenen beforeunload ENGELLENMEZ', (action) => {
        const seen = [];
        const { result } = renderHook(() => useDirtyGuard());
        act(() => result.current.markDirty());
        act(() => result.current.requestClose(() => seen.push(unloadBlocked())));   // sayfa sunumu: history.back()
        expect(unloadBlocked()).toBe(true);

        act(() => result.current.resolvePendingClose(action));

        expect(seen).toEqual([false]);
    });

    it('stay sonrasi beforeunload engellemeye devam eder', () => {
        const { result } = renderHook(() => useDirtyGuard());
        act(() => result.current.markDirty());
        act(() => result.current.requestClose(() => {}));
        act(() => result.current.resolvePendingClose('stay'));
        expect(unloadBlocked()).toBe(true);
    });

    it('ayrilma secildi ama sayfada kalindi: markClean bayragi indirir, yeni duzenleme yine korunur', () => {
        const { result } = renderHook(() => useDirtyGuard());
        act(() => result.current.markDirty());
        act(() => result.current.requestClose(() => {}));
        act(() => result.current.resolvePendingClose('discard'));

        /* Çağıran formunu temizlemedi → eşitleme effect'i korumayı yeniden kirletir: bayrak hâlâ açık. */
        act(() => result.current.markDirty());
        expect(unloadBlocked()).toBe(false);

        act(() => result.current.markClean());
        act(() => result.current.markDirty());
        expect(unloadBlocked()).toBe(true);
    });

    /* decisions L3 — oturum penceresinde "Giriş sayfasına git": apya.dirtyGuard.allowUnload(). */
    it('apya.dirtyGuard.isUnloadAllowed() true ise engellemez; false ise engeller; ortak koruma yoksa engeller', () => {
        const { result } = renderHook(() => useDirtyGuard());
        act(() => result.current.markDirty());
        expect(unloadBlocked()).toBe(true);                      // window.apya yok

        const isUnloadAllowed = vi.fn(() => true);
        window.apya = { dirtyGuard: { isUnloadAllowed } };
        expect(unloadBlocked()).toBe(false);
        expect(isUnloadAllowed).toHaveBeenCalled();

        isUnloadAllowed.mockReturnValue(false);
        expect(unloadBlocked()).toBe(true);

        window.apya = { dirtyGuard: {} };                        // eski sürüm: işlev yok
        expect(unloadBlocked()).toBe(true);
    });
});
