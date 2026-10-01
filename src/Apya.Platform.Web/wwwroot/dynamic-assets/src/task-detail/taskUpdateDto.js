/**
 * Görevin TAM güncelleme DTO'su (CreateUpdateTaskDto) — mevcut görevden kurulur.
 *
 * UpdateAsync TAM değiştirir: DTO'da olmayan alan (bütçe bağı, öncüller, etiketler,
 * planlama) SİLİNİR (STA-01). Kısmi değişiklik yapan çağıranlar bu yüzden DTO'yu elle
 * ve eksik kuruyordu; alan kümesi C# kaynağını okuyan testle (taskUpdateDto.test.js)
 * kilitli.
 *
 * Girdi GetAsync TaskDto'su olmalı — liste DTO'su predecessorIds taşımaz. Dar uç varsa
 * (updateStatus, setPriority, updateSchedule) ÖNCE o kullanılmalı; bu yardımcı yalnız
 * dar ucu olmayan alanlar içindir (açıklama, öncül listesi).
 *
 * @param {object} task GetAsync TaskDto'su
 * @param {object} [patch] ezilecek alanlar — en son yayılır
 */
export function taskToUpdateDto(task, patch = {}) {
    return {
        title: task.title,
        description: task.description ?? null,
        startDate: (task.startDate ?? '').slice(0, 10),
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : null,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId ?? null,
        boardColumnId: task.boardColumnId ?? null,
        projectId: task.projectId ?? null,
        parentTaskId: task.parentTaskId ?? null,
        isPrivate: Boolean(task.isPrivate),
        predecessorIds: task.predecessorIds ?? [],
        tagNames: (task.tags ?? []).map((t) => t.name),
        estimatedHours: task.estimatedHours ?? null,
        taskType: task.taskType ?? null,
        sprint: task.sprint ?? null,
        budgetLineId: task.budgetLineId ?? null,
        plannedAmount: task.plannedAmount ?? null,
        ...patch,
    };
}
