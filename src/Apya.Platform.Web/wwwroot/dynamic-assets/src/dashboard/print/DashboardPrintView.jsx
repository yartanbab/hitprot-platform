import React, { useEffect, useMemo } from 'react';

import {
    useSummary, useStatistics, useDeliveries, useProjectHealth,
    usePendingApprovals, useBlockedTasks, useIncomeExpense, useDeliveryHeatmap,
} from '../hooks/useDashboard';
import { VIEWS, DEFAULT_VIEW } from '../layouts/viewPresets';
import { STAT_GROUPS } from '../cards/StatisticsBand';
import { GROUP_ORDER, GROUP_LABEL } from '../cards/DeliveriesCard';
import { STATE_BADGE } from '../cards/ProjectHealthCard';
import { REASON } from '../cards/BlockersCard';
import { readPrintContext, resolvePeriod, formatPeriod, formatStamp } from './printMeta';
import { formatMoney } from '../../lib/utils';
import { t, currentLocale } from '../../lib/i18n';

/**
 * A4 YATAY baskı çıktısı — üç bölüm: (1) özet + istatistikler, (2) iş yükü,
 * (3) finans + teslim yoğunluğu.
 *
 * EKRANDAN İKİ FARKI VAR, ikisi de bilinçli:
 *
 * 1. KIRPMA YOK. Ekranda kartlar kutuya sığsın diye kısaltır (teslimler ilk
 *    4 proje, tıkananlar ilk 3, onaylar ilk 4, istatistikler TEK sekme).
 *    Kağıtta kaydırma yoktur; kısaltılan satır kaybolur. Bu yüzden baskı her
 *    listenin TAMAMINI ve istatistiklerin BEŞ grubunu birden basar.
 *
 * 2. AKTİF GÖRÜNÜMDEN BAĞIMSIZ. Ekranda hangi kartların durduğuna kullanıcının
 *    düzeni karar verir; çıktı ise dönemin tam tablosu olmalı, o yüzden sekiz
 *    bölümün hepsi basılır. Bunun bedeli ekranda olmayan kartların ek sorgusudur
 *    — bu yüzden bileşen sayfayla birlikte DEĞİL, yalnız "Yazdır"a basınca
 *    mount edilir (bkz DashboardRoot).
 *
 * Renk baskıda SADELEŞİR (index.css dolguları iptal eder): durum rozet rengiyle
 * değil METİNLE anlatılır, siyah-beyaz çıktıda da okunsun diye.
 */

const RANGE_LABEL = {
    Week:    ['Dashboard:Range:Week',    'Bu hafta'],
    Month:   ['Dashboard:Range:Month',   'Bu ay'],
    Quarter: ['Dashboard:Range:Quarter', 'Bu çeyrek'],
};

/* Ekranda teslim durumu renkli NOKTA ile anlatılıyor (DeliveriesCard.STATE_DOT);
   kağıtta nokta bir şey söylemez, metin karşılığı yalnız baskıda gerekir. */
const DELIVERY_STATE_LABEL = {
    Overdue:  ['Dashboard:Print:State:Overdue',  'Gecikmiş'],
    InReview: ['Dashboard:Print:State:InReview', 'Kontrolde'],
    OnTrack:  ['Dashboard:Print:State:OnTrack',  'Yolunda'],
    Upcoming: ['Dashboard:Print:State:Upcoming', 'Yaklaşan'],
};

const TREND_SYMBOL = { Up: '▲', Down: '▼', Flat: '•' };

const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const TH = 'border-b border-neutral-500 pb-1 pe-3 text-start text-[7pt] font-bold uppercase tracking-wide text-neutral-600';
const TD = 'border-b border-neutral-200 py-[3px] pe-3 align-top text-[8.5pt] leading-tight';
const TD_NUM = `${TD} text-end font-mono tabular-nums whitespace-nowrap`;

