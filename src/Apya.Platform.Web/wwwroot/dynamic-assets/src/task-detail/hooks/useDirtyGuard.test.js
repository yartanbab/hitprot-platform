import { describe, it, expect, vi } from 'vitest';
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
