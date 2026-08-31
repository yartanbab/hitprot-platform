import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MonthGrid } from './MonthGrid';

/**
 * Taşınabilir öğe çubukları `draggable` (başka bir güne sürüklenirler), o yüzden
 * seçim `click`te değil pointerdown'da yapılır — bkz. lib/dom/draggableActivation.js.
 * Kritik yan koşul: çubuğa basmak ALTINDAKİ gün hücresini seçmemeli.
 */

const MONTH = new Date('2026-03-15T00:00:00');
const DAY = '2026-03-10';

const ITEM = {
    key: 'task-1', source: 'task', title: 'Teklif hazırla', subtitle: '',
    date: `${DAY}T09:00:00`, canReschedule: true, isDone: false, risk: null, amount: null,
};

/* jsdom'da `PointerEvent` yok; bileşenin baktığı alanları taşıyan olayları elle kuruyoruz. */
function fire(el, type, { pointerType = 'mouse', button = 0 } = {}) {
    const event = new MouseEvent(type, { bubbles: true, cancelable: true, button, detail: 1 });
    Object.defineProperty(event, 'pointerType', { value: pointerType });
    fireEvent(el, event);
}

function renderGrid(item = ITEM) {
    const onSelectItem = vi.fn();
    const onSelectDay = vi.fn();
    render(
        <MonthGrid
            month={MONTH}
            byDay={{ [DAY]: [item] }}
            today={MONTH}
            capacity={8}
            onSelectItem={onSelectItem}
            onSelectDay={onSelectDay}
            selectedDay={null}
            onDropItem={vi.fn()}
        />,
    );
    return { onSelectItem, onSelectDay, pill: screen.getByText(item.title).closest('button') };
}

describe('MonthGrid oge cubugu', () => {
    /** Asil regresyon: surukleme click'i yutsa bile oge acilmali. */
    it('fare basildigi anda ogeyi acar (click beklemeden)', () => {
        const { onSelectItem, pill } = renderGrid();
        fire(pill, 'pointerdown');
        expect(onSelectItem).toHaveBeenCalledWith(ITEM);
    });

    it('tam fare tiklamasinda onSelectItem bir kez cagrilir', () => {
        const { onSelectItem, pill } = renderGrid();
        fire(pill, 'pointerdown');
        fire(pill, 'click');
        expect(onSelectItem).toHaveBeenCalledTimes(1);
    });

    /** Yayilma durdurulmazsa gun hucresinin onClick'i de calisir. */
    it('cubuga basmak gunu SECMEZ', () => {
        const { onSelectDay, pill } = renderGrid();
        fire(pill, 'pointerdown');
        fire(pill, 'click');
        expect(onSelectDay).not.toHaveBeenCalled();
    });

    /** Tasinamayan oge suruklenemez ama tiklanabilir olmayi surdurur. */
    it('suruklenemeyen oge de tiklamayla acilir', () => {
        const fixed = { ...ITEM, canReschedule: false };
        const { onSelectItem, pill } = renderGrid(fixed);
        expect(pill).not.toHaveAttribute('draggable', 'true');
        fire(pill, 'pointerdown');
        fire(pill, 'click');
        expect(onSelectItem).toHaveBeenCalledTimes(1);
        expect(onSelectItem).toHaveBeenCalledWith(fixed);
    });

    it('dokunmada secim click ten gelir', () => {
        const { onSelectItem, pill } = renderGrid();
        fire(pill, 'pointerdown', { pointerType: 'touch' });
        expect(onSelectItem).not.toHaveBeenCalled();
        fire(pill, 'click', { pointerType: 'touch' });
        expect(onSelectItem).toHaveBeenCalledTimes(1);
    });
});
