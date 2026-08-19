import React, { useEffect, useState } from 'react';
import { Button, EmptyState, Sheet, SheetContent, Skeleton } from '../components/ui';
import { cn } from '../lib/utils';
import { INTERNAL_SOURCE_ORDER, SOURCES, fmt } from './lib/model';
import { useSyncSettings, useUpdateSyncRules } from './hooks/useSyncSettings';
import {
    useAddIcalSubscription, useDeleteIcalSubscription, useIcalFeedLink,
    useIcalSubscriptions, useProbeIcal, useRegenerateIcalFeed,
} from './hooks/useIcal';

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

const REFRESH_OPTIONS = [
    { value: 15, label: '15 dk' },
    { value: 60, label: '1 saat' },
    { value: 360, label: '6 saat' },
    { value: 1440, label: 'Günlük' },
];

/**
 * iCal: dışa abonelik bağlantısı + içeri .ics abonelikleri.
 *
 * Tek yönlü olduğu EKRANDA yazar — kullanıcı çift yönlü senkron beklerken
 * sessizce tek yönlü bir bağlantı kurmuş olmasın.
 */
function IcalSection({ open }) {
    const feed = useIcalFeedLink(open);
    const regenerate = useRegenerateIcalFeed();
    const subs = useIcalSubscriptions(open);
    const add = useAddIcalSubscription();
    const remove = useDeleteIcalSubscription();
    const probe = useProbeIcal();

    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [refresh, setRefresh] = useState(60);
    const [copied, setCopied] = useState(false);

    const feedUrl = feed.data?.path ? `${window.location.origin}${feed.data.path}` : '';

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(feedUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* pano kapalıysa kullanıcı elle seçer */ }
    };

    return (
        <section className="rounded-card border border-subtle bg-surface-base">
            <header className="border-b border-subtle px-3 py-2">
                <h4 className="text-[12px] font-semibold text-text-primary">iCal</h4>
            </header>

            <div className="border-b border-subtle px-3 py-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                    APYA takviminize abone olun
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                    <input
                        readOnly
                        value={feedUrl}
                        aria-label="iCal abonelik bağlantısı"
                        className="min-w-0 flex-1 truncate rounded-md border border-default bg-surface-sunken px-2 py-1 font-mono text-[11px] text-text-secondary"
                    />
                    <Button size="sm" variant="outline" onClick={copyLink} disabled={!feedUrl}>
                        {copied ? 'Kopyalandı' : 'Kopyala'}
                    </Button>
                </div>
                <p className="mt-1.5 text-[11px] leading-snug text-text-tertiary">
                    Salt-okunur bağlantı; size atanan tarihli görevleri taşır. Bağlantıyı bilen
                    herkes bu takvimi okuyabilir —
                    <button
                        type="button"
                        onClick={() => regenerate.mutate()}
                        className="ms-1 font-semibold text-text-link hover:underline"
                    >
                        yeniden üret
                    </button>
                    {' '}dediğinizde eski bağlantı anında geçersizleşir.
                </p>
            </div>

            <div className="px-3 py-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                    Dışarıdan takvim ekle
                </p>

                <div className="mt-1.5 flex flex-col gap-1.5">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => { setUrl(e.target.value); probe.reset(); }}
                        placeholder="https://…/basic.ics"
                        aria-label="Takvim bağlantısı"
                        className="rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    />

                    {probe.data?.isValid && (
                        <p className="text-[11px] text-positive-700">
                            <i className="fa fa-circle-check me-1" aria-hidden="true" />
                            Bağlantı doğrulandı · {probe.data.eventCount} etkinlik bulundu
                        </p>
                    )}
                    {probe.data && !probe.data.isValid && (
                        <p className="text-[11px] text-negative-700">
                            <i className="fa fa-triangle-exclamation me-1" aria-hidden="true" />
                            {probe.data.error}
                        </p>
                    )}

                    <div className="flex items-center gap-1.5">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={probe.data?.suggestedName || 'Görünen ad'}
                            aria-label="Görünen ad"
                            className="min-w-0 flex-1 rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                        />
                        <select
                            value={refresh}
                            onChange={(e) => setRefresh(Number(e.target.value))}
                            aria-label="Yenileme sıklığı"
                            className="rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary"
                        >
                            {REFRESH_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            size="sm" variant="outline" disabled={!url || probe.isPending}
                            onClick={() => probe.mutate(url)}
                        >
                            {probe.isPending ? 'Deneniyor…' : 'Bağlantıyı dene'}
                        </Button>
                        <Button
                            size="sm" variant="primary"
                            disabled={!url || add.isPending}
                            onClick={() => add.mutate(
                                { url, displayName: name, color: 'accent', refreshMinutes: refresh },
                                { onSuccess: () => { setUrl(''); setName(''); probe.reset(); } },
                            )}
                        >
                            {add.isPending ? 'Ekleniyor…' : 'Takvimi ekle'}
                        </Button>
                    </div>

                    {add.isError && (
                        <p className="text-[11px] text-negative-700">
                            {add.error?.message || 'Takvim eklenemedi.'}
                        </p>
                    )}

                    <p className="text-[11px] leading-snug text-text-tertiary">
                        iCal abonelikleri <strong className="font-semibold">tek yönlüdür</strong>:
                        etkinlikler APYA'da salt-okunur görünür, APYA öğeleri bu takvime yazılmaz.
                        Çift yönlü senkron için Google veya Outlook hesabı bağlayın.
                    </p>
                </div>

                {(subs.data ?? []).length > 0 && (
                    <div className="mt-3 border-t border-subtle pt-2">
                        {subs.data.map((sub) => (
                            <div key={sub.id} className="flex items-start gap-2 border-b border-subtle py-2 last:border-b-0">
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-[12px] font-medium text-text-primary">
                                        {sub.displayName}
                                    </span>
                                    <span className={cn(
                                        'block truncate text-[10.5px]',
                                        sub.lastError ? 'text-negative-700' : 'text-text-tertiary',
                                    )}>
                                        {sub.lastError ?? `${sub.lastEventCount} etkinlik · ${relativeTime(sub.lastFetchedAt)} çekildi`}
                                    </span>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => remove.mutate(sub.id)}
                                    className="shrink-0 rounded p-1 text-[11px] text-text-tertiary hover:text-negative-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                                    aria-label={`${sub.displayName} aboneliğini kaldır`}
                                >
                                    Kaldır
                                </button>
                            </div>
                        ))}
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
                    ) : (
                        <div className="flex flex-col gap-3">
                            {(data?.accounts ?? []).length === 0 ? (
                                <div className="rounded-card border border-subtle bg-surface-base p-4">
                                    <EmptyState
                                        compact
                                        icon={<i className="fa fa-calendar-plus" />}
                                        title="Bağlı hesap yok"
                                        description="Google veya Outlook bağlayınca size atanan tarihli öğeler oraya etkinlik olarak yazılır."
                                        action={
                                            <Button size="sm" variant="outline" onClick={() => { window.location.href = '/Calendars/SimulateAuth?provider=1'; }}>
                                                Hesap bağla
                                            </Button>
                                        }
                                    />
                                </div>
                            ) : (
                                data.accounts.map((account) => (
                                    <AccountCard
                                        key={account.id}
                                        account={account}
                                        saving={update.isPending}
                                        onSave={(input) => update.mutate(input)}
                                    />
                                ))
                            )}

                            {/* iCal hesap GEREKTİRMEZ: OAuth bağlantısı olmayan kullanıcı da
                                .ics abonesi olabilmeli ve kendi bağlantısını alabilmeli. */}
                            <IcalSection open={open} />

                            <section className="rounded-card border border-subtle bg-surface-base">
                                <header className="border-b border-subtle px-3 py-2">
                                    <h4 className="text-[12px] font-semibold text-text-primary">Senkron günlüğü</h4>
                                </header>
                                <div className="px-3 py-2">
                                    {(data?.log ?? []).length === 0 ? (
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
