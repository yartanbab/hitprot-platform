import React, { useMemo, useState } from 'react';
import { CardShell } from './CardShell';
import { TrendDelta } from '../charts';
import { useStatistics } from '../hooks/useDashboard';
import { cn } from '../../lib/utils';
import { t } from '../../lib/i18n';

/**
 * İstatistik bandı — sekmeli kutucuk ızgarası.
 *
 * KİLİT: `locked` bayrağı SUNUCUDAN gelir. Kilitli kutucukta `value` zaten
 * null'dır (sorgu bile atılmamıştır); UI yalnız kesik çerçeve + "yetki gerekli"
 * çizer. Frontend hiçbir değeri kendi kararıyla saklamaz.
 */

const TABS = [
    ['Work',          'Dashboard:StatTab:Work',          'İş & teslim'],
    ['Finance',       'Dashboard:StatTab:Finance',       'Finans'],
    ['Grants',        'Dashboard:StatTab:Grants',        'Hibe'],
    ['Communication', 'Dashboard:StatTab:Communication', 'İletişim'],
    ['System',        'Dashboard:StatTab:System',        'Sistem'],
];

function StatisticsBand({ filter, editMode }) {
    const query = useStatistics(filter);
    const stats = query.data ?? [];
    const [activeTab, setActiveTab] = useState('Work');

    /* Yalnız veri dönen sekmeler gösterilir — boş sekme tıklanabilir olmamalı. */
    const availableTabs = useMemo(
        () => TABS.filter(([group]) => stats.some((s) => s.group === group)),
        [stats],
    );

    const visible = stats.filter((s) => s.group === activeTab);
    const lockedCount = stats.filter((s) => s.locked).length;

    return (
        <CardShell
            editMode={editMode}
            title={t('Dashboard:Statistics:Title', 'İstatistikler')}
            subtitle={stats.length > 0
                ? t('Dashboard:Statistics:Subtitle', '{0} istatistikten {1}\'i yetkinde · {2}\'si kilitli',
                    stats.length, stats.length - lockedCount, lockedCount)
                : undefined}
            actions={
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {availableTabs.map(([group, key, fallback]) => (
                        <button
                            key={group}
                            type="button"
                            onClick={() => setActiveTab(group)}
                            aria-pressed={activeTab === group}
                            className={cn(
                                'inline-flex items-center h-7 px-[11px] rounded-[9px] text-[11.5px] transition-colors duration-fast',
                                'focus-visible:outline-none focus-visible:shadow-focus',
                                activeTab === group
                                    ? 'bg-text-primary text-surface-base font-semibold'
                                    : 'bg-surface-sunken text-text-secondary font-medium hover:text-text-primary',
                            )}
                        >
                            {t(key, fallback)}
                        </button>
                    ))}
                </div>
            }
            isLoading={query.isPending}
            isError={query.isError}
            onRetry={query.refetch}
            isEmpty={stats.length === 0}
            isFetching={query.isFetching}
            isStale={query.isStale}
            dataUpdatedAt={query.dataUpdatedAt}
        >
            {/* Kolon sayısı KARTIN kendi genişliğinden çıkar (auto-fill), viewport'tan
                değil: bu kart yarım genişlikte de kullanılıyor (Finans görünümü) ve
                `grid-cols-6` orada kutucukları 43px'e eziyordu — etiketler okunmuyordu.
                154px = en uzun etiket (126px) + kutucuk dolgusu (28px); tasarımın
                6 / 3 / 1 kırılımlarını 1088 / 534 / 311px kart genişliklerinde
                kendiliğinden veriyor. */}
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(154px, 1fr))' }}>
                {visible.map((stat) => <StatTile key={stat.key} stat={stat} />)}
            </div>
        </CardShell>
    );
}

function StatTile({ stat }) {
    if (stat.locked) {
        return (
            <div className="p-[12px_14px] border border-dashed border-default rounded-xl bg-surface-base flex flex-col gap-1.5">
                <span className="text-[11.5px] text-text-tertiary truncate">{stat.label}</span>
                <span className="font-mono text-xl font-semibold leading-none tracking-[-0.03em] text-text-tertiary">— —</span>
                <span className="text-[10.5px] text-text-tertiary">{t('Dashboard:Stat:Locked', 'yetki gerekli')}</span>
                <span className="font-mono text-[9px] text-text-tertiary truncate">{stat.requiredPermission}</span>
            </div>
        );
    }

    return (
        <div className="p-[12px_14px] border border-subtle rounded-xl bg-surface-base flex flex-col gap-1.5">
            <span className="text-[11.5px] text-text-secondary truncate">{stat.label}</span>
            <span className="font-mono text-xl font-semibold leading-none tracking-[-0.03em] text-text-primary tabular-nums">
                {stat.formatted || '—'}
            </span>
            {stat.deltaFormatted
                ? <TrendDelta trend={stat.trend}>{stat.deltaFormatted}</TrendDelta>
                : <span className="font-mono text-[10.5px] text-text-tertiary">{t('Dashboard:Stat:Flat', '• sabit')}</span>}
            <span className="font-mono text-[9px] text-text-tertiary truncate">{stat.requiredPermission}</span>
        </div>
    );
}

export { StatisticsBand };
