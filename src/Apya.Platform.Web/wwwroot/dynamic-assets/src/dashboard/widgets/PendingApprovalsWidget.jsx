import React from 'react';
import { WidgetShell } from './WidgetShell';
import { Button, Badge, SkeletonList, EmptyState } from '../../components/ui';
import { formatMoney, cn } from '../../lib/utils';
import { usePendingApprovals, useApproveItem, useRejectItem } from '../hooks/usePendingApprovals';

/**
 * PendingApprovalsWidget — "Bana ne bekliyor?"
 *
 * Decision UI: kullanıcı her satırda Approve/Reject butonlarını GÖRÜR,
 * tek tıkla aksiyon alır. UX strategy doc § 8 — "≤2 tap" hedefi.
 *
 * Optimistic UI:
 *   - Tıklama anında satır half-opacity + spinner badge'i alır.
 *   - Backend mismatch'te rollback toast.
 *   - Burada mock — onApprove/onReject prop'ları gerçek mutation hook'una
 *     bağlanır (TanStack Query useMutation, gelecek commit).
 *
 * Bento'da 2×2 ya da 3×2 alabilir. Mobile'da tek sütun stack.
 */

const TYPE_LABELS = {
    invoice:  { label: 'Fatura',   variant: 'brand' },
    expense:  { label: 'Masraf',   variant: 'neutral' },
    po:       { label: 'Sipariş',  variant: 'ai' },
};

function PendingApprovalsWidget() {
    const { data: items, isLoading, isError, isFetching, isStale, dataUpdatedAt, refetch } = usePendingApprovals();
    const approve = useApproveItem();
    const reject  = useRejectItem();
    const onRetry  = () => refetch();
    const onApprove = (item) => approve.mutateAsync(item).catch(() => { /* rollback handled in onError */ });
    const onReject  = (item) => reject.mutateAsync(item).catch(() => { /* rollback handled in onError */ });
    const count = items?.length ?? 0;

    return (
        <WidgetShell
            title="Onay Bekleyenler"
            subtitle={count > 0 ? `${count} kalem inceleme bekliyor` : undefined}
            badge={count > 0 && (
                <Badge variant="warning" size="sm" withDot>
                    {count}
                </Badge>
            )}
            isLoading={isLoading}
            isError={isError}
            isFetching={isFetching}
            isStale={isStale}
            dataUpdatedAt={dataUpdatedAt}
            onRetry={onRetry}
            skeleton={<SkeletonList rows={4} />}
            isEmpty={!isLoading && !isError && count === 0}
            emptyState={(
                <EmptyState
                    compact
                    variant="success"
                    icon={<span className="text-base">✓</span>}
                    title="Hepsi tamam"
                    description="Bugün karar bekleyen kalmadı."
                />
            )}
        >
            <ul className="flex flex-col gap-2 h-full overflow-y-auto">
                {items?.map((item) => (
                    <ApprovalRow
                        key={item.id}
                        item={item}
                        onApprove={onApprove}
                        onReject={onReject}
                    />
                ))}
            </ul>
        </WidgetShell>
    );
}

function ApprovalRow({ item, onApprove, onReject }) {
    const [pending, setPending] = React.useState(null); // 'approve' | 'reject' | null
    const typeMeta = TYPE_LABELS[item.type] ?? TYPE_LABELS.expense;
    const ageLabel = formatAge(item.ageHours);

    const handle = async (action, fn) => {
        if (pending) return;
        setPending(action);
        try {
            await fn?.(item);
        } finally {
            setPending(null);
        }
    };

    return (
        <li className={cn(
            'flex items-center gap-3 p-2.5 rounded-md',
            'bg-surface-base border border-subtle',
            'transition-opacity duration-fast',
            pending && 'opacity-60',
        )}>
            {/* Sol: tip + meta */}
            <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <Badge variant={typeMeta.variant} size="sm">{typeMeta.label}</Badge>
                    <span className="text-xs text-text-tertiary truncate">
                        {item.requester} · {ageLabel}
                    </span>
                </div>
                <p className="text-sm font-medium text-text-primary truncate">{item.title}</p>
            </div>

            {/* Orta: tutar */}
            <div className="font-tabular font-semibold text-sm text-text-primary flex-none">
                {formatMoney(item.amount, item.currency)}
            </div>

            {/* Sağ: aksiyon — desktop'ta 2 buton, mobile'da swipeable card'a evrilebilir */}
            <div className="flex items-center gap-1 flex-none">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handle('reject', onReject)}
                    isLoading={pending === 'reject'}
                    aria-label={`${item.title} reddet`}
                    className="text-text-negative hover:bg-negative-50 hover:text-negative-700"
                >
                    Reddet
                </Button>
                <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handle('approve', onApprove)}
                    isLoading={pending === 'approve'}
                    aria-label={`${item.title} onayla`}
                >
                    Onayla
                </Button>
            </div>
        </li>
    );
}

function formatAge(hours) {
    if (hours < 1)  return 'az önce';
    if (hours < 24) return `${Math.round(hours)} sa önce`;
    const d = Math.floor(hours / 24);
    return `${d} gün önce`;
}

export { PendingApprovalsWidget };
