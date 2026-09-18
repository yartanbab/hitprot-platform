import React, { useRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuestionCard, payloadBlocks, serverIdMap, parentCandidatesFor, conditionCandidatesFor } from './form-builder';

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
 * Tur 15/16 · Açılır liste bir VERİ KAYNAĞINA bağlanabilir. Canlı listede elle yazılan seçenekler gizlenir,
 * önizleme sunucudaki güncel kayıtları gösterir; zincirli kaynakta ayrıca üst alan seçilir.
 */
describe('acilir liste secenek kaynagi', () => {
    const SOURCES = [
        { key: 'firms', scope: 2, dependsOnSourceKey: null },
        { key: 'open-grant-calls', scope: 0, dependsOnSourceKey: null },
        { key: 'tenant-project-tasks', scope: 1, dependsOnSourceKey: 'tenant-projects' },
        { key: 'tenant-projects', scope: 1, dependsOnSourceKey: null },
    ];
    const dropdown = (settings) => ({ id: 'd1', type: 18, content: 'İlgilendiğiniz çağrı', settings });
    const renderCard = (settings, onPatchSettings = vi.fn(), parentCandidates = []) => render(
        <QuestionCard block={dropdown(settings)} index={0} selected onSelect={vi.fn()} onPatch={vi.fn()}
            onPatchSettings={onPatchSettings} onChangeType={vi.fn()} onDuplicate={vi.fn()} onRemove={vi.fn()}
            onAddAfter={vi.fn()} onMove={vi.fn()} dragRef={{ current: null }} publicSlug="proje-fikri"
            sources={SOURCES} parentCandidates={parentCandidates} />,
    );

    it('canli listede onizleme gelir, sabit secenek duzenleyicisi gizlenir', async () => {
        renderCard({ source: 'open-grant-calls', urlPrefill: true, options: ['Seçenek 1'] });
        expect(screen.getByLabelText('Veri kaynağından, canlı liste')).toBeChecked();
        expect(screen.getByLabelText('Veri kaynağı')).toHaveValue('open-grant-calls');
        await waitFor(() => expect(screen.getByText('Şu an 4 kayıt listeleniyor.')).toBeInTheDocument());
        expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
            'TÜBİTAK · Sanayi Ar-Ge Projeleri (2026/1)', 'KOSGEB · KOBİGEL Dijital Dönüşüm (2026/1)', 'Sanayi ve Tek. Bak. · Teknoyatırım (2026/1)',
        ]);
        expect(screen.getByText('ve 1 kayıt daha')).toBeInTheDocument();
        expect(screen.queryByText('+ Seçenek ekle')).not.toBeInTheDocument();
        expect(screen.getByLabelText('Çağrıya özel bağlantı')).toBeInTheDocument();
    });

    it('sabit secenege donunce kaynak ayarlari kaldirilir', () => {
        const onPatchSettings = vi.fn();
        renderCard({ source: 'open-grant-calls', urlPrefill: true }, onPatchSettings);
        fireEvent.click(screen.getByLabelText('Sabit seçenekler, elle yazılır'));
        expect(onPatchSettings).toHaveBeenCalledWith('d1', { source: undefined, urlPrefill: undefined, dependsOn: undefined });
    });

    it('canli liste secilince cagri listesi ve baglantidan on secim gelir', () => {
        const onPatchSettings = vi.fn();
        renderCard({ options: ['Seçenek 1'] }, onPatchSettings);
        expect(screen.getByText('+ Seçenek ekle')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('Veri kaynağından, canlı liste'));
        expect(onPatchSettings).toHaveBeenCalledWith('d1', { source: 'open-grant-calls', urlPrefill: true, dependsOn: undefined });
    });

    it('kaynak degisince ust alan bagi ve baglanti on secimi dusur', () => {
        const onPatchSettings = vi.fn();
        renderCard({ source: 'open-grant-calls', urlPrefill: true }, onPatchSettings);
        fireEvent.change(screen.getByLabelText('Veri kaynağı'), { target: { value: 'tenant-projects' } });
        expect(onPatchSettings).toHaveBeenCalledWith('d1', { source: 'tenant-projects', urlPrefill: undefined, dependsOn: undefined });
    });

    it('zincirli kaynakta ust alan secilir, onizleme istenmez', () => {
        renderCard({ source: 'tenant-project-tasks' }, vi.fn(), [{ id: 'p1', content: 'Projeniz' }]);
        expect(screen.getByLabelText('Üst alan')).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Projeniz' })).toBeInTheDocument();
        expect(screen.queryByText(/kayıt listeleniyor/)).not.toBeInTheDocument();
    });

    it('zincirli kaynakta uygun ust alan yoksa uyarilir', () => {
        renderCard({ source: 'tenant-project-tasks' });
        expect(screen.queryByLabelText('Üst alan')).not.toBeInTheDocument();
        expect(screen.getByText(/Önce yukarıya .Firmanın projeleri. kaynağına bağlı bir açılır liste ekleyin/)).toBeInTheDocument();
    });
});

