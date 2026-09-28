import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function svc() {
    return window?.apya?.platform?.tasks?.task || null;
}

/** Görev zaman takibi — logları çek, sayaç başlat/durdur, aktif log.
 *  Backend: getTimeLogs(taskId) / getActiveTimeLog() / startTimeTracking(taskId) / stopTimeTracking(taskId). */
export function useTaskTimeTracking(taskId) {
    const queryClient = useQueryClient();
    const logsKey = ['task-timelogs', taskId];
    const activeKey = ['task-active-timelog'];

    const logsQuery = useQuery({
        queryKey: logsKey,
        queryFn: () => Promise.resolve(svc()?.getTimeLogs(taskId)),
        enabled: Boolean(taskId) && Boolean(svc()),
        staleTime: 15_000,
        meta: { persist: false },
        retry: false,
    });

    const activeQuery = useQuery({
        queryKey: activeKey,
        /* Kayıt yokken uç 204 döner, proxy undefined çözer; TanStack v5 undefined'ı
           hata sayıp önceki çalışan kaydı ekranda bırakır (sayaç durmazdı). */
        queryFn: () => Promise.resolve(svc()?.getActiveTimeLog()).then((log) => log ?? null),
        enabled: Boolean(svc()),
        staleTime: 5_000,
        /* Canlı sayaç kanbandan da başlatılıp durduruluyor; açılışlar arasında taşınmaz. */
        meta: { persist: false },
        retry: false,
    });

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: logsKey });
        queryClient.invalidateQueries({ queryKey: activeKey });
    };

    const startMutation = useMutation({
        mutationFn: () => Promise.resolve(svc()?.startTimeTracking(taskId)),
        onSuccess: invalidate,
    });

    const stopMutation = useMutation({
        mutationFn: () => Promise.resolve(svc()?.stopTimeTracking(taskId)),
        onSuccess: invalidate,
    });

    return {
        logs: logsQuery.data ?? [],
        isLoading: logsQuery.isLoading,
        activeLog: activeQuery.data ?? null,
        start: startMutation.mutateAsync,
        stop: stopMutation.mutateAsync,
        isMutating: startMutation.isPending || stopMutation.isPending,
    };
}
