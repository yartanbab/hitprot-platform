import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSignalR } from './SignalRProvider';
import { useToast } from '../feedback/Toast.jsx';

/**
 * useConflictListener — SignalR conflict event'lerini dinler ve kullanıcıyı
 * "edit'in çakıştı" toast'i ile bilgilendirir.
 *
 * useSignalRInvalidation'dan farkı:
 *   - invalidation: "veri değişti, sessizce tazele"
 *   - conflict: "senin yapmaya çalıştığın işlem başkası tarafından yapıldı,
 *     UI'ını güncelle ve karar ver"
 *
 * Mapping shape:
 *   [
 *     ['ApprovalConflict', {
 *        queryKeys: [QK.dashboard.approvals()],
 *        message:  'Bir onay kaydı çakıştı',
 *        description: 'Başka bir kullanıcı bu kayıtla işlem yaptı.',
 *      }],
 *     ['TaskConflict', {
 *        queryKeys: [QK.dashboard.tasks()],
 *        message: 'Bir görevde çakışma var',
 *      }],
 *   ]
 *
 * Toast'tan "Yenile" tıklanırsa queryKeys invalidate edilir; aksi halde de
 * arka planda invalidate edilir (kullanıcı toast'ı görmese bile state taze).
 */

export function useConflictListener(mappings) {
    const { connection, state } = useSignalR();
    const queryClient = useQueryClient();
    const toast = useToast();

    useEffect(() => {
        if (!connection || !mappings?.length) return undefined;

        const handlers = mappings.map(([eventName, opts]) => {
            const handler = (payload) => {
                /* Defansif arka plan invalidate — kullanıcı toast'ı kaçırsa bile UI taze */
                opts.queryKeys?.forEach((key) =>
                    queryClient.invalidateQueries({ queryKey: key }),
                );
                toast.warning(opts.message ?? 'Bu kayıtta çakışma oldu', {
                    description: opts.description ?? payload?.message,
                    action: {
                        label: 'Yenile',
                        onClick: () => {
                            opts.queryKeys?.forEach((key) =>
                                queryClient.invalidateQueries({ queryKey: key }),
                            );
                        },
                    },
                });
            };
            connection.on(eventName, handler);
            return [eventName, handler];
        });

        return () => {
            handlers.forEach(([eventName, handler]) => connection.off(eventName, handler));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connection, state, queryClient]);
}
