import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Responsive } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { CardShell } from './cards/CardShell';
import { CardCatalog } from './catalog/CardCatalog';
import {
    CARD_REGISTRY, VIEWS, DEFAULT_VIEW,
    GRID_BREAKPOINTS, GRID_COLS, GRID_ROW_HEIGHT, GRID_MARGIN, GRID_CONTAINER_PADDING,
    tierFromWidth, fullWidthCardWidth, stripLayoutFor,
    readViewPreference, writeViewPreference,
} from './layouts/viewPresets';
import { useDashboardLayout, useSaveLayout, useResetLayout } from './hooks/useDashboardLayout';
import { DashboardPrintView } from './print/DashboardPrintView';
import { CHART_TYPE_NUMBER_TREND } from './hooks/enums';

import { Button } from '../components/ui';
import { cn } from '../lib/utils';
import { t } from '../lib/i18n';

const RANGES = [
    ['Month',   'Dashboard:Range:Month',   'Bu ay'],
    ['Week',    'Dashboard:Range:Week',    'Bu hafta'],
    ['Quarter', 'Dashboard:Range:Quarter', 'Bu çeyrek'],
];

/**
 * Dashboard kökü — sayfa başlığı + görünüm sekmeleri + düzenleme modu + ızgara.
 *
 * Düzen SUNUCUDA saklanır (kullanıcı + görünüm). Kayıt yoksa sunucu görünümün
 * yerleşik varsayılanını döner ve `isDefault` işaretler.
 */
