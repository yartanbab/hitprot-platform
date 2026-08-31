import React, { useRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuestionCard } from './form-builder';

/**
 * Sürüklenen KART DEĞİL, üstündeki ⠿ tutamacı. Kart `draggable` olduğu sürece
 * basılıyken oluşan küçük kayma `click`i yutuyordu (tek tıklamayla seçilemiyor,
 * içindeki metin kutularında metin seçilemiyordu). Testler bu ayrımı korur.
 */

const BLOCK = { id: 'b1', type: 'ShortText', content: 'Adınız', settings: {} };

function Harness({ index = 2, onSelect = () => {}, onMove = () => {}, dragSeen }) {
    const dragRef = useRef(null);
    /* Sürükleme sırasında yazılan index'i teste sızdır. */
    const spyRef = { get current() { return dragRef.current; },
                     set current(v) { dragRef.current = v; dragSeen?.(v); } };
    return (
        <QuestionCard
            block={BLOCK}
            index={index}
            selected={false}
            onSelect={onSelect}
            onPatch={vi.fn()}
            onPatchSettings={vi.fn()}
            onChangeType={vi.fn()}
            onDuplicate={vi.fn()}
            onRemove={vi.fn()}
            onAddAfter={vi.fn()}
            onMove={onMove}
            dragRef={spyRef}
        />
    );
}

const cardOf = () => screen.getByDisplayValue('Adınız').closest('.group');
const handleOf = () => screen.getByTitle('Sürükle');

describe('QuestionCard surukleme tutamaci', () => {
    it('kartin kendisi ARTIK suruklenemez', () => {
        render(<Harness />);
        expect(cardOf()).not.toHaveAttribute('draggable', 'true');
    });

    it('tutamac suruklenebilir', () => {
        render(<Harness />);
        expect(handleOf()).toHaveAttribute('draggable', 'true');
    });

    it('tutamactan surukleyince kaynak index kaydedilir', () => {
        const dragSeen = vi.fn();
        render(<Harness index={2} dragSeen={dragSeen} />);
        fireEvent.dragStart(handleOf(), { dataTransfer: { setDragImage: vi.fn() } });
        expect(dragSeen).toHaveBeenCalledWith(2);
    });

    /** Kart artik draggable olmadigi icin duz `click` guvenilir. */
    it('karta tek tiklamak onu secer', () => {
        const onSelect = vi.fn();
        render(<Harness onSelect={onSelect} />);
        fireEvent.click(cardOf());
        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(onSelect).toHaveBeenCalledWith('b1');
    });

    /** Kart birakma HEDEFI olmayi surduruyor. */
    it('kartin uzerine birakmak onMove u kendi indexiyle cagirir', () => {
        const onMove = vi.fn();
        render(<Harness index={3} onMove={onMove} />);
        fireEvent.drop(cardOf());
        expect(onMove).toHaveBeenCalledWith(3);
    });
});
