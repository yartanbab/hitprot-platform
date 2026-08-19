import React, { useEffect, useState } from 'react';
import { Button, EmptyState, Sheet, SheetContent, Skeleton } from '../components/ui';
import { cn } from '../lib/utils';
import { INTERNAL_SOURCE_ORDER, SOURCES, fmt } from './lib/model';
import { useSyncSettings, useUpdateSyncRules } from './hooks/useSyncSettings';

const PROVIDER = {
    1: { label: 'Google Calendar', icon: 'fa-google', brand: 'bg-[#ea4335]' },
    2: { label: 'Microsoft Outlook', icon: 'fa-windows', brand: 'bg-[#0078d4]' },
    3: { label: 'iCloud', icon: 'fa-apple', brand: 'bg-neutral-700' },
};

const CONFLICT = {
    0: { title: 'Son değişen kazanır', desc: 'İki taraf da düzenlenirse en son yapılan değişiklik uygulanır; ekranda geri alma şeridi çıkar.' },
    1: { title: 'APYA her zaman kazanır', desc: 'Dış takvim salt-okunur ayna olur; dışarıdaki düzenleme geri alınır.' },
};

const LOG_KIND = {
    0: { icon: 'fa-arrow-up-from-bracket', cls: 'text-text-tertiary' },
    1: { icon: 'fa-code-merge', cls: 'text-warning-700' },
    2: { icon: 'fa-triangle-exclamation', cls: 'text-negative-700' },
};

function relativeTime(iso) {
    if (!iso) return 'hiç';
    const diff = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (diff < 1) return 'az önce';
    if (diff < 60) return `${diff} dk önce`;
    if (diff < 1440) return `${Math.round(diff / 60)} sa önce`;
    return fmt.dayShort(new Date(iso));
}

/** Bir hesabın kartı: bağlantı durumu + kuralları. */
function AccountCard({ account, onSave, saving }) {
    const meta = PROVIDER[account.provider] ?? { label: 'Takvim', icon: 'fa-calendar', brand: 'bg-neutral-700' };
    const [sources, setSources] = useState(() => new Set(account.syncSources ?? []));
    const [conflictRule, setConflictRule] = useState(account.conflictRule ?? 0);
    const [enabled, setEnabled] = useState(account.isSyncEnabled);

    /* Sunucudan yeni değer gelirse (kaydetme sonrası) yerel taslak onu izler. */
    useEffect(() => {
        setSources(new Set(account.syncSources ?? []));
        setConflictRule(account.conflictRule ?? 0);
        setEnabled(account.isSyncEnabled);
    }, [account]);

    const dirty = enabled !== account.isSyncEnabled
        || conflictRule !== account.conflictRule
        || sources.size !== (account.syncSources ?? []).length
        || [...sources].some((s) => !(account.syncSources ?? []).includes(s));

    const toggle = (source) => setSources((prev) => {
        const next = new Set(prev);
        if (next.has(source)) next.delete(source); else next.add(source);
        return next;
    });

    return (
        <section className="rounded-card border border-subtle bg-surface-base">
            <header className="flex items-center gap-3 border-b border-subtle px-3 py-2.5">
                <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white', meta.brand)} aria-hidden="true">
                    <i className={cn('fab', meta.icon)} />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-text-primary">{meta.label}</span>
                    <span className="block truncate text-[11.5px] text-text-tertiary">
                        {account.externalEmail} · son senkron {relativeTime(account.lastSyncTime)}
                    </span>
                </span>
                <label className="flex shrink-0 items-center gap-1.5 text-[11.5px] text-text-secondary">
                    <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        className="h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
                    />
                    Açık
                </label>
            </header>

            <div className="px-3 py-2.5">
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                    Bu hesaba ne gitsin?
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {INTERNAL_SOURCE_ORDER.map((source) => {
                        const on = sources.has(source);
                        return (
                            <button
                                key={source}
                                type="button"
                                role="switch"
                                aria-checked={on}
                                onClick={() => toggle(source)}
                                className={cn(
                                    'flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11.5px] font-medium transition-colors duration-fast',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                                    on
                                        ? 'border-accent bg-primary-subtle text-accent'
                                        : 'border-subtle bg-surface-base text-text-tertiary hover:bg-surface-hover',
                                )}
                            >
                                <i className={cn('fa text-[10px]', SOURCES[source]?.icon)} aria-hidden="true" />
                                {SOURCES[source]?.label}
                            </button>
                        );
                    })}
                </div>
                {sources.size === 0 && (
                    <p className="mt-1.5 text-[11px] text-text-tertiary">
                        Hiçbiri seçili değil — yalnız görevler gönderilir.
                    </p>
                )}

                <p className="mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                    Çakışma kuralı
                </p>
                <div className="flex flex-col gap-1.5">
                    {Object.entries(CONFLICT).map(([value, rule]) => {
                        const numeric = Number(value);
                        const on = conflictRule === numeric;
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setConflictRule(numeric)}
                                className={cn(
                                    'rounded-md border px-2.5 py-2 text-left transition-colors duration-fast',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                                    on ? 'border-accent bg-primary-subtle' : 'border-subtle hover:bg-surface-hover',
                                )}
                            >
                                <span className={cn('block text-[12px] font-semibold', on ? 'text-accent' : 'text-text-primary')}>
                                    {rule.title}
                                </span>
                                <span className="mt-0.5 block text-[11px] leading-snug text-text-tertiary">{rule.desc}</span>
                            </button>
                        );
                    })}
                </div>

                {dirty && (
                    <div className="mt-3 flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="primary"
                            disabled={saving}
                            onClick={() => onSave({
                                accountId: account.id,
                                isSyncEnabled: enabled,
                                syncSources: [...sources],
                                syncProjectIds: account.syncProjectIds ?? [],
                                conflictRule,
                            })}
                        >
                            {saving ? 'Kaydediliyor…' : 'Kuralları kaydet'}
                        </Button>
                        <span className="text-[11px] text-text-tertiary">Kaydedilmemiş değişiklik var</span>
                    </div>
                )}
            </div>
        </section>
    );
}

