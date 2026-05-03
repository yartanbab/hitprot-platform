import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSignalR } from './SignalRProvider';

/**
 * useSignalRInvalidation
 *
 * Hub event → TanStack Query cache invalidation köprüsü.
 *
 * Kullanım:
 *   useSignalRInvalidation([
 *     ['JournalEntryPosted', [QK.dashboard.budget(), QK.dashboard.cashflow()]],
 *     ['ApprovalDecided',    [QK.dashboard.approvals()]],
 *   ]);
 *
 * Connection durumu değişince re-subscribe; double-subscribe yok (off+on).
 */
export function useSignalRInvalidation(mappings) {
    const { connection, state } = useSignalR();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!connection || !mappings?.length) return undefined;

        const handlers = mappings.map(([eventName, queryKeys]) => {
            const handler = () => {
                queryKeys.forEach((key) => {
                    queryClient.invalidateQueries({ queryKey: key });
                });
            };
            connection.on(eventName, handler);
            return [eventName, handler];
        });

        return () => {
            handlers.forEach(([eventName, handler]) => {
                connection.off(eventName, handler);
            });
        };
        /* state dependency: reconnect sonrası handler'lar yeniden bağlanır.
           mappings reference stable olmalı (caller useMemo gerekirse). */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connection, state, queryClient]);
}
