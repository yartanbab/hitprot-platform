import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileList } from './FileList';

/**
 * Satırlar ve kartlar `draggable` (belgeyi klasöre sürüklemek için). Bu yüzden
 * seçim `click`te değil pointerdown'da yapılır — bkz. lib/dom/draggableActivation.js.
 * Buradaki testler o değişikliğin iki yan etkisini kilitler:
 *   1) seçim tam bir kez çalışmalı (onSelect ağ isteği tetikliyor),
 *   2) satır içindeki seçim kutusu satırı seçmemeli (artık click'i durdurmak yetmiyor).
 */

const FILES = [
    {
        id: 'f1', displayName: 'Sözleşme.pdf', fileName: 'sozlesme.pdf', contentType: 'application/pdf',
        status: 1, versionCount: 1, amount: null, currency: 'TRY', creationTime: '2026-01-05T10:00:00Z',
    },
];

/* jsdom'da `PointerEvent` yok; bileşenin baktığı `pointerType`/`button` alanlarını
   taşıyan olayları elle kuruyoruz. */
function fire(el, type, { pointerType = 'mouse', button = 0 } = {}) {
    const event = new MouseEvent(type, { bubbles: true, cancelable: true, button, detail: 1 });
    Object.defineProperty(event, 'pointerType', { value: pointerType });
    fireEvent(el, event);
}

/** Gerçek fare tıklaması: pointerdown + click. */
function mouseClick(el) {
    fire(el, 'pointerdown');
    fire(el, 'click');
}

function renderList(props = {}) {
    const onSelect = vi.fn();
    const onToggleCheck = vi.fn();
    render(
        <FileList
            loading={false}
            files={FILES}
            totalCount={1}
            view="list"
            sorting=""
            onSort={vi.fn()}
            selectedId={null}
            onSelect={onSelect}
            checkedIds={new Set()}
            onToggleCheck={onToggleCheck}
            onToggleAll={vi.fn()}
            page={0}
            pageSize={20}
            onPageChange={vi.fn()}
            onDragStart={vi.fn()}
            {...props}
        />,
    );
    const row = screen.getByText('Sözleşme.pdf').closest('.apya-doc-row');
    return { onSelect, onToggleCheck, row };
}

describe('FileList satir secimi', () => {
    /** Asil regresyon: surukleme click'i yutsa bile satir secilmeli. */
    it('fare basildigi anda belgeyi secer (click beklemeden)', () => {
        const { onSelect, row } = renderList();
        fire(row, 'pointerdown');
        expect(onSelect).toHaveBeenCalledWith(FILES[0]);
    });

    /** onSelect ag istegi atiyor — cift tetiklenmemeli. */
    it('tam fare tiklamasinda onSelect bir kez cagrilir', () => {
        const { onSelect, row } = renderList();
        mouseClick(row);
        expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('dokunmada secim click ten gelir, pointerdown erken tetiklemez', () => {
        const { onSelect, row } = renderList();
        fire(row, 'pointerdown', { pointerType: 'touch' });
        expect(onSelect).not.toHaveBeenCalled();
        fire(row, 'click', { pointerType: 'touch' });
        expect(onSelect).toHaveBeenCalledTimes(1);
    });

    /** Satir pointerdown'da sectigi icin kutucuk da pointerdown'i durdurmali. */
    it('secim kutusuna basmak satiri SECMEZ', () => {
        const { onSelect, onToggleCheck, row } = renderList();
        mouseClick(row.querySelector('[role="checkbox"]'));
        expect(onToggleCheck).toHaveBeenCalledWith('f1');
        expect(onSelect).not.toHaveBeenCalled();
    });

    /** Cop kutusunda satir ne secilir ne suruklenir. */
    it('cop kutusunda satira basmak hicbir sey secmez', () => {
        const { onSelect, row } = renderList({ isTrash: true });
        mouseClick(row);
        expect(onSelect).not.toHaveBeenCalled();
    });
});
