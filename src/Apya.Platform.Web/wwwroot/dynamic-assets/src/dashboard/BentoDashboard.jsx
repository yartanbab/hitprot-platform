import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import {
    PERSONA_LAYOUTS,
    PERSONA_LABELS,
    GRID_BREAKPOINTS,
    GRID_COLS,
    GRID_ROW_HEIGHT,
    GRID_MARGIN,
    readPersonaPreference,
    writePersonaPreference,
    readLayoutOverrides,
    writeLayoutOverrides,
    clearLayoutOverrides,
} from './layouts/personaLayouts';

import { WidgetShell } from './widgets/WidgetShell';
import { BudgetHealthWidget } from './widgets/BudgetHealthWidget';
import { CashFlowWidget } from './widgets/CashFlowWidget';
import { PendingApprovalsWidget } from './widgets/PendingApprovalsWidget';
import { RiskAlertsWidget } from './widgets/RiskAlertsWidget';
import { AISuggestionsWidget } from './widgets/AISuggestionsWidget';
import { ApprovalDetailSheet } from './approvals/ApprovalDetailSheet';

import { Button, ThemeToggle } from '../components/ui';
import { cn } from '../lib/utils';

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * Bento Dashboard — Apya'nın "CFO-in-a-box" widget grid'i.
 *
 * Sorumluluklar:
 *   - Persona seçici (CFO / PM / Field) → default layout yükler
 *   - react-grid-layout responsive grid (desktop 12 / tablet 8 / mobile 1)
 *   - Edit mode toggle — drag/resize sadece edit'te aktif
 *   - Kullanıcı override'ları localStorage'da persist edilir
 *   - "Reset" → persona default'una geri döner
 *
 * Wire-up to backend (sonraki commit):
 *   - Her widget'a `useQuery` hook'u ile data injection (TanStack Query)
 *   - SignalR ile invalidation
 *   - Optimistic mutation'lar Approve/Reject için
 */

const WIDGET_REGISTRY = {
    'budget-health':     BudgetHealthWidget,
    'cash-flow':         CashFlowWidget,
    'pending-approvals': PendingApprovalsWidget,
    'risk-alerts':       RiskAlertsWidget,
    'ai-suggestions':    AISuggestionsWidget,
};

