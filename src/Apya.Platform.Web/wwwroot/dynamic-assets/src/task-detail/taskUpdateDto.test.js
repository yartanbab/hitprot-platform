import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { renderHook } from '@testing-library/react';
import { taskToUpdateDto } from './taskUpdateDto';
import { useTaskForm } from './hooks/useTaskForm';

/**
 * STA-01: UpdateAsync TAM değiştirir — DTO'dan düşen alan SİLİNİR. Kısmi değişiklik
 * yapan çağıranlar DTO'yu elle ve eksik kurduğu için bütçe bağı ve öncüller siliniyordu.
 * Alan kümesi C# CreateUpdateTaskDto kaynağına karşı kilitlenir; aynı test formun
 * kurucusunu (useTaskForm.toUpdateDto) da kilitler — iki kurucu birlikte kayamaz.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const DTO_SOURCE = path.resolve(here, '../../../../../Apya.Platform.Application.Contracts/Tasks/CreateUpdateTaskDto.cs');

function csharpDtoFields() {
    const src = readFileSync(DTO_SOURCE, 'utf8');
    const names = [...src.matchAll(/public\s+\S+\s+(\w+)\s*\{\s*get;\s*set;/g)].map((m) => m[1]);
    return names.map((n) => n.charAt(0).toLowerCase() + n.slice(1));
}

const TASK = {
    id: 't1',
    title: 'Görev',
    description: 'Açıklama',
    startDate: '2026-10-01T09:30:00',
    dueDate: '2026-10-05T18:00:00',
    status: 2,
    priority: 3,
    assigneeId: 'u1',
    boardColumnId: 'c1',
    projectId: 'p1',
    parentTaskId: null,
    isPrivate: false,
    predecessorIds: ['a', 'b'],
    tags: [{ name: 'x' }, { name: 'y' }],
    estimatedHours: 4,
    taskType: 'Analiz',
    sprint: 'S1',
    budgetLineId: 'b1',
    plannedAmount: 500,
};

describe('taskToUpdateDto — C# CreateUpdateTaskDto sözleşmesi', () => {
    const fields = csharpDtoFields();

    it('C# kaynağından yeterli alan okunur (regex bozulursa test boşuna geçmesin)', () => {
        expect(fields.length).toBeGreaterThanOrEqual(18);
    });

    it('yardımcı C# DTO alanlarının HEPSİNİ taşır', () => {
        const keys = Object.keys(taskToUpdateDto(TASK));
        fields.forEach((f) => expect(keys, `eksik alan: ${f}`).toContain(f));
    });

    it('form kurucusu (useTaskForm.toUpdateDto) da HEPSİNİ taşır', () => {
        const { result } = renderHook(() => useTaskForm(TASK));
        const keys = Object.keys(result.current.toUpdateDto());
        fields.forEach((f) => expect(keys, `eksik alan: ${f}`).toContain(f));
    });
});

describe('taskToUpdateDto — davranış', () => {
    it('bütçe bağı, öncüller ve etiketler görevden taşınır', () => {
        const dto = taskToUpdateDto(TASK);
        expect(dto.budgetLineId).toBe('b1');
        expect(dto.plannedAmount).toBe(500);
        expect(dto.predecessorIds).toEqual(['a', 'b']);
        expect(dto.tagNames).toEqual(['x', 'y']);
        expect(dto.estimatedHours).toBe(4);
        expect(dto.taskType).toBe('Analiz');
        expect(dto.sprint).toBe('S1');
    });

    it('patch yalnız verilen alanı ezer', () => {
        const dto = taskToUpdateDto(TASK, { description: 'yeni', predecessorIds: ['b'] });
        expect(dto.description).toBe('yeni');
        expect(dto.predecessorIds).toEqual(['b']);
        expect(dto.title).toBe('Görev');
        expect(dto.budgetLineId).toBe('b1');
        expect(dto.tagNames).toEqual(['x', 'y']);
    });

    it('tarihler 10 karaktere kesilir; bitiş yoksa null', () => {
        expect(taskToUpdateDto(TASK).startDate).toBe('2026-10-01');
        expect(taskToUpdateDto(TASK).dueDate).toBe('2026-10-05');
        expect(taskToUpdateDto({ ...TASK, dueDate: null }).dueDate).toBeNull();
    });

    it('eksik alanlar null/boş değerle gelir, undefined kalmaz', () => {
        const dto = taskToUpdateDto({ id: 't2', title: 'Yalın', startDate: '2026-10-01T00:00:00', status: 1, priority: 2 });
        expect(dto.budgetLineId).toBeNull();
        expect(dto.plannedAmount).toBeNull();
        expect(dto.predecessorIds).toEqual([]);
        expect(dto.tagNames).toEqual([]);
        expect(dto.isPrivate).toBe(false);
    });
});
