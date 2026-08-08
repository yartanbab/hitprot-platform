import React from 'react';

function fmtMoney(amount, currency) {
    const cur = currency || 'TRY';
    try {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: cur, minimumFractionDigits: 2 }).format(amount || 0);
    } catch {
        return `${(amount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${cur}`.trim();
    }
}

function fmtDate(d) {
    if (!d) return '';
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? '' : new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(dt);
}

/** Görev finansı — göreve etiketlenmiş gerçek gider/gelirler (backend'de izinle gate'lenir).
 *  Para birimine göre gruplar; çapraz-kur toplama yapmaz. */
export function FinanceTab({ task }) {
    const expenses = task?.expenses || [];
    const incomes = task?.incomes || [];

    if (expenses.length === 0 && incomes.length === 0) {
        return (
            <div className="rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs">
                <div className="flex items-center gap-2.5 border-b border-subtle pb-4 mb-4">
                    <i className="fa-solid fa-coins text-success text-base" />
                    <h3 className="text-[15px] font-bold text-text-primary">Görev Finansı</h3>
                </div>
                <p className="text-[13px] text-text-tertiary py-2">
                    Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor).
                </p>
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
        <div className="rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs flex flex-col gap-5">
            <div className="flex items-center gap-2.5 border-b border-subtle pb-4">
                <i className="fa-solid fa-coins text-success text-base" />
                <h3 className="text-[15px] font-bold text-text-primary">Görev Finansı</h3>
            </div>

            {perCurrency.map(({ cur, inc, exp, net }) => (
                <div key={cur} className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-subtle p-3 bg-surface-sunken/40">
                        <p className="text-xs text-text-tertiary">Toplam Gelir ({cur})</p>
                        <p className="text-base font-semibold text-success">{fmtMoney(inc, cur)}</p>
                    </div>
                    <div className="rounded-xl border border-subtle p-3 bg-surface-sunken/40">
                        <p className="text-xs text-text-tertiary">Toplam Gider ({cur})</p>
                        <p className="text-base font-semibold text-negative">{fmtMoney(exp, cur)}</p>
                    </div>
                    <div className="rounded-xl border border-subtle p-3 bg-surface-sunken/40">
                        <p className="text-xs text-text-tertiary">Net Bakiye ({cur})</p>
                        <p className={`text-base font-semibold ${net >= 0 ? 'text-success' : 'text-negative'}`}>{fmtMoney(net, cur)}</p>
                    </div>
                </div>
            ))}

            <div className="flex flex-col divide-y divide-subtle/50 rounded-xl border border-subtle overflow-hidden">
                {lines.map((l) => (
                    <div key={`${l.kind}-${l.id}`} className="flex items-center justify-between px-3.5 py-2.5 bg-surface-base">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${l.kind === 'income' ? 'text-success bg-success-subtle' : 'text-negative bg-negative-subtle'}`}>
                                <i className={`fa-solid ${l.kind === 'income' ? 'fa-plus' : 'fa-minus'}`} />
                            </span>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[13px] font-medium text-text-primary truncate">{l.title || (l.kind === 'income' ? 'Gelir' : 'Gider')}</span>
                                <span className="text-[11px] text-text-tertiary">{fmtDate(l.date)}</span>
                            </div>
                        </div>
                        <span className={`text-[13px] font-semibold shrink-0 ${l.kind === 'income' ? 'text-success' : 'text-negative'}`}>
                            {l.kind === 'income' ? '+' : '−'}{fmtMoney(l.amount, l.currency)}
                        </span>
                    </div>
                ))}
            </div>

            <p className="text-[11px] text-text-tertiary">Kayıtlar Finans modülünden yönetilir; buraya göreve etiketlenmiş gider/gelirler yansır.</p>
        </div>
    );
}
