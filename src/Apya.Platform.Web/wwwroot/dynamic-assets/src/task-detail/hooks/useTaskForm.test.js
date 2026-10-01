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

/* TSK-01 / STA-04: ayni gorev icin sunucudan gelen yeni veri (kanbanda tasima,
   arsivle, odak tazelemesi, kayit sonrasi yeniden cekme) forma yansimiyordu; Kaydet
   eski durumu geri yaziyor, form sebepsiz "kirli" gorunuyordu. */
describe('useTaskForm · sunucu verisine yeniden temellenme', () => {
    const SERVER = { ...TASK, status: 2, priority: 2, tags: [] };
    const renderForm = (task = SERVER) =>
        renderHook(({ task: t }) => useTaskForm(t), { initialProps: { task } });

    it('ayni id ile sunucudan yeni durum gelince form onu alir, kirli olmaz, DTO yeni durumu tasir', () => {
        const { result, rerender } = renderForm();

        rerender({ task: { ...SERVER, status: 1 } });

        expect(result.current.values.status).toBe(1);
        expect(result.current.isDirty).toBe(false);
        expect(result.current.toUpdateDto().status).toBe(1);
    });

    it('kullanicinin degistirdigi alan korunur, dokunmadigi alan sunucudan gelir', () => {
        const { result, rerender } = renderForm();
        act(() => result.current.setField('priority', 3));

        rerender({ task: { ...SERVER, status: 1 } });

        expect(result.current.values.priority).toBe(3);
        expect(result.current.values.status).toBe(1);
        expect(result.current.isDirty).toBe(true);
        expect(result.current.toUpdateDto()).toMatchObject({ status: 1, priority: 3 });
    });

    it('farkli goreve geciste form tamamen sifirlanir ve hatalar temizlenir', () => {
        const { result, rerender } = renderForm();
        act(() => result.current.setField('title', '   '));
        act(() => { result.current.validate(); });
        expect(result.current.errors.title).toBeTruthy();

        rerender({ task: { ...SERVER, id: 't2', title: 'Baska gorev' } });

        expect(result.current.values.title).toBe('Baska gorev');
        expect(result.current.errors).toEqual({});
        expect(result.current.isDirty).toBe(false);
    });

    it('commitSaved: sunucunun duzelttigi etiket yazimi formu kirli birakmaz', () => {
        const { result, rerender } = renderForm();
        act(() => result.current.setField('tagNames', ['konaklama']));
        const sent = result.current.values;
        const saved = { ...SERVER, tags: [{ id: 'g1', name: 'Konaklama' }] };

        rerender({ task: saved });                       // kayit sonrasi yeniden cekme
        act(() => result.current.commitSaved(sent, saved));

        expect(result.current.values.tagNames).toEqual(['Konaklama']);
        expect(result.current.isDirty).toBe(false);
    });

    it('commitSaved: yeniden cekmeden ONCE cagrilsa da ayni sonuca varir', () => {
        const { result, rerender } = renderForm();
        act(() => result.current.setField('tagNames', ['konaklama']));
        const sent = result.current.values;
        const saved = { ...SERVER, tags: [{ id: 'g1', name: 'Konaklama' }] };

        act(() => result.current.commitSaved(sent, saved));
        rerender({ task: saved });

        expect(result.current.values.tagNames).toEqual(['Konaklama']);
        expect(result.current.isDirty).toBe(false);
    });

    it('commitSaved: iki etiketli kayitta sunucunun sirasi ve yazimi alinir', () => {
        const { result, rerender } = renderForm();
        act(() => result.current.setField('tagNames', ['konaklama', 'anlaşma']));
        const sent = result.current.values;
        const saved = { ...SERVER, tags: [{ id: 'g2', name: 'Anlaşma' }, { id: 'g1', name: 'Konaklama' }] };

        rerender({ task: saved });
        act(() => result.current.commitSaved(sent, saved));

        expect(result.current.values.tagNames).toEqual(['Anlaşma', 'Konaklama']);
        expect(result.current.isDirty).toBe(false);
    });

    it('commitSaved: kayit surerken degisen aciklama korunur', () => {
        const { result, rerender } = renderForm();
        act(() => result.current.setField('tagNames', ['konaklama']));
        const sent = result.current.values;
        act(() => result.current.setField('description', 'Kayit surerken yazildi'));
        const saved = { ...SERVER, tags: [{ id: 'g1', name: 'Konaklama' }] };

        rerender({ task: saved });
        act(() => result.current.commitSaved(sent, saved));

        expect(result.current.values.tagNames).toEqual(['Konaklama']);
        expect(result.current.values.description).toBe('Kayit surerken yazildi');
        expect(result.current.isDirty).toBe(true);
    });

    it('commitSaved(sent, undefined) hicbir sey yapmaz', () => {
        const { result } = renderForm();
        act(() => result.current.setField('tagNames', ['konaklama']));
        const before = result.current.values;

        act(() => result.current.commitSaved(before, undefined));

        expect(result.current.values).toBe(before);
    });

    it('ayni icerikli satir ici nesneyle art arda render sonsuz donguye girmez', () => {
        const { result, rerender } = renderHook(() => useTaskForm({ ...SERVER }));
        rerender();
        rerender();
        expect(result.current.isDirty).toBe(false);
        expect(result.current.values.status).toBe(2);
    });
});
