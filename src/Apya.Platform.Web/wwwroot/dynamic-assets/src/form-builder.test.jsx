import React, { useRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuestionCard, payloadBlocks, serverIdMap } from './form-builder';

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

/**
 * Yanıtlar alan kimliğiyle saklanır. Kayıt kimliği değiştirirse eski yanıtlar sorusundan kopar
 * (yanıt ekranında "Soru", dışa aktarımda boş hücre). Bu yüzden sunucudan gelen kimlik geri
 * gönderilir ve yeni alanın geçici kimliği kayıttan sonra sunucununkiyle değiştirilir.
 */
describe('alan kimlikleri kayitta korunur', () => {
    const SERVER_ID = '3f2b8c1e-9d4a-4c7e-8b21-5a6f0e9d1c34';

    it('sunucu kimligi geri gonderilir, gecici kimlik gonderilmez', () => {
        const body = payloadBlocks([
            { id: SERVER_ID, type: 'ShortText', content: 'Adınız', settings: { required: true } },
            { id: 'k3j9x0aa', type: 'Email', content: 'E-posta', settings: {} },
        ]);
        expect(body.map((b) => b.id)).toEqual([SERVER_ID, null]);
        expect(body.map((b) => b.order)).toEqual([1, 2]);
        expect(body[0].settings).toBe('{"required":true}');
    });

    it('kayittan sonra yalniz degisen kimlikler eslenir', () => {
        const sent = [{ id: SERVER_ID }, { id: 'k3j9x0aa' }];
        const saved = [
            { id: 'aaaaaaaa-0000-4000-8000-000000000002', order: 2 },
            { id: SERVER_ID, order: 1 },
        ];
        expect(serverIdMap(sent, saved)).toEqual({ k3j9x0aa: 'aaaaaaaa-0000-4000-8000-000000000002' });
    });

    it('sunucu blok dondurmezse esleme bos kalir', () => {
        expect(serverIdMap([{ id: 'k3j9x0aa' }], undefined)).toEqual({});
    });
});
