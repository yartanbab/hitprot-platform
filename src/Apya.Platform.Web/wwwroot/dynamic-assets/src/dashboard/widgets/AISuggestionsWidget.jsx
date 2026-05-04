import React from 'react';
import { WidgetShell } from './WidgetShell';
import { Badge, SkeletonList, EmptyState } from '../../components/ui';
import { SuggestionCard, ConfidenceMeter } from '../../components/ai';
import {
    useAISuggestions,
    useApplySuggestion,
    useSnoozeSuggestion,
    useDismissSuggestion,
} from '../hooks/useAISuggestions';

/**
 * AISuggestionsWidget — "AI Inbox" Bento görünümü.
 *
 * Felsefe (UX strategy doc § 4):
 *   - Push notification değil, sessiz feed
 *   - 0.30 altı confidence GİZLİ — gürültü olur, kullanıcı güvenini kaybeder
 *   - Top 5'ten fazlası kesilir; "+N daha" link inbox sayfasına gider (sonraki ticket)
 *   - Optimistic UI: apply/snooze/dismiss tek click → kart anında çıkar
 */

const MAX_VISIBLE = 5;
const MIN_CONFIDENCE = 0.30;

function AISuggestionsWidget() {
    const { data, isLoading, isError, isFetching, isStale, dataUpdatedAt, refetch } = useAISuggestions();
    const apply   = useApplySuggestion();
    const snooze  = useSnoozeSuggestion();
    const dismiss = useDismissSuggestion();

    /* Düşük confidence'ı filtrele — UX kontratı gereği */
    const visible = React.useMemo(() => {
        const filtered = (data ?? []).filter(
            (s) => ConfidenceMeter.normalize(s.confidence) >= MIN_CONFIDENCE,
        );
        return filtered.slice(0, MAX_VISIBLE);
    }, [data]);

    const remaining = (data?.length ?? 0) - visible.length;

    return (
        <WidgetShell
            title="AI önerileri"
            subtitle="Sessiz inbox — sen bakmak istediğinde"
            badge={<Badge variant="ai" size="sm" withDot>AI</Badge>}
            isLoading={isLoading}
            isError={isError}
            isFetching={isFetching}
            isStale={isStale}
            dataUpdatedAt={dataUpdatedAt}
            onRetry={() => refetch()}
            skeleton={<SkeletonList rows={3} withLeading={false} />}
            isEmpty={!isLoading && !isError && visible.length === 0}
            emptyState={(
                <EmptyState
                    compact
                    variant="info"
                    icon={<span className="text-base">✦</span>}
                    title="AI şu an sessiz"
                    description="Anlamlı bir öneri çıkarsa burada gözükecek. Şimdilik aksiyona gerek yok."
                />
            )}
        >
            <ul className="flex flex-col gap-2 h-full overflow-y-auto">
                {visible.map((s) => (
                    <li key={s.id}>
                        <SuggestionCardRow
                            suggestion={s}
                            apply={apply}
                            snooze={snooze}
                            dismiss={dismiss}
                        />
                    </li>
                ))}
                {remaining > 0 && (
                    <li className="text-xs text-text-tertiary text-center pt-1">
                        +{remaining} öneri daha
                        {/* TODO(APYA-future): full inbox sayfasına link */}
                    </li>
                )}
            </ul>
        </WidgetShell>
    );
}

function SuggestionCardRow({ suggestion, apply, snooze, dismiss }) {
    /* Hangi mutation aktif → button-spinner pending state'i */
    const pending = apply.isPending && apply.variables?.id === suggestion.id ? 'apply'
        : snooze.isPending && snooze.variables?.id === suggestion.id ? 'snooze'
        : dismiss.isPending && dismiss.variables?.suggestion?.id === suggestion.id ? 'dismiss'
        : null;

    return (
        <SuggestionCard
            headline={suggestion.headline}
            why={suggestion.why}
            confidence={suggestion.confidence}
            tone={suggestion.tone}
            primaryActionLabel={suggestion.primaryActionLabel}
            pending={pending}
            onApply={() => apply.mutateAsync(suggestion).catch(() => { /* rollback in onError */ })}
            onSnooze={() => snooze.mutateAsync(suggestion).catch(() => { /* rollback in onError */ })}
            onDismiss={() => dismiss.mutateAsync({ suggestion, reason: 'irrelevant' }).catch(() => { /* rollback in onError */ })}
        />
    );
}

export { AISuggestionsWidget };
