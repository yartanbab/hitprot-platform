import React from 'react';
import { CardShell } from './CardShell';
import { useEffortDistribution } from '../hooks/useDashboard';
import { EmptyState } from '../../components/ui';
import { t } from '../../lib/i18n';

const VISIBLE_ROWS = 5;

/** Saat, tr-TR ve tek ondalıkla: 12.5 → "12,5". */
function formatHours(hours) {
    return Number(hours ?? 0).toLocaleString('tr-TR', { maximumFractionDigits: 1 });
}

/**
 * "Efor dağılımı" — dönemde kişi başına kaydedilen süre.
 *
 * Kaldırılan Özet Raporlar ekranındaki *Personel Bazlı Efor Yükü* halka grafiği ile
 * *PDKS / Personel Özeti* listesinin karşılığı; ikisi de aynı veriyi iki kez
 * çiziyordu, burada tek satırda birleşiyor: kişi · görev sayısı · saat.
 *
 * Barlar RankBar'ın CSS gramerini izler ama onu KULLANMAZ: RankBar satır başına tek
 * değer çizer, buradaki satırda saatin yanında görev sayısı da var.
 *
 * Sunucu listeyi çoktan aza SIRALI döndürür — burada yeniden sıralanmaz.
 */
function EffortDistributionCard({ filter, editMode }) {
    const query = useEffortDistribution(filter);
    const people = query.data ?? [];

    const visible = people.slice(0, VISIBLE_ROWS);
    const rest = people.slice(VISIBLE_ROWS);

    const totalHours = people.reduce((sum, p) => sum + (p.hours ?? 0), 0);
    /* Bar oranı EN ÇOK ÇALIŞANA göre — toplama göre değil. Toplam alınırsa
       kalabalık ekipte bütün barlar okunamayacak kadar kısalıyor. */
    const max = visible.length > 0 ? Math.max(...visible.map((p) => p.hours ?? 0)) : 0;

    return (
        <CardShell
            editMode={editMode}
            title={t('Dashboard:Effort:Title', 'Efor dağılımı')}
            subtitle={people.length > 0
                ? t('Dashboard:Effort:Subtitle', '{0} kişi · toplam {1} sa', people.length, formatHours(totalHours))
                : undefined}
            isLoading={query.isPending}
            isError={query.isError}
            onRetry={query.refetch}
            isEmpty={people.length === 0}
            isFetching={query.isFetching}
            isStale={query.isStale}
            dataUpdatedAt={query.dataUpdatedAt}
            emptyState={
                <EmptyState
                    compact
                    title={t('Dashboard:Effort:EmptyTitle', 'Bu dönemde süre kaydı yok')}
                    description={t('Dashboard:Effort:EmptyDescription', 'Görevlere süre işlendikçe kimin ne kadar çalıştığı burada birikir.')}
                />
            }
            footer={rest.length > 0 && (
                <span className="text-xs text-text-secondary truncate">
                    {t('Dashboard:Effort:More', '+{0} kişi daha · {1} sa', rest.length,
                        formatHours(rest.reduce((sum, p) => sum + (p.hours ?? 0), 0)))}
                </span>
            )}
        >
            <ul className="flex flex-col gap-2.5">
                {visible.map((person) => (
                    <li key={person.userId} className="flex flex-col gap-1">
                        <div className="flex items-baseline justify-between gap-2">
                            <span className="text-[12.5px] font-medium text-text-primary truncate">
                                {person.userName}
                            </span>
                            <span className="font-mono text-[11px] text-text-primary tabular-nums flex-none">
                                {t('Dashboard:Effort:Hours', '{0} sa', formatHours(person.hours))}
                            </span>
                        </div>
                        <span className="block h-[5px] rounded-full bg-surface-sunken overflow-hidden">
                            <span
                                className="block h-full rounded-full"
                                style={{
                                    width: max > 0 ? `${((person.hours ?? 0) / max) * 100}%` : '0%',
                                    background: 'var(--apya-brand-500)',
                                }}
                            />
                        </span>
                        {/* text-tertiary DEĞİL: o token kart zemininde 2.54:1 veriyor
                            (AA altı) ve bu satır okunması gereken bir veri. */}
                        <span className="font-mono text-[10.5px] text-text-secondary">
                            {t('Dashboard:Effort:TaskCount', '{0} görev', person.taskCount)}
                        </span>
                    </li>
                ))}
            </ul>
        </CardShell>
    );
}

export { EffortDistributionCard };
