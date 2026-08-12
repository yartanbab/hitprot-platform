import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTabOrder } from './useTabOrder';

const ORDER_KEY = 'apya.taskDetail.tabOrder';

const TABS = [
    { code: 'general', title: 'Genel' },
    { code: 'subtasks', title: 'Alt Görevler' },
    { code: 'files', title: 'Dosyalar' },
];

const codes = (result) => result.current.orderedTabs.map((t) => t.code);

/** Suruklemeyi uctan uca oynatir: dragStart -> reorderTo -> dragEnd. */
function drag(result, from, to) {
    act(() => result.current.handleDragStart(from));
    act(() => result.current.reorderTo(to));
    act(() => result.current.handleDragEnd());
}

beforeEach(() => {
    localStorage.clear();
});

describe('useTabOrder', () => {
    it('tercih yokken registry sirasini korur', () => {
        const { result } = renderHook(() => useTabOrder(TABS));
        expect(codes(result)).toEqual(['general', 'subtasks', 'files']);
    });

    it('kayitli tercihi uygular', () => {
        localStorage.setItem(ORDER_KEY, JSON.stringify(['files', 'general', 'subtasks']));
        const { result } = renderHook(() => useTabOrder(TABS));
        expect(codes(result)).toEqual(['files', 'general', 'subtasks']);
    });

    it('suruklenen sekmeyi hedefin yerine tasir', () => {
        const { result } = renderHook(() => useTabOrder(TABS));
        drag(result, 'files', 'general');
        expect(codes(result)).toEqual(['files', 'general', 'subtasks']);
    });

    it('surukleme bitince sirayi localStorage a yazar', () => {
        const { result } = renderHook(() => useTabOrder(TABS));
        drag(result, 'files', 'general');
        expect(JSON.parse(localStorage.getItem(ORDER_KEY))).toEqual(['files', 'general', 'subtasks']);
    });

    it('sekmeyi kendi uzerine birakmak sirayi degistirmez', () => {
        const { result } = renderHook(() => useTabOrder(TABS));
        drag(result, 'subtasks', 'subtasks');
        expect(codes(result)).toEqual(['general', 'subtasks', 'files']);
    });

    it('dragStart olmadan reorderTo hicbir sey yapmaz', () => {
        const { result } = renderHook(() => useTabOrder(TABS));
        act(() => result.current.reorderTo('general'));
        expect(codes(result)).toEqual(['general', 'subtasks', 'files']);
    });

    it('suruklenen kodu draggingCode olarak tutar, bitince birakir', () => {
        const { result } = renderHook(() => useTabOrder(TABS));
        act(() => result.current.handleDragStart('files'));
        expect(result.current.draggingCode).toBe('files');
        act(() => result.current.handleDragEnd());
        expect(result.current.draggingCode).toBeNull();
    });

    /**
     * Saklanan sira bir TERCIH'tir, kaynak liste degil. Kullanici bir ozelligi
     * kaldirinca ya da yeni ozellik eklenince sira sessizce bozulmamali.
     */
    it('artik gorunmeyen kodlari suzer', () => {
        localStorage.setItem(ORDER_KEY, JSON.stringify(['files', 'kaldirilmis-ozellik', 'general']));
        const { result } = renderHook(() => useTabOrder(TABS));
        expect(codes(result)).toEqual(['files', 'general', 'subtasks']);
    });

    it('tercihte olmayan yeni sekmeyi sona ekler', () => {
        localStorage.setItem(ORDER_KEY, JSON.stringify(['files', 'general']));
        const { result } = renderHook(() => useTabOrder(TABS));
        expect(codes(result)).toEqual(['files', 'general', 'subtasks']);
    });

    it('bozuk JSON da coker degil, registry sirasina duser', () => {
        localStorage.setItem(ORDER_KEY, '{bozuk json');
        const { result } = renderHook(() => useTabOrder(TABS));
        expect(codes(result)).toEqual(['general', 'subtasks', 'files']);
    });

    it('dizi olmayan kayitli deger yok sayilir', () => {
        localStorage.setItem(ORDER_KEY, JSON.stringify({ nope: true }));
        const { result } = renderHook(() => useTabOrder(TABS));
        expect(codes(result)).toEqual(['general', 'subtasks', 'files']);
    });
});
