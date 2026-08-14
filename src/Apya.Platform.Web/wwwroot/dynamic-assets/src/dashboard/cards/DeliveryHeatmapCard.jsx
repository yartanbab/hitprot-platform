import React from 'react';
import { CardShell } from './CardShell';
import { Heatmap } from '../charts';
import { useDeliveryHeatmap } from '../hooks/useDashboard';
import { EmptyState } from '../../components/ui';
import { t } from '../../lib/i18n';

/** Teslim yoğunluğu — 4 hafta × 7 gün ısı takvimi. Sarı gün = hibe son tarihi. */
function DeliveryHeatmapCard({ filter, editMode }) {
    const query = useDeliveryHeatmap(filter);
    const cells = query.data ?? [];
    const hasDeliveries = cells.some((c) => c.count > 0);

    const busiest = cells.reduce(
        (best, cell) => (cell.count > (best?.count ?? 0) ? cell : best),
        null,
    );

    return (
        <CardShell
            editMode={editMode}
            title={t('Dashboard:Heatmap:Title', 'Teslim yoğunluğu')}
            subtitle={t('Dashboard:Heatmap:Subtitle', 'Önümüzdeki 4 hafta · hafta × gün')}
            isLoading={query.isLoading}
            isError={query.isError}
            onRetry={query.refetch}
            isEmpty={cells.length === 0}
            isFetching={query.isFetching}
            isStale={query.isStale}
            dataUpdatedAt={query.dataUpdatedAt}
            emptyState={
                <EmptyState
                    compact
                    title={t('Dashboard:Heatmap:EmptyTitle', 'Planlı teslim yok')}
                    description={t('Dashboard:Heatmap:EmptyDescription', 'Önümüzdeki 4 haftada son tarihi olan iş bulunmuyor.')}
                />
            }
            bodyClassName="flex flex-col gap-3"
        >
            <Heatmap cells={cells} />
            <span className="text-[11.5px] text-text-tertiary">
                {hasDeliveries && busiest
                    ? t('Dashboard:Heatmap:Busiest', 'En yoğun gün {0} ({1} teslim) · sarı: hibe son tarihi',
                        new Date(busiest.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
                        busiest.count)
                    : t('Dashboard:Heatmap:NoneScheduled', 'Bu pencerede teslim planlanmamış · sarı: hibe son tarihi')}
            </span>
        </CardShell>
    );
}

export { DeliveryHeatmapCard };
