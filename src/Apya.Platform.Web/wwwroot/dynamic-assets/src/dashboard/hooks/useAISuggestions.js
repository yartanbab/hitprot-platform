import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QK } from '../../lib/api/queryClient';
import { fixtures } from './fixtures';

/**
 * AI suggestions — inbox feed.
 *
 * Tasarım kararları:
 *   - Suggestion'lar push popup değil, inbox: kullanıcı görmek istediğinde bakar
 *   - Apply / Snooze / Dismiss üçü de optimistic — listeden anında kalkar
 *   - Dismiss `reason` taşır (irrelevant | wrong | not-now) → model retraining
 *   - 409 (concurrency) durumunda rollback otomatik (onError)
 */

const fetcher = () => fixtures.aiSuggestions();

export function useAISuggestions() {
    return useQuery({
        queryKey: QK.dashboard.aiSuggestions(),
        queryFn:  fetcher,
    });
}

/* Genel mutation factory — apply/snooze/dismiss aynı optimistic pattern.
   `extractTarget` mutation arg'ından suggestion'ı çıkarır (dismiss `{ suggestion, reason }` alır;
   diğerleri direkt suggestion alır). */
function useSuggestionMutation(performer, extractTarget = (arg) => arg) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: performer,
        onMutate: async (arg) => {
            const target = extractTarget(arg);
            await qc.cancelQueries({ queryKey: QK.dashboard.aiSuggestions() });
            const previous = qc.getQueryData(QK.dashboard.aiSuggestions());
            qc.setQueryData(QK.dashboard.aiSuggestions(), (old = []) =>
                old.filter((s) => s.id !== target.id),
            );
            return { previous };
        },
        onError: (_err, _arg, ctx) => {
            if (ctx?.previous) qc.setQueryData(QK.dashboard.aiSuggestions(), ctx.previous);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: QK.dashboard.aiSuggestions() });
        },
    });
}

export function useApplySuggestion() {
    return useSuggestionMutation((suggestion) => fixtures.applySuggestion(suggestion));
}

export function useSnoozeSuggestion() {
    return useSuggestionMutation((suggestion) => fixtures.snoozeSuggestion(suggestion));
}

export function useDismissSuggestion() {
    return useSuggestionMutation(
        ({ suggestion, reason }) => fixtures.dismissSuggestion(suggestion, reason),
        ({ suggestion }) => suggestion,
    );
}
