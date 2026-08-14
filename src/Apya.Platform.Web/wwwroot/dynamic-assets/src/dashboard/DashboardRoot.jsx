import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { CardShell } from './cards/CardShell';
import { CardCatalog } from './catalog/CardCatalog';
import {
    CARD_REGISTRY, VIEWS, DEFAULT_VIEW,
    GRID_BREAKPOINTS, GRID_COLS, GRID_ROW_HEIGHT, GRID_MARGIN,
    readViewPreference, writeViewPreference,
} from './layouts/viewPresets';
import { useDashboardLayout, useSaveLayout, useResetLayout } from './hooks/useDashboardLayout';
import { CHART_TYPE_NUMBER_TREND } from './hooks/enums';

import { Button } from '../components/ui';
import { cn } from '../lib/utils';
import { t } from '../lib/i18n';

const ResponsiveGridLayout = WidthProvider(Responsive);

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

    const layoutQuery = useDashboardLayout(viewKey);
    const saveLayout = useSaveLayout();
    const resetLayout = useResetLayout();

    const filter = useMemo(() => ({ range }), [range]);

    /* Sunucudan gelen düzen; düzenleme modunda taslak varsa o geçerli. */
    const cards = draftCards ?? layoutQuery.data?.cards ?? [];

    /* WidthProvider state.width'i sabit 1280 ile başlatır ve gerçek genişliği
       yalnız ResizeObserver callback'i ateşlenirse günceller (bkz node_modules/
       react-grid-layout/build/components/WidthProvider.js). #apya-dashboard-root
       negatif margin + sidebar layout'u yüzünden gerçek genişlik 1280'den farklı;
       callback hiç ateşlenmezse grid tüm kartları 1280 varsayarak taşırır.
       Fix: ilk paint sonrası TEK SEFERLİK key değişimiyle grid'i remount et →
       WidthProvider'ın componentDidMount'ı (dolayısıyla ResizeObserver.observe)
       yeniden, bu kez layout oturmuşken çalışır. */
    const [gridMountKey, setGridMountKey] = useState(0);
    useEffect(() => {
        const raf = requestAnimationFrame(() => setGridMountKey(1));
        return () => cancelAnimationFrame(raf);
    }, []);

    const layouts = useMemo(() => {
        const desktop = cards.map(toGridItem);
        return {
            desktop,
            /* Tablet: 8 kolon — genişlikler kırpılır, sıra korunur. */
            tablet: desktop.map((item) => ({ ...item, w: Math.min(item.w, 8) })),
            /* Mobil tek kolon: tasarım sırası y'ye göre. */
            mobile: desktop
                .slice()
                .sort((a, b) => a.y - b.y || a.x - b.x)
                .map((item, index) => ({ ...item, x: 0, y: index, w: 1 })),
        };
    }, [cards]);

    const handleViewChange = useCallback((next) => {
        setViewKey(next);
        writeViewPreference(next);
        setDraftCards(null);
        setEditMode(false);
    }, []);

    const handleLayoutChange = useCallback((currentLayout) => {
        if (!editMode) return; /* Düzenleme kapalıyken sürükleme zaten yok */
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
    }, [editMode, cards]);

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
                onToggleEdit={() => setEditMode((v) => !v)}
                onOpenCatalog={() => setCatalogOpen(true)}
            />

            {editMode && (
                <EditToolbar
                    onSave={handleSave}
                    isSaving={saveLayout.isPending}
                />
            )}

            {/* Boşluk hiyerarşisi (kullanıcı kararı):
                  sol/üst kenar 16px — kartlar sol raya yakın dursun
                  başlık → ilk kart 16px
                  kart ↔ kart 10px (GRID_MARGIN) — başlık mesafesinden DAHA DAR,
                  böylece kartlar tek blok gibi okunur, başlık ayrışır. */}
            <main className="px-4 pt-4 pb-4 mobile:px-3">
                <ResponsiveGridLayout
                    key={gridMountKey}
                    className={cn('apya-dashboard-grid', editMode && 'apya-dashboard-grid--edit')}
                    layouts={layouts}
                    breakpoints={GRID_BREAKPOINTS}
                    cols={GRID_COLS}
                    rowHeight={GRID_ROW_HEIGHT}
                    margin={GRID_MARGIN}
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
                                <Card filter={filter} editMode={editMode} />
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
                </ResponsiveGridLayout>

                {/* Izgara ile alt şerit arası da kart↔kart boşluğuyla aynı (20px). */}
                <FooterStrip
                    isDefault={layoutQuery.data?.isDefault !== false}
                    onReset={handleReset}
                    onOpenCatalog={() => setCatalogOpen(true)}
                    isResetting={resetLayout.isPending}
                />
            </main>

            <CardCatalog
                open={catalogOpen}
                onOpenChange={setCatalogOpen}
                presentCardKeys={cards.map((c) => c.cardKey)}
                onAdd={handleAddCard}
            />
        </div>
    );
}

function PageHeader({ viewKey, onViewChange, range, onRangeChange, editMode, onToggleEdit, onOpenCatalog }) {
    const activeView = VIEWS.find((v) => v.key === viewKey) ?? VIEWS[0];

    return (
        <header className="px-4 pt-4 pb-3 bg-surface-base border-b border-default flex items-end justify-between gap-5 mobile:px-3 mobile:flex-col mobile:items-stretch mobile:gap-3">
            <div className="flex flex-col gap-2.5 min-w-0">
                <div className="flex items-center gap-2.5">
                    <h1 className="text-[22px] font-semibold tracking-[-0.025em] text-text-primary m-0">
                        {t('Dashboard:Title', 'Genel Bakış')}
                    </h1>
                    <span className="inline-flex items-center h-[22px] px-[9px] rounded-full bg-accent-soft text-accent-600 text-[11.5px] font-semibold flex-none">
                        {t(activeView.labelKey, activeView.fallback)}
                    </span>
                </div>

                <nav className="flex items-center gap-1 flex-wrap" aria-label={t('Dashboard:Views', 'Görünümler')}>
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
                <RangeSelect value={range} onChange={onRangeChange} />
                <Button size="sm" variant="secondary" onClick={onOpenCatalog}>
                    {t('Dashboard:AddCard', '+ Kart ekle')}
                </Button>
                <Button size="sm" variant="primary" onClick={onToggleEdit}>
                    {editMode ? t('Common:Done', 'Bitir') : t('Common:Edit', 'Düzenle')}
                </Button>
            </div>
        </header>
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

function FooterStrip({ isDefault, onReset, onOpenCatalog, isResetting }) {
    return (
        <div className="flex items-center justify-between gap-3 mt-5 px-4 py-3 rounded-card border border-dashed border-default bg-surface-base mobile:flex-col mobile:items-stretch">
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
                <Button size="sm" variant="primary" onClick={onOpenCatalog}>
                    {t('Dashboard:AddCard', '+ Kart ekle')}
                </Button>
            </div>
        </div>
    );
}

function toGridItem(card) {
    const meta = CARD_REGISTRY[card.cardKey];
    return {
        i: card.cardKey,
        x: card.x, y: card.y, w: card.w, h: card.h,
        minW: meta?.minW ?? 2,
        minH: meta?.minH ?? 2,
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
