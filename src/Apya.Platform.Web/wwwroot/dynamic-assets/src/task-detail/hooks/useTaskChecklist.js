import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function svc() {
    const s = window?.apya?.platform?.tasks?.task;
    if (!s) return null;
    return s;
}

function fetchItems(taskId) {
    const s = svc();
    if (!s) return Promise.reject(new Error('ABP görev servisi yüklenmedi.'));
    return Promise.resolve(s.getChecklistItems(taskId));
}

/** Görev kontrol listesi maddeleri — ekle/işaretle/sil. */
export function useTaskChecklist(taskId) {
    const queryClient = useQueryClient();
    const queryKey = ['task-checklist', taskId];

    const query = useQuery({
        queryKey,
        queryFn: () => fetchItems(taskId),
        enabled: Boolean(taskId),
        staleTime: 30_000,
        retry: false,
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey });

    const addMutation = useMutation({
        mutationFn: (text) => Promise.resolve(svc().addChecklistItem(taskId, text)),
        onSuccess: invalidate,
    });

    const toggleMutation = useMutation({
        mutationFn: (itemId) => Promise.resolve(svc().toggleChecklistItem(itemId)),
        onSuccess: invalidate,
    });

    const removeMutation = useMutation({
        mutationFn: (itemId) => Promise.resolve(svc().deleteChecklistItem(itemId)),
        onSuccess: invalidate,
    });

    return {
        items: query.data ?? [],
        isLoading: query.isLoading,
        addItem: addMutation.mutateAsync,
        toggleItem: toggleMutation.mutateAsync,
        removeItem: removeMutation.mutateAsync,
    };
}
