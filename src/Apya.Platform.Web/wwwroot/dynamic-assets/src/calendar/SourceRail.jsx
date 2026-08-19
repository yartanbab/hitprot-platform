import React from 'react';
import { cn } from '../lib/utils';
import { SOURCES, SOURCE_ORDER } from './lib/model';

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

export function SourceRail({
    sources, counts, enabled, onToggle, compact = false,
    externalAccounts = [], externalLoading = false, onOpenSync,
}) {
    const available = (sources ?? []).filter((s) => s.isAvailable);
    if (available.length === 0) return null;

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

            {available.map((row) => {
                const meta = SOURCES[row.source];
                if (!meta) return null;
                const isOn = enabled.has(row.source);
                const count = counts[row.source] ?? 0;

                return (
                    <button
                        key={row.source}
                        type="button"
                        role="switch"
                        aria-checked={isOn}
                        title={compact ? `${meta.label} — ${count} öğe` : undefined}
                        onClick={() => onToggle(row.source)}
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
                                    {meta.label}
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
                                Ayarlar
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
                </>
            )}
        </nav>
    );
}
