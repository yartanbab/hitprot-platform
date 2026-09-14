import React, { useRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuestionCard, payloadBlocks, serverIdMap } from './form-builder';

/* Canlı liste paneli önizleme için sunucudan çağrıları ister. */
vi.mock('./lib/api/httpClient', () => ({
    api: { get: vi.fn(async () => [
        { value: 'c1', label: 'TÜBİTAK · Sanayi Ar-Ge Projeleri (2026/1)' },
        { value: 'c2', label: 'KOSGEB · KOBİGEL Dijital Dönüşüm (2026/1)' },
        { value: 'c3', label: 'Sanayi ve Tek. Bak. · Teknoyatırım (2026/1)' },
        { value: 'c4', label: 'Horizon Europe · EIC Accelerator (2026/1)' },
    ]) },
}));

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

/**
 * Tur 15 · Açılır liste canlı "Yayındaki hibeler" kaynağına bağlanabilir. Canlı listede elle yazılan
 * seçenekler gizlenir, önizleme sunucudaki güncel çağrıları gösterir.
 */
describe('acilir liste secenek kaynagi', () => {
    const dropdown = (settings) => ({ id: 'd1', type: 18, content: 'İlgilendiğiniz çağrı', settings });
    const renderCard = (settings, onPatchSettings = vi.fn()) => render(
        <QuestionCard block={dropdown(settings)} index={0} selected onSelect={vi.fn()} onPatch={vi.fn()}
            onPatchSettings={onPatchSettings} onChangeType={vi.fn()} onDuplicate={vi.fn()} onRemove={vi.fn()}
            onAddAfter={vi.fn()} onMove={vi.fn()} dragRef={{ current: null }} publicSlug="proje-fikri" />,
    );

    it('canli listede onizleme gelir, sabit secenek duzenleyicisi gizlenir', async () => {
        renderCard({ source: 'open-grant-calls', urlPrefill: true, options: ['Seçenek 1'] });
        expect(screen.getByLabelText('Yayındaki hibeler, canlı liste')).toBeChecked();
        await waitFor(() => expect(screen.getByText(/başvuruya açık 4 çağrı var/)).toBeInTheDocument());
        expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
            'TÜBİTAK · Sanayi Ar-Ge Projeleri (2026/1)', 'KOSGEB · KOBİGEL Dijital Dönüşüm (2026/1)', 'Sanayi ve Tek. Bak. · Teknoyatırım (2026/1)',
        ]);
        expect(screen.getByText('ve 1 çağrı daha')).toBeInTheDocument();
        expect(screen.queryByText('+ Seçenek ekle')).not.toBeInTheDocument();
        expect(screen.getByLabelText('Çağrıya özel bağlantı')).toBeInTheDocument();
    });

    it('sabit secenege donunce kaynak ayarlari kaldirilir', () => {
        const onPatchSettings = vi.fn();
        renderCard({ source: 'open-grant-calls', urlPrefill: true }, onPatchSettings);
        fireEvent.click(screen.getByLabelText('Sabit seçenekler, elle yazılır'));
        expect(onPatchSettings).toHaveBeenCalledWith('d1', { source: undefined, urlPrefill: undefined });
    });

    it('canli liste secilince baglantidan on secim de acilir', () => {
        const onPatchSettings = vi.fn();
        renderCard({ options: ['Seçenek 1'] }, onPatchSettings);
        expect(screen.getByText('+ Seçenek ekle')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('Yayındaki hibeler, canlı liste'));
        expect(onPatchSettings).toHaveBeenCalledWith('d1', { source: 'open-grant-calls', urlPrefill: true });
    });
});