/**
 * Senkron drawer'ı — entegrasyon ayarları sayfanın ALTINDAN buraya taşındı.
 *
 * Neden: kartlar sayfanın altındayken kullanıcı takvimi kaydırmadan senkron
 * durumunu göremiyordu. Drawer kaynak rayındaki "Senkron" düğmesinden açılır;
 * takvim bağlamı ekranda kalır.
 */
export function SyncDrawer({ open, onClose }) {
    const { data, isPending } = useSyncSettings(open);
    const update = useUpdateSyncRules();

    return (
        <Sheet open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
            <SheetContent side="right" title="Takvim senkronizasyonu" className="w-full max-w-[440px] p-0">
                <header className="flex items-start gap-2 border-b border-subtle px-4 py-3">
                    <div className="min-w-0 flex-1">
                        <h3 className="text-[15px] font-semibold text-text-primary">Takvim senkronizasyonu</h3>
                        <p className="mt-0.5 text-[11.5px] text-text-tertiary">
                            APYA öğeleri dış takvimlerinize etkinlik olarak yazılır.
                        </p>
                    </div>
                    <button
                        type="button" onClick={onClose} aria-label="Kapat"
                        className="rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    >
                        <i className="fa fa-xmark" aria-hidden="true" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-4 py-3">
                    {isPending ? (
                        <div className="flex flex-col gap-2" aria-hidden="true">
                            <Skeleton height={92} />
                            <Skeleton height={92} />
                        </div>
                    ) : (data?.accounts ?? []).length === 0 ? (
                        <EmptyState
                            icon={<i className="fa fa-calendar-plus" />}
                            title="Bağlı takvim yok"
                            description="Google veya Outlook hesabı bağlayınca size atanan tarihli öğeler oraya etkinlik olarak yazılır."
                            action={
                                <Button size="sm" variant="outline" onClick={() => { window.location.href = '/Calendars/SimulateAuth?provider=1'; }}>
                                    Hesap bağla
                                </Button>
                            }
                        />
                    ) : (
                        <div className="flex flex-col gap-3">
                            {data.accounts.map((account) => (
                                <AccountCard
                                    key={account.id}
                                    account={account}
                                    saving={update.isPending}
                                    onSave={(input) => update.mutate(input)}
                                />
                            ))}

                            <section className="rounded-card border border-subtle bg-surface-base">
                                <header className="border-b border-subtle px-3 py-2">
                                    <h4 className="text-[12px] font-semibold text-text-primary">Senkron günlüğü</h4>
                                </header>
                                <div className="px-3 py-2">
                                    {(data.log ?? []).length === 0 ? (
                                        <p className="py-2 text-[11.5px] text-text-tertiary">
                                            Henüz senkron kaydı yok.
                                        </p>
                                    ) : (
                                        data.log.map((entry) => {
                                            const kind = LOG_KIND[entry.kind] ?? LOG_KIND[0];
                                            return (
                                                <div key={entry.id} className="flex items-start gap-2 border-b border-subtle py-2 last:border-b-0">
                                                    <i className={cn('fa mt-0.5 shrink-0 text-[11px]', kind.icon, kind.cls)} aria-hidden="true" />
                                                    <span className="min-w-0 flex-1 text-[11.5px] leading-snug text-text-secondary">
                                                        {entry.message}
                                                    </span>
                                                    <span className="shrink-0 text-[10.5px] text-text-tertiary">
                                                        {relativeTime(entry.occurredAt)}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
