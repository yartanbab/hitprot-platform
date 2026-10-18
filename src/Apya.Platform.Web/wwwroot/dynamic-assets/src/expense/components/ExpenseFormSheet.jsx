import React, { useEffect, useState } from 'react';
import { Sheet, Button, Input, MoneyInput, Combobox } from '../../components/ui';
import { cn, formatMoney } from '../../lib/utils';

/**
 * Expense form — bottom sheet on mobile, side drawer on tablet/desktop.
 * BOŞ açılır; çekilen fotoğraf üstte gösterilir, kullanıcı değerleri ona bakarak girer.
 *
 * F-01: Form eskiden sahte "AI okuma" değerleriyle (dosya boyutundan tutar, hazır listeden
 * tedarikçi) dolu açılıyor, alanlarda güven rozeti ve "AI emin değil" ipucu gösteriyordu.
 * Okuma gerçek değildi; kullanıcı uydurma değeri kaydedebilirdi. Sunucuya hiç gitmeyen
 * KDV alanı da kalktı (gider sözleşmesinde KDV yok).
 *
 * APYA-107 refinements:
 *   - Form 4 kritik alan (Tutar, Tarih, Tedarikçi, Kategori); ekstralar
 *     "Daha fazla" disclosure'ında.
 *   - APYA-106 primitive'leri: MoneyInput (locale + currency), Input,
 *     Combobox (kategori için). Raw input'lar kalktı.
 *   - submit retry sırasında kullanıcı double-click ile duplicate yaratamaz
 *     (Button.isLoading + form submit guard).
 */

/* Değer = sunucudaki ExpenseCategory enum'u; etiketler masaüstü gider formuyla
   (Pages/Expenses/ExpenseLookups.cs) aynı. Eskiden serbest metin ('Seyahat')
   gidiyordu ve sunucu enum'a çeviremeyip her kaydı 400 ile reddediyordu. */
const CATEGORY_OPTIONS = [
    { value: '0', label: 'Genel / Diğer' },
    { value: '1', label: 'Ofis / Kira' },
    { value: '2', label: 'Seyahat / Ulaşım' },
    { value: '3', label: 'Personel / Maaş' },
    { value: '4', label: 'Malzeme / Sarf' },
    { value: '5', label: 'Hizmet / Danışmanlık' },
    { value: '6', label: 'Vergi / Harç' },
];

const CURRENCIES = ['TRY', 'USD', 'EUR'];

/* Seçici stili — mevcut Input/textarea deseniyle aynı token'lar.
   min-h-[44px]: tasarım 1d "tüm dokunma hedefleri ≥44px" diyor. */
const SELECT_CLS = [
    'block w-full min-h-[44px] rounded-md border border-default bg-surface-base text-text-primary',
    'px-3 py-2 text-sm',
    'focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus',
].join(' ');

