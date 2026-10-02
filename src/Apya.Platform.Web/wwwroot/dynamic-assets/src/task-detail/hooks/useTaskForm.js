import { useState, useCallback, useMemo } from 'react';
import { t } from '../../lib/i18n';

const EMPTY_VALUES = {
    title: '', description: '', startDate: '', dueDate: '',
    status: 1, priority: 2, assigneeId: null, tagNames: [], isPrivate: false, projectId: null,
    estimatedHours: null, taskType: '', sprint: '',
    budgetLineId: null, plannedAmount: null,
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
        isPrivate: Boolean(task.isPrivate),
        projectId: task.projectId ?? null,
        estimatedHours: task.estimatedHours ?? null,
        taskType: task.taskType ?? '',
        sprint: task.sprint ?? '',
        budgetLineId: task.budgetLineId ?? null,
        plannedAmount: task.plannedAmount ?? null,
    };
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** Kullanıcının dokunmadığı alanlar (values[k] === from[k]) yeni sunucu değerini alır;
    dokunduğu alanlar kullanıcının değerinde kalır. */
function rebase(values, from, to) {
    const next = {};
    for (const k of Object.keys(to)) next[k] = same(values[k], from[k]) ? to[k] : values[k];
    return next;
}

/**
 * Görev "Genel" sekmesi form state'i. İlk render'da `task` her zaman `undefined`'dır
 * (TanStack Query hiç senkron çözülmez) — bu yüzden values, task yüklenince (veya
 * farklı bir taskId'ye geçilince) render sırasında gerçek verilerle senkronlanır
 * (bkz. `lastTaskId` kontrolü).
 *
 * Aynı görev için sunucudan YENİ veri gelirse (arşivle, taşı, odak tazelemesi, kayıt
 * sonrası yeniden çekme) form bu veriye yeniden temellenir (rebase): kullanıcının
 * dokunmadığı alanlar sunucu değerini alır, düzenlediği alanlar korunur. Böylece
 * Kaydet eski değeri geri yazmaz, isDirty yalnız gerçek düzenlemeyi gösterir.
 */
export function useTaskForm(task) {
    const [lastTaskId, setLastTaskId] = useState(task?.id);
    const initial = useMemo(() => toFormValues(task), [task]);
    const [base, setBase] = useState(initial);
    const [values, setValues] = useState(initial);
    const [errors, setErrors] = useState({});

    /* task yüklenmeden önce (undefined) render başlar; TanStack Query hiçbir zaman
       senkron çözülmez, bu yüzden ilk render'da her zaman task=undefined olur. Görev
       verisi gelince (veya farklı bir taskId'ye geçilince) formu render SIRASINDA
       gerçek değerlerle senkronla — React'in resmi "prop değişince state ayarla"
       deseni. useEffect ile yapılırsa kullanıcı bir an için boş/eski değerleri görür.
       Referans eşitliği üretimde kısa keser (useMemo([task]) ve TanStack'in yapısal
       paylaşımı aynı içerikte aynı referansı verir); içerik karşılaştırması yalnız
       referans değişince çalışır — satır içi görev nesnesiyle sonsuz döngü olmaz. */
    if (task?.id !== lastTaskId || (initial !== base && !same(initial, base))) {
        const sameTask = task?.id !== undefined && task.id === lastTaskId;
        setLastTaskId(task?.id);
        setBase(initial);
        setValues(sameTask ? rebase(values, base, initial) : initial);
        if (!sameTask) setErrors({});
    }

    const setField = useCallback((name, value) => {
        setValues((v) => ({ ...v, [name]: value }));
        /* Düzeltilen alanın altında eski hata kalmasın. Son tarih hatası başlangıca
           bağlıdır: başlangıç değişince o da kalkar (Kaydet yeniden doğrular). */
        setErrors((e) => {
            if (!e[name] && !(name === 'startDate' && e.dueDate)) return e;
            const next = { ...e };
            delete next[name];
            if (name === 'startDate') delete next.dueDate;
            return next;
        });
    }, []);

    const isDirty = useMemo(
        () => JSON.stringify(values) !== JSON.stringify(initial),
        [values, initial],
    );

    const validate = useCallback(() => {
        const next = {};
        if (!values.title.trim()) next.title = t('Tasks:Detail:Validation:TitleRequired', 'Başlık zorunlu.');
        if (!values.startDate) next.startDate = t('Tasks:Detail:Validation:StartDateRequired', 'Başlangıç tarihi zorunlu.');
        if (values.dueDate && values.startDate && values.dueDate < values.startDate) {
            next.dueDate = t('Tasks:Detail:Validation:DueBeforeStart', 'Son tarih başlangıç tarihinden önce olamaz.');
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
        projectId: values.projectId ?? null,
        parentTaskId: task?.parentTaskId ?? null,
        isPrivate: Boolean(values.isPrivate),
        predecessorIds: task?.predecessorIds ?? [],
        tagNames: values.tagNames,
        estimatedHours: values.estimatedHours,
        taskType: values.taskType || null,
        sprint: values.sprint || null,
        /* DTO'dan DÜŞÜRÜLEMEZ: UpdateAsync bu iki alanı koşulsuz uyguluyor
           (task.SetBudgetLink), dolayısıyla gönderilmediklerinde görevin bütçe
           bağı HER kayıtta sessizce siliniyordu. Eski Razor modali aynı tuzağa
           karşı "koru" bloğu yazmıştı (Tasks/EditModal.cshtml.cs); burada alanlar
           form state'inde taşındığı için koruma kendiliğinden oluşuyor. */
        budgetLineId: values.budgetLineId ?? null,
        plannedAmount: values.plannedAmount ?? null,
    }), [values, task]);

    const reset = useCallback(() => {
        setValues(initial);
        setErrors({});
    }, [initial]);

    /* Kayıttan sonra sunucunun normalize ettiği değerleri (etiket yazımı/sırası)
       forma işler: gönderilen değerde kalan alanlar sunucu değerini alır, kayıt
       sürerken kullanıcının değiştirdiği alanlar korunur. `sent` kayıt anındaki
       values, `savedTask` sunucudan dönen TaskDto. */
    const commitSaved = useCallback((sent, savedTask) => {
        if (!savedTask) return;
        const server = toFormValues(savedTask);
        setValues((v) => rebase(v, sent, server));
    }, []);

    return { values, setField, isDirty, errors, validate, toUpdateDto, reset, commitSaved };
}
