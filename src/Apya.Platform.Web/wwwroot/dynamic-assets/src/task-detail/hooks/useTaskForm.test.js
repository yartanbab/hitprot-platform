import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTaskForm } from './useTaskForm';

const TASK = {
    id: 't1',
    title: 'Otel Konaklama Anlaşması',
    description: 'Önce medine sonra mekke',
    startDate: '2026-06-25T00:00:00Z',
    dueDate: '2026-07-10T00:00:00Z',
    status: 4,
    priority: 4,
    assigneeId: 'u1',
    tags: [{ id: 'g1', name: 'Konaklama' }, { id: 'g2', name: 'Anlaşma' }],
    isPrivate: true,
    projectId: 'p1',
    parentTaskId: null,
    predecessorIds: [],
};

describe('useTaskForm', () => {
    it('başlangıç değerlerini task\'tan türetir', () => {
        const { result } = renderHook(() => useTaskForm(TASK));
        expect(result.current.values.title).toBe('Otel Konaklama Anlaşması');
        expect(result.current.values.startDate).toBe('2026-06-25');
        expect(result.current.values.dueDate).toBe('2026-07-10');
        expect(result.current.values.tagNames).toEqual(['Konaklama', 'Anlaşma']);
        expect(result.current.isDirty).toBe(false);
    });

    it('task yokken (yükleniyor) çökmez, boş değerler döner', () => {
        const { result } = renderHook(() => useTaskForm(undefined));
        expect(result.current.values.title).toBe('');
        expect(result.current.values.tagNames).toEqual([]);
        expect(result.current.isDirty).toBe(false);
    });

    it('alan değişince dirty olur', () => {
        const { result } = renderHook(() => useTaskForm(TASK));
        act(() => result.current.setField('title', 'Yeni Başlık'));
        expect(result.current.isDirty).toBe(true);
    });

    it('orijinal değere elle dönünce dirty temizlenir', () => {
        const { result } = renderHook(() => useTaskForm(TASK));
        act(() => result.current.setField('title', 'Yeni Başlık'));
        act(() => result.current.setField('title', 'Otel Konaklama Anlaşması'));
        expect(result.current.isDirty).toBe(false);
    });

    it('başlık boşsa validate false döner ve hata mesajı üretir', () => {
        const { result } = renderHook(() => useTaskForm(TASK));
        act(() => result.current.setField('title', '   '));
        act(() => { expect(result.current.validate()).toBe(false); });
        expect(result.current.errors.title).toBeTruthy();
    });

    it('bitiş tarihi başlangıçtan önceyse validate false döner', () => {
        const { result } = renderHook(() => useTaskForm(TASK));
        act(() => result.current.setField('dueDate', '2026-01-01'));
        act(() => { expect(result.current.validate()).toBe(false); });
        expect(result.current.errors.dueDate).toBeTruthy();
    });

    it('geçerli değerlerde validate true döner ve errors boşalır', () => {
        const { result } = renderHook(() => useTaskForm(TASK));
        act(() => result.current.setField('title', 'Yeni Başlık'));
        act(() => { expect(result.current.validate()).toBe(true); });
        expect(result.current.errors).toEqual({});
    });

    it('toUpdateDto düzenlenen alanları values\'tan, düzenlenmeyenleri task\'tan alır', () => {
        const { result } = renderHook(() => useTaskForm(TASK));
        act(() => result.current.setField('title', 'Güncellendi'));
        const dto = result.current.toUpdateDto();
        expect(dto.title).toBe('Güncellendi');
        expect(dto.projectId).toBe('p1');
        expect(dto.isPrivate).toBe(true);
        expect(dto.parentTaskId).toBe(null);
        expect(dto.predecessorIds).toEqual([]);
    });

    it('reset formu başlangıç değerlerine döndürür ve dirty temizler', () => {
        const { result } = renderHook(() => useTaskForm(TASK));
        act(() => result.current.setField('title', 'Değişti'));
        act(() => result.current.reset());
        expect(result.current.values.title).toBe('Otel Konaklama Anlaşması');
        expect(result.current.isDirty).toBe(false);
    });
});
