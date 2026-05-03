import React, { useState } from 'react';
import { Sheet, Button, Badge } from '../../components/ui';
import { cn, formatMoney } from '../../lib/utils';

/**
 * Expense form — bottom sheet on mobile, side drawer on tablet/desktop.
 * AI'dan gelen değerlerle pre-filled. Kullanıcı düzeltir, gönderir.
 *
 * UX kuralı: form 4 alandan fazla tutmasın (mobile'da scroll = friction).
 * Ekstra alanlar "Daha fazla" disclosure'ında.
 *
 * Confidence rozeti — kullanıcıya AI'a güvenip güvenmemesi gerektiğini söyler.
 */
export function ExpenseFormSheet({
    open, onOpenChange, ocrResult, onSubmit, isSubmitting,
}) {
    const [form, setForm] = useState(() => initialFromOcr(ocrResult));
    const [showMore, setShowMore] = useState(false);

    React.useEffect(() => {
        setForm(initialFromOcr(ocrResult));
    }, [ocrResult]);

    const update = (field) => (e) =>
        setForm((s) => ({ ...s, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            amount: parseFloat(form.amount),
            taxRate: parseFloat(form.taxRate),
        };
        await onSubmit(payload);
    };

    const confidence = ocrResult?.confidence ?? 0;
    const confLabel = confidence >= 0.85 ? 'Yüksek güven'
                    : confidence >= 0.65 ? 'Orta güven'
                    : 'Düşük güven — kontrol edin';
    const confVariant = confidence >= 0.85 ? 'positive'
                      : confidence >= 0.65 ? 'warning'
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
                        <Field label="Tutar" required>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
                                    required
                                    value={form.amount}
                                    onChange={update('amount')}
                                    className={inputCls + ' font-tabular flex-1'}
                                />
                                <select
                                    value={form.currency}
                                    onChange={update('currency')}
                                    className={cn(inputCls, 'w-20')}
                                >
                                    <option value="TRY">TRY</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>
                        </Field>

                        <Field label="Tarih" required>
                            <input
                                type="date"
                                required
                                value={form.date}
                                onChange={update('date')}
                                className={inputCls}
                            />
                        </Field>

                        <Field label="Tedarikçi" required>
                            <input
                                type="text"
                                required
                                value={form.vendor}
                                onChange={update('vendor')}
                                className={inputCls}
                            />
                        </Field>

                        <Field label="Kategori">
                            <input
                                type="text"
                                value={form.category}
                                onChange={update('category')}
                                className={inputCls}
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
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={form.taxRate}
                                        onChange={update('taxRate')}
                                        className={inputCls + ' font-tabular'}
                                    />
                                </Field>
                                <Field label="Not">
                                    <textarea
                                        rows={2}
                                        value={form.note}
                                        onChange={update('note')}
                                        className={inputCls + ' resize-none'}
                                    />
                                </Field>
                            </>
                        )}
                    </div>

                    <footer className="px-4 py-3 border-t border-subtle bg-surface-sunken flex items-center justify-between gap-2">
                        <span className="text-sm text-text-tertiary">
                            Toplam:{' '}
                            <span className="font-tabular font-semibold text-text-primary">
                                {form.amount && !isNaN(parseFloat(form.amount))
                                    ? formatMoney(parseFloat(form.amount), form.currency)
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

function Field({ label, required, children }) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-text-secondary">
                {label}{required && <span className="text-text-negative ml-0.5">*</span>}
            </span>
            {children}
        </label>
    );
}

const inputCls = cn(
    'h-10 px-3 rounded-md',
    'bg-surface-base text-text-primary',
    'border border-default',
    'focus-visible:outline-none focus-visible:shadow-focus focus:border-focus',
    'transition-colors duration-fast',
);

function initialFromOcr(ocr) {
    return {
        amount:   ocr?.amount ?? '',
        currency: ocr?.currency ?? 'TRY',
        date:     ocr?.date ?? new Date().toISOString().slice(0, 10),
        vendor:   ocr?.vendor ?? '',
        category: ocr?.category ?? '',
        taxRate:  ocr?.taxRate ?? 20,
        note:     '',
    };
}
