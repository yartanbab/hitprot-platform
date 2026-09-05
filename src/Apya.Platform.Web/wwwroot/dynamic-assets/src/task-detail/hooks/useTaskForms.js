import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function svc() {
    const s = window?.apya?.platform?.tasks?.task;
    if (!s) return null;
    return s;
}

function fetchLinks(taskId) {
    const s = svc();
    if (!s) return Promise.reject(new Error('ABP görev servisi yüklenmedi.'));
    return Promise.resolve(s.getLinkedForms(taskId));
}

/**
 * Göreve bağlı formlar — bağla / kaldır / misafire aç.
 *
 * Yanıtlar AYRI sorguda (`useTaskFormResponses`): liste satırı yalnız SAYIYI
 * gösteriyor, satırları açmadan çekmenin anlamı yok.
 */
export function useTaskForms(taskId) {
    const queryClient = useQueryClient();
    const listKey = ['task-forms', taskId];

    const list = useQuery({
        queryKey: listKey,
        queryFn: () => fetchLinks(taskId),
        enabled: Boolean(taskId),
        staleTime: 30_000,
        retry: false,
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: listKey });

    const linkMutation = useMutation({
        mutationFn: (documentId) => Promise.resolve(svc().linkForm(taskId, documentId)),
        onSuccess: invalidate,
    });

    const unlinkMutation = useMutation({
        mutationFn: (linkId) => Promise.resolve(svc().unlinkForm(linkId)),
        onSuccess: invalidate,
    });

    const guestMutation = useMutation({
        mutationFn: ({ linkId, value }) => Promise.resolve(svc().setFormGuestFillable(linkId, value)),
        onSuccess: invalidate,
    });

    return {
        forms: list.data ?? [],
        isLoading: list.isLoading,
        linkForm: linkMutation.mutateAsync,
        unlinkForm: unlinkMutation.mutateAsync,
        setGuestFillable: guestMutation.mutateAsync,
        isLinking: linkMutation.isPending,
    };
}

/** Form seçicisi — YALNIZ seçici açıkken çekilir. */
export function useTaskFormOptions(taskId, enabled) {
    return useQuery({
        queryKey: ['task-form-options', taskId],
        queryFn: () => Promise.resolve(svc().getFormOptions(taskId)),
        enabled: Boolean(taskId) && Boolean(enabled),
        retry: false,
    });
}

/** Bir formun BU GÖREVDEKİ yanıtları — satır açıldığında çekilir. */
export function useTaskFormResponses(taskId, documentId) {
    return useQuery({
        queryKey: ['task-form-responses', taskId, documentId],
        queryFn: () => Promise.resolve(svc().getFormResponses(taskId, documentId)),
        enabled: Boolean(taskId) && Boolean(documentId),
        retry: false,
    });
}
