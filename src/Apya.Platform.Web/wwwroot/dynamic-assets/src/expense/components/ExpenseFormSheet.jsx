import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Sheet, Button, Badge, Input, MoneyInput, Combobox } from '../../components/ui';
import { ConfidenceMeter } from '../../components/ai';
import { cn, formatMoney } from '../../lib/utils';
import { LOW_CONFIDENCE_THRESHOLD } from '../hooks/fixtures';

/**
 * Expense form — bottom sheet on mobile, side drawer on tablet/desktop.
 * AI'dan gelen değerlerle pre-filled. Kullanıcı düzeltir, gönderir.
 *
 * APYA-107 refinements:
 *   - Per-field confidence: ocrResult.fields[k].confidence düşükse alan
 *     warning border + alt ipucu alır. Form bu alanlara FOCUS DA bizzat
 *     yapar — kullanıcı en şüpheli alanı en başta görür, doğrular.
 *   - Form 4 kritik alan (Tutar, Tarih, Tedarikçi, Kategori); ekstralar
 *     "Daha fazla" disclosure'ında.
 *   - APYA-106 primitive'leri: MoneyInput (locale + currency), Input,
 *     Combobox (kategori için). Raw input'lar kalktı.
 *   - submit retry sırasında kullanıcı double-click ile duplicate yaratamaz
 *     (Button.isLoading + form submit guard).
 */

const CATEGORY_OPTIONS = [
    { value: 'Ofis Sarfiyat',     label: 'Ofis Sarfiyat' },
    { value: 'Donanım',           label: 'Donanım' },
    { value: 'Yazılım Lisansı',   label: 'Yazılım Lisansı' },
    { value: 'Internet/Telekom',  label: 'Internet/Telekom' },
    { value: 'Seyahat',           label: 'Seyahat' },
    { value: 'Yemek',             label: 'Yemek' },
    { value: 'Kırtasiye',         label: 'Kırtasiye' },
    { value: 'Diğer',             label: 'Diğer' },
];

const CURRENCIES = ['TRY', 'USD', 'EUR'];

