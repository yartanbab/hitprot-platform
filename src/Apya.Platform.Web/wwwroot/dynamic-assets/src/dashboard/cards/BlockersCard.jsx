import React from 'react';
import { CardShell } from './CardShell';
import { useBlockedTasks } from '../hooks/useDashboard';
import { EmptyState } from '../../components/ui';
import { cn } from '../../lib/utils';
import { t } from '../../lib/i18n';

const REASON = {
    WaitingReview: ['bg-warning-50 text-warning-700',   'Dashboard:Blockers:WaitingReview', 'Kontrolde'],
    Dependency:    ['bg-surface-sunken text-text-secondary', 'Dashboard:Blockers:Dependency', 'Bağımlı'],
    Unassigned:    ['bg-negative-50 text-negative-700', 'Dashboard:Blockers:Unassigned',    'Atanmamış'],
};

/**
 * "Tıkanan işler & risk" — üstte 3px kırmızı durum şeridi, zemin renklendirilmez.
 * Tıkanma tanımı sunucuda (DashboardOptions.StaleAfterDays + sebep önceliği).
 */
function BlockersCard({ editMode }) {
    const query = useBlockedTasks();
    const items = query.data ?? [];

    return (
        <CardShell
            editMode={editMode}
            accent={items.length > 0 ? 'negative' : undefined}
            title={t('Dashboard:Blockers:Title', 'Tıkanan işler & risk')}
            badge={items.length > 0 && (
                <span className="font-mono text-[11px] font-semibold px-[7px] py-0.5 rounded-full bg-negative-50 text-negative-700 tabular-nums flex-none">
                    {items.length}
                </span>
            )}
            isLoading={query.isLoading}
            isError={query.isError}
            onRetry={query.refetch}
            isEmpty={items.length === 0}
            isFetching={query.isFetching}
            isStale={query.isStale}
            dataUpdatedAt={query.dataUpdatedAt}
            emptyState={
                <EmptyState
                    compact
                    title={t('Dashboard:Blockers:EmptyTitle', 'Tıkanan iş yok')}
                    description={t('Dashboard:Blockers:EmptyDescription', 'Açık işlerin hepsi son günlerde hareket görmüş.')}
                />
            }
        >
            <ul className="flex flex-col gap-3">
                {items.slice(0, 3).map((item, index) => (
                    <li key={item.taskId} className="flex flex-col gap-1">
                        {index > 0 && <span className="h-px bg-subtle mb-2" />}
                        <div className="flex items-center gap-2">
                            <ReasonBadge reason={item.blockReason} />
                            <span className="font-mono text-[10.5px] text-text-tertiary truncate">
                                {t('Dashboard:Blockers:Meta', '{0} · {1} gündür hareketsiz', item.code, item.idleDays)}
                            </span>
                        </div>
                        <span className="text-[12.5px] font-medium text-text-primary leading-[1.4]">
                            {item.title}
                            {item.dependentCount > 0 && (
                                <span className="text-text-tertiary font-normal">
                                    {' — '}
                                    {t('Dashboard:Blockers:Dependents', '{0} bağımlı görev bekliyor', item.dependentCount)}
                                </span>
                            )}
                        </span>
                        <a
                            href={`/Tasks?taskId=${item.taskId}`}
                            className="text-xs font-medium text-text-link hover:underline self-start"
                        >
                            {t('Dashboard:Blockers:OpenTask', 'Görevi aç →')}
                        </a>
                    </li>
                ))}
            </ul>
        </CardShell>
    );
}

function ReasonBadge({ reason }) {
    const [tone, key, fallback] = REASON[reason] ?? REASON.Dependency;
    return (
        <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full flex-none', tone)}>
            {t(key, fallback)}
        </span>
    );
}

export { BlockersCard };
