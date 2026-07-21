import React from 'react';
import { Card, Skeleton, Badge, Sparkline } from '../../components/ui';
import { formatMoneyCompact, formatDelta, cn } from '../../lib/utils';
import { useKpiSummary } from '../hooks/useKpiSummary';

/**
 * KpiStripWidget — prototip "tek satır 4 KPI kartı" (HANDOFF §Dashboard):
 * ikon + değer + delta chip + sparkline, her biri bağımsız kart.
 *
 * WidgetShell KULLANMAZ — WidgetShell tek başlıklı TEK kart chrome'u verir
 * ("4 KPI'yı içeren 1 kart" görünümü), prototip ise 4 BAĞIMSIZ kart ister.
 * Bu yüzden loading/error state'i burada kendi başına ele alınır (aynı
 * Bento 4-state felsefesi, WidgetShell'in card-per-item olmayan versiyonu).
 *
 * Grid'de tek bir react-grid-layout item'ı (sürükle/boyutlandır tek parça);
 * içi CSS grid ile 4 (desktop/tablet) veya 2×2 (mobile) tile'a bölünür.
 */
const ICONS = {
    wallet: WalletIcon,
    trending: TrendingIcon,
    receipt: ReceiptIcon,
    gauge: GaugeIcon,
};

function KpiStripWidget() {
    const { data, isLoading, isError, refetch } = useKpiSummary();

    if (isError) {
        return (
            <Card variant="flat" density="comfortable" className="h-full flex items-center justify-center">
                <div className="flex items-center gap-3 text-sm">
                    <Badge variant="negative" withDot>Yüklenemedi</Badge>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="text-text-link underline-offset-2 hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
                    >
                        Tekrar dene
                    </button>
                </div>
            </Card>
        );
    }

    if (isLoading || !data) {
        return (
            <div className="grid grid-cols-4 gap-3 h-full mobile:grid-cols-2">
                {[0, 1, 2, 3].map((i) => (
                    <Card key={i} variant="default" density="compact" className="flex flex-col gap-2 justify-center">
                        <Skeleton height={10} className="w-1/2" />
                        <Skeleton height={22} className="w-2/3" />
                        <Skeleton height={9} className="w-1/3" />
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-4 gap-3 h-full mobile:grid-cols-2">
            {data.map((kpi) => <KpiTile key={kpi.id} kpi={kpi} />)}
        </div>
    );
}

function KpiTile({ kpi }) {
    const delta = formatDelta(kpi.deltaPct);
    const trendUp = kpi.deltaPct >= 0;
    const valueText = kpi.format === 'percent'
        ? new Intl.NumberFormat('tr-TR', { style: 'percent', maximumFractionDigits: 0 }).format(kpi.value)
        : formatMoneyCompact(kpi.value, kpi.currency);
    const Icon = ICONS[kpi.icon] ?? WalletIcon;

    return (
        <Card variant="default" density="compact" className="flex flex-col gap-1.5 justify-between">
            <div className="flex items-center justify-between gap-2">
                <span className="apya-overline truncate">{kpi.label}</span>
                <Icon className="text-text-tertiary flex-none" />
            </div>
            <div className="flex items-end justify-between gap-2">
                <span className="text-xl font-semibold tracking-tight font-tabular truncate">
                    {valueText}
                </span>
                <div className="w-10 h-6 flex-none">
                    <Sparkline series={kpi.series} variant={trendUp ? 'positive' : 'negative'} />
                </div>
            </div>
            <div className={cn(
                'inline-flex items-center gap-1 text-xs font-medium font-tabular w-fit',
                trendUp ? 'text-text-positive' : 'text-text-negative',
            )}>
                {delta.symbol} {delta.text}
            </div>
        </Card>
    );
}

/* -------------------- Inline Icons (no deps, ThemeToggle.jsx ile aynı desen) -------------------- */

function WalletIcon({ className }) {
    return (
        <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
        </svg>
    );
}

function TrendingIcon({ className }) {
    return (
        <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 17l6-6 4 4 8-8" />
            <path d="M17 7h4v4" />
        </svg>
    );
}

function ReceiptIcon({ className }) {
    return (
        <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 2h16v20l-3-2-2 2-3-2-3 2-2-2-3 2Z" />
            <path d="M8 8h8M8 12h8" />
        </svg>
    );
}

function GaugeIcon({ className }) {
    return (
        <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            <path d="M12 15l3-3M4 15a8 8 0 1 1 16 0" />
        </svg>
    );
}

export { KpiStripWidget };