export function ExpenseFormSheet({
    open, onOpenChange, ocrResult, onSubmit, isSubmitting,
}) {
    const [form, setForm] = useState(() => initialFromOcr(ocrResult));
    const [showMore, setShowMore] = useState(false);
    const firstLowConfFieldRef = useRef(null);

    /* OCR sonucu değişince form'u sıfırla. Kullanıcı düzelmeye başladıysa
       yine de yeni OCR'a geç — capture flow yeni dosya = yeni session. */
    useEffect(() => {
        setForm(initialFromOcr(ocrResult));
    }, [ocrResult]);

    /* Form açıldığında en düşük güvenli alana focus. Strategy: kullanıcı
       şüpheli alanı görür, hemen düzeltir. Tutar gibi yüksek güvenli alanlara
       focus etmek hata; kullanıcı zaten doğru olduğunu görüyor. */
    useEffect(() => {
        if (!open || !ocrResult?.fields) return;
        const t = setTimeout(() => firstLowConfFieldRef.current?.focus?.(), 80);
        return () => clearTimeout(t);
    }, [open, ocrResult]);

    const fieldConfidence = useMemo(
        () => ocrResult?.fields ?? {},
        [ocrResult],
    );

    /* "İlk low-conf" alanı belirle — auto-focus için. Sıra: vendor → category
       → date → amount (UX'e göre kullanıcının düzeltmek isteyeceği sıra). */
    const firstLowConf = useMemo(() => {
        const order = ['vendor', 'category', 'date', 'amount'];
        for (const key of order) {
            const c = fieldConfidence[key]?.confidence;
            if (c != null && c < LOW_CONFIDENCE_THRESHOLD) return key;
        }
        return null;
    }, [fieldConfidence]);

    const update = (field) => (e) =>
        setForm((s) => ({ ...s, [field]: e?.target ? e.target.value : e }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;          /* Double-submit guard */
        const payload = {
            ...form,
            amount: typeof form.amount === 'number' ? form.amount : parseFloat(form.amount),
            taxRate: typeof form.taxRate === 'number' ? form.taxRate : parseFloat(form.taxRate),
        };
        await onSubmit(payload);
    };

    const globalConfidence = ocrResult?.confidence ?? 0;
    const confLabel = globalConfidence >= 0.85 ? 'Yüksek güven'
                    : globalConfidence >= 0.65 ? 'Orta güven'
                    : 'Düşük güven — kontrol edin';
    const confVariant = globalConfidence >= 0.85 ? 'positive'
                      : globalConfidence >= 0.65 ? 'warning'
                      : 'critical';

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <Sheet.Content title="Masraf detayları" description="AI tarafından okunan tutarları doğrulayın ve gönderin">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <header className="px-4 pt-2 pb-3 border-b border-subtle flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Masraf Detayları</h2>
                        <Badge variant={confVariant} size="sm" withDot>{confLabel}</Badge>
                    </header>

                    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
                        <Field label="Tutar" required confidence={fieldConfidence.amount?.confidence}>
                            <MoneyInput
                                ref={firstLowConf === 'amount' ? firstLowConfFieldRef : undefined}
                                value={form.amount}
                                onValueChange={(v) => setForm((s) => ({ ...s, amount: v ?? '' }))}
                                currency={form.currency}
                                currencies={CURRENCIES}
                                onCurrencyChange={(c) => setForm((s) => ({ ...s, currency: c }))}
                                size="md"
                                invalid={fieldConfidence.amount?.confidence < LOW_CONFIDENCE_THRESHOLD}
                                required
                                min={0.01}
                            />
                        </Field>

                        <Field label="Tarih" required confidence={fieldConfidence.date?.confidence}>
                            <Input
                                ref={firstLowConf === 'date' ? firstLowConfFieldRef : undefined}
                                type="date"
                                required
                                value={form.date}
                                onChange={update('date')}
                                invalid={fieldConfidence.date?.confidence < LOW_CONFIDENCE_THRESHOLD}
                            />
                        </Field>

                        <Field label="Tedarikçi" required confidence={fieldConfidence.vendor?.confidence}>
                            <Input
                                ref={firstLowConf === 'vendor' ? firstLowConfFieldRef : undefined}
                                type="text"
                                required
                                value={form.vendor}
                                onChange={update('vendor')}
                                invalid={fieldConfidence.vendor?.confidence < LOW_CONFIDENCE_THRESHOLD}
                                placeholder="örn. Migros A.Ş."
                            />
                        </Field>

                        <Field label="Kategori" confidence={fieldConfidence.category?.confidence}>
                            <Combobox
                                options={CATEGORY_OPTIONS}
                                value={form.category}
                                onChange={(value) => setForm((s) => ({ ...s, category: value }))}
                                invalid={fieldConfidence.category?.confidence < LOW_CONFIDENCE_THRESHOLD}
                                placeholder="Kategori seç"
                            />
                        </Field>

                        <button
                            type="button"
                            onClick={() => setShowMore((v) => !v)}
                            className="self-start text-sm text-text-link hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
                        >
                            {showMore ? 'Daha az alan' : 'Daha fazla alan'}
                        </button>

                        {showMore && (
                            <>
                                <Field label="KDV Oranı (%)">
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={form.taxRate}
                                        onChange={update('taxRate')}
                                        className="font-tabular"
                                    />
                                </Field>
                                <Field label="Not">
                                    <textarea
                                        rows={2}
                                        value={form.note}
                                        onChange={update('note')}
                                        className={cn(
                                            'block w-full rounded-md border border-default bg-surface-base text-text-primary',
                                            'px-3 py-2 text-sm resize-none',
                                            'focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus',
                                            'placeholder:text-text-tertiary',
                                        )}
                                    />
                                </Field>
                            </>
                        )}
                    </div>

                    <footer className="px-4 py-3 border-t border-subtle bg-surface-sunken flex items-center justify-between gap-2">
                        <span className="text-sm text-text-tertiary">
                            Toplam:{' '}
                            <span className="font-tabular font-semibold text-text-primary">
                                {typeof form.amount === 'number' && form.amount > 0
                                    ? formatMoney(form.amount, form.currency)
                                    : '—'}
                            </span>
                        </span>
                        <div className="flex gap-2">
                            <Sheet.Close asChild>
                                <Button type="button" variant="ghost" size="md">İptal</Button>
                            </Sheet.Close>
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                isLoading={isSubmitting}
                                loadingText="Gönderiliyor..."
                            >
                                Gönder
                            </Button>
                        </div>
                    </footer>
                </form>
            </Sheet.Content>
        </Sheet>
    );
}

function Field({ label, required, confidence, children }) {
    /* Per-field confidence rozeti — yalnızca değer gelmişse ve <0.95 ise göster.
       0.95+ "kesin biliyorum" anlamında; UI'ı kalabalıklaştırmak gereksiz.
       <LOW_CONFIDENCE_THRESHOLD ise alt satırda "AI emin değil" ipucu. */
    const showMeter = confidence != null && confidence < 0.95;
    const isLowConf = confidence != null && confidence < LOW_CONFIDENCE_THRESHOLD;

    return (
        <label className="flex flex-col gap-1.5">
            <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-text-secondary">
                    {label}{required && <span className="text-text-negative ml-0.5">*</span>}
                </span>
                {showMeter && (
                    <ConfidenceMeter score={confidence} showLabel={false} size="sm" />
                )}
            </span>
            {children}
            {isLowConf && (
                <span className="text-xs text-text-warning">
                    AI bu alandan emin değil — doğrula.
                </span>
            )}
        </label>
    );
}

function initialFromOcr(ocr) {
    const f = ocr?.fields ?? {};
    return {
        amount:   f.amount?.value   ?? '',
        currency: f.currency?.value ?? 'TRY',
        date:     f.date?.value     ?? new Date().toISOString().slice(0, 10),
        vendor:   f.vendor?.value   ?? '',
        category: f.category?.value ?? '',
        taxRate:  f.taxRate?.value  ?? 20,
        note:     '',
    };
}