export function ExpenseFormSheet({
    open, onOpenChange, previewUrl, onSubmit, isSubmitting,
    context, lines, onProjectChange, isOffline,
}) {
    const [form, setForm] = useState(emptyForm);
    const [showMore, setShowMore] = useState(false);

    /* Yeni fotoğraf = yeni kayıt: form sıfırlanır. */
    useEffect(() => {
        setForm(emptyForm());
    }, [previewUrl]);

    const update = (field) => (e) =>
        setForm((s) => ({ ...s, [field]: e?.target ? e.target.value : e }));

    /* Kalem tanımlı projede kalem ZORUNLU — aynı kural sunucuda da işliyor
       (ProjectBudgetManager.EnsureBudgetLineIsValidAsync). Burada engellemek
       erken geri bildirimdir, tek savunma hattı değil. */
    const lineRequired = !!lines?.requiresBudgetLine;
    const missingContext = !form.cashAccountId
        || (lineRequired && !form.budgetLineId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting || missingContext) return;   /* Double-submit guard */
        const payload = {
            ...form,
            amount: typeof form.amount === 'number' ? form.amount : parseFloat(form.amount),
        };
        await onSubmit(payload);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <Sheet.Content title="Masraf detayları" description="Fişteki bilgileri girin ve gönderin">
                {/* flex-1 min-h-0: Sheet yalnız max-height taşıdığı için h-full auto'ya
                    düşüyordu; gövde kaymıyor, mobilde Gönder ekran dışında kalıyordu. */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    <header className="px-4 pt-2 pb-3 border-b border-subtle flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Masraf Detayları</h2>
                    </header>

                    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
                        {isOffline && (
                            <div className="rounded-xl border border-warning bg-warning-subtle px-3 py-2 text-[12.5px] text-warning">
                                <i className="fa-solid fa-wifi-slash mr-1.5" />
                                Bağlantı yok — kayıt <strong>cihazda saklanır</strong>, bağlantı gelince
                                gönderilir.
                            </div>
                        )}

                        {previewUrl && (
                            <figure className="flex flex-col gap-1.5">
                                <img
                                    src={previewUrl}
                                    alt="Çekilen fiş fotoğrafı"
                                    className="max-h-64 w-full rounded-md border border-subtle bg-surface-sunken object-contain"
                                />
                                <figcaption className="text-xs text-text-tertiary">
                                    Fotoğraf yalnız bu ekranda görünür, kayda eklenmez. Belgeyi sonradan
                                    Dokümanlar'dan bu gidere bağlayabilirsin.
                                </figcaption>
                            </figure>
                        )}

                        {/* ── BAĞLAM (tasarım 1d): proje · kalem · kasa ───────────
                            Kasa ZORUNLU (sunucu sözleşmesi), kalem projede kalem
                            tanımlıysa zorunlu. Bunlar olmadan saha kaydı doğrudan
                            "kaleme yazılmamış" kovasına düşerdi. */}
                        <Field label="Proje">
                            <select
                                className={SELECT_CLS}
                                value={form.projectId || ''}
                                onChange={(e) => { update('projectId')(e); onProjectChange?.(e.target.value); }}
                            >
                                <option value="">— Projesiz —</option>
                                {(context?.projects ?? []).map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </Field>

                        {form.projectId && (lines?.lines?.length ?? 0) > 0 && (
                            <Field label="Bütçe kalemi" required={lineRequired}>
                                <select
                                    className={SELECT_CLS}
                                    value={form.budgetLineId || ''}
                                    onChange={update('budgetLineId')}
                                >
                                    <option value="">— Kalem seçin —</option>
                                    {lines.lines.map(l => (
                                        <option key={l.id} value={l.id}>{l.label}</option>
                                    ))}
                                </select>
                            </Field>
                        )}

                        <Field label="Kasa / banka" required>
                            <select
                                className={SELECT_CLS}
                                value={form.cashAccountId || ''}
                                onChange={update('cashAccountId')}
                            >
                                <option value="">— Kasa seçin —</option>
                                {(context?.accounts ?? []).map(a => (
                                    <option key={a.id} value={a.id}>{a.name} ({a.currency})</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Tutar" required>
                            <MoneyInput
                                value={form.amount}
                                onValueChange={(v) => setForm((s) => ({ ...s, amount: v ?? '' }))}
                                currency={form.currency}
                                currencies={CURRENCIES}
                                onCurrencyChange={(c) => setForm((s) => ({ ...s, currency: c }))}
                                size="lg"
                                required
                                min={0.01}
                            />
                        </Field>

                        <Field label="Tarih" required>
                            <Input
                                type="date"
                                required
                                size="lg"
                                value={form.date}
                                onChange={update('date')}
                            />
                        </Field>

                        <Field label="Tedarikçi" required>
                            <Input
                                type="text"
                                required
                                size="lg"
                                value={form.vendor}
                                onChange={update('vendor')}
                                placeholder="örn. Migros A.Ş."
                            />
                        </Field>

                        <Field label="Kategori">
                            <Combobox
                                options={CATEGORY_OPTIONS}
                                value={form.category}
                                onChange={(value) => setForm((s) => ({ ...s, category: value }))}
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

function emptyForm() {
    return {
        amount:   '',
        currency: 'TRY',
        date:     new Date().toISOString().slice(0, 10),
        vendor:   '',
        category: '',
        note:     '',
    };
}
