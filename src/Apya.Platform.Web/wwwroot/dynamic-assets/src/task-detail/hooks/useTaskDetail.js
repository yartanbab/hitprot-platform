import { useQuery } from '@tanstack/react-query';

/**
 * Görev detayı — mevcut ABP dinamik JS proxy'si üzerinden.
 * Yeni endpoint AÇMIYORUZ: apya.platform.tasks.task.get zaten
 * TaskAppService.GetAsync'i çağırıyor (gizlilik + tenant kuralları orada).
 *
 * jQuery Deferred döner; native Promise'e sarmak zorundayız (documents.jsx
 * ile aynı köprü deseni).
 */
function fetchTask(taskId) {
    const svc = window?.apya?.platform?.tasks?.task;
    if (!svc) return Promise.reject(new Error('ABP görev servisi yüklenmedi.'));
    return Promise.resolve(svc.get(taskId));
}

export function useTaskDetail(taskId) {
    return useQuery({
        queryKey: ['task-detail', taskId],
        queryFn: () => fetchTask(taskId),
        enabled: Boolean(taskId),
        staleTime: 30_000,
        retry: 1,
    });
}

/** İzin köprüsü — frontend gizleme, backend kontrolünün YERİNE GEÇMEZ. */
export function isGranted(permission) {
    return Boolean(window?.abp?.auth?.isGranted?.(permission));
}
