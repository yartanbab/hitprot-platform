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

    it('baslangic tarihi bossa validate false doner ve hata mesaji uretir', () => {
        const { result } = renderHook(() => useTaskForm(TASK));
        act(() => result.current.setField('startDate', ''));
        act(() => { expect(result.current.validate()).toBe(false); });
        expect(result.current.errors.startDate).toBeTruthy();
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

    it('task once undefined sonra rerender ile gelince gercek verilerle senkronlanir ve dirty olmaz', () => {
        const { result, rerender } = renderHook(({ task }) => useTaskForm(task), {
            initialProps: { task: undefined },
        });
        expect(result.current.values.title).toBe('');
        expect(result.current.isDirty).toBe(false);

        rerender({ task: TASK });

        expect(result.current.values.title).toBe('Otel Konaklama Anlaşması');
        expect(result.current.values.status).toBe(4);
        expect(result.current.isDirty).toBe(false);
    });

    it('ayni taskId icin tekrar render olunca kullanicinin girdigi deger korunur', () => {
        const { result, rerender } = renderHook(({ task }) => useTaskForm(task), {
            initialProps: { task: TASK },
        });
        act(() => result.current.setField('title', 'Kullanici degistirdi'));
        expect(result.current.isDirty).toBe(true);

        // Ayni id, farkli obje referansi (ör. bir refetch) - values ezilmemeli.
        rerender({ task: { ...TASK } });

        expect(result.current.values.title).toBe('Kullanici degistirdi');
        expect(result.current.isDirty).toBe(true);
    });
});

describe('useTaskForm · butce bagi', () => {
    /* UpdateAsync bu iki alani kosulsuz uyguluyor (task.SetBudgetLink). DTO'dan
       duserlerse gorevin butce bagi HER kayitta sessizce silinir. */
    it('mevcut bagi DTO ya tasir (dokunulmasa bile)', () => {
        const { result } = renderHook(() => useTaskForm({
            ...TASK, budgetLineId: 'b1', plannedAmount: 12500,
        }));

        const dto = result.current.toUpdateDto();
        expect(dto.budgetLineId).toBe('b1');
        expect(dto.plannedAmount).toBe(12500);
    });

    it('bagi olmayan gorevde null gonderir', () => {
        const { result } = renderHook(() => useTaskForm(TASK));

        const dto = result.current.toUpdateDto();
        expect(dto.budgetLineId).toBeNull();
        expect(dto.plannedAmount).toBeNull();
    });

    it('kalem/tutar degisimi kirli sayilir ve DTO ya yansir', () => {
        const { result } = renderHook(() => useTaskForm(TASK));

        act(() => {
            result.current.setField('budgetLineId', 'b2');
            result.current.setField('plannedAmount', 3000);
        });

        expect(result.current.isDirty).toBe(true);
        expect(result.current.toUpdateDto()).toMatchObject({ budgetLineId: 'b2', plannedAmount: 3000 });
    });
});
