import React from 'react';
import { TAB_CARD, TabCardHeader, TabEmptyState, RowBadge, fmtShortDate } from '../v3/tabPrimitives';

function fmtMoney(amount, currency) {
    const cur = currency || 'TRY';
    try {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: cur, minimumFractionDigits: 2 }).format(amount || 0);
    } catch {
        return `${(amount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${cur}`.trim();
    }
}

function KpiCard({ label, value, tone, note }) {
    return (
        <div className="flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs">
            <span className="text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary">{label}</span>
            <span className={`font-mono text-[22px] font-bold tracking-[-.02em] ${tone}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {value}
            </span>
            {note && <span className="text-[11.5px] text-text-tertiary">{note}</span>}
        </div>
    );
}

/**
 * Finans sekmesi (V4 tasarım dili).
 *
 * TASARIMDAN BİLİNÇLİ SAPMA: prototip "Bütçe / Harcanan / Kalan" KPI'ları
 * gösteriyor, ama görevde bütçe alanı YOK — veri gider/gelir kayıtlarından
 * geliyor. Prototipin görsel formu (3 KPI kartı + rozetli satır listesi)
 * korunup etiketler gerçek anlamlarıyla bırakıldı; uydurma bir "bütçe"
 * gösterilmedi. Para birimine göre gruplar, çapraz-kur toplamaz.
 */
export function FinanceTab({ task }) {
    const expenses = task?.expenses || [];
    const incomes = task?.incomes || [];

    if (expenses.length === 0 && incomes.length === 0) {
        return (
            <div className={TAB_CARD}>
                <TabCardHeader title="Görev Finansı" />
                <TabEmptyState
                    icon="fa-coins"
                    title="Kayıt yok"
                    description="Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
                />
            </div>
        );
    }

    const currencies = Array.from(new Set([...expenses, ...incomes].map((l) => l.currency || 'TRY')));
    const perCurrency = currencies.map((cur) => {
        const inc = incomes.filter((l) => (l.currency || 'TRY') === cur).reduce((a, l) => a + (l.amount || 0), 0);
        const exp = expenses.filter((l) => (l.currency || 'TRY') === cur).reduce((a, l) => a + (l.amount || 0), 0);
        return { cur, inc, exp, net: inc - exp };
    });

    const lines = [
        ...incomes.map((l) => ({ ...l, kind: 'income' })),
        ...expenses.map((l) => ({ ...l, kind: 'expense' })),
    ].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    return (
        <div className="flex flex-col gap-4">
            {perCurrency.map(({ cur, inc, exp, net }) => (
                <div key={cur} className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
                    <KpiCard label={`Toplam Gelir (${cur})`} value={fmtMoney(inc, cur)} tone="text-success" note="göreve etiketli gelirler" />
                    <KpiCard label={`Toplam Gider (${cur})`} value={fmtMoney(exp, cur)} tone="text-warning" note="göreve etiketli giderler" />
                    <KpiCard
                        label={`Net Bakiye (${cur})`}
                        value={fmtMoney(net, cur)}
                        tone={net >= 0 ? 'text-success' : 'text-negative'}
                        note={net >= 0 ? 'gelir gideri karşılıyor' : 'gider gelirden fazla'}
                    />
                </div>
            ))}

            <div className={TAB_CARD}>
                <TabCardHeader title="Finans kalemleri" />
                {lines.map((l) => (
                    <div
                        key={`${l.kind}-${l.id}`}
                        className="flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised"
                    >
                        <span className="flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary">
                            <i className={`fa-solid ${l.kind === 'income' ? 'fa-arrow-down' : 'fa-arrow-up'} text-[11px]`} />
                        </span>
                        <span className="flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary">
                            {l.title || (l.kind === 'income' ? 'Gelir' : 'Gider')}
                        </span>
                        <span className="shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden">{fmtShortDate(l.date)}</span>
                        {l.kind === 'income'
                            ? <RowBadge bg="bg-success-subtle" fg="text-success">Gelir</RowBadge>
                            : <RowBadge bg="bg-warning-subtle" fg="text-warning">Gider</RowBadge>}
                        <span
                            className={`shrink-0 font-mono text-[12.5px] font-bold ${l.kind === 'income' ? 'text-success' : 'text-text-primary'}`}
                            style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                            {l.kind === 'income' ? '+' : '−'}{fmtMoney(l.amount, l.currency)}
                        </span>
                    </div>
                ))}
            </div>

            <p className="m-0 text-[11px] text-text-tertiary">
                Kayıtlar Finans modülünden yönetilir; buraya göreve etiketlenmiş gider/gelirler yansır.
            </p>
        </div>
    );
}
