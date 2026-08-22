import React, { useState } from 'react';
import { Button, Dialog, DialogContent } from '../components/ui';
import { cn } from '../lib/utils';
import { INTERNAL_SOURCE_ORDER, SOURCES } from './lib/model';
import { useUpdatePreferences } from './hooks/useCalendarPreferences';

const CAPACITY_OPTIONS = [
    { value: 4, label: '4 sa' },
    { value: 6, label: '6 sa' },
    { value: 8, label: '8 sa' },
    { value: 0, label: 'Kapalı' },
];

const STEPS = ['Kaynaklar', 'Dış takvim', 'Kurallar'];

/**
 * İlk kurulum — üç adım: kaynak seçimi + kapasite, dış takvim (atlanabilir),
 * çakışma kuralı.
 *
 * Tasarımın kuralı: HER ADIM ATLANABİLİR ve her ayar sonradan senkron
 * drawer'ından değiştirilebilir. Bu yüzden "Şimdilik atla" da kurulumu
 * TAMAMLANMIŞ sayar — kullanıcı her açılışta aynı ekranla karşılaşmasın.
 */
export function SetupWizard({ open, counts, onDone }) {
    const [step, setStep] = useState(0);
    const [sources, setSources] = useState(() => new Set(INTERNAL_SOURCE_ORDER));
    const [capacity, setCapacity] = useState(8);
    const update = useUpdatePreferences();

    const finish = () => {
        update.mutate(
            {
                dailyCapacityHours: capacity > 0 ? capacity : 0,
                sources: [...sources],
                setupCompleted: true,
            },
            /* onSettled DEĞİL: hata durumunda da kapanırsa ayarlar sessizce
               kaybolur ve kullanıcı kurulumu yaptığını sanır. */
            { onSuccess: onDone },
        );
    };

    const toggle = (source) => setSources((prev) => {
        const next = new Set(prev);
        if (next.has(source)) next.delete(source); else next.add(source);
        return next;
    });

    return (
        <Dialog open={open} onOpenChange={(next) => { if (!next) onDone(); }}>
            {/* h-auto + max-h: panel içeriğe göre boylanır, viewport'u AŞMAZ.
                Paylaşılan DialogContent sabit 88dvh yükseklik ve tablet:min-h-520px
                dayatıyordu; kısa masaüstü viewport'unda (ör. Windows ölçekleme) bu
                520px, ekranı aşınca ortalanmış overflow-hidden panel footer'ı
                kırpıyordu. Orta bölüm min-h-0+overflow-y-auto ile scroll eder,
                header/footer shrink-0 ile her zaman görünür kalır. */}
            <DialogContent className="w-full max-w-[520px] p-0 h-auto max-h-[88dvh] tablet:min-h-0">
                <header className="shrink-0 border-b border-subtle px-5 py-4">
                    <h2 className="text-[18px] font-semibold tracking-tight text-text-primary">
                        Takviminizi kurun
                    </h2>
                    <p className="mt-1 text-[12px] leading-snug text-text-tertiary">
                        Hangi kaynakları göreceğinizi seçin, dilerseniz dış takvim bağlayın.
                        Her ayarı sonradan değiştirebilirsiniz.
                    </p>

                    <ol className="mt-3 flex items-center gap-2">
                        {STEPS.map((label, index) => (
                            <li key={label} className="flex items-center gap-1.5">
                                <span className={cn(
                                    'flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] font-bold',
                                    index === step ? 'bg-accent text-white'
                                        : index < step ? 'bg-primary-subtle text-accent'
                                            : 'bg-neutral-subtle text-text-tertiary',
                                )}>
                                    {index + 1}
                                </span>
                                <span className={cn(
                                    'text-[11.5px]',
                                    index === step ? 'font-semibold text-text-primary' : 'text-text-tertiary',
                                )}>
                                    {label}
                                </span>
                                {index < STEPS.length - 1 && <span className="ms-1 text-text-tertiary">·</span>}
                            </li>
                        ))}
                    </ol>
                </header>

                <div className="min-h-0 overflow-y-auto px-5 py-4">
                    {step === 0 && (
                        <>
                            <p className="text-[13px] font-semibold text-text-primary">Takvimde ne görünsün?</p>
                            <div className="mt-2 flex flex-col gap-1.5">
                                {INTERNAL_SOURCE_ORDER.map((source) => {
                                    const on = sources.has(source);
                                    const count = counts?.[source];
                                    return (
                                        <button
                                            key={source}
                                            type="button"
                                            role="switch"
                                            aria-checked={on}
                                            onClick={() => toggle(source)}
                                            className={cn(
                                                'flex items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-colors duration-fast',
                                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                                                on ? 'border-accent bg-primary-subtle' : 'border-subtle hover:bg-surface-hover',
                                            )}
                                        >
                                            <i className={cn('fa text-[12px]', SOURCES[source]?.icon, on ? 'text-accent' : 'text-text-tertiary')} aria-hidden="true" />
                                            <span className="flex-1 text-[12.5px] font-medium text-text-primary">
                                                {SOURCES[source]?.label}
                                            </span>
                                            {count != null && (
                                                <span className="font-mono text-[11px] tabular-nums text-text-tertiary">{count}</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <p className="mt-4 text-[13px] font-semibold text-text-primary">Günlük kapasiteniz</p>
                            <div className="mt-2 flex gap-1.5">
                                {CAPACITY_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setCapacity(option.value)}
                                        className={cn(
                                            'rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors duration-fast',
                                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                                            capacity === option.value
                                                ? 'border-accent bg-primary-subtle text-accent'
                                                : 'border-subtle text-text-secondary hover:bg-surface-hover',
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                            <p className="mt-1.5 text-[11px] leading-snug text-text-tertiary">
                                Aşım uyarıları bu değere göre hesaplanır. Kapatırsanız kapasite
                                çubukları görünmez.
                            </p>
                        </>
                    )}

                    {step === 1 && (
                        <>
                            <p className="text-[13px] font-semibold text-text-primary">Dış takvim bağlayın</p>
                            <p className="mt-1 text-[12px] leading-snug text-text-tertiary">
                                Google veya Outlook bağlarsanız size atanan tarihli öğeler oraya
                                etkinlik olarak yazılır. Bu adım isteğe bağlıdır — sonradan
                                senkron ayarlarından bağlayabilirsiniz.
                            </p>
                            <div className="mt-3 flex gap-2">
                                <Button
                                    size="sm" variant="outline"
                                    onClick={() => { window.location.href = '/Calendars/SimulateAuth?provider=1'; }}
                                >
                                    <i className="fab fa-google me-1.5" aria-hidden="true" />Google bağla
                                </Button>
                                <Button
                                    size="sm" variant="outline"
                                    onClick={() => { window.location.href = '/Calendars/SimulateAuth?provider=2'; }}
                                >
                                    <i className="fab fa-windows me-1.5" aria-hidden="true" />Outlook bağla
                                </Button>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <p className="text-[13px] font-semibold text-text-primary">Çakışma kuralı</p>
                            <p className="mt-1 text-[12px] leading-snug text-text-tertiary">
                                İki taraf da düzenlenirse varsayılan olarak <strong className="font-semibold">son
                                değişen kazanır</strong> ve ekranda geri alma şeridi çıkar. Hesap
                                bağladığınızda bu kuralı senkron ayarlarından değiştirebilirsiniz.
                            </p>
                            <p className="mt-3 text-[12px] text-text-secondary">
                                Kurulum tamam — takvim seçtiğiniz kaynaklarla açılacak.
                            </p>
                        </>
                    )}
                </div>

                {update.isError && (
                    <p role="alert" className="shrink-0 px-5 pb-3 text-[11px] text-negative-700">
                        {update.error?.message || 'Ayarlar kaydedilemedi, lütfen tekrar deneyin.'}
                    </p>
                )}

                <footer className="shrink-0 flex items-center gap-2 border-t border-subtle px-5 py-3">
                    <span className="text-[11.5px] text-text-tertiary">Adım {step + 1} / {STEPS.length}</span>
                    <span className="flex-1" />
                    {/* Atlamak da kurulumu tamamlanmış sayar: kullanıcı her açılışta
                        aynı ekranla karşılaşmasın. */}
                    <Button size="sm" variant="ghost" onClick={finish} disabled={update.isPending}>
                        Şimdilik atla
                    </Button>
                    {step < STEPS.length - 1 ? (
                        <Button size="sm" variant="primary" onClick={() => setStep((s) => s + 1)}>
                            Devam
                        </Button>
                    ) : (
                        <Button size="sm" variant="primary" onClick={finish} disabled={update.isPending}>
                            {update.isPending ? 'Kaydediliyor…' : 'Bitir'}
                        </Button>
                    )}
                </footer>
            </DialogContent>
        </Dialog>
    );
}
