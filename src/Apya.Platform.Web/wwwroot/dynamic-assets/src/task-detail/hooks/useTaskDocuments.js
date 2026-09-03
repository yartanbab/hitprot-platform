import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function svc() {
    const s = window?.apya?.platform?.tasks?.task;
    if (!s) return null;
    return s;
}

function fetchDocuments(taskId) {
    const s = svc();
    if (!s) return Promise.reject(new Error('ABP görev servisi yüklenmedi.'));
    return Promise.resolve(s.getDocuments(taskId));
}

/**
 * Göreve bağlı belgeler — listele/oluştur/güncelle/sil.
 *
 * Liste ucu gövdeyi (`content`) BOŞ döner; seçilen belgenin tam gövdesi ayrı
 * sorguyla (`['task-document', id]`) çekilir. Bu yüzden liste anahtarı ile
 * belge anahtarı ayrıdır: kaydetme sonrası ikisi de tazelenir, yoksa listedeki
 * başlık eski kalır.
 */
export function useTaskDocuments(taskId) {
    const queryClient = useQueryClient();
    const listKey = ['task-documents', taskId];

    const list = useQuery({
        queryKey: listKey,
        queryFn: () => fetchDocuments(taskId),
        enabled: Boolean(taskId),
        staleTime: 30_000,
        retry: false,
    });

    const invalidateList = () => queryClient.invalidateQueries({ queryKey: listKey });

    const createMutation = useMutation({
        mutationFn: (title) => Promise.resolve(svc().createDocument(taskId, title)),
        onSuccess: invalidateList,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, title, content }) => Promise.resolve(svc().updateDocument(id, title, content)),
        onSuccess: (saved) => {
            invalidateList();
            if (saved?.id) {
                // Sunucudan dönen hâli doğrudan yaz: yeniden çekmek gereksiz tur.
                queryClient.setQueryData(['task-document', saved.id], saved);
            }
        },
    });

    const removeMutation = useMutation({
        mutationFn: (id) => Promise.resolve(svc().deleteDocument(id)),
        onSuccess: invalidateList,
    });

    return {
        documents: list.data ?? [],
        isLoading: list.isLoading,
        createDocument: createMutation.mutateAsync,
        updateDocument: updateMutation.mutateAsync,
        removeDocument: removeMutation.mutateAsync,
        isSaving: updateMutation.isPending,
    };
}

/** Tek belgenin TAM gövdesi. `documentId` yokken sorgu hiç çalışmaz. */
export function useTaskDocument(documentId) {
    return useQuery({
        queryKey: ['task-document', documentId],
        queryFn: () => Promise.resolve(svc().getDocument(documentId)),
        enabled: Boolean(documentId),
        retry: false,
    });
}
