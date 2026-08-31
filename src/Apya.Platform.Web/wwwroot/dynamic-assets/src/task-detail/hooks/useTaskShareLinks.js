import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function svc() {
    return window?.apya?.platform?.tasks?.taskShare ?? null;
}

/**
 * Görevin dış paylaşım linkleri — listele / üret / iptal et.
 *
 * Üretilen linkin token'ı YALNIZ create yanıtında döner; sunucu onu bir daha üretemez.
 * Bu yüzden yeni link listeye değil, ayrı bir "az önce üretildi" durumuna yazılır ve
 * kullanıcı kopyalayana kadar ekranda kalır.
 */
export function useTaskShareLinks(taskId) {
    const queryClient = useQueryClient();
    const queryKey = ['task-share-links', taskId];

    const query = useQuery({
        queryKey,
        queryFn: () => {
            const s = svc();
            if (!s) return Promise.reject(new Error('Paylaşım servisi yüklenmedi.'));
            return Promise.resolve(s.getList(taskId));
        },
        enabled: Boolean(taskId),
        staleTime: 30_000,
        retry: false,
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey });

    const createMutation = useMutation({
        mutationFn: (input) => Promise.resolve(svc().create({ ...input, taskId })),
        onSuccess: invalidate,
    });

    const revokeMutation = useMutation({
        mutationFn: (id) => Promise.resolve(svc().revoke(id)),
        onSuccess: invalidate,
    });

    return {
        links: query.data ?? [],
        isLoading: query.isLoading,
        error: query.error,
        create: createMutation.mutateAsync,
        revoke: revokeMutation.mutateAsync,
        isCreating: createMutation.isPending,
    };
}
