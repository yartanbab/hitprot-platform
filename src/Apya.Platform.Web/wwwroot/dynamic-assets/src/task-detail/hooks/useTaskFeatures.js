import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/** documents.jsx/useTaskDetail.js ile ayni kopru deseni: jQuery Deferred'i
 *  native Promise'e sariyoruz. */
function svc() {
    const s = window?.apya?.platform?.tasks?.task;
    if (!s) return null;
    return s;
}

function fetchFeatures(taskId) {
    const s = svc();
    if (!s) return Promise.reject(new Error('ABP görev servisi yüklenmedi.'));
    return Promise.resolve(s.getFeatureAssignments(taskId));
}

/** Görev-bazlı atanmış non-core özellik kodları + ekleme/kaldırma mutasyonları. */
export function useTaskFeatures(taskId) {
    const queryClient = useQueryClient();
    const queryKey = ['task-features', taskId];

    const query = useQuery({
        queryKey,
        queryFn: () => fetchFeatures(taskId),
        enabled: Boolean(taskId),
        staleTime: 30_000,
        retry: false,
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey });

    const addMutation = useMutation({
        mutationFn: (featureCode) => Promise.resolve(svc().addFeature(taskId, featureCode)),
        onSuccess: invalidate,
    });

    const removeMutation = useMutation({
        mutationFn: (featureCode) => Promise.resolve(svc().removeFeature(taskId, featureCode)),
        onSuccess: invalidate,
    });

    return {
        assignedCodes: query.data ?? [],
        isLoading: query.isLoading,
        addFeature: addMutation.mutateAsync,
        removeFeature: removeMutation.mutateAsync,
        mutatingCode: addMutation.variables ?? removeMutation.variables ?? null,
        isMutating: addMutation.isPending || removeMutation.isPending,
    };
}