function DashboardPrintView({ viewKey, range, onReady }) {
    const filter = useMemo(() => ({ range }), [range]);

    const summary = useSummary(filter);
    const statistics = useStatistics(filter);
    const deliveries = useDeliveries(filter);
    const health = useProjectHealth(filter);
    const approvals = usePendingApprovals();
    const blockers = useBlockedTasks();
    const incomeExpense = useIncomeExpense(filter);
    const heatmap = useDeliveryHeatmap(filter);

    /* HAZIR = her sorgu bir sonuca bağlandı; başarı da hata da sayılır.
       Hatalıyı beklemek baskıyı süresiz kilitlerdi — o bölüm "Veri alınamadı."
       basar, kalan yedi bölüm kağıda çıkar. */
    const settled = [summary, statistics, deliveries, health, approvals, blockers, incomeExpense, heatmap]
        .every((query) => query.status !== 'pending');

    useEffect(() => {
        if (settled) onReady?.();
    }, [settled, onReady]);

    const locale = currentLocale();
    const context = useMemo(() => readPrintContext(), []);
    /* Damga mount anında donar: "yazdırılma zamanı" bu, sonraki render'larda kaymamalı. */
    const stamp = useMemo(() => formatStamp(new Date(), locale), [locale]);
    const period = useMemo(() => resolvePeriod(range), [range]);

    const view = VIEWS.find((v) => v.key === viewKey)
        ?? VIEWS.find((v) => v.key === DEFAULT_VIEW)
        ?? VIEWS[0];
    const [rangeKey, rangeFallback] = RANGE_LABEL[range] ?? RANGE_LABEL.Month;

    const head = {
        tenantName: context?.tenantName,
        userName: context?.userName,
        viewLabel: t(view.labelKey, view.fallback),
        rangeLabel: `${t(rangeKey, rangeFallback)} · ${formatPeriod(period, locale)}`,
        stamp,
    };

    return (
        <div className="apya-print-root hidden print:block">
            <section className="apya-print-page">
                <PageHead {...head} part={t('Dashboard:Print:Part1', 'Özet & istatistikler')} />
                <SummaryBlock query={summary} locale={locale} />
                <StatisticsBlock query={statistics} />
            </section>

            <section className="apya-print-page apya-print-break">
                <PageHead {...head} part={t('Dashboard:Print:Part2', 'İş yükü')} />
                <DeliveriesBlock query={deliveries} locale={locale} />
                <HealthBlock query={health} />
                <BlockersBlock query={blockers} />
            </section>

            <section className="apya-print-page apya-print-break">
                <PageHead {...head} part={t('Dashboard:Print:Part3', 'Finans & teslim yoğunluğu')} />
                <ApprovalsBlock query={approvals} locale={locale} />
                <IncomeExpenseBlock query={incomeExpense} locale={locale} />
                <HeatmapBlock query={heatmap} locale={locale} />
            </section>
        </div>
    );
}

/**
 * Künye — her bölümün üstünde TEKRARLANIR. Sayfalar birbirinden ayrılabilir
 * (zımbalanmamış çıktı, tek sayfa fotokopisi); ikinci sayfa tek başına kalınca
 * hangi kuruma ve hangi döneme ait olduğu okunamazsa çıktı bağlamsızdır.
 *
 * Sayfa NUMARASI yazılmaz: listeler sınırsız uzunlukta, üç bölüm üç kağıda
 * sığmayabilir — "Sayfa 1 / 3" yalan olurdu. Yerine bölüm adı yazılır.
 */
function PageHead({ tenantName, userName, viewLabel, rangeLabel, stamp, part }) {
    return (
        <header className="flex items-end justify-between gap-6 border-b-2 border-black pb-2 break-after-avoid">
            <div className="min-w-0">
                <p className="text-[8pt] font-bold uppercase tracking-widest text-neutral-500">
                    {t('Dashboard:Print:Eyebrow', 'APYA · Genel Bakış')}
                </p>
                <h1 className="mt-1 text-[20pt] font-semibold leading-none">
                    {tenantName || t('Dashboard:Title', 'Genel Bakış')}
                </h1>
                <p className="mt-1.5 text-[8.5pt] text-neutral-600">
                    {t('Dashboard:Print:Meta:Period', 'Dönem')}: <strong className="font-semibold">{rangeLabel}</strong>
                    {' · '}
                    {t('Dashboard:Print:Meta:View', 'Görünüm')}: <strong className="font-semibold">{viewLabel}</strong>
                </p>
            </div>
            <div className="flex-none text-end text-[8pt] leading-snug text-neutral-500">
                <p className="text-[9pt] font-semibold uppercase tracking-wide text-neutral-700">{part}</p>
                {userName && <p className="mt-1">{t('Dashboard:Print:Meta:By', 'Yazdıran')}: {userName}</p>}
                <p>{t('Dashboard:Print:Meta:At', '{0} tarihinde oluşturuldu', stamp)}</p>
                <p>{t('Dashboard:Print:Meta:Scope', 'Liste ve istatistikler kırpılmadan basılır')}</p>
            </div>
        </header>
    );
}

