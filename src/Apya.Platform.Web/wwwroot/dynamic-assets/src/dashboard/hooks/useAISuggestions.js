import { useQuery } from '@tanstack/react-query';
import { QK } from '../../lib/api/queryClient';
import { useOptimisticListMutation } from '../../lib/api/optimisticList';
import { fixtures } from './fixtures';

const fetcher = () => fixtures.aiSuggestions();

export function useAISuggestions() {
    return useQuery({
        queryKey: QK.dashboard.aiSuggestions(),
        queryFn:  fetcher,
    });
}

/**
 * AI suggestion mutations — apply/snooze/dismiss aynı optimistic pattern,
 * factory üzerinden.
 *
 * Apply için "Geri al" toast'i — 10s window. Reverse fixture yok; undoFn yerine
 * yalnızca cache restore (server side reverse implementasyonu sonra).
 *
 * Dismiss `reason` taşır — model retraining sinyali. Factory `extractTarget`
 * ile mutation arg'ından suggestion'ı çıkarıyor.
 */

export function useApplySuggestion() {
    return useOptimisticListMutation({
        queryKey: QK.dashboard.aiSuggestions(),
        mutationFn: (suggestion) => fixtures.applySuggestion(suggestion),
        undoMessage: (s) => `Uygulandı: ${s.headline}`,
        /* Server reverse henüz yok — undo cache restore'la sınırlı (factory zaten
           previous'ı koyar). Reverse hazırlanınca undoFn dolar. */
        undoFn: () => Promise.resolve(),
        errorMessage: 'Öneri uygulanamadı',
    });
}

export function useSnoozeSuggestion() {
    return useOptimisticListMutation({
        queryKey: QK.dashboard.aiSuggestions(),
        mutationFn: (suggestion) => fixtures.snoozeSuggestion(suggestion),
        errorMessage: 'Erteleme başarısız',
    });
}

export function useDismissSuggestion() {
    return useOptimisticListMutation({
        queryKey: QK.dashboard.aiSuggestions(),
        mutationFn: ({ suggestion, reason }) => fixtures.dismissSuggestion(suggestion, reason),
        extractTarget: ({ suggestion }) => suggestion,
        errorMessage: 'Reddetme kaydedilemedi',
    });
}