function BentoDashboard() {
    const [persona, setPersonaState] = useState(() => readPersonaPreference());
    const [editMode, setEditMode] = useState(false);
    const [approvalSheetId, setApprovalSheetId] = useState(null);

    /* Deep-link: /Dashboard?approval=ID → push notification tap'inden gelen
       direkt sheet açılışı. URL param'ı tek seferlik okur, history'yi temiz
       bırakmak için pushState ile siler (kullanıcı geri tuşuna basınca dashboard
       state'ine dönsün, aynı sheet'i tekrar açmasın). */
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        const approvalId = params.get('approval');
        if (!approvalId) return;
        setApprovalSheetId(approvalId);
        params.delete('approval');
        const cleanUrl = window.location.pathname + (params.toString() ? `?${params}` : '') + window.location.hash;
        window.history.replaceState(null, '', cleanUrl);
    }, []);

    /* Layout = persona default + kullanıcı override (varsa) */
    const layouts = useMemo(() => {
        const base = PERSONA_LAYOUTS[persona] ?? PERSONA_LAYOUTS.cfo;
        const overrides = readLayoutOverrides(persona);
        if (!overrides) return base;
        /* Override gelen breakpoint'leri ezer; gelmeyenler default'tan kalır. */
        return { ...base, ...overrides };
    }, [persona]);

    const setPersona = useCallback((next) => {
        setPersonaState(next);
        writePersonaPreference(next);
    }, []);

    const handleLayoutChange = useCallback(
        (_currentLayout, allLayouts) => {
            if (!editMode) return;       /* Edit mode kapalı iken kayıt yok */
            writeLayoutOverrides(persona, allLayouts);
        },
        [editMode, persona],
    );

    const handleReset = useCallback(() => {
        clearLayoutOverrides(persona);
        /* Force re-render: persona'yı re-set etmek useMemo'yu yeniler */
        setPersonaState(persona);
    }, [persona]);

    /* Aktif persona için widget'lar — layout'tan i (id) okunur */
    const activeLayoutItems = layouts.desktop ?? [];
    const widgetIds = activeLayoutItems.map((item) => item.i);

    return (
        <div className="min-h-screen bg-surface-base text-text-primary">
            <DashboardHeader
                persona={persona}
                onPersonaChange={setPersona}
                editMode={editMode}
                onEditModeToggle={() => setEditMode((v) => !v)}
                onReset={handleReset}
            />

            <main className="px-4 py-4 mobile:px-2 mobile:py-2">
                <ResponsiveGridLayout
                    className={cn('apya-bento', editMode && 'apya-bento--edit')}
                    layouts={layouts}
                    breakpoints={GRID_BREAKPOINTS}
                    cols={GRID_COLS}
                    rowHeight={GRID_ROW_HEIGHT}
                    margin={GRID_MARGIN}
                    isDraggable={editMode}
                    isResizable={editMode}
                    /* Drag handle: WidgetShell.DRAG_HANDLE_CLASS — header'dan tutar */
                    draggableHandle={`.${WidgetShell.DRAG_HANDLE_CLASS}`}
                    onLayoutChange={handleLayoutChange}
                    /* Compact tip "vertical" — boşluk kalırsa widget'lar yukarı çekilir */
                    compactType="vertical"
                    /* Çakışma engelleme; iki widget aynı hücreyi paylaşamaz */
                    preventCollision={false}
                    /* Performans: sadece görünür item'ları render etme yerine bütünü
                       — 4-12 widget için fark yok, gerekince virtualize */
                >
                    {widgetIds.map((id) => {
                        const WidgetComponent = WIDGET_REGISTRY[id];
                        if (!WidgetComponent) {
                            return (
                                <div key={id}>
                                    <WidgetShell title={`Bilinmeyen widget: ${id}`} />
                                </div>
                            );
                        }
                        return (
                            <div key={id} className="apya-bento-item">
                                <WidgetComponent />
                            </div>
                        );
                    })}
                </ResponsiveGridLayout>
            </main>

            {/* Push notification deep-link → onay detayı sheet'i (APYA-108) */}
            <ApprovalDetailSheet
                approvalId={approvalSheetId}
                open={Boolean(approvalSheetId)}
                onOpenChange={(open) => { if (!open) setApprovalSheetId(null); }}
            />

            {/* Edit mode hint — discoverability */}
            {editMode && (
                <div
                    role="status"
                    aria-live="polite"
                    className={cn(
                        'fixed bottom-4 left-1/2 -translate-x-1/2 z-toast',
                        'bg-surface-inverse text-text-inverse text-sm',
                        'px-4 py-2 rounded-md shadow-lg',
                        'flex items-center gap-3',
                    )}
                >
                    <span>Düzenleme modu — widget'ları sürükleyip yeniden boyutlandırabilirsin</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-text-inverse hover:bg-white/10"
                        onClick={() => setEditMode(false)}
                    >
                        Bitir
                    </Button>
                </div>
            )}
        </div>
    );
}

function DashboardHeader({ persona, onPersonaChange, editMode, onEditModeToggle, onReset }) {
    return (
        <header className={cn(
            'sticky top-0 z-sticky',
            'bg-surface-raised/95 backdrop-blur-sm',
            'border-b border-default',
            'px-4 py-3',
            'flex items-center justify-between gap-4',
            'mobile:px-2 mobile:py-2',
        )}>
            <div className="flex flex-col gap-0.5 min-w-0">
                <h1 className="text-base font-semibold text-text-primary truncate">
                    Genel Bakış
                </h1>
                <p className="text-xs text-text-tertiary truncate mobile:hidden">
                    {PERSONA_LABELS[persona]} görünümü
                </p>
            </div>

            <div className="flex items-center gap-2 flex-none">
                <PersonaSelect value={persona} onChange={onPersonaChange} />

                {editMode ? (
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={onReset}
                        title="Layout'u persona varsayılanına döndür"
                    >
                        Sıfırla
                    </Button>
                ) : null}

                <Button
                    size="sm"
                    variant={editMode ? 'primary' : 'secondary'}
                    onClick={onEditModeToggle}
                >
                    {editMode ? 'Tamamla' : 'Düzenle'}
                </Button>

                <ThemeToggle />
            </div>
        </header>
    );
}

function PersonaSelect({ value, onChange }) {
    return (
        <label className="flex items-center gap-2">
            <span className="sr-only">Persona seç</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    'h-10 px-3 text-sm rounded-md',
                    'bg-surface-base text-text-primary',
                    'border border-default',
                    'hover:border-strong',
                    'focus-visible:outline-none focus-visible:shadow-focus',
                    'transition-colors duration-fast',
                )}
            >
                {Object.entries(PERSONA_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                ))}
            </select>
        </label>
    );
}

export { BentoDashboard };
