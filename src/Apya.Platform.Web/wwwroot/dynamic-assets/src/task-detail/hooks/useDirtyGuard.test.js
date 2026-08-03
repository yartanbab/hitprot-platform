import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDirtyGuard } from './useDirtyGuard';

describe('useDirtyGuard', () => {
    beforeEach(() => {
        window.onbeforeunload = null;
    });

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
});
