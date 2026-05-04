import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../feedback/Toast.jsx';
import { ApiError } from './httpClient';

/**
 * createOptimisticListMutation — liste tipi cache için tek noktalı optimistic
 * mutation pattern.
 *
 * Pattern (UX strategy doc § State Management):
 *   1) cancelQueries(queryKey) — in-flight refetch'leri durdur
 *   2) snapshot al → rollback için "previous"
 *   3) optimistic transform — varsayılan: target.id eşleşen satırı listeden çıkar
 *      (caller `transform` opsiyoneliyle ezer — örn. status değiştir, eklenti yap)
 *   4) onError → snapshot'a rollback + toast
 *      - 409 (conflict) → "yenile" CTA'lı uyarı toast'i (ApiError.status'tan tespit)
 *      - diğer → kısa hata toast'i + ham mesaj
 *   5) onSuccess (opsiyonel) → "Geri al" toast'i (undoFn varsa)
 *   6) onSettled → invalidate(queryKey) + extra invalidations
 *
 * Caller side effect'lerini `extraInvalidations` ile bildirir (örn. approve →
 * budget + cashflow). Mutation'ın kendisi yalnızca primary listeyi yönetir.
 *
 * Kullanım:
 *   const useApproveItem = () => useOptimisticListMutation({
 *     queryKey: QK.dashboard.approvals(),
 *     mutationFn: (item) => api.post(`/approvals/${item.id}/approve`),
 *     extraInvalidations: [QK.dashboard.budget(), QK.dashboard.cashflow()],
 *     undoMessage: (item) => `${item.title} onaylandı`,
 *     undoFn: (item) => api.post(`/approvals/${item.id}/reverse`),
 *   });
 */

const DEFAULT_REMOVE_TRANSFORM = (list, target) =>
    (list ?? []).filter((row) => row.id !== target?.id);

export function useOptimisticListMutation({
    queryKey,
    mutationFn,
    /* Mutation arg'ı liste'deki hedef row'a nasıl eşlenir? Default: arg = row */
    extractTarget = (arg) => arg,
    /* Optimistic cache transform — default: id eşleşen row'u sil */
    transform = DEFAULT_REMOVE_TRANSFORM,
    /* Side-effect query'leri — onSettled'da invalidate edilir */
    extraInvalidations = [],
    /* Başarı toast'i (undo destekli). undoFn varsa "Geri al" gösterilir. */
    undoMessage,                    /* (target) => string  | undefined */
    undoFn,                          /* (target) => Promise | undefined */
    /* Hata toast'leri — varsayılan generic mesajlar */
    errorMessage = 'İşlem başarısız oldu',
    conflictMessage = 'Bu kayıt başka bir kullanıcı tarafından değiştirildi',
}) {
    const qc = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn,

        onMutate: async (arg) => {
            const target = extractTarget(arg);
            await qc.cancelQueries({ queryKey });
            const previous = qc.getQueryData(queryKey);
            qc.setQueryData(queryKey, (old) => transform(old, target, arg));
            return { previous, target };
        },

        onError: (err, _arg, ctx) => {
            if (ctx?.previous !== undefined) {
                qc.setQueryData(queryKey, ctx.previous);
            }
            const isConflict = err instanceof ApiError ? err.status === 409 : err?.status === 409;
            if (isConflict) {
                toast.warning(conflictMessage, {
                    description: 'Veriyi tazeleyip tekrar deneyebilirsin.',
                    action: { label: 'Yenile', onClick: () => qc.invalidateQueries({ queryKey }) },
                });
            } else {
                toast.error(errorMessage, {
                    description: err?.message,
                });
            }
        },

        onSuccess: (_data, arg, ctx) => {
            if (!undoFn || !undoMessage) return;
            const target = ctx?.target ?? extractTarget(arg);
            const message = typeof undoMessage === 'function' ? undoMessage(target) : undoMessage;
            toast.success(message, {
                action: {
                    label: 'Geri al',
                    onClick: () => {
                        /* Undo: kaydı geri koy → server'a reverse çağrısı.
                           Reverse hatası kullanıcıya ayrı toast — original'ın geri yüklenmiş
                           halini bozma. */
                        qc.setQueryData(queryKey, ctx?.previous);
                        Promise.resolve(undoFn(target)).catch((err) => {
                            toast.error('Geri alınamadı', { description: err?.message });
                            qc.invalidateQueries({ queryKey });
                        });
                    },
                },
            });
        },

        onSettled: () => {
            qc.invalidateQueries({ queryKey });
            extraInvalidations.forEach((key) => qc.invalidateQueries({ queryKey: key }));
        },
    });
}
