import { useState, useCallback, useMemo } from 'react';

const EMPTY_VALUES = {
    title: '', description: '', startDate: '', dueDate: '',
    status: 1, priority: 2, assigneeId: null, tagNames: [],
};

function toFormValues(task) {
    if (!task) return EMPTY_VALUES;
    return {
        title: task.title ?? '',
        description: task.description ?? '',
        startDate: task.startDate ? task.startDate.slice(0, 10) : '',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        status: task.status ?? 1,
        priority: task.priority ?? 2,
        assigneeId: task.assigneeId ?? null,
        tagNames: (task.tags ?? []).map((t) => t.name),
    };
}

/**
 * Görev "Genel" sekmesi form state'i. İlk render'da `task` her zaman `undefined`'dır
 * (TanStack Query hiç senkron çözülmez) — bu yüzden values, task yüklenince (veya
 * farklı bir taskId'ye geçilince) render sırasında gerçek verilerle senkronlanır
 * (bkz. `lastTaskId` kontrolü). Aynı task için sonraki render'larda values kullanıcı
 * girdisini korur, task referansı değişse bile (ör. save sonrası refetch) — id aynı
 * kaldığı sürece kullanıcının o anki düzenlemesi ezilmez.
 */
export function useTaskForm(task) {
    const [lastTaskId, setLastTaskId] = useState(task?.id);
    const initial = useMemo(() => toFormValues(task), [task]);
    const [values, setValues] = useState(initial);
    const [errors, setErrors] = useState({});

    /* task yüklenmeden önce (undefined) render başlar; TanStack Query hiçbir zaman
       senkron çözülmez, bu yüzden ilk render'da her zaman task=undefined olur. Görev
       verisi gelince (veya farklı bir taskId'ye geçilince) formu render SIRASINDA
       gerçek değerlerle senkronla — React'in resmi "prop değişince state ayarla"
       deseni. useEffect ile yapılırsa kullanıcı bir an için boş/eski değerleri görür. */
    if (task?.id !== lastTaskId) {
        setLastTaskId(task?.id);
        setValues(initial);
        setErrors({});
    }

    const setField = useCallback((name, value) => {
        setValues((v) => ({ ...v, [name]: value }));
    }, []);

    const isDirty = useMemo(
        () => JSON.stringify(values) !== JSON.stringify(initial),
        [values, initial],
    );

    const validate = useCallback(() => {
        const next = {};
        if (!values.title.trim()) next.title = 'Başlık zorunlu.';
        if (!values.startDate) next.startDate = 'Başlangıç tarihi zorunlu.';
        if (values.dueDate && values.startDate && values.dueDate < values.startDate) {
            next.dueDate = 'Bitiş tarihi başlangıçtan önce olamaz.';
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    }, [values]);

    const toUpdateDto = useCallback(() => ({
        title: values.title.trim(),
        description: values.description || null,
        startDate: values.startDate,
        dueDate: values.dueDate || null,
        status: values.status,
        priority: values.priority,
        assigneeId: values.assigneeId,
        boardColumnId: task?.boardColumnId ?? null,
        projectId: task?.projectId ?? null,
        parentTaskId: task?.parentTaskId ?? null,
        isPrivate: Boolean(task?.isPrivate),
        predecessorIds: task?.predecessorIds ?? [],
        tagNames: values.tagNames,
    }), [values, task]);

    const reset = useCallback(() => {
        setValues(initial);
        setErrors({});
    }, [initial]);

    return { values, setField, isDirty, errors, validate, toUpdateDto, reset };
}
