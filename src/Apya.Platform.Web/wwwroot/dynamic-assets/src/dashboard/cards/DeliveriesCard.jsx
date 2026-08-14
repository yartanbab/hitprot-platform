import React, { useMemo } from 'react';
import { CardShell } from './CardShell';
import { useDeliveries } from '../hooks/useDashboard';
import { EmptyState } from '../../components/ui';
import { cn } from '../../lib/utils';
import { t } from '../../lib/i18n';

/**
 * "Bu ay teslim edilecekler" — hafta gruplu liste.
 *
 * GRUPLAMA SUNUCUDA yapılır (DeliveryItemDto.groupKey); burada yalnız çizilir.
 * Aksiyon = navigasyon: satır tıklaması görev sayfasına gider, satır içi düzenleme yok.
 */

const GROUP_ORDER = ['ThisWeek', 'NextWeek', 'EndOfMonth', 'Later'];

const GROUP_LABEL = {
    ThisWeek:   ['Dashboard:Deliveries:ThisWeek', 'Bu hafta'],
    NextWeek:   ['Dashboard:Deliveries:NextWeek', 'Gelecek hafta'],
    EndOfMonth: ['Dashboard:Deliveries:EndOfMonth', 'Ay sonu'],
    Later:      ['Dashboard:Deliveries:Later', 'Sonrası'],
};

function DeliveriesCard({ filter, editMode }) {
    const query = useDeliveries(filter);
    const items = query.data ?? [];

    const groups = useMemo(() => {
        const map = new Map(GROUP_ORDER.map((key) => [key, []]));
        for (const item of items) {
            (map.get(item.groupKey) ?? map.get('Later')).push(item);
        }
        return GROUP_ORDER
            .map((key) => ({ key, items: map.get(key) ?? [] }))
            .filter((g) => g.items.length > 0);
    }, [items]);

    const overdueCount = items.filter((i) => i.state === 'Overdue').length;

    return (
        <CardShell
            editMode={editMode}
            title={t('Dashboard:Deliveries:Title', 'Bu ay teslim edilecekler')}
            subtitle={t('Dashboard:Deliveries:Subtitle', '{0} iş · {1} gecikmiş', items.length, overdueCount)}
            actions={
                <a href="/Tasks" className="text-[12.5px] font-medium text-text-link hover:underline">
                    {t('Dashboard:Deliveries:AllTasks', 'Görev listesi →')}
                </a>
            }
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
                    title={t('Dashboard:Deliveries:EmptyTitle', 'Bu dönem teslim yok')}
                    description={t('Dashboard:Deliveries:EmptyDescription', 'Son tarihi bu döneme düşen açık iş bulunmuyor.')}
                    action={
                        <a href="/Tasks" className="text-[12.5px] font-medium text-text-link hover:underline">
                            {t('Dashboard:Deliveries:AllTasks', 'Görev listesi →')}
                        </a>
                    }
                />
            }
        >
            <div className="flex flex-col gap-2.5">
                {groups.map((group) => (
                    <React.Fragment key={group.key}>
                        <GroupHeader groupKey={group.key} count={group.items.length} />
                        <ul className="flex flex-col gap-[3px]">
                            {group.items.map((item) => <DeliveryRow key={item.taskId} item={item} />)}
                        </ul>
                    </React.Fragment>
                ))}
            </div>
        </CardShell>
    );
}

function GroupHeader({ groupKey, count }) {
    const [key, fallback] = GROUP_LABEL[groupKey] ?? GROUP_LABEL.Later;
    return (
        <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.04em] text-text-tertiary">
                {t(key, fallback)}
            </span>
            <span className="font-mono text-[10.5px] text-text-tertiary tabular-nums">{count}</span>
            <span className="flex-1 h-px bg-subtle" />
        </div>
    );
}

const STATE_DOT = {
    Overdue:  'bg-negative-500',
    InReview: 'bg-warning-500',
    OnTrack:  'bg-positive-500',
    Upcoming: 'bg-neutral-300',
};

function DeliveryRow({ item }) {
    return (
        <li>
            <a
                href={`/Tasks?taskId=${item.taskId}`}
                className={cn(
                    /* `flex-wrap` + başlığa taban genişlik: rozet/proje/tarih/avatar
                       hepsi flex-none olduğu için dar kartta başlık 0'a eziliyordu
                       (ölçüldü: 311px kartta başlığa 4px kalıyor). Taban genişlik
                       sığmayınca yan bilgiler alt satıra sarar. `mobile:` yetmez —
                       o viewport sorgusu, kart dar olması ekranın dar olması demek değil. */
                    'flex flex-wrap items-center gap-3 p-2.5 rounded-[10px]',
                    'bg-surface-base border border-subtle',
                    'hover:bg-surface-hover hover:border-default transition-colors duration-fast',
                    'focus-visible:outline-none focus-visible:shadow-focus',
                )}
            >
                <span className={cn('w-1.5 h-1.5 rounded-full flex-none', STATE_DOT[item.state] ?? STATE_DOT.Upcoming)} aria-hidden="true" />

                <span className="flex-1 min-w-[140px] text-[13.5px] font-medium text-text-primary truncate">
                    {item.title}
                </span>

                {item.state === 'Overdue' && item.overdueDays != null && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-negative-50 text-negative-700 flex-none">
                        {t('Dashboard:Deliveries:OverdueDays', '{0} gün gecikmiş', item.overdueDays)}
                    </span>
                )}
                {item.state === 'InReview' && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-warning-50 text-warning-700 flex-none">
                        {t('Dashboard:Deliveries:InReview', 'kontrolde')}
                    </span>
                )}

                {item.projectName && (
                    <span className="text-[11px] text-text-secondary px-2 py-0.5 rounded-full bg-surface-sunken flex-none truncate max-w-[140px]">
                        {item.projectName}
                    </span>
                )}

                <span className={cn(
                    'font-mono text-[11.5px] w-[50px] text-right flex-none tabular-nums',
                    item.state === 'Overdue' ? 'text-negative-500' : 'text-text-secondary',
                )}>
                    {formatShortDate(item.dueDate)}
                </span>

                {item.assigneeInitials && (
                    <span
                        title={item.assigneeName}
                        className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full bg-surface-sunken text-text-secondary text-[9px] font-semibold flex-none"
                    >
                        {item.assigneeInitials}
                    </span>
                )}
            </a>
        </li>
    );
}

function formatShortDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

export { DeliveriesCard };
