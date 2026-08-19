import React, { useEffect, useState } from 'react';
import { Button, Sheet, SheetContent } from '../components/ui';
import { cn } from '../lib/utils';
import { RISK, SOURCES, addDays, fmt } from './lib/model';
import { MeetingActions } from './MeetingActions';

const RISK_LABEL = {
    [RISK.OVERDUE]: { text: 'Gecikmiş', cls: 'bg-negative-50 text-negative-700' },
    [RISK.DUE_TODAY]: { text: 'Bugün son gün', cls: 'bg-warning-50 text-warning-700' },
};

function Field({ label, children }) {
    if (!children) return null;
    return (
        <div className="flex items-start justify-between gap-3 border-b border-subtle py-2.5 last:border-b-0">
            <span className="shrink-0 text-[11.5px] font-medium text-text-tertiary">{label}</span>
            <span className="min-w-0 text-right text-[12.5px] text-text-primary">{children}</span>
        </div>
    );
}

/**
 * Etkinlik drawer'ı — öğeye tıklamak artık listeye GİTMEZ, burayı açar.
 *
 * Tasarım kuralı: takvimden yapılabilen her şey klavyeyle de yapılabilir olmalı.
 * Sürükle-bırakla yapılan taşımanın klavye karşılığı buradaki tarih alanı ve
 * "+1 gün ertele" düğmesidir.
 *
 * Değiştirilemeyen kaynaklarda (fatura/gider/gelir vadesi, hibe son tarihi)
 * tarih satırı "değişmez" olarak gösterilir — düğme gizlemek yerine NEDENİ yazılır.
 */
export function ItemDrawer({ item, capacity, onClose, onReschedule, onComplete, isPending, error, onRetry }) {
    const [dateDraft, setDateDraft] = useState(() => item.date.slice(0, 10));
    const meta = SOURCES[item.source];
    const risk = RISK_LABEL[item.risk];
    const currentDay = item.date.slice(0, 10);

    /* Öğe taşınınca (sürükle-bırak, "+1 gün ertele" veya geri alma) alan da
       yeni tarihe döner. Aksi hâlde alan eski günde kalır ve "Uygula" düğmesi
       kullanıcıya farkında olmadan geri-taşıma teklif eder. */
    useEffect(() => setDateDraft(currentDay), [currentDay]);

    const applyDate = () => {
        if (!dateDraft || dateDraft === currentDay) return;
        onReschedule(item, new Date(`${dateDraft}T00:00:00`));
    };

    return (
        <Sheet open onOpenChange={(open) => { if (!open) onClose(); }}>
            <SheetContent side="right" title={item.title} className="w-full max-w-[420px] p-0">
                <header className="border-b border-subtle px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-neutral-subtle px-2 py-1 text-[11px] font-semibold text-text-secondary">
                            {meta && <i className={cn('fa text-[10px]', meta.icon)} aria-hidden="true" />}
                            {meta?.label}
                        </span>
                        {risk && (
                            <span className={cn('rounded-md px-2 py-1 text-[11px] font-bold', risk.cls)}>
                                {risk.text}
                            </span>
                        )}
                        {item.isDone && (
                            <span className="rounded-md bg-positive-50 px-2 py-1 text-[11px] font-bold text-positive-700">
                                Tamamlandı
                            </span>
                        )}
                        <button
                            type="button" onClick={onClose} aria-label="Kapat"
                            className="ml-auto rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                        >
                            <i className="fa fa-xmark" aria-hidden="true" />
                        </button>
                    </div>
                    <h3 className="mt-2 text-[16px] font-semibold leading-snug text-text-primary">{item.title}</h3>
                </header>

                {error && (
                    <div className="flex items-center gap-2 border-b border-negative-100 bg-negative-50 px-4 py-2.5 text-[12px] text-negative-700">
                        <i className="fa fa-triangle-exclamation" aria-hidden="true" />
                        <span className="flex-1">{error}</span>
                        <button type="button" onClick={onRetry} className="font-semibold underline">Yeniden dene</button>
                    </div>
                )}

                {isPending && (
                    <div className="border-b border-subtle px-4 py-2 text-[12px] text-text-tertiary" aria-live="polite">
                        <i className="fa fa-circle-notch fa-spin me-1.5" aria-hidden="true" />kaydediliyor…
                    </div>
                )}

                {item.canReschedule && !item.isDone && (
                    <div className="flex flex-wrap gap-2 border-b border-subtle px-4 py-3">
                        <Button size="sm" variant="secondary" onClick={() => onComplete(item)}>
                            <i className="fa fa-check me-1.5" aria-hidden="true" />Tamamla
                        </Button>
                        <Button
                            size="sm" variant="outline"
                            onClick={() => onReschedule(item, addDays(new Date(`${currentDay}T00:00:00`), 1))}
                        >
                            +1 gün ertele
                        </Button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto px-4 py-2">
                    <Field label="Son tarih">
                        {item.canReschedule ? (
                            <span className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={dateDraft}
                                    onChange={(e) => setDateDraft(e.target.value)}
                                    className="rounded-md border border-default bg-surface-base px-2 py-1 text-[12.5px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                                    aria-label="Son tarih"
                                />
                                {dateDraft !== currentDay && (
                                    <Button size="sm" variant="primary" onClick={applyDate}>Uygula</Button>
                                )}
                            </span>
                        ) : (
                            <span className="text-text-secondary">
                                {fmt.dayTitle(new Date(`${currentDay}T00:00:00`))}
                                <span className="ml-1.5 text-text-tertiary">· takvimden değiştirilemez</span>
                            </span>
                        )}
                    </Field>

                    <Field label="Bağlam">{item.subtitle}</Field>
                    <Field label="Atanan">{item.assigneeName}</Field>
                    <Field label="Tutar">
                        {item.amount != null ? fmt.money(item.amount, item.currency) : null}
                    </Field>
                    <Field label="Gün yükü">
                        {item.loadHours != null
                            ? `${fmt.hours(item.loadHours)}${capacity ? ` / ${fmt.hours(capacity)} kapasite` : ''}`
                            : null}
                    </Field>
                </div>

                {/* Dış takvim etkinliği tek yönlü kalmasın: notlardan görev çıkarılabilir. */}
                {item.source === 7 && <MeetingActions item={item} />}

                {item.href && (
                    <footer className="border-t border-subtle px-4 py-3">
                        <a
                            href={item.href}
                            className="text-[12.5px] font-medium text-text-link hover:underline"
                        >
                            {meta?.label} ekranında aç
                            <i className="fa fa-arrow-right ms-1.5 text-[10px]" aria-hidden="true" />
                        </a>
                    </footer>
                )}
            </SheetContent>
        </Sheet>
    );
}
