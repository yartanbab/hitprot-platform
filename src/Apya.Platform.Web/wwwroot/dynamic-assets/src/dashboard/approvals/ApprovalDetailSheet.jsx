import React, { useCallback, useMemo } from 'react';
import { Sheet, Button, Badge, HoldButton, SkeletonHeadline } from '../../components/ui';
import { ConfidenceMeter } from '../../components/ai';
import { useDeviceMode } from '../../lib/device';
import { formatMoney } from '../../lib/utils';
import { useApprovalDetail, useApproveItem, useRejectItem } from '../hooks/usePendingApprovals';
import { t } from '../../lib/i18n';

/**
 * ApprovalDetailSheet — push notification deep-link'in açtığı bottom sheet
 * (UX strategy doc § 8 — Flow B). Kullanıcı listeye uğramadan kararı verir.
 *
 * Anatomi:
 *   - Headline: ₺tutar — talep eden — kategori
 *   - AI: confidence meter + anomaly status + neden listesi (disclosure)
 *   - 3 satır context: bütçe kalanı, kategori spend, proje
 *   - Aksiyonlar: Reddet (instant) + Onayla (mobile'da 200ms hold)
 *
 * Karar: Onay'da hold-to-confirm yalnızca decision (mobile) modda; tablet+ ise
 * tek tıkla. Reject reversible (undoFn approve), kazara basışın maliyeti düşük.
 *
 * Kapanma kuralı: action bittikten sonra sheet kapanır (parent onClose çağırır).
 * Kullanıcı yeni bir öğe seçmek istiyorsa listeye gider — bu sheet "tek karar".
 */

const HOLD_MS_MOBILE = 200;        /* strategy spec */

function ApprovalDetailSheet({ approvalId, open, onOpenChange }) {
    const mode = useDeviceMode();
    const detail = useApprovalDetail(approvalId);
    const approve = useApproveItem();
    const reject  = useRejectItem();

    const item = detail.data;

    const handleApprove = useCallback(async () => {
        if (!item) return;
        try {
            await approve.mutateAsync(item);
            onOpenChange?.(false);
        } catch { /* Hata toast'i factory'den; sheet açık kalsın */ }
    }, [item, approve, onOpenChange]);

    const handleReject = useCallback(async () => {
        if (!item) return;
        try {
            await reject.mutateAsync(item);
            onOpenChange?.(false);
        } catch { /* aynı */ }
    }, [item, reject, onOpenChange]);

    const headline = useMemo(() => {
        if (!item) return null;
        return `${formatMoney(item.amount, item.currency)} — ${item.requester} — ${item.context?.category?.label ?? item.type}`;
    }, [item]);

    const holdMs = mode === 'decision' ? HOLD_MS_MOBILE : 0;
    const isPending = approve.isPending || reject.isPending;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <Sheet.Content
                title={t('Approval:Detail:Title', 'Onay detayı')}
                description={t('Approval:Detail:Subtitle', 'Tek bir kararı bağlamıyla incele ve uygula')}
            >
                <div className="flex flex-col h-full">
                    <header className="px-4 pt-2 pb-3 border-b border-subtle">
                        <h2 className="text-lg font-semibold text-balance">
                            {detail.isLoading ? <SkeletonHeadline withDelta={false} /> : headline}
                        </h2>
                        {item && (
                            <p className="text-xs text-text-tertiary mt-1">
                                {item.title}
                            </p>
                        )}
                    </header>

                    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
                        {detail.isError && (
                            <div className="rounded-md border border-negative-100 bg-negative-50 p-3">
                                <p className="text-sm text-text-negative">
                                    {detail.error?.message ?? t('Approval:LoadFailed', 'Onay yüklenemedi.')}
                                </p>
                            </div>
                        )}

                        {item && (
                            <>
                                <AISection ai={item.ai} />
                                <ContextSection context={item.context} />
                            </>
                        )}
                    </div>

                    <footer className="px-4 py-3 border-t border-subtle bg-surface-sunken flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="md"
                            onClick={handleReject}
                            isLoading={reject.isPending}
                            disabled={!item || isPending}
                            className="text-text-negative hover:bg-negative-50 hover:text-negative-700"
                        >
                            {t('Common:Reject', 'Reddet')}
                        </Button>
                        <HoldButton
                            holdMs={holdMs}
                            variant="primary"
                            size="md"
                            onConfirm={handleApprove}
                            isLoading={approve.isPending}
                            disabled={!item || isPending}
                        >
                            {holdMs > 0
                        ? t('Approval:HoldToApprove', 'Onaylamak için bas')
                        : t('Common:Approve', 'Onayla')}
                        </HoldButton>
                    </footer>
                </div>
            </Sheet.Content>
        </Sheet>
    );
}

function AISection({ ai }) {
    if (!ai) return null;
    return (
        <section className="rounded-md border border-subtle bg-surface-base p-3">
            <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant={ai.anomaly ? 'warning' : 'ai'} size="sm" withDot>
                    {ai.anomaly
                        ? t('Approval:Ai:AnomalyFound', 'AI: anomali işareti var')
                        : t('Approval:Ai:NoAnomaly', 'AI: anomali yok')}
                </Badge>
                <ConfidenceMeter score={ai.confidence} size="md" />
            </div>
            {ai.reasons?.length > 0 && (
                <ul className="text-xs text-text-secondary list-disc pl-5 space-y-1">
                    {ai.reasons.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
            )}
        </section>
    );
}

function ContextSection({ context }) {
    if (!context) return null;
    const { budget, category, project } = context;
    /* Kalan bütçe yüzdesi → renk seçimi: yüksek (>30%) yeşil, düşük (<10%) kırmızı */
    const ratio = budget?.total ? budget.remaining / budget.total : 0;
    const ratioVariant = ratio >= 0.30 ? 'positive' : ratio >= 0.10 ? 'warning' : 'critical';

    return (
        <section className="grid grid-cols-1 gap-2">
            <ContextRow
                label={t('Approval:Detail:BudgetRemaining', 'Bütçe kalanı')}
                value={budget && formatMoney(budget.remaining, budget.currency)}
                hint={budget && `${Math.round(ratio * 100)}% / ${formatMoney(budget.total, budget.currency)}`}
                variant={ratioVariant}
            />
            <ContextRow
                label={t('Approval:Detail:CategoryThisMonth', '{0} — bu ay',
                    category?.label ?? t('Common:Category', 'Kategori'))}
                value={category && formatMoney(category.spentMonth, budget?.currency ?? 'TRY')}
            />
            <ContextRow
                label={t('Common:Project', 'Proje')}
                value={project?.name}
                hint={project?.code}
            />
        </section>
    );
}

function ContextRow({ label, value, hint, variant }) {
    const valueClass = variant === 'positive' ? 'text-text-positive'
        : variant === 'warning' ? 'text-text-warning'
        : variant === 'critical' ? 'text-text-negative'
        : 'text-text-primary';
    return (
        <div className="flex items-center justify-between gap-3 py-1.5 border-b border-subtle last:border-b-0">
            <span className="text-sm text-text-secondary">{label}</span>
            <div className="flex flex-col items-end min-w-0">
                <span className={`text-sm font-tabular font-medium ${valueClass}`}>
                    {value ?? '—'}
                </span>
                {hint && <span className="text-xs text-text-tertiary">{hint}</span>}
            </div>
        </div>
    );
}

export { ApprovalDetailSheet };