/** Bölüm çerçevesi — hata ve boşluk durumunu tek yerde çözer. */
function Section({ title, meta, query, isEmpty, emptyText, children }) {
    return (
        <section className="mt-4">
            <div className="flex items-baseline justify-between gap-3 border-b border-black pb-1 break-after-avoid">
                <h2 className="text-[10pt] font-bold uppercase tracking-wide">{title}</h2>
                {meta && <span className="text-[8pt] text-neutral-600">{meta}</span>}
            </div>
            {query?.isError
                ? <Note>{t('Dashboard:Print:SectionError', 'Veri alınamadı.')}</Note>
                : isEmpty
                    ? <Note>{emptyText}</Note>
                    : <div className="mt-1.5">{children}</div>}
        </section>
    );
}

function Note({ children }) {
    return <p className="mt-1.5 text-[8.5pt] italic text-neutral-500">{children}</p>;
}

/* ─────────────────────────── Sayısal özet ─────────────────────────── */

function SummaryBlock({ query, locale }) {
    const data = query.data;

    return (
        <Section
            title={t('Dashboard:Card:SummaryStrip', 'Sayısal özet')}
            query={query}
            isEmpty={!data}
            emptyText={t('Dashboard:Summary:Error', 'Özet yüklenemedi.')}
        >
            {data && (
                <div className="grid grid-cols-5 border-s border-t border-neutral-400 break-inside-avoid">
                    <SummaryTile
                        label={t('Dashboard:Summary:DueThisPeriod', 'Bu dönem teslim')}
                        value={data.dueThisPeriod}
                        note={t('Dashboard:Summary:DueThisWeek', '{0} bu hafta', data.dueThisWeek)}
                    />
                    <SummaryTile
                        label={t('Dashboard:Summary:Overdue', 'Gecikmiş')}
                        value={data.overdue}
                        note={[
                            data.oldestOverdueDays != null
                                ? t('Dashboard:Summary:OldestOverdue', 'en eski {0} g', data.oldestOverdueDays)
                                : null,
                            t('Dashboard:Summary:OverdueProjects', '{0} projede', data.overdueProjectCount),
                        ].filter(Boolean).join(' · ')}
                    />
                    <SummaryTile
                        label={t('Dashboard:Summary:Blocked', 'Tıkanan iş')}
                        value={data.blocked}
                        note={t('Dashboard:Summary:BlockedAvg', 'ort. {0} g', round(data.blockedAvgIdleDays, 1))}
                    />
                    <SummaryTile
                        label={t('Dashboard:Summary:PendingApprovals', 'Bende onay')}
                        value={data.pendingApprovals}
                        locked={data.pendingApprovals == null}
                        permission="Platform.Invoices"
                        note={[
                            data.pendingApprovalAmount != null
                                ? formatMoney(data.pendingApprovalAmount, data.currency, locale)
                                : null,
                            data.pendingApprovalAvgAgeHours != null
                                ? t('Dashboard:Summary:AvgWait', 'ortalama bekleme {0} sa', round(data.pendingApprovalAvgAgeHours, 0))
                                : null,
                        ].filter(Boolean).join(' · ')}
                    />
                    <SummaryTile
                        label={t('Dashboard:Summary:BudgetUsage', 'Bütçe kullanımı')}
                        value={data.budgetUsedRatio != null ? `%${Math.round(data.budgetUsedRatio * 100)}` : null}
                        locked={data.budgetUsedRatio == null && data.budgetTotal == null}
                        permission="Platform.Projects.ViewBudget"
                        note={data.budgetTotal != null
                            ? `${formatMoney(data.budgetSpent, data.currency, locale)} / ${formatMoney(data.budgetTotal, data.currency, locale)}`
                            : null}
                    />
                </div>
            )}
        </Section>
    );
}

