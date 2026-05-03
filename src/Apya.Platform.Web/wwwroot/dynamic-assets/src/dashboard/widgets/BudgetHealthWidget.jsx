import React from 'react';
import { WidgetShell } from './WidgetShell';
import { Badge } from '../../components/ui';
import { formatMoneyCompact, formatDelta, cn } from '../../lib/utils';
import { useBudgetSummary } from '../hooks/useBudgetSummary';

/**
 * BudgetHealthWidget — "Bütçem sağlıklı mı?" sorusuna 1 saniyede cevap.
 *
 * Glance level (L1):
 *   - Büyük rakam: harcanan / toplam bütçe
 *   - % delta: önceki dönemle karşılaştırma
 *   - Sağlık göstergesi: yeşil/sarı/kırmızı bar
 *
 * Scan level (L2 — hover/focus): proje bazında dağılım
 * Drill level (L3 — tıklama): /reports/budget detayı
 *
 * Veri kaynağı: useBudgetSummary hook (TanStack Query).
 * APYA-97'de fetcher mock; backend endpoint hazırlanınca swap edilir.
 */

function BudgetHealthWidget() {
    const { data, isLoading, isError, refetch } = useBudgetSummary();
    const onRetry = () => refetch();
    const usagePct = data ? (data.spent / data.budget) * 100 : 0;
    const health   = healthForUsage(usagePct);
    const delta    = data ? formatDelta(data.deltaPct) : null;

    return (
        <WidgetShell
            title="Bütçe Sağlığı"
            subtitle="Tüm aktif projeler — bu ay"
            badge={<Badge variant={health.badgeVariant} size="sm" withDot>{health.label}</Badge>}
            isLoading={isLoading}
            isError={isError}
            onRetry={onRetry}
        >
            {data && (
                <div className="flex flex-col gap-3 h-full">
                    {/* L1 — Glance metric */}
                    <div className="flex items-baseline gap-2 font-tabular">
                        <span className="text-3xl font-semibold tracking-tight">
                            {formatMoneyCompact(data.spent, data.currency)}
                        </span>
                        <span className="text-sm text-text-tertiary">
                            / {formatMoneyCompact(data.budget, data.currency)}
                        </span>
                    </div>

                    {/* Delta line */}
                    {delta && (
                        <div className="flex items-center gap-1.5 text-xs">
                            <span className={cn(
                                'inline-flex items-center gap-1 font-medium font-tabular',
                                /* delta < 0 = harcama düşmüş = pozitif sinyal */
                                data.deltaPct < 0 ? 'text-text-positive' : 'text-text-negative',
                            )}>
                                {delta.symbol} {delta.text}
                            </span>
                            <span className="text-text-tertiary">geçen aya göre</span>
                        </div>
                    )}

                    {/* Sağlık barı */}
                    <ProgressBar value={usagePct} variant={health.barVariant} />

                    {/* L2 — Scan: proje dağılımı (compact list) */}
                    <ul className="flex flex-col gap-1.5 mt-1 overflow-y-auto">
                        {data.breakdown.map((row) => (
                            <li
                                key={row.project}
                                className="flex items-center justify-between text-xs gap-3"
                            >
                                <span className="truncate text-text-secondary">{row.project}</span>
                                <span className={cn(
                                    'font-tabular font-medium',
                                    healthForUsage(row.ratio * 100).textVariant,
                                )}>
                                    {Math.round(row.ratio * 100)}%
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </WidgetShell>
    );
}

/* Sağlık eşikleri — finance/PMO best practice:
     0-70%   → yeşil  (sağlıklı)
     70-90%  → sarı   (dikkat)
     90%+    → kırmızı (kritik) */
function healthForUsage(pct) {
    if (pct >= 90) {
        return {
            label:        'Kritik',
            badgeVariant: 'critical',
            barVariant:   'critical',
            textVariant:  'text-text-negative',
        };
    }
    if (pct >= 70) {
        return {
            label:        'Dikkat',
            badgeVariant: 'warning',
            barVariant:   'warning',
            textVariant:  'text-text-warning',
        };
    }
    return {
        label:        'Sağlıklı',
        badgeVariant: 'positive',
        barVariant:   'positive',
        textVariant:  'text-text-positive',
    };
}

function ProgressBar({ value, variant = 'positive' }) {
    const fillColor = {
        positive: 'bg-positive-500',
        warning:  'bg-warning-500',
        critical: 'bg-negative-500',
    }[variant];

    return (
        <div
            role="progressbar"
            aria-valuenow={Math.round(value)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="w-full h-1.5 rounded-full bg-surface-sunken overflow-hidden"
        >
            <div
                className={cn(
                    fillColor,
                    'h-full rounded-full transition-all duration-slow ease-standard',
                )}
                style={{ width: `${Math.min(value, 100)}%` }}
            />
        </div>
    );
}

export { BudgetHealthWidget };
