import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TAB_CARD, TAB_CARD_UNCLIPPED, TabCardHeader, TabEmptyState, RowBadge, fmtShortDate } from '../v3/tabPrimitives';
import { Button, Combobox, MoneyInput } from '../../components/ui';
import { isGranted } from '../hooks/useTaskDetail';
import { useProjectBudgetLines } from '../hooks/useProjectBudgetLines';

function fmtMoney(amount, currency) {
    const cur = currency || 'TRY';
    try {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: cur, minimumFractionDigits: 2 }).format(amount || 0);
    } catch {
        return `${(amount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${cur}`.trim();
    }
}

/**
 * Gider/gelir kaydını AÇMAK için mevcut ABP modallerini kullanırız — React'te
 * ikinci bir finans formu YAZMIYORUZ. Modaller zaten görevden açılmak üzere
 * yazılmış: `?TaskId=` geldiğinde görevin projesini de önden seçiyorlar
 * (bkz. Pages/Expenses/CreateModal.cshtml.cs).
 *
 * Kayıt kapanınca görev detayı tazelenir; yeni satır sekmede belirir.
 */
function openFinanceModal(page, taskId, onSaved) {
    const manager = window?.abp?.ModalManager;
    if (!manager) {
        window?.abp?.notify?.error?.('Kayıt formu yüklenemedi.');
        return;
    }
    const appPath = window?.abp?.appPath ?? '/';
    const modal = new manager({ viewUrl: `${appPath}${page}?TaskId=${taskId}` });
    modal.onResult(() => onSaved?.());
    modal.open();
}

/** Sekme başlığındaki "Gider ekle" / "Gelir ekle" — her biri kendi izniyle. */
function FinanceActions({ taskId }) {
    const queryClient = useQueryClient();
    const canAddExpense = isGranted('Platform.Expenses.Create');
    const canAddIncome = isGranted('Platform.Incomes.Create');

    if (!taskId || (!canAddExpense && !canAddIncome)) { return null; }

    const refresh = () => queryClient.invalidateQueries({ queryKey: ['task-detail', taskId] });

    return (
        <div className="flex shrink-0 items-center gap-2">
            {canAddExpense && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openFinanceModal('Expenses/CreateModal', taskId, refresh)}
                >
                    <i className="fa-solid fa-arrow-up text-[11px]" />
                    Gider ekle
                </Button>
            )}
            {canAddIncome && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openFinanceModal('Incomes/CreateModal', taskId, refresh)}
                >
                    <i className="fa-solid fa-arrow-down text-[11px]" />
                    Gelir ekle
                </Button>
            )}
        </div>
    );
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
 * Kalem + görev bütçesi girişi.
 *
 * Lookup gelene kadar HİÇBİR ŞEY basılmaz: yükleme anında "kalem tanımlı değil"
 * yazmak, kalemi olan projede de bir an yanlış bilgi gösterirdi.
 */
