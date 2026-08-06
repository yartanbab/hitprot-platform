import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { readAntiForgeryToken } from '../../lib/api/httpClient';

function svc() {
    const s = window?.apya?.platform?.tasks?.task;
    if (!s) return null;
    return s;
}

function fetchAttachments(taskId) {
    const s = svc();
    if (!s) return Promise.reject(new Error('ABP görev servisi yüklenmedi.'));
    return Promise.resolve(s.getAttachments(taskId));
}

async function uploadAttachment(taskId, file) {
    const formData = new FormData();
    formData.append('file', file);
    const headers = {};
    const token = readAntiForgeryToken();
    if (token) headers.RequestVerificationToken = token;

    const response = await fetch(`/api/tasks/attachments/upload/${taskId}`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: formData,
    });
    const result = await response.json();
    if (!response.ok || result?.success === false) {
        throw new Error(result?.error || 'Dosya yüklenemedi.');
    }
    return result;
}

/** Görev dosya ekleri — listele/yükle/sil. */
export function useTaskAttachments(taskId) {
    const queryClient = useQueryClient();
    const queryKey = ['task-attachments', taskId];

    const query = useQuery({
        queryKey,
        queryFn: () => fetchAttachments(taskId),
        enabled: Boolean(taskId),
        staleTime: 30_000,
        retry: false,
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey });

    const uploadMutation = useMutation({
        mutationFn: (file) => uploadAttachment(taskId, file),
        onSuccess: invalidate,
    });

    const removeMutation = useMutation({
        mutationFn: (attachmentId) => Promise.resolve(svc().deleteAttachment(attachmentId)),
        onSuccess: invalidate,
    });

    return {
        attachments: query.data ?? [],
        isLoading: query.isLoading,
        upload: uploadMutation.mutateAsync,
        remove: removeMutation.mutateAsync,
        isUploading: uploadMutation.isPending,
    };
}
