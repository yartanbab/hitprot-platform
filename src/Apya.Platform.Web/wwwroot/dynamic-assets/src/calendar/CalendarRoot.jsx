import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, EmptyState, Sheet, SheetContent, Skeleton } from '../components/ui';
import { cn } from '../lib/utils';
import { api } from '../lib/api/httpClient';
import { AgendaView } from './AgendaView';
import { DayPanel } from './DayPanel';
import { MonthGrid } from './MonthGrid';
import { SourceRail } from './SourceRail';
import { Toolbar } from './Toolbar';
import { WeekGrid } from './WeekGrid';
import { ItemDrawer } from './ItemDrawer';
import { SyncDrawer } from './SyncDrawer';
import { SmartDeferPanel } from './SmartDeferPanel';
import { SetupWizard } from './SetupWizard';
import { ShortcutHelp } from './ShortcutHelp';
import { Announcer } from './Announcer';
import { PrintView } from './PrintView';
import { TeamLayer } from './TeamLayer';
import { useCalendarFeed } from './hooks/useCalendarFeed';
import { useCalendarPrefs } from './hooks/useCalendarPrefs';
import { useCalendarMutations } from './hooks/useCalendarMutations';
import { useExternalEvents } from './hooks/useExternalEvents';
import { useCalendarPreferences } from './hooks/useCalendarPreferences';
import { useCalendarKeyboard } from './hooks/useCalendarKeyboard';
import { useTeamLoad } from './hooks/useTeamLoad';
import { useOfflineQueue } from './hooks/useOfflineQueue';
import { layoutOf, useContainerWidth } from './hooks/useContainerWidth';
import {
    MONTH_CELLS, addDays, dayLoad, fmt, groupByDay, isoDay, monthGridStart, stripTime, weekDays,
} from './lib/model';

/** Ajanda penceresi: geriye gecikmişleri, ileriye planı kapsar. */
const AGENDA_PAST_DAYS = 60;
const AGENDA_FUTURE_DAYS = 60;

/** Gezinme adımı görünüme göre değişir: ay görünümünde ay, haftada hafta, günde gün. */
function step(anchor, view, direction) {
    if (view === 'week') return addDays(anchor, 7 * direction);
    if (view === 'day') return addDays(anchor, direction);
    return new Date(anchor.getFullYear(), anchor.getMonth() + direction, 1);
}