function BudgetLinkEditor({ options, isLoading, lineId, planned, onField }) {
    if (isLoading) { return null; }

    if (options.length === 0) {
        return (
            <p className="m-0 text-[12px] text-text-tertiary">
                Bu projede bütçe kalemi tanımlı değil — kalemler Finans &amp; Bütçe ekranından açılır.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
            <label className="flex flex-col gap-1.5">
                <span className="text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary">
                    Bütçe kalemi
                </span>
                <Combobox
                    options={options}
                    value={lineId ?? undefined}
                    onChange={(value) => onField('budgetLineId', value ?? null)}
                    placeholder="Kalem seç"
                    size="sm"
                />
            </label>
            <label className="flex flex-col gap-1.5">
                <span className="text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary">
                    Görev bütçesi
                </span>
                <MoneyInput
                    value={planned}
                    onValueChange={(value) => onField('plannedAmount', value)}
                    currency="TRY"
                    min={0}
                    size="sm"
                    disabled={!lineId}
                />
            </label>
        </div>
    );
}

/**
 * "Bütçe bağı" kartı (tasarım 4a).
 *
 * İKİ KİP:
 *  - Düzenlenebilir: `form` geldi, görev bir projeye bağlı ve kullanıcıda
 *    `Projects.ViewBudget` var. Kalem ve görev bütçesi buradan atanır; değer
 *    detayın ORTAK form state'ine yazılır, footer'daki Kaydet ile kalıcı olur.
 *    (Ayrı bir kaydet düğmesi kullanıcının o an açık diğer düzenlemelerini
 *    yarım kaydederdi.)
 *  - Salt okunur: yetki/proje yoksa yalnız mevcut bağın özeti basılır; bağ da
 *    yoksa kart hiç görünmez.
 *
 * TASARIMDAN BİLİNÇLİ SAPMA: prototip DÖRT hücre gösteriyor
 * (bütçe · taahhüt · gerçekleşen · kalan); burada ÜÇ var. "Taahhüt" onay
 * bekleyen sipariş/talep demek ve arkasında bir varlık yok — eklenseydi
 * ekranda hep 0 gösteren bir hücre olurdu.
 */
function BudgetLinkCard({ task, form, spentByCurrency }) {
    const projectId = (form ? form.values.projectId : task?.projectId) ?? null;
    const { options, lines, canViewBudget, isLoading } = useProjectBudgetLines(projectId);

    const editable = Boolean(form) && canViewBudget && Boolean(projectId);
    const lineId = (form ? form.values.budgetLineId : task?.budgetLineId) ?? null;
    const planned = (form ? form.values.plannedAmount : task?.plannedAmount) ?? null;

    if (!editable && (!lineId || planned == null)) { return null; }

    // Kalem değiştirildiğinde DTO'daki "kalemde kalan" bayatlar; lookup elde
    // varsa seçili kalemin kendi kalanı kullanılır.
    const selectedLine = lines.find((l) => l.id === lineId);
    const lineRemaining = selectedLine ? selectedLine.remainingAmount : task?.budgetLineRemaining;

    // Görevin planı proje para birimindedir; gerçekleşen de aynı defterden
    // okunur (₺). Çapraz kur toplamı YAPILMAZ.
    const spent = spentByCurrency;
    const hasPlan = Boolean(lineId) && planned != null;
    const remaining = (planned ?? 0) - spent;
    const pct = planned > 0 ? Math.round((spent / planned) * 100) : 0;
    const over = remaining < 0;

    const clearLink = () => {
        form.setField('budgetLineId', null);
        form.setField('plannedAmount', null);
    };

    return (
        /* Kırpmayan kart ŞART: kalem seçicisinin listesi kartın içine absolute
           konumlanır, TAB_CARD'ın overflow-hidden'ı onu alt kenarda keserdi. */
        <div className={TAB_CARD_UNCLIPPED}>
            <TabCardHeader
                title="Bütçe bağı"
                action={editable && lineId ? (
                    <Button type="button" variant="ghost" size="sm" onClick={clearLink}>
                        Bağı kaldır
                    </Button>
                ) : null}
            />
            <div className="px-4 pb-4 pt-1 flex flex-col gap-3">
                {editable ? (
                    <BudgetLinkEditor
                        options={options}
                        isLoading={isLoading}
                        lineId={lineId}
                        planned={planned}
                        onField={form.setField}
                    />
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-semibold text-accent">
                            {task.budgetLineName || 'Bütçe kalemi'}
                        </span>
                    </div>
                )}

                {lineRemaining != null && (
                    <span className="text-[11px] text-text-tertiary">
                        kalemde kalan {fmtMoney(lineRemaining, 'TRY')}
                    </span>
                )}

                {hasPlan && (
                    <>
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
                    </>
                )}
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
export function FinanceTab({ task, taskId, form }) {
    const expenses = task?.expenses || [];
    const incomes = task?.incomes || [];

    // Görev bütçesi ₺ defterde tutulur; gerçekleşen de oradan toplanır.
    const spentTry = expenses
        .filter((l) => (l.currency || 'TRY') === 'TRY')
        .reduce((a, l) => a + (l.amount || 0), 0);
    const budgetCard = <BudgetLinkCard task={task} form={form} spentByCurrency={spentTry} />;
    const actions = <FinanceActions taskId={taskId ?? task?.id} />;

    if (expenses.length === 0 && incomes.length === 0) {
        // Bütçe bağı kartı BURADA DA basılır: kaydı olmayan ama bütçesi planlanmış
        // görev, "kayıt yok" derken planını göstermeye devam etmeli.
        return (
            <div className="flex flex-col gap-4">
                {budgetCard}
                <div className={TAB_CARD}>
                    <TabCardHeader title="Görev Finansı" action={actions} />
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
                <TabCardHeader title="Finans kalemleri" action={actions} />
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
                Buradan eklenen kayıt göreve ve projesine etiketlenir; düzenleme/silme Finans modülünden yapılır.
            </p>
        </div>
    );
}
