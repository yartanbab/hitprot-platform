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
function StatStripCard({ filter, template, compact }) {
    /* isLoading DEĞİL isPending: kalıcı önbellek geri yüklenirken sorgu
       `fetchStatus:'idle'` döner → isLoading FALSE olur ama `data` hâlâ
       undefined'dır ve aşağıdaki `!data` dalı devreye girip şeridi bir kare
       "Özet yüklenemedi." hatasıyla çizerdi. */
    const { data, isPending, isError, refetch } = useSummary(filter);

    /* Kolon şablonu DashboardRoot'tan gelir: şeridin ÖLÇÜLEN genişliğinden
       türetilir (bkz stripLayoutFor). Buradaki `lt-1080:`/`mobile:` gibi viewport
       medya sorguları KULLANILMAZ — ızgara kaba, kart içi viewport'a bakınca
       ikisi çakışıyordu (kenar çubuğu 327px'lik sabit farkı yaratıyor). */
    const gridStyle = { gridTemplateColumns: template ?? 'repeat(4, minmax(0, 2fr)) minmax(0, 3fr)' };

    if (isPending) {
        return (
            <div className="h-full grid gap-[12px]" style={gridStyle}>
                {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="rounded-card shadow-card bg-surface-base border border-default p-[16px]">
                        <Skeleton height={14} className="w-2/3 mb-[8px]" />
                        <Skeleton height={28} className="w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="rounded-card shadow-card bg-surface-base border border-default p-[16px] flex items-center justify-between gap-[12px]">
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
           Kutucuk arası da aynı 12px — ızgaradaki kart aralarıyla birebir.

           Kutu yüksekliği de kolon sayısını takip eder (stripLayoutFor → h), yani
           çok satırlı dizilimde kutu büyür; sabit h=2 bırakılınca satırlar 148px'lik
           kutuya sıkışıp `overflow-hidden` altyazıları kesiyordu. */
        <div className="h-full grid gap-[12px]" style={gridStyle}>
            <Tile
                compact={compact}
                label={t('Dashboard:Summary:DueThisPeriod', 'Bu dönem teslim')}
                value={data.dueThisPeriod}
                pill={t('Dashboard:Summary:DueThisWeek', '{0} bu hafta', data.dueThisWeek)}
                icon={<CalendarIcon />}
                iconTone="brand"
                spark={data.dueTrend}
            />
            <Tile
                compact={compact}
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
                compact={compact}
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
                compact={compact}
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
            <BudgetTile data={data} compact={compact} />
        </div>
    );
}

function Tile({ label, value, pill, pillTone = 'neutral', caption, tone = 'neutral', icon, iconTone = 'brand', spark, locked, lockedPermission, compact }) {
    /* Kompakt kip (dar mobil, bkz stripLayoutFor): padding/punto küçülür,
       sparkline gizlenir — kutucuk ~97px'lik satıra sığmalı. */
    const showSpark = !compact && spark && spark.length > 1;
    return (
        <div
            className={cn(
                'rounded-card shadow-card bg-surface-base border border-default',
                'flex flex-col overflow-hidden',
                compact ? 'gap-[5px] pt-[12px] px-[12px] pb-[12px]' : cn(
                    'gap-[7px]',
                    /* Üst ve yan padding TÜM kutucuklarda aynı; yalnız alt padding
                       grafikli kutucukta sıfırlanır ki sparkline kenara yapışsın.
                       Farklı üst padding vermek şeritteki başlıkları kaydırıyordu. */
                    'pt-[16px] px-[16px]',
                    spark ? 'pb-[0px]' : 'pb-[16px]',
                ),
            )}
        >
            <div className="flex items-center justify-between gap-[8px]">
                <span className="text-[12.5px] font-medium text-text-secondary truncate">{label}</span>
                <span className={cn(
                    'inline-flex items-center justify-center rounded-lg flex-none',
                    compact ? 'w-5 h-5' : 'w-6 h-6',
                    iconTone === 'negative' ? 'bg-negative-50 text-negative-700'
                        : iconTone === 'warning' ? 'bg-warning-50 text-warning-700'
                        : 'bg-accent-soft text-accent-600',
                )}>
                    {icon}
                </span>
            </div>

            {locked ? (
                <>
                    <span className={cn('font-mono font-semibold tracking-[-0.03em] text-text-tertiary', compact ? 'text-[22px]' : 'text-[28px]', 'leading-none')}>— —</span>
                    <span className="text-[11.5px] text-text-tertiary">{t('Dashboard:Stat:Locked', 'yetki gerekli')}</span>
                    <span className="font-mono text-[9px] text-text-tertiary">{lockedPermission}</span>
                </>
            ) : (
                <>
                    <div className="flex items-baseline gap-[8px] flex-wrap">
                        <span className={cn(
                            'font-mono font-semibold tracking-[-0.03em] tabular-nums',
                            compact ? 'text-[22px]' : 'text-[28px]',
                            /* leading-none SIRASI ÖNEMLİ: tailwind-merge, text-[..] font-size
                               sınıfını gördüğünde ÖNCESİNDEKİ leading-* sınıfını atıyor. */
                            'leading-none',
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
            {showSpark && (
                <div className="h-9 mt-auto -mx-[16px]">
                    <AreaSpark values={spark} ariaLabel={t('Dashboard:Summary:DueTrend', 'Teslim dağılımı')} />
                </div>
            )}
        </div>
    );
}

/** Bütçe kutucuğu — halka grafikli, ViewBudget yoksa kilitli. */
function BudgetTile({ data, compact }) {
    const locked = data.budgetUsedRatio == null && data.budgetTotal == null;

    return (
        /* Kompakt kipte tam satıra yayılır: 145px'lik yarım kolonda Gauge (58px)
           + altyazı sığmıyor, tek başına geniş satırda rahat ediyor. */
        <div
            className={cn(
                'rounded-card shadow-card bg-surface-base border border-default flex items-center justify-between',
                compact ? 'p-[12px] gap-[8px]' : 'p-[16px] gap-[10px]',
            )}
            style={compact ? { gridColumn: '1 / -1' } : undefined}
        >
            <div className={cn('flex flex-col min-w-0', compact ? 'gap-[5px]' : 'gap-[7px]')}>
                <span className="text-[12.5px] font-medium text-text-secondary truncate">
                    {t('Dashboard:Summary:BudgetUsage', 'Bütçe kullanımı')}
                </span>
                {locked ? (
                    <>
                        <span className={cn('font-mono font-semibold tracking-[-0.03em] text-text-tertiary', compact ? 'text-[22px]' : 'text-[28px]', 'leading-none')}>— —</span>
                        <span className="font-mono text-[9px] text-text-tertiary">Platform.Projects.ViewBudget</span>
                    </>
                ) : (
                    <>
                        <span className={cn('font-mono font-semibold tracking-[-0.03em] text-text-primary tabular-nums', compact ? 'text-[22px]' : 'text-[28px]', 'leading-none')}>
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