function DashboardRoot() {
    const [viewKey, setViewKey] = useState(() => readViewPreference());
    const [range, setRange] = useState(() => readRangeFromUrl());
    const [editMode, setEditMode] = useState(false);
    const [catalogOpen, setCatalogOpen] = useState(false);
    const [draftCards, setDraftCards] = useState(null); /* düzenleme modunda kaydedilmemiş düzen */
    /* 'idle' → baskı görünümü hiç mount edilmedi (sekiz sorgusunun hiçbiri atılmadı);
       'preparing' → mount edildi, veriler bekleniyor; 'ready' → en az bir kez basıldı. */
    const [printState, setPrintState] = useState('idle');
    const printedRef = useRef(false);

    const layoutQuery = useDashboardLayout(viewKey);
    const saveLayout = useSaveLayout();
    const resetLayout = useResetLayout();

    const filter = useMemo(() => ({ range }), [range]);

    /* Sunucudan gelen düzen; düzenleme modunda taslak varsa o geçerli. */
    const cards = draftCards ?? layoutQuery.data?.cards ?? [];

    /* TEK ÖLÇÜM KAYNAĞI.
       `WidthProvider` KULLANILMIYOR: state.width'i sabit 1280 ile başlatıyor ve
       gerçek genişliği yalnız kendi ResizeObserver'ı ateşlenirse düzeltiyordu.
       Kabı burada bir kez ölçüyoruz ve aynı sayı üç yeri birden besliyor:
       RGL'in piksel matematiğini (`width`), kırılım/kolon seçimini ve özet
       şeridinin kutucuk düzeni + yüksekliğini. Böylece "ızgara kaba göre,
       kart içi viewport'a göre karar veriyor" çelişkisi ortadan kalkıyor. */
    const gridHostRef = useRef(null);
    const [gridWidth, setGridWidth] = useState(null);

    useLayoutEffect(() => {
        const host = gridHostRef.current;
        if (!host) return undefined;

        const measure = () => setGridWidth(host.clientWidth);
        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(host);
        return () => observer.disconnect();
    }, []);

    const tier = gridWidth == null ? null : tierFromWidth(gridWidth);
    const strip = useMemo(
        () => stripLayoutFor(gridWidth == null ? 0 : fullWidthCardWidth(gridWidth)),
        [gridWidth],
    );

    /* RGL YALNIZ masaüstü kırılımında render edilir (aşağıya bakın). Tablet ve
       mobil düzenler artık RGL'in sabit-piksel ızgarasından TÜRETİLMİYOR; doğal
       akışlı `NativeStack` çiziyor. Sabit yükseklik (h×64px) dar ekranda içerikle
       uyuşmayıp kartları üst üste bindiriyordu — kullanıcının bildirdiği hata buydu.
       Bu yüzden yalnız desktop düzenini hazırlıyoruz.
       Özet şeridinin yüksekliği kutucuk satır sayısını takip etmeli (strip.h). */
    const layouts = useMemo(
        () => ({ desktop: cards.map((card) => toGridItem(card, strip.h)) }),
        [cards, strip.h],
    );

    /* Baskı görünümü ekrandaki kartlardan BAĞIMSIZ, sekiz bölümü birden basar.
       Sayfayla birlikte mount edilseydi görünümde OLMAYAN kartların sorguları da
       her açılışta atılırdı — düzenin sayfaya gömülmesiyle kazanılan turu geri
       verirdi (bkz IndexModel). Bu yüzden mount ilk 'Yazdır'a ertelenir. */
    const handlePrint = useCallback(() => {
        if (printState === 'ready') { window.print(); return; }
        setPrintState((current) => (current === 'idle' ? 'preparing' : current));
    }, [printState]);

    /* Veriler oturunca baskı diyaloğunu BİR KEZ aç. requestAnimationFrame şart:
       DOM commit edildi ama tarayıcı henüz düzenlemedi; aynı tik içinde print()
       çağırmak yarım çizilmiş çıktı riski taşıyor. */
    const handlePrintReady = useCallback(() => {
        if (printedRef.current) return;
        printedRef.current = true;
        setPrintState('ready');
        window.requestAnimationFrame(() => window.print());
    }, []);

    const handleViewChange = useCallback((next) => {
        setViewKey(next);
        writeViewPreference(next);
        setDraftCards(null);
        setEditMode(false);
    }, []);

    const handleLayoutChange = useCallback((currentLayout) => {
        if (!editMode) return; /* Düzenleme kapalıyken sürükleme zaten yok */
        /* RGL zaten yalnız masaüstünde render ediliyor; bu savunma amaçlı: dar
           kırılımlar NativeStack ile çizildiği için kaydedilecek koordinat yok. */
        if (tier !== 'desktop') return;
        setDraftCards((previous) => {
            const source = previous ?? cards;
            return currentLayout.map((item) => {
                const existing = source.find((c) => c.cardKey === item.i);
                return {
                    cardKey: item.i,
                    /* Enum SAYI olarak gidip gelir; string göndermek
                       deserialization hatası verir (JsonStringEnumConverter yok). */
                    chartType: existing?.chartType ?? CHART_TYPE_NUMBER_TREND,
                    x: item.x, y: item.y, w: item.w, h: item.h,
                };
            });
        });
    }, [editMode, cards, tier]);

    /* Düzen yalnız masaüstü kırılımında anlamlı — dar ekranda kartlar zaten
       türetilmiş tek/çift kolona diziliyor, sürüklemenin kaydedilecek karşılığı yok. */
    const canEdit = tier === 'desktop';

    const handleSave = useCallback(() => {
        saveLayout.mutate(
            { viewKey, cards: draftCards ?? cards },
            { onSuccess: () => { setDraftCards(null); setEditMode(false); } },
        );
    }, [saveLayout, viewKey, draftCards, cards]);

    const handleReset = useCallback(() => {
        resetLayout.mutate(viewKey, {
            onSuccess: () => { setDraftCards(null); setEditMode(false); },
        });
    }, [resetLayout, viewKey]);

    const handleAddCard = useCallback((cardKey) => {
        const meta = CARD_REGISTRY[cardKey];
        if (!meta) return;
        const source = draftCards ?? cards;
        const nextY = source.reduce((max, c) => Math.max(max, c.y + c.h), 0);
        setDraftCards([
            ...source,
            { cardKey, chartType: CHART_TYPE_NUMBER_TREND, x: 0, y: nextY, w: meta.w, h: meta.h },
        ]);
        setCatalogOpen(false);
        setEditMode(true);
    }, [draftCards, cards]);

    const handleRemoveCard = useCallback((cardKey) => {
        const source = draftCards ?? cards;
        setDraftCards(source.filter((c) => c.cardKey !== cardKey));
    }, [draftCards, cards]);

    return (
        <div className="min-h-screen bg-surface-app-bg">
            <PageHeader
                viewKey={viewKey}
                onViewChange={handleViewChange}
                range={range}
                onRangeChange={setRange}
                editMode={editMode}
                canEdit={canEdit}
                onToggleEdit={() => setEditMode((v) => !v)}
                onOpenCatalog={() => setCatalogOpen(true)}
                onPrint={handlePrint}
                printState={printState}
            />

            {editMode && (
                <EditToolbar
                    onSave={handleSave}
                    isSaving={saveLayout.isPending}
                />
            )}

            {/* Boşluk hiyerarşisi (kullanıcı kararı):
                  sol/sağ/alt kenar 18px — TEK kaynak burası; ızgaranın kendi
                    kenar dolgusu kapalı (bkz GRID_CONTAINER_PADDING)
                  başlık → ilk kart 16px
                  kart ↔ kart 12px (GRID_MARGIN) — kenar boşluğundan DAHA DAR,
                  böylece kartlar tek blok gibi okunur, başlık ayrışır. */}
            <main className="px-[18px] pt-4 pb-[18px] mobile:px-3">
                {/* Ölçüm kabı — hem RGL'in `width`'i hem de kırılım (tier) kararı bu
                    düğümün ölçülen genişliğinden gelir. */}
                <div ref={gridHostRef}>
                {gridWidth != null && (tier === 'desktop' ? (
                <Responsive
                    width={gridWidth}
                    className={cn('apya-dashboard-grid', editMode && 'apya-dashboard-grid--edit')}
                    layouts={layouts}
                    breakpoints={GRID_BREAKPOINTS}
                    cols={GRID_COLS}
                    rowHeight={GRID_ROW_HEIGHT}
                    margin={GRID_MARGIN}
                    containerPadding={GRID_CONTAINER_PADDING}
                    isDraggable={editMode}
                    isResizable={editMode}
                    draggableHandle={`.${CardShell.DRAG_HANDLE_CLASS}`}
                    onLayoutChange={handleLayoutChange}
                    compactType="vertical"
                    preventCollision={false}
                >
                    {cards.map((card) => {
                        const meta = CARD_REGISTRY[card.cardKey];
                        if (!meta) return <div key={card.cardKey} />;
                        const Card = meta.component;
                        return (
                            <div key={card.cardKey} className="relative">
                                <Card
                                    filter={filter}
                                    editMode={editMode}
                                    {...(card.cardKey === 'summary-strip' ? { template: strip.template, compact: strip.compact } : null)}
                                />
                                {editMode && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCard(card.cardKey)}
                                        aria-label={t('Dashboard:RemoveCard', 'Kartı kaldır')}
                                        className={cn(
                                            'absolute top-2 right-2 z-10 w-6 h-6 rounded-lg',
                                            'bg-surface-base border border-default text-text-secondary',
                                            'hover:text-negative-500 hover:border-strong',
                                            'focus-visible:outline-none focus-visible:shadow-focus',
                                        )}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </Responsive>
                ) : (
                    <NativeStack tier={tier} cards={cards} filter={filter} strip={strip} />
                ))}
                </div>

                {/* Izgara ile alt şerit arası da kart↔kart boşluğuyla aynı (12px). */}
                <FooterStrip
                    isDefault={layoutQuery.data?.isDefault !== false}
                    canEdit={canEdit}
                    onReset={handleReset}
                    onOpenCatalog={() => setCatalogOpen(true)}
                    isResetting={resetLayout.isPending}
                />
            </main>

            {/* Ekranda görünmez (hidden print:block) — yalnız kağıda çıkar. */}
            {printState !== 'idle' && (
                <DashboardPrintView viewKey={viewKey} range={range} onReady={handlePrintReady} />
            )}

            <CardCatalog
                open={catalogOpen}
                onOpenChange={setCatalogOpen}
                presentCardKeys={cards.map((c) => c.cardKey)}
                onAdd={handleAddCard}
            />
        </div>
    );
}

/**
 * Masaüstü altı (tablet + mobil) yerleşim — RGL YERİNE doğal akışlı CSS ızgarası.
 *
 * Kartlar DOĞAL yükseklikte akar; sabit piksel yükseklik (RGL'in h×64px'i) yok,
 * dolayısıyla içerik dar ekranda uzasa bile kutuya sığmayıp alttaki karta binmez —
 * kullanıcının bildirdiği "havada duran, üst üste binen kartlar" hatasının kök nedeni
 * buydu. Düzenleme/sürükleme zaten yalnız masaüstünde aktif olduğu için burada kayıp yok.
 *   - mobil (tek kolon): her kart tam satır, doğal yükseklik.
 *   - tablet (iki kolon): kartlar ikişerli akar; şerit kartları (band) tam satır kaplar.
 * `strip` şablonu DashboardRoot'ta kabın genişliğinden türetilir; burada yalnız aktarılır.
 */
function NativeStack({ tier, cards, filter, strip }) {
    const columns = tier === 'tablet' ? 2 : 1;
    return (
        <div
            className={cn('grid items-stretch', tier === 'tablet' ? 'gap-3.5' : 'gap-3')}
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
            {cards.map((card) => {
                const meta = CARD_REGISTRY[card.cardKey];
                if (!meta) return null;
                const Card = meta.component;
                const spanFull = columns > 1 && meta.band;
                return (
                    <div key={card.cardKey} style={spanFull ? { gridColumn: '1 / -1' } : undefined}>
                        <Card
                            filter={filter}
                            editMode={false}
                            {...(card.cardKey === 'summary-strip' ? { template: strip.template, compact: strip.compact } : null)}
                        />
                    </div>
                );
            })}
        </div>
    );
}

function PageHeader({
    viewKey, onViewChange, range, onRangeChange,
    editMode, canEdit, onToggleEdit, onOpenCatalog, onPrint, printState,
}) {
    const activeView = VIEWS.find((v) => v.key === viewKey) ?? VIEWS[0];

    /* Yatay dolgu `main` ile AYNI (18px): başlık, kartların sol/sağ rayına
       hizalanmazsa şerit kaymış görünüyor. */
    return (
        <header className="px-[18px] pt-4 pb-3 bg-surface-base border-b border-default flex items-end justify-between gap-5 mobile:px-3 mobile:flex-col mobile:items-stretch mobile:gap-3">
            <div className="flex flex-col gap-2.5 min-w-0">
                <div className="flex items-center gap-2.5">
                    <h1 className="text-[22px] font-semibold tracking-[-0.025em] text-text-primary m-0">
                        {t('Dashboard:Title', 'Genel Bakış')}
                    </h1>
                    {/* Rozet mobilde gizli: aktif görünümü zaten dropdown gösteriyor. */}
                    <span className="inline-flex items-center h-[22px] px-[9px] rounded-full bg-accent-soft text-accent-600 text-[11.5px] font-semibold flex-none mobile:hidden">
                        {t(activeView.labelKey, activeView.fallback)}
                    </span>
                </div>

                {/* Sekmeler mobilde çok yer kaplıyordu (4 sekme 2 satıra sarıyordu) —
                    dar ekranda gizlenir, yerini alttaki ViewSelect dropdown'ı alır. */}
                <nav className="flex items-center gap-1 flex-wrap mobile:hidden" aria-label={t('Dashboard:Views', 'Görünümler')}>
                    {VIEWS.map((view) => (
                        <button
                            key={view.key}
                            type="button"
                            onClick={() => onViewChange(view.key)}
                            aria-current={view.key === viewKey ? 'page' : undefined}
                            className={cn(
                                'inline-flex items-center h-[30px] px-3 rounded-[9px] text-[12.5px] transition-colors duration-fast',
                                'focus-visible:outline-none focus-visible:shadow-focus',
                                view.key === viewKey
                                    ? 'bg-text-primary text-surface-base font-semibold'
                                    : 'text-text-secondary font-medium hover:bg-surface-sunken hover:text-text-primary',
                            )}
                        >
                            {t(view.labelKey, view.fallback)}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-2 flex-none mobile:flex-wrap">
                <ViewSelect value={viewKey} onChange={onViewChange} />
                <RangeSelect value={range} onChange={onRangeChange} />
                {/* Düzenleme düğmelerinin AKSİNE dar ekranda da durur: çıktı almak
                    masaüstüne özgü bir iş değil. */}
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={onPrint}
                    disabled={printState === 'preparing'}
                    title={t('Dashboard:Print:Hint', 'A4 yatay · tüm bölümler, kırpılmadan')}
                >
                    {printState === 'preparing'
                        ? t('Dashboard:Print:Preparing', 'Hazırlanıyor…')
                        : t('Dashboard:Print:Action', 'Yazdır')}
                </Button>
                {canEdit && (
                    <>
                        <Button size="sm" variant="secondary" onClick={onOpenCatalog}>
                            {t('Dashboard:AddCard', '+ Kart ekle')}
                        </Button>
                        <Button size="sm" variant="primary" onClick={onToggleEdit}>
                            {editMode ? t('Common:Done', 'Bitir') : t('Common:Edit', 'Düzenle')}
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
}

/* Görünüm seçimi — YALNIZ mobilde görünür; geniş ekranda sekmeler (nav) iş görür. */
function ViewSelect({ value, onChange }) {
    return (
        <label className="hidden mobile:inline-flex items-center flex-1 min-w-0">
            <span className="sr-only">{t('Dashboard:SelectView', 'Görünüm seç')}</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    'h-8 w-full px-3 rounded-[9px] text-[12.5px] font-medium',
                    'bg-surface-sunken text-text-secondary border-0',
                    'focus-visible:outline-none focus-visible:shadow-focus',
                )}
            >
                {VIEWS.map((view) => (
                    <option key={view.key} value={view.key}>{t(view.labelKey, view.fallback)}</option>
                ))}
            </select>
        </label>
    );
}

function RangeSelect({ value, onChange }) {
    return (
        <label className="inline-flex items-center">
            <span className="sr-only">{t('Dashboard:SelectRange', 'Zaman aralığı seç')}</span>
            <select
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    writeRangeToUrl(e.target.value);
                }}
                className={cn(
                    'h-8 px-3 rounded-[9px] text-[12.5px] font-medium',
                    'bg-surface-sunken text-text-secondary border-0',
                    'focus-visible:outline-none focus-visible:shadow-focus',
                )}
            >
                {RANGES.map(([key, labelKey, fallback]) => (
                    <option key={key} value={key}>{t(labelKey, fallback)}</option>
                ))}
            </select>
        </label>
    );
}

function EditToolbar({ onSave, isSaving }) {
    return (
        <div className="flex items-center justify-between gap-3 px-6 py-2.5 bg-accent-soft border-b border-default mobile:px-3 mobile:flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center h-[26px] px-2.5 rounded-lg bg-accent text-white text-[11.5px] font-semibold">
                    {t('Dashboard:EditMode', 'Düzenleme modu')}
                </span>
                <span className="inline-flex items-center h-[26px] px-2.5 rounded-lg bg-surface-base border border-default text-accent-600 text-[11.5px]">
                    {t('Dashboard:EditMode:Snap', 'Yapış: 12 kolon · 64px satır')}
                </span>
            </div>
            <div className="flex items-center gap-3.5">
                <span className="font-mono text-[11px] text-accent-600 mobile:hidden">
                    {t('Dashboard:EditMode:Hint', 'Kartı başlıktaki ⠿ tutamağından sürükle')}
                </span>
                <Button size="sm" variant="primary" onClick={onSave} disabled={isSaving}>
                    {t('Dashboard:EditMode:Save', 'Düzeni kaydet')}
                </Button>
            </div>
        </div>
    );
}

function FooterStrip({ isDefault, canEdit, onReset, onOpenCatalog, isResetting }) {
    return (
        <div className="flex items-center justify-between gap-3 mt-3 px-4 py-3 rounded-card border border-dashed border-default bg-surface-base mobile:flex-col mobile:items-stretch">
            <span className="text-[12.5px] text-text-secondary">
                {isDefault
                    ? t('Dashboard:Footer:DefaultLayout', 'Bu görünüm rol varsayılanından geldi — kart ekleyip çıkarabilir, sürükleyip boyutlandırabilirsin.')
                    : t('Dashboard:Footer:CustomLayout', 'Bu görünümü sen düzenledin. Dilediğin an varsayılana dönebilirsin.')}
            </span>
            <div className="flex items-center gap-2 flex-none">
                {!isDefault && (
                    <Button size="sm" variant="secondary" onClick={onReset} disabled={isResetting}>
                        {t('Dashboard:Footer:Reset', 'Varsayılana dön')}
                    </Button>
                )}
                {canEdit && (
                    <Button size="sm" variant="primary" onClick={onOpenCatalog}>
                        {t('Dashboard:AddCard', '+ Kart ekle')}
                    </Button>
                )}
            </div>
        </div>
    );
}

function toGridItem(card, stripHeight) {
    const meta = CARD_REGISTRY[card.cardKey];
    /* Şeridin yüksekliği kullanıcıdan değil ölçümden gelir: kayıtlı düzendeki
       h bayat kalabilir (kutucuk satır sayısı ekran genişliğiyle değişiyor). */
    const isStrip = card.cardKey === 'summary-strip';
    return {
        i: card.cardKey,
        x: card.x, y: card.y, w: card.w,
        h: isStrip ? stripHeight : card.h,
        minW: meta?.minW ?? 2,
        minH: isStrip ? stripHeight : (meta?.minH ?? 2),
    };
}

/* Zaman aralığı URL'de taşınır — paylaşılan link aynı pencereyi açsın. */
function readRangeFromUrl() {
    try {
        const value = new URLSearchParams(window.location.search).get('range');
        return RANGES.some(([key]) => key === value) ? value : 'Month';
    } catch {
        return 'Month';
    }
}

function writeRangeToUrl(range) {
    try {
        const params = new URLSearchParams(window.location.search);
        params.set('range', range);
        window.history.replaceState(null, '', `${window.location.pathname}?${params}`);
    } catch {
        /* history yazılamıyorsa aralık yalnız bileşen state'inde kalır. */
    }
}

export { DashboardRoot };