function MonthSkeleton() {
    return (
        <div className="overflow-hidden rounded-card border border-default bg-surface-base" aria-hidden="true">
            <div className="grid grid-cols-7 border-b border-default bg-surface-raised">
                {Array.from({ length: 7 }, (_, i) => (
                    <div key={i} className="px-2.5 py-2"><Skeleton height={10} /></div>
                ))}
            </div>
            <div className="grid grid-cols-7">
                {Array.from({ length: MONTH_CELLS }, (_, i) => (
                    <div key={i} className="min-h-[96px] border-b border-r border-subtle p-1.5 last:border-r-0">
                        <Skeleton height={12} width="40%" className="ml-auto" />
                        {i % 3 === 0 && <Skeleton height={14} className="mt-2" />}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CalendarRoot() {
    const [containerRef, containerWidth] = useContainerWidth();
    const layout = layoutOf(containerWidth);
    const isNarrow = layout === 'narrow';

    const today = useMemo(() => stripTime(new Date()), []);
    const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedItemKey, setSelectedItemKey] = useState(null);
    const [syncOpen, setSyncOpen] = useState(false);
    const [deferOpen, setDeferOpen] = useState(false);
    const [setupDismissed, setSetupDismissed] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const [focusedDay, setFocusedDay] = useState(null);
    const [teamOpen, setTeamOpen] = useState(false);

    const { view, setView, applyResponsiveDefault, enabledSources, toggleSource, resetSources } =
        useCalendarPrefs();

    /* Dar kapta ajanda varsayılan: 42 hücrelik grid orada okunmaz. Karar kap
       ÖLÇÜLDÜKTEN sonra verilir (ilk render'da genişlik 0'dır) ve kullanıcının
       açık tercihini ezmez. */
    useEffect(() => {
        if (containerWidth === 0) return;
        applyResponsiveDefault(isNarrow ? 'agenda' : 'month');
    }, [containerWidth, isNarrow, applyResponsiveDefault]);

    /* Görünüme göre sorgulanacak aralık ve başlık. Hafta/Gün, ay grid'inden
       farklı bir pencere ister; ajanda ise bugünden akan sabit bir penceredir. */
    const { range, title, weekDayList } = useMemo(() => {
        if (view === 'agenda') {
            return {
                range: { from: addDays(today, -AGENDA_PAST_DAYS), to: addDays(today, AGENDA_FUTURE_DAYS) },
                title: 'Ajanda',
                weekDayList: null,
            };
        }
        if (view === 'week') {
            const days = weekDays(month);
            return {
                range: { from: days[0], to: days[6] },
                title: `${fmt.dayShort(days[0])} – ${fmt.dayShort(days[6])} ${days[6].getFullYear()}`,
                weekDayList: days,
            };
        }
        if (view === 'day') {
            const day = stripTime(month);
            return { range: { from: day, to: day }, title: fmt.dayTitle(day), weekDayList: [day] };
        }
        const start = monthGridStart(month);
        return {
            range: { from: start, to: addDays(start, MONTH_CELLS - 1) },
            title: fmt.monthTitle(month),
            weekDayList: null,
        };
    }, [view, month, today]);

    const { data, isPending, isError, refetch } = useCalendarFeed(range);
    /* Dış etkinlikler ayrı sorgudan gelir: yavaş/kırılgan dış çağrı grid'i bekletmesin. */
    const external = useExternalEvents(range);
    const preferences = useCalendarPreferences();
    const teamLoad = useTeamLoad({ from: range.from, to: range.to, enabled: teamOpen });

    /* Çevrimdışı kuyruk: bağlantı yokken taşımalar burada birikir, gelince gönderilir. */
    const offline = useOfflineQueue({
        onFlush: (entry) => api.post('/api/app/calendar/reschedule-item', entry.payload),
    });

    const allItems = useMemo(
        () => [...(data?.items ?? []), ...(external.data?.items ?? [])],
        [data, external.data],
    );
    const items = useMemo(
        () => allItems.filter((item) => enabledSources.has(item.source)),
        [allItems, enabledSources],
    );

    const byDay = useMemo(() => groupByDay(items), [items]);
    const capacity = data?.dailyCapacityHours ?? null;

    const counts = useMemo(() => {
        const map = {};
        for (const row of data?.sources ?? []) map[row.source] = row.count;
        return map;
    }, [data]);

    const overloadDays = useMemo(() => {
        if (!capacity) return 0;
        return Object.values(byDay).filter((dayItems) => dayLoad(dayItems) > capacity).length;
    }, [byDay, capacity]);

    /* Ay değişince seçili gün o ayda kalmaz — panel bayat veri göstermesin. */
    useEffect(() => {
        if (!selectedDay) return;
        if (!byDay[selectedDay] && !isPending) {
            const stillInRange = selectedDay >= isoDay(range.from) && selectedDay <= isoDay(range.to);
            if (!stillInRange) setSelectedDay(null);
        }
    }, [selectedDay, byDay, isPending, range]);

    /* Öğeye tıklamak listeye GİTMEZ, drawer açar (tasarım §3). Drawer içinde
       "ekranında aç" bağlantısı duruyor — bağlam kaybolmasın diye. */
    const openItem = useCallback((item) => setSelectedItemKey(item.key), []);

    /* Çapa BUGÜN'e alınır (ayın 1'ine değil): hafta/gün görünümü bugüne otursun. */
    const goToday = useCallback(() => {
        setMonth(today);
        setSelectedDay(isoDay(today));
    }, [today]);

    const mutations = useCalendarMutations({ onOfflineFailure: offline.enqueue });

    /* Klavye: sürükle-bırakla yapılabilen her şey klavyeyle de yapılabilmeli. */
    const deferFocusedDay = useCallback((days) => {
        const key = focusedDay ?? selectedDay;
        if (!key) return;
        for (const item of byDay[key] ?? []) {
            if (item.canReschedule && !item.isDone) {
                mutations.reschedule(item, addDays(new Date(`T00:00:00`), days));
            }
        }
    }, [focusedDay, selectedDay, byDay, mutations]);

    useCalendarKeyboard({
        onView: setView,
        onToday: goToday,
        onPrev: () => setMonth((m) => step(m, view, -1)),
        onNext: () => setMonth((m) => step(m, view, 1)),
        onDeferSelected: deferFocusedDay,
        onUndo: () => mutations.lastAction?.undo?.(),
        onToggleHelp: () => setHelpOpen((v) => !v),
    });

    const hasAnyData = allItems.length > 0;
    const filteredToEmpty = hasAnyData && items.length === 0;
    const selectedItems = selectedDay ? (byDay[selectedDay] ?? []) : [];
    /* Drawer'daki öğe cache'ten okunur: iyimser güncelleme sonrası drawer da
       anında yeni tarihi gösterir, ayrı bir kopya bayatlamaz. */
    const selectedItem = selectedItemKey
        ? allItems.find((i) => i.key === selectedItemKey) ?? null
        : null;

    const panel = selectedDay && (
        <DayPanel
            dayKey={selectedDay}
            items={selectedItems}
            capacity={capacity}
            onSelectItem={openItem}
            onClose={() => setSelectedDay(null)}
        />
    );

    return (
        <div ref={containerRef} className="flex flex-col gap-3">
            <Toolbar
                title={title}
                view={view}
                onView={setView}
                onPrev={() => setMonth((m) => step(m, view, -1))}
                onNext={() => setMonth((m) => step(m, view, 1))}
                onToday={goToday}
                overloadDays={overloadDays}
                onHelp={() => setHelpOpen(true)}
            />

            {isError && (
                <div className="rounded-card border border-negative-100 bg-negative-50 px-3 py-2.5 text-[12.5px] text-negative-700">
                    Takvim yüklenemedi.
                    <button type="button" onClick={() => refetch()} className="ml-2 font-semibold underline">
                        Yeniden dene
                    </button>
                </div>
            )}

            {/* Çevrimdışı şerit: değişiklik kaybolmadı, kuyrukta bekliyor. */}
            {(!offline.isOnline || offline.pendingCount > 0) && (
                <div
                    role="status"
                    aria-live="polite"
                    className="flex items-center gap-2 rounded-card border border-warning-100 bg-warning-50 px-3 py-2 text-[12.5px] text-warning-700"
                >
                    <i className={cn('fa', offline.isOnline ? 'fa-cloud-arrow-up' : 'fa-wifi')} aria-hidden="true" />
                    <span className="flex-1">
                        {offline.isOnline
                            ? `${offline.pendingCount} değişiklik gönderiliyor…`
                            : `Çevrimdışısınız — ${offline.pendingCount} değişiklik kuyrukta, bağlantı gelince gönderilecek.`}
                    </span>
                    {offline.isOnline && offline.pendingCount > 0 && (
                        <button type="button" onClick={offline.flush} className="font-semibold underline">
                            Şimdi gönder
                        </button>
                    )}
                </div>
            )}

            {/* Geri alma ŞERİDİ — toast değil: takvime bakarken kaybolan bir bildirim
                geri almayı imkânsız kılar (tasarım §4). */}
            {mutations.lastAction && (
                <div
                    className="flex items-center gap-2 rounded-card border border-subtle bg-surface-raised px-3 py-2 text-[12.5px] text-text-secondary"
                    role="status"
                    aria-live="polite"
                >
                    <i className="fa fa-clock-rotate-left text-text-tertiary" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{mutations.lastAction.message}</span>
                    {mutations.lastAction.undo && (
                        <button
                            type="button"
                            onClick={() => { mutations.lastAction.undo(); mutations.dismissAction(); }}
                            className="font-semibold text-text-link hover:underline"
                        >
                            Geri al
                        </button>
                    )}
                    <button
                        type="button" onClick={mutations.dismissAction} aria-label="Şeridi kapat"
                        className="rounded p-1 text-text-tertiary hover:bg-surface-hover"
                    >
                        <i className="fa fa-xmark" aria-hidden="true" />
                    </button>
                </div>
            )}

            <div className={cn('flex gap-3', isNarrow ? 'flex-col' : 'flex-row items-start')}>
                {!isNarrow && (
                    <div className={cn('shrink-0', layout === 'wide' ? 'w-[240px]' : 'w-auto')}>
                        <SourceRail
                            sources={data?.sources ?? []}
                            counts={counts}
                            enabled={enabledSources}
                            onToggle={toggleSource}
                            compact={layout !== 'wide'}
                            externalAccounts={external.data?.accounts ?? []}
                            externalLoading={external.isFetching}
                            onOpenSync={() => setSyncOpen(true)}
                            teamOpen={teamOpen}
                            onToggleTeam={() => setTeamOpen((v) => !v)}
                            teamContent={teamOpen ? (
                                <TeamLayer
                                    rows={teamLoad.data}
                                    days={weekDayList}
                                    capacity={capacity}
                                    loading={teamLoad.isPending}
                                />
                            ) : null}
                        />
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    {isPending ? (
                        <MonthSkeleton />
                    ) : filteredToEmpty ? (
                        <div className="rounded-card border border-subtle bg-surface-base p-6">
                            <EmptyState
                                icon={<i className="fa fa-filter-circle-xmark" />}
                                title="Bu filtreyle gösterilecek öğe yok"
                                description="Kaynak rayında kapattığınız türler bu aralıktaki tüm öğeleri gizliyor."
                                action={<Button size="sm" variant="outline" onClick={resetSources}>Kaynakları aç</Button>}
                            />
                        </div>
                    ) : !hasAnyData ? (
                        <div className="rounded-card border border-subtle bg-surface-base p-6">
                            <EmptyState
                                icon={<i className="fa fa-calendar-plus" />}
                                title="Bu aralıkta planlanmış bir şey yok"
                                description="Son tarihi olan görevler, fatura vadeleri, hibe son tarihleri ve tarihli finans kayıtları burada birlikte görünür."
                                action={<Button size="sm" variant="outline" onClick={() => { window.location.href = '/Tasks'; }}>Görev oluştur</Button>}
                            />
                        </div>
                    ) : view === 'month' ? (
                        <MonthGrid
                            month={month}
                            byDay={byDay}
                            today={today}
                            capacity={capacity}
                            selectedDay={selectedDay}
                            onSelectItem={openItem}
                            onSelectDay={setSelectedDay}
                            onDropItem={mutations.reschedule}
                            focusedDay={focusedDay}
                            onFocusDay={setFocusedDay}
                            onNavigate={(date) => setMonth(date)}
                            pending={mutations.pending}
                            errors={mutations.errors}
                        />
                    ) : weekDayList ? (
                        <WeekGrid
                            days={weekDayList}
                            byDay={byDay}
                            today={today}
                            capacity={capacity}
                            selectedDay={selectedDay}
                            onSelectItem={openItem}
                            onSelectDay={setSelectedDay}
                        />
                    ) : (
                        <AgendaView
                            items={items}
                            today={today}
                            onSelectItem={openItem}
                            onSmartDefer={() => setDeferOpen(true)}
                        />
                    )}
                </div>

                {/* Geniş kapta panel yan yana durur; dar kapta takvimin üstüne biner. */}
                {layout === 'wide' && selectedDay && (
                    <div className="w-[340px] shrink-0 self-stretch">{panel}</div>
                )}
            </div>

            {layout === 'medium' && selectedDay && (
                <Sheet open onOpenChange={(open) => { if (!open) setSelectedDay(null); }}>
                    <SheetContent side="right" title="Gün detayı" className="w-[380px] p-0">{panel}</SheetContent>
                </Sheet>
            )}

            {isNarrow && selectedDay && (
                <Sheet open onOpenChange={(open) => { if (!open) setSelectedDay(null); }}>
                    <SheetContent side="bottom" title="Gün detayı" className="max-h-[80vh] p-0">{panel}</SheetContent>
                </Sheet>
            )}

            {/* Baskı çıktısı yalnız  print içinde görünür; ekranda yer kaplamaz. */}
            <PrintView
                items={items}
                month={month}
                today={today}
                generatedAt={fmt.dayShort(today)}
            />

            <ShortcutHelp open={helpOpen} onClose={() => setHelpOpen(false)} />

            {/* Duyurular: taşıma nazik, senkron hatası ısrarlı. */}
            <Announcer
                polite={mutations.lastAction?.message ?? ''}
                assertive={external.data?.accounts?.find((a) => a.error)?.error ?? ''}
            />

            <SyncDrawer open={syncOpen} onClose={() => setSyncOpen(false)} />

            <SmartDeferPanel
                open={deferOpen}
                items={items}
                today={today}
                capacity={capacity}
                onClose={() => setDeferOpen(false)}
            />

            {/* Kurulum yalnız HİÇ yapılmadıysa ve tercihler yüklendiyse açılır. */}
            <SetupWizard
                open={preferences.data ? !preferences.data.setupCompleted && !setupDismissed : false}
                counts={counts}
                onDone={() => setSetupDismissed(true)}
            />

            {selectedItem && (
                <ItemDrawer
                    item={selectedItem}
                    capacity={capacity}
                    onClose={() => setSelectedItemKey(null)}
                    onReschedule={mutations.reschedule}
                    onComplete={mutations.complete}
                    isPending={!!mutations.pending[selectedItem.key]}
                    error={mutations.errors[selectedItem.key]}
                    onRetry={() => mutations.clearError(selectedItem.key)}
                />
            )}
        </div>
    );
}
