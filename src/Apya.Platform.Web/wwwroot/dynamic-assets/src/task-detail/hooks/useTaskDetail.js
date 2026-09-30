import { useQuery } from '@tanstack/react-query';

/**
 * Görev detayı — mevcut ABP dinamik JS proxy'si üzerinden.
 * Yeni endpoint AÇMIYORUZ: apya.platform.tasks.task.get zaten
 * TaskAppService.GetAsync'i çağırıyor (gizlilik + tenant kuralları orada).
 *
 * jQuery Deferred döner; native Promise'e sarmak zorundayız (documents.jsx
 * ile aynı köprü deseni).
 *
 * TSK-23: abp.ajax zarflı hatada yalnız hata zarfıyla reddeder (Promise.resolve ikinci
 * argümanı — jqXHR — düşürür); HTTP durumu isteğin kendisinde (abp.jquery.js
 * `promise.jqXHR`). 404 (görev yok) / 403 (gizli görev) / geçici hata ayrımı için durum
 * reddedilen nesnenin ÜSTÜNE yazılır — yeni nesne kurulmaz: G1'in "gösterildi"
 * işaretleri (apyaShown / apyaCentral) ve zarfın code/details alanları korunur.
 * abpHandleError değişmez (401 akışı G1'in; çift gösterim STA-10).
 */
function fetchTask(taskId) {
    const svc = window?.apya?.platform?.tasks?.task;
    if (!svc) return Promise.reject(new Error('ABP görev servisi yüklenmedi.'));
    const request = svc.get(taskId);
    return Promise.resolve(request).catch((error) => {
        const status = request?.jqXHR?.status;
        if (error && typeof error === 'object' && error.status == null && status) {
            error.status = status;
        }
        throw error;
    });
}

export function useTaskDetail(taskId) {
    return useQuery({
        queryKey: ['task-detail', taskId],
        queryFn: () => fetchTask(taskId),
        enabled: Boolean(taskId),
        /* Detay düzenlenebilir canlı kayıt: kanban, liste ve proje konsolu aynı
           görevi React Query dışından değiştiriyor. Her açılışta (modal yeni
           QueryClient kurar), göreve dönüşte ve sekme odağında yeniden çekilir;
           oturum önbelleğine yazılmaz. Gelen yeni değer useTaskForm'da kullanıcının
           dokunmadığı alanlara işlenir (rebase). */
        staleTime: 0,
        meta: { persist: false },
        /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
           hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
        retry: false,
    });
}

/** İzin köprüsü — frontend gizleme, backend kontrolünün YERİNE GEÇMEZ. */
export function isGranted(permission) {
    return Boolean(window?.abp?.auth?.isGranted?.(permission));
}
