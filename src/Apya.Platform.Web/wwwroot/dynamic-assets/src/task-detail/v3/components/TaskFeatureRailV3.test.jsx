import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskFeatureRailV3 } from './TaskFeatureRailV3';

/**
 * Dikey ray da yatay çubukla aynı `draggable` düğmeleri kullanır, dolayısıyla aynı
 * "click yutulması" hatasına açıktı. Seçim burada da pointerdown'da yapılır.
 */

/* jsdom'da `PointerEvent` yok; fireEvent.pointerDown yalnız düz bir Event üretir ve
   `pointerType` / `button` olaya hiç inmez. Bileşenin ayırt ettiği alanlar bunlar
   olduğu için olayı elle kuruyoruz. */
function firePointerDown(el, { pointerType = 'mouse', button = 0 } = {}) {
    const event = new MouseEvent('pointerdown', { bubbles: true, cancelable: true, button });
    Object.defineProperty(event, 'pointerType', { value: pointerType });
    fireEvent(el, event);
}

const TABS = [
    { code: 'general',  icon: 'fa-circle-info', title: 'Genel' },
    { code: 'subtasks', icon: 'fa-list-check',  title: 'Alt Görevler' },
];

function renderRail(props = {}) {
    const onTabChange = vi.fn();
    render(
        <TaskFeatureRailV3
            activeTab="general"
            onTabChange={onTabChange}
            orderedTabs={TABS}
            onDragStart={vi.fn()}
            onDragEnd={vi.fn()}
            onReorderTo={vi.fn()}
            onOpenPicker={vi.fn()}
            {...props}
        />,
    );
    return { onTabChange };
}

describe('TaskFeatureRailV3 sekme secimi', () => {
    it('fare basildigi anda sekmeyi degistirir (click beklemeden)', () => {
        const { onTabChange } = renderRail();
        firePointerDown(screen.getByRole('button', { name: /Alt Görevler/ }));
        expect(onTabChange).toHaveBeenCalledWith('subtasks');
    });

    it('dokunmada secim click ten gelir', () => {
        const { onTabChange } = renderRail();
        const tab = screen.getByRole('button', { name: /Alt Görevler/ });

        firePointerDown(tab, { pointerType: 'touch' });
        expect(onTabChange).not.toHaveBeenCalled();

        fireEvent.click(tab);
        expect(onTabChange).toHaveBeenCalledWith('subtasks');
    });

    it('surukleme baslayinca onDragStart cagrilir', () => {
        const onDragStart = vi.fn();
        renderRail({ onDragStart });
        fireEvent.dragStart(screen.getByRole('button', { name: /Alt Görevler/ }));
        expect(onDragStart).toHaveBeenCalledWith('subtasks');
    });
});
