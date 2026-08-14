import React from 'react';
import { AreaSpark, Gauge } from '../charts';
import { useSummary } from '../hooks/useDashboard';
import { cn, formatMoneyCompact } from '../../lib/utils';
import { t } from '../../lib/i18n';
import { Skeleton } from '../../components/ui';

/**
 * Sayısal özet şeridi — 5 kutucuk. Tek sorgudan beslenir (useSummary).
 *
 * Yetkisi olmayan alanlar sunucudan NULL gelir; o kutucuk "yetki gerekli"
 * durumuna düşer. Frontend hiçbir değeri kendi kararıyla gizlemez.
 */
function StatStripCard({ filter }) {
    const { data, isLoading, isError, refetch } = useSummary(filter);

    if (isLoading) {
        return (
            <div className="h-full grid grid-cols-5 gap-5 lt-1080:grid-cols-3 mobile:grid-cols-2 mobile:h-auto">
                {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="rounded-card shadow-card bg-surface-base border border-default p-4">
                        <Skeleton height={14} className="w-2/3 mb-2" />
                        <Skeleton height={28} className="w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="rounded-card shadow-card bg-surface-base border border-default p-4 flex items-center justify-between gap-3">
                <span className="text-[12.5px] text-text-secondary">
                    {t('Dashboard:Summary:Error', 'Özet yüklenemedi.')}
                </span>
                <button type="button" onClick={() => refetch()} className="text-[12.5px] text-text-link hover:underline">
                    {t('Common:Retry', 'Tekrar dene')}
                </button>
            </div>
        );
    }

    return (
        /* Kutucuklar ızgara kutusunu TAM doldurur (h-full): doğal yüksekliğe
           bırakılırsa kutu içerikten kısa kalınca taşıp alttaki satıra biniyor,
           uzun kalınca da altta ölü boşluk bırakıyordu — ikisini de gördük.
           Ek alt padding YOK: tüm boşluklar tek kaynaktan, GRID_MARGIN'den gelir.

           Kutucuk arası da aynı 20px (gap-5) — ızgaradaki kart aralarıyla birebir.

           lt-1080 ve mobile ikisi de max-width → Tailwind bunları azalan sırada
           yazar, dar ekranda mobile kazanır. `tablet:` KULLANILMAZ: o min-width'tir,
           1440'ta da tetiklenirdi. */
        <div className="h-full grid grid-cols-5 gap-5 lt-1080:grid-cols-3 mobile:grid-cols-2 mobile:h-auto">
            <Tile
                label={t('Dashboard:Summary:DueThisPeriod', 'Bu dönem teslim')}
                value={data.dueThisPeriod}
                pill={t('Dashboard:Summary:DueThisWeek', '{0} bu hafta', data.dueThisWeek)}
                icon={<CalendarIcon />}
                iconTone="brand"
                spark={data.dueTrend}
            />
            <Tile
                label={t('Dashboard:Summary:Overdue', 'Gecikmiş')}
                value={data.overdue}
                tone="negative"
                pill={data.oldestOverdueDays != null
                    ? t('Dashboard:Summary:OldestOverdue', 'en eski {0} g', data.oldestOverdueDays)
                    : null}
                pillTone="negative"
                icon={<AlertIcon />}
                iconTone="negative"
                caption={t('Dashboard:Summary:OverdueProjects', '{0} projede', data.overdueProjectCount)}
            />
            <Tile
                label={t('Dashboard:Summary:Blocked', 'Tıkanan iş')}
                value={data.blocked}
                tone="warning"
                pill={t('Dashboard:Summary:BlockedAvg', 'ort. {0} g', data.blockedAvgIdleDays)}
                pillTone="warning"
                icon={<BlockIcon />}
                iconTone="warning"
                caption={t('Dashboard:Summary:BlockedReasons', 'onay · bilgi · bağımlılık')}
            />
            <Tile
                label={t('Dashboard:Summary:PendingApprovals', 'Bende onay')}
                value={data.pendingApprovals}
                locked={data.pendingApprovals == null}
                lockedPermission="Platform.Invoices"
                pill={data.pendingApprovalAmount != null
                    ? formatMoneyCompact(data.pendingApprovalAmount, data.currency)
                    : null}
                icon={<CheckIcon />}
                iconTone="brand"
                caption={data.pendingApprovalAvgAgeHours != null
                    ? t('Dashboard:Summary:AvgWait', 'ortalama bekleme {0} sa', data.pendingApprovalAvgAgeHours)
                    : null}
            />
            <BudgetTile data={data} />
        </div>
    );
}

function Tile({ label, value, pill, pillTone = 'neutral', caption, tone = 'neutral', icon, iconTone = 'brand', spark, locked, lockedPermission }) {
    return (
        <div
            className={cn(
                'rounded-card shadow-card bg-surface-base border border-default',
                'flex flex-col gap-[7px] overflow-hidden',
                /* Üst ve yan padding TÜM kutucuklarda aynı; yalnız alt padding
                   grafikli kutucukta sıfırlanır ki sparkline kenara yapışsın.
                   Farklı üst padding vermek şeritteki başlıkları kaydırıyordu. */
                'pt-4 px-4',
                spark ? 'pb-0' : 'pb-4',
            )}
        >
            <div className="flex items-center justify-between gap-2">
                <span className="text-[12.5px] font-medium text-text-secondary truncate">{label}</span>
                <span className={cn(
                    'inline-flex items-center justify-center w-6 h-6 rounded-lg flex-none',
                    iconTone === 'negative' ? 'bg-negative-50 text-negative-700'
                        : iconTone === 'warning' ? 'bg-warning-50 text-warning-700'
                        : 'bg-accent-soft text-accent-600',
                )}>
                    {icon}
                </span>
            </div>

            {locked ? (
                <>
                    <span className="font-mono text-[28px] font-semibold leading-none tracking-[-0.03em] text-text-tertiary">— —</span>
                    <span className="text-[11.5px] text-text-tertiary">{t('Dashboard:Stat:Locked', 'yetki gerekli')}</span>
                    <span className="font-mono text-[9px] text-text-tertiary">{lockedPermission}</span>
                </>
            ) : (
                <>
                    <div className="flex items-baseline gap-2 flex-wrap">
                        <span className={cn(
                            'font-mono text-[28px] font-semibold leading-none tracking-[-0.03em] tabular-nums',
                            tone === 'negative' ? 'text-negative-500'
                                : tone === 'warning' ? 'text-warning-600'
                                : 'text-text-primary',
                        )}>
                            {value}
                        </span>
                        {pill && (
                            <span className={cn(
                                'font-mono text-[11px] font-semibold px-[7px] py-0.5 rounded-full tabular-nums',
                                pillTone === 'negative' ? 'bg-negative-50 text-negative-700'
                                    : pillTone === 'warning' ? 'bg-warning-50 text-warning-700'
                                    : 'bg-surface-sunken text-text-secondary',
                            )}>
                                {pill}
                            </span>
                        )}
                    </div>
                    {caption && <span className="text-[11.5px] text-text-tertiary truncate">{caption}</span>}
                </>
            )}

            {/* Taşan sparkline: kartın yatay padding'ini iptal edip alt kenara yapışır.
                mt-auto ŞART — kutucuk içerikten uzun olduğunda grafik ortada asılı
                kalmasın, her zaman alt kenarı kucaklasın. */}
            {spark && spark.length > 1 && (
                <div className="h-9 mt-auto -mx-4">
                    <AreaSpark values={spark} ariaLabel={t('Dashboard:Summary:DueTrend', 'Teslim dağılımı')} />
                </div>
            )}
        </div>
    );
}

/** Bütçe kutucuğu — halka grafikli, ViewBudget yoksa kilitli. */
function BudgetTile({ data }) {
    const locked = data.budgetUsedRatio == null && data.budgetTotal == null;

    return (
        <div className="rounded-card shadow-card bg-surface-base border border-default p-4 flex items-center justify-between gap-2.5">
            <div className="flex flex-col gap-[7px] min-w-0">
                <span className="text-[12.5px] font-medium text-text-secondary truncate">
                    {t('Dashboard:Summary:BudgetUsage', 'Bütçe kullanımı')}
                </span>
                {locked ? (
                    <>
                        <span className="font-mono text-[28px] font-semibold leading-none tracking-[-0.03em] text-text-tertiary">— —</span>
                        <span className="font-mono text-[9px] text-text-tertiary">Platform.Projects.ViewBudget</span>
                    </>
                ) : (
                    <>
                        <span className="font-mono text-[28px] font-semibold leading-none tracking-[-0.03em] text-text-primary tabular-nums">
                            %{Math.round((data.budgetUsedRatio ?? 0) * 100)}
                        </span>
                        <span className="text-[11.5px] text-text-tertiary truncate">
                            {formatMoneyCompact(data.budgetSpent, data.currency)} / {formatMoneyCompact(data.budgetTotal, data.currency)}
                        </span>
                    </>
                )}
            </div>
            {!locked && <Gauge ratio={data.budgetUsedRatio ?? 0} />}
        </div>
    );
}

/* İkonlar — mevcut inline SVG deseni: 24×24 viewBox, stroke 2, currentColor. */
const iconProps = { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' };

const CalendarIcon = () => (
    <svg {...iconProps}><path d="M8 2v3M16 2v3M4 9h16" /><rect x="4" y="5" width="16" height="16" rx="2" /></svg>
);
const AlertIcon = () => (
    <svg {...iconProps}><circle cx="12" cy="12" r="9" /><path d="M12 8v5" /><path d="M12 16.5v.01" /></svg>
);
const BlockIcon = () => (
    <svg {...iconProps}><circle cx="12" cy="12" r="9" /><path d="M5.6 5.6l12.8 12.8" /></svg>
);
const CheckIcon = () => (
    <svg {...iconProps}><path d="M20 6L9 17l-5-5" /></svg>
);

export { StatStripCard };