/**
 * 16b · Üst alan adayı YALNIZ yukarıdaki alanlar olabilir: doldurucu önce üstteki soruyu yanıtlar.
 */
describe('zincirli alanin ust alan adaylari', () => {
    const SOURCES = [{ key: 'tenant-project-tasks', scope: 1, dependsOnSourceKey: 'tenant-projects' }];
    const blocks = [
        { id: 'p1', type: 18, content: 'Projeniz', settings: { source: 'tenant-projects' } },
        { id: 'x1', type: 18, content: 'Çağrı', settings: { source: 'open-grant-calls' } },
        { id: 't1', type: 18, content: 'Göreviniz', settings: { source: 'tenant-project-tasks' } },
        { id: 'p2', type: 18, content: 'Diğer projeniz', settings: { source: 'tenant-projects' } },
    ];

    it('yalniz yukaridaki ve dogru kaynaga bagli alanlar aday', () => {
        expect(parentCandidatesFor(blocks, 2, SOURCES).map((b) => b.id)).toEqual(['p1']);
    });

    it('zincirli olmayan alanda aday aranmaz', () => {
        expect(parentCandidatesFor(blocks, 1, SOURCES)).toEqual([]);
    });
});

/**
 * 17 · Görünürlük kuralı düzenleyicide kurulur: koşul alanı YALNIZ yukarıdaki cevaplanabilir alanlardan
 * seçilir, "seçilen kayıt şu şartı taşıyorsa" ise yalnız bayrak üreten kaynağa bağlı alanda çıkar.
 */
