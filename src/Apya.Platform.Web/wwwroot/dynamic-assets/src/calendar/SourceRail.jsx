import React from 'react';
import { cn } from '../lib/utils';
import { RAIL_GROUPS, SOURCES } from './lib/model';

/**
 * Kaynak rayı — hangi veri türü takvimde görünsün.
 *
 * İzin verilmeyen kaynak HİÇ ÇİZİLMEZ (sunucu IsAvailable=false döner):
 * kullanıcıya erişemeyeceği bir veri türü vaat edilmez.
 *
 * `compact` (tablet): satırlar ikona daralır, sayaç ikonun üstünde rozet olur —
 * kolonlardan hiçbiri kaybolmaz, yalnız genişlik 256 → 60px'e iner.
 */
const PROVIDER_LABEL = { 1: 'Google', 2: 'Outlook', 3: 'iCloud' };

/** "Ayşe Yılmaz" → "AY"; tek kelimeyse ilk iki harf. */
function initials(name) {
    const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toLocaleUpperCase('tr');
    return (parts[0][0] + parts[parts.length - 1][0]).toLocaleUpperCase('tr');
}

export function SourceRail({
    sources, counts, enabled, onToggle, compact = false,
    externalAccounts = [], externalLoading = false, onOpenSync,
    teamOpen = false, onToggleTeam, teamContent, teamMembers = [],
    riskCounts,
}) {
    const available = (sources ?? []).filter((s) => s.isAvailable);
    if (available.length === 0) return null;

    /* Ray satırları gruplardan türer: gider+gelir tek satır. Grubun hiçbir
       kaynağına izin yoksa satır hiç çizilmez; bir kısmı izinliyse yalnız
       izinli olanlar sayılır ve anahtarlanır. */
    const izinli = new Set(available.map((s) => s.source));
    const groups = RAIL_GROUPS
        .map(({ key, sources: list }) => {
            const acik = list.filter((s) => izinli.has(s));
            if (acik.length === 0) return null;
            return {
                key,
                sources: acik,
                meta: SOURCES[acik[0]],
                /* Grubun tamamı kapalıysa kapalı sayılır — biri açıksa satır açıktır. */
                isOn: acik.some((s) => enabled.has(s)),
                count: acik.reduce((sum, s) => sum + (counts[s] ?? 0), 0),
            };
        })
        .filter(Boolean);

    return (
        <nav
            aria-label="Takvim kaynakları"
            className={cn(
                'flex flex-col gap-1 rounded-card border border-subtle bg-surface-base p-2',
                compact ? 'w-[60px] items-center' : 'w-full',
            )}
        >
            {!compact && (
                <p className="px-2 pb-1 pt-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary">
                    Kaynaklar
                </p>
            )}

            {groups.map(({ key, sources: groupSources, meta, isOn, count }) => {
                if (!meta) return null;

                return (
                    <button
                        key={key}
                        type="button"
                        role="switch"
                        aria-checked={isOn}
                        title={compact ? `${meta.railLabel ?? meta.label} — ${count} öğe` : undefined}
                        /* Grup tek anahtar: gider ve gelir birlikte açılıp kapanır.
                           Karışık durumda (biri açık, biri kapalı) hepsini körlemesine
                           çevirmek durumu TERS çevirirdi — yalnız hedeften sapanlar
                           anahtarlanır. */
                        onClick={() => {
                            const hedef = !isOn;
                            groupSources.forEach((s) => { if (enabled.has(s) !== hedef) onToggle(s); });
                        }}
                        className={cn(
                            'group flex items-center rounded-md text-left transition-colors duration-fast',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                            compact ? 'relative h-11 w-11 justify-center' : 'gap-2.5 px-2 py-2',
                            isOn ? 'text-text-primary' : 'text-text-tertiary',
                            'hover:bg-surface-hover',
                        )}
                    >
                        <span
                            className={cn(
                                'flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px]',
                                isOn ? 'bg-primary-subtle text-accent' : 'bg-neutral-subtle text-text-tertiary',
                            )}
                            aria-hidden="true"
                        >
                            <i className={cn('fa', meta.icon)} />
                        </span>

                        {compact ? (
                            count > 0 && (
                                <span
                                    className={cn(
                                        'absolute right-0 top-0 min-w-[16px] rounded-full px-1 text-[9.5px] font-bold leading-4',
                                        isOn ? 'bg-accent text-white' : 'bg-neutral-200 text-text-tertiary',
                                    )}
                                >
                                    {count}
                                </span>
                            )
                        ) : (
                            <>
                                <span className={cn('flex-1 truncate text-[12.5px] font-medium', !isOn && 'line-through decoration-1')}>
                                    {meta.railLabel ?? meta.label}
                                </span>
                                <span className="font-mono text-[11px] tabular-nums text-text-tertiary">{count}</span>
                            </>
                        )}
                    </button>
                );
            })}


            {/* Dış takvimler — izinle değil kullanıcının kendi bağlantısıyla gelir,
                bu yüzden kaynak anahtarlarından AYRI bir bölümde durur. Bozuk
                bağlantı burada görünür; takvimin kalanı çalışmaya devam eder. */}
            {!compact && (
                <>
                    <div className="mt-2 flex items-center justify-between border-t border-subtle px-2 pb-1 pt-2">
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary">
                            Dış takvimler
                        </p>
                        {onOpenSync && (
                            <button
                                type="button"
                                onClick={onOpenSync}
                                className="rounded p-1 text-[11px] font-medium text-text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                            >
                                + Ekle
                            </button>
                        )}
                    </div>

                    {externalAccounts.length === 0 && !externalLoading && (
                        <p className="px-2 pb-1 text-[11.5px] text-text-tertiary">
                            Bağlı takvim yok.
                        </p>
                    )}

                    {externalLoading && externalAccounts.length === 0 && (
                        <p className="px-2 py-1 text-[11.5px] text-text-tertiary">
                            <i className="fa fa-circle-notch fa-spin me-1.5" aria-hidden="true" />
                            senkronize ediliyor…
                        </p>
                    )}

                    {externalAccounts.map((account) => (
                        <div
                            key={account.accountId}
                            className={cn(
                                'flex items-start gap-2 rounded-md px-2 py-1.5',
                                account.error && 'bg-negative-50',
                            )}
                        >
                            <span
                                className={cn(
                                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px]',
                                    account.error ? 'bg-negative-100 text-negative-700' : 'bg-neutral-subtle text-text-tertiary',
                                )}
                                aria-hidden="true"
                            >
                                <i className={cn('fa', account.error ? 'fa-triangle-exclamation' : 'fa-calendar-days')} />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-[12px] font-medium text-text-primary">
                                    {PROVIDER_LABEL[account.provider] ?? 'Takvim'}
                                </span>
                                <span className={cn(
                                    'block truncate text-[10.5px]',
                                    account.error ? 'text-negative-700' : 'text-text-tertiary',
                                )}>
                                    {account.error ?? `${account.email} · ${account.eventCount} etkinlik`}
                                </span>
                                {account.error && (
                                    <a href="/Calendars" className="text-[10.5px] font-semibold text-text-link hover:underline">
                                        Yeniden bağla
                                    </a>
                                )}
                            </span>
                        </div>
                    ))}

                {/* Ekip katmanı — "kim ne zaman müsait". Kapalıyken sorgu bile atılmaz. */}
                {!compact && onToggleTeam && (
                    <>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={teamOpen}
                            onClick={onToggleTeam}
                            className={cn(
                                'mt-2 flex items-center gap-2 border-t border-subtle px-2 pb-1 pt-2 text-left',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                            )}
                        >
                            <span className="flex-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary">
                                Ekip katmanı
                            </span>
                            <i
                                className={cn('fa text-[11px]', teamOpen ? 'fa-toggle-on text-accent' : 'fa-toggle-off text-text-tertiary')}
                                aria-hidden="true"
                            />
                        </button>

                        {/* Kimlerin yükü sayılıyor. Katman AÇIKKEN dolar: kapalıyken
                            ekip sorgusu hiç atılmıyor, uydurma isim göstermeyiz. */}
                        {teamMembers.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1 px-2 pb-1">
                                {teamMembers.slice(0, 3).map((m) => (
                                    <span
                                        key={m.userId}
                                        title={m.name}
                                        className="flex items-center gap-1 rounded-full bg-neutral-subtle py-0.5 pe-2 ps-0.5 text-[10.5px] text-text-secondary"
                                    >
                                        <span
                                            className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[8.5px] font-bold text-[color:var(--apya-avatar-fg)]"
                                            aria-hidden="true"
                                        >
                                            {initials(m.name)}
                                        </span>
                                        <span className="max-w-[86px] truncate">{m.name}</span>
                                    </span>
                                ))}
                                {teamMembers.length > 3 && (
                                    <span className="text-[10.5px] font-medium text-text-tertiary">
                                        +{teamMembers.length - 3}
                                    </span>
                                )}
                            </div>
                        )}

                        {teamContent}
                    </>
                )}
                    {/* Risk özeti — takvime bakmadan "kaç şey yanıyor" sorusunun
                        cevabı. Sıfır olan satır çizilmez; boş sayaç gürültüdür. */}
                    {riskCounts && (riskCounts.overdue > 0 || riskCounts.dueToday > 0 || riskCounts.syncError > 0) && (
                        <>
                            <p className="mt-2 border-t border-subtle px-2 pb-1 pt-2 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary">
                                Risk
                            </p>
                            {[
                                { key: 'overdue', label: 'Gecikmiş', value: riskCounts.overdue, dot: 'bg-negative' },
                                { key: 'dueToday', label: 'Bugün son gün', value: riskCounts.dueToday, dot: 'bg-warning' },
                                { key: 'syncError', label: 'Senkron hatası', value: riskCounts.syncError, dot: 'bg-negative-700' },
                            ].filter((r) => r.value > 0).map((r) => (
                                <div key={r.key} className="flex items-center gap-2 px-2 py-1">
                                    <span className={cn('h-[7px] w-[7px] shrink-0 rounded-full', r.dot)} aria-hidden="true" />
                                    <span className="flex-1 text-[11.5px] text-text-secondary">{r.label}</span>
                                    <span className="font-mono text-[11px] tabular-nums text-text-primary">{r.value}</span>
                                </div>
                            ))}
                        </>
                    )}

                    {onOpenSync && (
                        <button
                            type="button"
                            onClick={onOpenSync}
                            className="mt-2 flex items-center gap-2 rounded-md border border-subtle px-2.5 py-2 text-left text-[12px] font-medium text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                        >
                            <i className="fa fa-gear text-[12px] text-text-tertiary" aria-hidden="true" />
                            <span className="flex-1">Senkron ayarları</span>
                            <i className="fa fa-chevron-right text-[10px] text-text-tertiary" aria-hidden="true" />
                        </button>
                    )}
                </>
            )}
        </nav>
    );
}