/** Kilitli kutucuk sayı YAZMAZ — sunucu değeri hiç göndermedi, uydurulmaz. */
function SummaryTile({ label, value, note, locked, permission }) {
    return (
        <div className="border-b border-e border-neutral-400 p-2">
            <p className="text-[8pt] font-medium text-neutral-600">{label}</p>
            <p className="mt-1 font-mono text-[17pt] font-semibold leading-none tabular-nums">
                {locked ? '— —' : (value ?? '—')}
            </p>
            {locked
                ? (
                    <p className="mt-1 text-[7.5pt] text-neutral-500">
                        {t('Dashboard:Stat:Locked', 'yetki gerekli')} · <span className="font-mono">{permission}</span>
                    </p>
                )
                : note && <p className="mt-1 text-[7.5pt] text-neutral-500">{note}</p>}
        </div>
    );
}

/* ─────────────────────────── İstatistikler ─────────────────────────── */

/** Ekranda TEK sekme görünür; kağıtta beş grubun tamamı arka arkaya basılır. */
function StatisticsBlock({ query }) {
    const stats = query.data ?? [];
    const lockedCount = stats.filter((s) => s.locked).length;

    return (
        <Section
            title={t('Dashboard:Statistics:Title', 'İstatistikler')}
            meta={stats.length > 0
                ? t('Dashboard:Statistics:Subtitle', "{0} istatistikten {1}'i yetkinde · {2}'si kilitli",
                    stats.length, stats.length - lockedCount, lockedCount)
                : null}
            query={query}
            isEmpty={stats.length === 0}
            emptyText={t('Dashboard:Print:Statistics:Empty', 'Bu dönem için istatistik üretilmedi.')}
        >
            <div className="columns-2 gap-6">
                {STAT_GROUPS.map(([group, key, fallback]) => {
                    const rows = stats.filter((s) => s.group === group);
                    if (rows.length === 0) return null;
                    return (
                        <div key={group} className="mb-3 break-inside-avoid">
                            <p className="text-[8.5pt] font-bold uppercase tracking-wide">{t(key, fallback)}</p>
                            <table className="mt-1 w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className={TH}>{t('Dashboard:Print:Col:Stat', 'İstatistik')}</th>
                                        <th className={`${TH} text-end`}>{t('Dashboard:Print:Col:Value', 'Değer')}</th>
                                        <th className={`${TH} text-end`}>{t('Dashboard:Print:Col:Delta', 'Değişim')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((stat) => (
                                        <tr key={stat.key}>
                                            <td className={TD}>
                                                {stat.label}
                                                <span className="block font-mono text-[6.5pt] text-neutral-400">
                                                    {stat.requiredPermission}
                                                </span>
                                            </td>
                                            <td className={TD_NUM}>
                                                {stat.locked ? '— —' : (stat.formatted || '—')}
                                            </td>
                                            <td className={TD_NUM}>
                                                {stat.locked
                                                    ? t('Dashboard:Stat:Locked', 'yetki gerekli')
                                                    : stat.deltaFormatted
                                                        ? `${TREND_SYMBOL[stat.trend] ?? TREND_SYMBOL.Flat} ${stat.deltaFormatted}`
                                                        : TREND_SYMBOL.Flat}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>
        </Section>
    );
}

/* ─────────────────────────── Teslimler ─────────────────────────── */

/** Ekranda hafta grupları listelenir; kağıtta aynı gruplama + TÜM satırlar. */
function DeliveriesBlock({ query, locale }) {
    const items = query.data ?? [];
    const overdue = items.filter((i) => i.state === 'Overdue').length;

    return (
        <Section
            title={t('Dashboard:Deliveries:Title', 'Bu ay teslim edilecekler')}
            meta={items.length > 0
                ? t('Dashboard:Deliveries:Subtitle', '{0} iş · {1} gecikmiş', items.length, overdue)
                : null}
            query={query}
            isEmpty={items.length === 0}
            emptyText={t('Dashboard:Deliveries:EmptyDescription', 'Son tarihi bu döneme düşen açık iş bulunmuyor.')}
        >
            {GROUP_ORDER.map((groupKey) => {
                const rows = items.filter((i) => i.groupKey === groupKey);
                if (rows.length === 0) return null;
                const [key, fallback] = GROUP_LABEL[groupKey];
                return (
                    <div key={groupKey} className="mb-2">
                        <p className="text-[8.5pt] font-bold uppercase tracking-wide break-after-avoid">
                            {t(key, fallback)} · {rows.length}
                        </p>
                        <table className="mt-1 w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className={`${TH} w-[14px]`} aria-hidden="true" />
                                    <th className={TH}>{t('Dashboard:Print:Col:Task', 'İş')}</th>
                                    <th className={TH}>{t('Dashboard:Print:Col:Project', 'Proje')}</th>
                                    <th className={TH}>{t('Dashboard:Print:Col:Assignee', 'Sorumlu')}</th>
                                    <th className={TH}>{t('Dashboard:Print:Col:State', 'Durum')}</th>
                                    <th className={`${TH} text-end`}>{t('Dashboard:Print:Col:Due', 'Son tarih')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((item) => {
                                    const [stateKey, stateFallback] =
                                        DELIVERY_STATE_LABEL[item.state] ?? DELIVERY_STATE_LABEL.Upcoming;
                                    return (
                                        <tr key={item.taskId}>
                                            <td className={TD}><Checkbox /></td>
                                            <td className={`${TD} ${item.state === 'Overdue' ? 'font-semibold' : ''}`}>
                                                {item.title}
                                            </td>
                                            <td className={TD}>{item.projectName || '—'}</td>
                                            <td className={TD}>{item.assigneeName || '—'}</td>
                                            <td className={TD}>
                                                {t(stateKey, stateFallback)}
                                                {item.state === 'Overdue' && item.overdueDays != null
                                                    && ` · ${t('Dashboard:Deliveries:OverdueDays', '{0} gün gecikmiş', item.overdueDays)}`}
                                            </td>
                                            <td className={TD_NUM}>{formatDate(item.dueDate, locale)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </Section>
    );
}

/** Kağıt üstünde işaretlenecek kutu — takvim çıktısındaki desenle aynı. */
function Checkbox() {
    return <span className="mt-[2px] block h-[9px] w-[9px] border border-neutral-600" aria-hidden="true" />;
}

/* ─────────────────────────── Proje sağlığı ─────────────────────────── */

/** Ekranda ilk 4 proje çizilir (VISIBLE_ROWS); kağıtta hepsi. */
function HealthBlock({ query }) {
    const projects = query.data ?? [];

    return (
        <Section
            title={t('Dashboard:Health:Title', 'Proje sağlığı')}
            meta={projects.length > 0 ? t('Dashboard:Health:Subtitle', '{0} aktif proje', projects.length) : null}
            query={query}
            isEmpty={projects.length === 0}
            emptyText={t('Dashboard:Health:EmptyDescription', 'Proje oluşturunca sağlık göstergeleri burada belirir.')}
        >
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className={TH}>{t('Dashboard:Print:Col:Project', 'Proje')}</th>
                        <th className={TH}>{t('Dashboard:Print:Col:State', 'Durum')}</th>
                        <th className={`${TH} text-end`}>{t('Dashboard:Print:Col:DaysLeft', 'Kalan gün')}</th>
                        <th className={`${TH} text-end`}>{t('Dashboard:Print:Col:Budget', 'Bütçe')}</th>
                        <th className={`${TH} text-end`}>{t('Dashboard:Print:Col:Time', 'Süre')}</th>
                        <th className={`${TH} text-end`}>{t('Dashboard:Print:Col:Tasks', 'Görev')}</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => {
                        const [, stateKey, stateFallback] = STATE_BADGE[project.state] ?? STATE_BADGE.Healthy;
                        return (
                            <tr key={project.projectId}>
                                <td className={TD}>{project.name}</td>
                                <td className={`${TD} ${project.state === 'Risky' ? 'font-semibold' : ''}`}>
                                    {t(stateKey, stateFallback)}
                                </td>
                                <td className={TD_NUM}>{project.daysRemaining ?? '—'}</td>
                                <td className={TD_NUM}>{percent(project.budgetRatio)}</td>
                                <td className={TD_NUM}>{percent(project.timeRatio)}</td>
                                <td className={TD_NUM}>{project.tasksDone}/{project.tasksTotal}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Section>
    );
}

/* ─────────────────────────── Tıkananlar ─────────────────────────── */

/** Ekranda ilk 3 satır çizilir; kağıtta hepsi. */
function BlockersBlock({ query }) {
    const items = query.data ?? [];

    return (
        <Section
            title={t('Dashboard:Blockers:Title', 'Tıkanan işler & risk')}
            meta={items.length > 0 ? t('Dashboard:Print:Count', '{0} kayıt', items.length) : null}
            query={query}
            isEmpty={items.length === 0}
            emptyText={t('Dashboard:Blockers:EmptyDescription', 'Açık işlerin hepsi son günlerde hareket görmüş.')}
        >
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className={`${TH} w-[14px]`} aria-hidden="true" />
                        <th className={TH}>{t('Dashboard:Print:Col:Code', 'Kod')}</th>
                        <th className={TH}>{t('Dashboard:Print:Col:Task', 'İş')}</th>
                        <th className={TH}>{t('Dashboard:Print:Col:Reason', 'Sebep')}</th>
                        <th className={`${TH} text-end`}>{t('Dashboard:Print:Col:Idle', 'Hareketsiz')}</th>
                        <th className={`${TH} text-end`}>{t('Dashboard:Print:Col:Dependents', 'Bağımlı')}</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => {
                        const [, reasonKey, reasonFallback] = REASON[item.blockReason] ?? REASON.Dependency;
                        return (
                            <tr key={item.taskId}>
                                <td className={TD}><Checkbox /></td>
                                <td className={`${TD} font-mono`}>{item.code}</td>
                                <td className={TD}>{item.title}</td>
                                <td className={TD}>{t(reasonKey, reasonFallback)}</td>
                                <td className={TD_NUM}>{t('Dashboard:Health:DaysLeft', '{0} gün', item.idleDays)}</td>
                                <td className={TD_NUM}>{item.dependentCount}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Section>
    );
}

/* ─────────────────────────── Onaylar ─────────────────────────── */

/** Ekranda ilk 4 satır çizilir; kağıtta hepsi + toplam. */
function ApprovalsBlock({ query, locale }) {
    const items = query.data ?? [];
    const total = items.reduce((sum, i) => sum + (i.amount ?? 0), 0);
    const avgAge = items.length
        ? Math.round(items.reduce((sum, i) => sum + i.ageHours, 0) / items.length)
        : 0;
    const currency = items[0]?.currency ?? 'TRY';

    return (
        <Section
            title={t('Dashboard:Approvals:Title', 'Bende bekleyen kararlar')}
            meta={items.length > 0
                ? t('Dashboard:Approvals:Total', 'Toplam {0} · ort. bekleme {1} sa', formatMoney(total, currency, locale), avgAge)
                : null}
            query={query}
            isEmpty={items.length === 0}
            emptyText={t('Dashboard:Approvals:EmptyDescription', 'Taslak durumdaki fatura bulunmuyor.')}
        >
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className={`${TH} w-[14px]`} aria-hidden="true" />
                        <th className={TH}>{t('Dashboard:Print:Col:Record', 'Kayıt')}</th>
                        <th className={TH}>{t('Dashboard:Print:Col:Requester', 'Talep eden')}</th>
                        <th className={`${TH} text-end`}>{t('Dashboard:Print:Col:Age', 'Bekleme')}</th>
                        <th className={`${TH} text-end`}>{t('Dashboard:Print:Col:Amount', 'Tutar')}</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td className={TD}><Checkbox /></td>
                            <td className={TD}>{item.title}</td>
                            <td className={TD}>{item.requesterName || '—'}</td>
                            <td className={TD_NUM}>{item.ageHours} sa</td>
                            <td className={TD_NUM}>{formatMoney(item.amount, item.currency, locale)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Section>
    );
}

/* ─────────────────────────── Gelir / gider ─────────────────────────── */

/** Ekranda 6 ay bar grafiği; kağıtta aynı 6 ay SAYIYLA — bar okunmaz, rakam okunur. */
function IncomeExpenseBlock({ query, locale }) {
    const data = query.data;
    const points = data?.points ?? [];
    const currency = data?.currency ?? 'TRY';
    const hasValues = points.some((p) => p.income > 0 || p.expense > 0);

    return (
        <Section
            title={t('Dashboard:IncomeExpense:Title', 'Gelir / gider')}
            meta={t('Dashboard:IncomeExpense:Subtitle', 'Son 6 ay')}
            query={query}
            isEmpty={!hasValues}
            emptyText={t('Dashboard:IncomeExpense:EmptyDescription', 'Son 6 ayda gelir veya gider kaydı bulunmuyor.')}
        >
            <table className="w-full border-collapse break-inside-avoid">
                <thead>
                    <tr>
                        <th className={TH}>{t('Dashboard:Print:Col:Month', 'Ay')}</th>
                        <th className={`${TH} text-end`}>{t('Dashboard:IncomeExpense:Income', 'Gelir')}</th>
                        <th className={`${TH} text-end`}>{t('Dashboard:IncomeExpense:Expense', 'Gider')}</th>
                        <th className={`${TH} text-end`}>{t('Dashboard:IncomeExpense:Net', 'net')}</th>
                    </tr>
                </thead>
                <tbody>
                    {points.map((point) => (
                        <tr key={point.month}>
                            <td className={TD}>{formatMonth(point.month, locale)}</td>
                            <td className={TD_NUM}>{formatMoney(point.income, currency, locale)}</td>
                            <td className={TD_NUM}>{formatMoney(point.expense, currency, locale)}</td>
                            <td className={TD_NUM}>{formatMoney(point.income - point.expense, currency, locale)}</td>
                        </tr>
                    ))}
                    <tr>
                        <td className={`${TD} font-semibold`} colSpan={3}>
                            {t('Dashboard:Print:PeriodNet', 'Dönem neti')}
                        </td>
                        <td className={`${TD_NUM} font-semibold`}>
                            {formatMoney(data?.net ?? 0, currency, locale)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </Section>
    );
}

/* ─────────────────────────── Teslim yoğunluğu ─────────────────────────── */

/** Ekranda renk kademeli ısı takvimi; kağıtta aynı ızgara SAYIYLA. */
function HeatmapBlock({ query, locale }) {
    const cells = query.data ?? [];
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    const busiest = cells.reduce((best, cell) => (cell.count > (best?.count ?? 0) ? cell : best), null);

    return (
        <Section
            title={t('Dashboard:Heatmap:Title', 'Teslim yoğunluğu')}
            meta={t('Dashboard:Heatmap:Subtitle', 'Önümüzdeki 4 hafta · hafta × gün')}
            query={query}
            isEmpty={cells.length === 0}
            emptyText={t('Dashboard:Heatmap:EmptyDescription', 'Önümüzdeki 4 haftada son tarihi olan iş bulunmuyor.')}
        >
            <table className="w-full border-collapse break-inside-avoid">
                <thead>
                    <tr>
                        {WEEKDAYS.map((day) => (
                            <th key={day} className={`${TH} text-center`}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {weeks.map((week) => (
                        <tr key={week[0].date}>
                            {week.map((cell) => (
                                <td key={cell.date} className={`${TD} text-center`}>
                                    <span className="block font-mono text-[7pt] text-neutral-500">
                                        {formatDate(cell.date, locale)}
                                        {cell.isGrantDeadline ? ' ✱' : ''}
                                    </span>
                                    <span className={`block font-mono tabular-nums ${cell.count > 0 ? 'font-semibold' : 'text-neutral-400'}`}>
                                        {cell.count}
                                    </span>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="mt-1 text-[7.5pt] text-neutral-500">
                {busiest && busiest.count > 0
                    ? t('Dashboard:Heatmap:Busiest', 'En yoğun gün {0} ({1} teslim) · sarı: hibe son tarihi',
                        formatDate(busiest.date, locale), busiest.count)
                    : t('Dashboard:Heatmap:NoneScheduled', 'Bu pencerede teslim planlanmamış · sarı: hibe son tarihi')}
                {' · '}
                {t('Dashboard:Print:GrantMark', '✱ hibe son tarihi')}
            </p>
        </Section>
    );
}

/* ─────────────────────────── Biçimlendirme ─────────────────────────── */

function formatDate(value, locale) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

function formatMonth(value, locale) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}

function percent(ratio) {
    return ratio == null ? '—' : `%${Math.round(ratio * 100)}`;
}

function round(value, digits) {
    if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
    return digits > 0 ? Number(value.toFixed(digits)) : Math.round(value);
}

export { DashboardPrintView };