describe('kosullu alan gorunurluk kurali', () => {
    const SOURCES = [
        { key: 'open-grant-calls', scope: 0, dependsOnSourceKey: null, flags: ['requiresConsortium'] },
        { key: 'tenant-projects', scope: 1, dependsOnSourceKey: null, flags: [] },
    ];
    const target = (settings) => ({ id: 'q2', type: 0, content: 'Ortak firma adı', settings });
    const renderCard = (settings, onPatchSettings = vi.fn(), candidates = []) => render(
        <QuestionCard block={target(settings)} index={1} selected onSelect={vi.fn()} onPatch={vi.fn()}
            onPatchSettings={onPatchSettings} onChangeType={vi.fn()} onDuplicate={vi.fn()} onRemove={vi.fn()}
            onAddAfter={vi.fn()} onMove={vi.fn()} dragRef={{ current: null }} publicSlug="basvuru"
            sources={SOURCES} conditionCandidates={candidates} />,
    );
    const callField = { id: 'q1', type: 18, content: 'İlgilendiğiniz çağrı', settings: { source: 'open-grant-calls' } };
    const textField = { id: 'q0', type: 0, content: 'Firma adı', settings: {} };

    it('yukarida alan yoksa kosul kurulamaz', () => {
        renderCard({});
        expect(screen.getByText('Koşul için yukarıda bir alan gerekir; bu alan her zaman görünür.')).toBeInTheDocument();
        expect(screen.queryByText('+ Koşul ekle')).not.toBeInTheDocument();
    });

    it('kosul eklenince ilk yukaridaki alan ve "yanitlanirsa" ile baslar', () => {
        const onPatchSettings = vi.fn();
        renderCard({}, onPatchSettings, [textField, callField]);
        fireEvent.click(screen.getByText('+ Koşul ekle'));
        expect(onPatchSettings).toHaveBeenCalledWith('q2', { visibleWhen: { blockId: 'q0', op: 'answered', value: undefined } });
    });

    it('bayrak ureten kaynaga bagli alanda "sarti tasiyorsa" secenegi cikar', () => {
        renderCard({ visibleWhen: { blockId: 'q1', op: 'answered' } }, vi.fn(), [textField, callField]);
        const ops = [...screen.getByLabelText('Koşul karşılaştırması').options].map((o) => o.textContent);
        expect(ops).toContain('seçilen kayıt şu şartı taşıyorsa');
    });

    it('bayraksiz alanda o secenek YOK', () => {
        renderCard({ visibleWhen: { blockId: 'q0', op: 'answered' } }, vi.fn(), [textField, callField]);
        const ops = [...screen.getByLabelText('Koşul karşılaştırması').options].map((o) => o.textContent);
        expect(ops).toEqual(['yanıtlanırsa', 'şu cevabı verirse', 'şu cevabı vermezse']);
    });

    it('sart secilince kural bayragi tasir', () => {
        const onPatchSettings = vi.fn();
        renderCard({ visibleWhen: { blockId: 'q1', op: 'answered' } }, onPatchSettings, [textField, callField]);
        fireEvent.change(screen.getByLabelText('Koşul karşılaştırması'), { target: { value: 'flag' } });
        expect(onPatchSettings).toHaveBeenCalledWith('q2', { visibleWhen: { blockId: 'q1', op: 'flag', value: 'requiresConsortium' } });
    });

    it('ust alan degisince karsilastirma sifirlanir', () => {
        const onPatchSettings = vi.fn();
        renderCard({ visibleWhen: { blockId: 'q1', op: 'flag', value: 'requiresConsortium' } }, onPatchSettings, [textField, callField]);
        fireEvent.change(screen.getByLabelText('Koşul alanı'), { target: { value: 'q0' } });
        expect(onPatchSettings).toHaveBeenCalledWith('q2', { visibleWhen: { blockId: 'q0', op: 'answered', value: undefined } });
    });

    it('kosuldaki alan yukaridan kalkmissa uyarilir', () => {
        renderCard({ visibleWhen: { blockId: 'silinmis', op: 'answered' } }, vi.fn(), [textField]);
        expect(screen.getByText(/Koşuldaki alan artık yukarıda değil/)).toBeInTheDocument();
    });

    it('kosul kaldirilinca ayar silinir', () => {
        const onPatchSettings = vi.fn();
        renderCard({ visibleWhen: { blockId: 'q0', op: 'answered' } }, onPatchSettings, [textField]);
        fireEvent.click(screen.getByText('Koşulu kaldır'));
        expect(onPatchSettings).toHaveBeenCalledWith('q2', { visibleWhen: undefined });
    });
});

describe('kosul alani adaylari', () => {
    const blocks = [
        { id: 'a', type: 0, content: 'Firma adı', settings: {} },
        { id: 'h', type: 16, content: 'Bölüm', settings: {} },
        { id: 'b', type: 18, content: 'Çağrı', settings: {} },
        { id: 'c', type: 0, content: 'Ortak', settings: {} },
    ];

    it('yalniz yukaridaki CEVAPLANABILIR alanlar aday', () => {
        expect(conditionCandidatesFor(blocks, 3).map((b) => b.id)).toEqual(['a', 'b']);
        expect(conditionCandidatesFor(blocks, 0)).toEqual([]);
    });
});
