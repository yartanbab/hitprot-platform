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
 * "Bütçe bağı" kartı (tasarım 4a).
 *
 * Görev artık bir bütçe kalemine bağlanabiliyor ve kendi planlanan tutarını
 * taşıyor, dolayısıyla bu kart uydurma değil GERÇEK veriye dayanıyor.
 *
 * TASARIMDAN BİLİNÇLİ SAPMA: prototip DÖRT hücre gösteriyor
 * (bütçe · taahhüt · gerçekleşen · kalan); burada ÜÇ var. "Taahhüt" onay
 * bekleyen sipariş/talep demek ve arkasında bir varlık yok — eklenseydi
 * ekranda hep 0 gösteren bir hücre olurdu.
 */
function BudgetLinkCard({ task, spentByCurrency }) {
    const planned = task?.plannedAmount;
    if (!task?.budgetLineId || planned == null) { return null; }

    // Görevin planı proje para birimindedir; gerçekleşen de aynı defterden
    // okunur (₺). Çapraz kur toplamı YAPILMAZ.
    const spent = spentByCurrency;
    const remaining = planned - spent;
    const pct = planned > 0 ? Math.round((spent / planned) * 100) : 0;
    const over = remaining < 0;

    return (
        <div className={TAB_CARD}>
            <TabCardHeader title="Bütçe bağı" />
            <div className="px-4 pb-4 pt-1 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-semibold text-accent">
                        {task.budgetLineName || 'Bütçe kalemi'}
                    </span>
                    {task.budgetLineRemaining != null && (
                        <span className="text-[11px] text-text-tertiary">
                            kalemde kalan {fmtMoney(task.budgetLineRemaining, 'TRY')}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3">
                    <Cell label="Görev bütçesi" value={fmtMoney(planned, 'TRY')} />
                    <Cell label="Gerçekleşen" value={fmtMoney(spent, 'TRY')} />
                    <Cell
                        label="Kalan"
                        value={fmtMoney(remaining, 'TRY')}
                        tone={over ? 'text-negative' : 'text-success'}
                    />
                </div>

                <div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-subtle">
                        <div
                            className={`h-full rounded-full ${over ? 'bg-negative' : pct >= 80 ? 'bg-warning' : 'bg-success'}`}
                            style={{ width: `${Math.min(Math.max(pct, 0), 100)}%` }}
                        />
                    </div>
                    <div className="mt-1 text-[11.5px] text-text-tertiary">
                        %{pct}
                        {over && <span className="ml-1 text-negative">· görev bütçesi aşıldı</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Cell({ label, value, tone }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary">{label}</span>
            <span className={`font-mono text-[15px] font-bold ${tone || 'text-text-primary'}`}
                  style={{ fontVariantNumeric: 'tabular-nums' }}>
                {value}
            </span>
        </div>
    );
}

/**
 * Finans sekmesi (V4 tasarım dili).
 *
 * Üstte "Bütçe bağı" kartı (yalnız görevin bütçe kalemi ve planı varsa),
 * ardından para birimi başına üç KPI ve kayıt listesi.
 */
export function FinanceTab({ task }) {
    const expenses = task?.expenses || [];
    const incomes = task?.incomes || [];

    // Görev bütçesi ₺ defterde tutulur; gerçekleşen de oradan toplanır.
    const spentTry = expenses
        .filter((l) => (l.currency || 'TRY') === 'TRY')
        .reduce((a, l) => a + (l.amount || 0), 0);
    const budgetCard = <BudgetLinkCard task={task} spentByCurrency={spentTry} />;

    if (expenses.length === 0 && incomes.length === 0) {
        // Bütçe bağı kartı BURADA DA basılır: kaydı olmayan ama bütçesi planlanmış
        // görev, "kayıt yok" derken planını göstermeye devam etmeli.
        return (
            <div className="flex flex-col gap-4">
                {budgetCard}
                <div className={TAB_CARD}>
                    <TabCardHeader title="Görev Finansı" />
                    <TabEmptyState
                        icon="fa-coins"
                        title="Kayıt yok"
                        description="Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
                    />
                </div>
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
            {budgetCard}
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
