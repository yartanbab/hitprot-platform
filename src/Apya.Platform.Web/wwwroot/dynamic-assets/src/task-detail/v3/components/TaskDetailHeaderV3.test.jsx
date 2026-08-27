import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskDetailHeaderV3 } from './TaskDetailHeaderV3';

const TASK = { id: 'task-1', title: 'Sözleşme taslağını hazırla', code: 'GRV-42' };

/** Header'i tum handler'lari casus (spy) olarak baglanmis halde render eder. */
function renderHeader(overrides = {}) {
    const spies = {
        onClose: vi.fn(),
        onToggleFullscreen: vi.fn(),
        onFieldChange: vi.fn(),
        onToggleFavorite: vi.fn(),
        onToggleWatch: vi.fn(),
        onDuplicate: vi.fn(),
        onArchive: vi.fn(),
        onDelete: vi.fn(),
        onOpenTransfer: vi.fn(),
        onSaveAsTemplate: vi.fn(),
        onConvertToSubtask: vi.fn(),
        onExportPdf: vi.fn(),
    };
    render(<TaskDetailHeaderV3 task={TASK} titleValue={TASK.title} {...spies} {...overrides} />);
    return spies;
}

/** ⋯ menusunu acar ve istenen maddeye tiklar. */
function clickMenuItem(name) {
    fireEvent.click(screen.getByRole('button', { name: /diğer seçenekler/i }));
    fireEvent.click(screen.getByText(name));
}

beforeEach(() => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn(() => Promise.resolve()) } });
});

describe('TaskDetailHeaderV3 / temel', () => {
    it('gorev basligini gosterir', () => {
        renderHeader();
        expect(screen.getByText(TASK.title)).toBeInTheDocument();
    });

    it('kapat dugmesi onClose u cagirir', () => {
        const spies = renderHeader();
        fireEvent.click(screen.getByRole('button', { name: /kapat/i }));
        expect(spies.onClose).toHaveBeenCalledTimes(1);
    });

    it('tam ekran dugmesi onToggleFullscreen i cagirir', () => {
        const spies = renderHeader();
        fireEvent.click(screen.getByRole('button', { name: /tam ekran/i }));
        expect(spies.onToggleFullscreen).toHaveBeenCalledTimes(1);
    });

    /* Oncelik cipi metadata izgarasina tasindi (TaskMetadataGridV3 "Oncelik" hucresi).
       Baslikta kalirsa rozet satiri sisip dar ekranda gorev adina yer birakmiyor. */
    it('oncelik cipini ARTIK gostermez', () => {
        renderHeader({ priorityValue: 2 });
        expect(screen.queryByText('Orta')).not.toBeInTheDocument();
    });

    /* Baslik, rozet/aksiyon satirinin KARDESI olmali; icine girerse sagdaki
       dugmeler kadar daralip mobilde iki-uc satira kiriliyor. */
    it('basligi rozet satirinin disinda, kendi tam genislikli satirinda render eder', () => {
        renderHeader();
        const title = screen.getByText(TASK.title);
        const badgeRow = screen.getByText(TASK.code).closest('button').parentElement;
        expect(badgeRow.contains(title)).toBe(false);
        expect(title.className).toContain('flex-1');
    });

    it('basligi duzenleyip odaktan cikinca title alanini gunceller', () => {
        const spies = renderHeader();
        const title = screen.getByText(TASK.title);
        title.textContent = 'Yeni baslik';
        fireEvent.blur(title);
        expect(spies.onFieldChange).toHaveBeenCalledWith('title', 'Yeni baslik');
    });
});

/**
 * ⋯ menusu — hangi maddenin GERCEKTEN is yaptigini belgeler.
 * Asagidaki "stub" testleri bilerek yazildi: uc madde su an yalnizca bildirim
 * gosteriyor, arkalarinda islev YOK. Gercek islev geldiginde bu testler
 * guncellenmeli (kirilmalari, isin bittiginin isareti).
 */
describe('TaskDetailHeaderV3 / ⋯ menusu', () => {
    it('Cogalt gercek handler i cagirir', () => {
        const spies = renderHeader();
        clickMenuItem('Çoğalt');
        expect(spies.onDuplicate).toHaveBeenCalledTimes(1);
    });

    it('Baska projeye kopyala transfer i copy modunda acar', () => {
        const spies = renderHeader();
        clickMenuItem('Başka projeye kopyala');
        expect(spies.onOpenTransfer).toHaveBeenCalledWith('copy');
    });

    it('Tasi transfer i move modunda acar', () => {
        const spies = renderHeader();
        clickMenuItem('Taşı (başka proje)');
        expect(spies.onOpenTransfer).toHaveBeenCalledWith('move');
    });

    it('Arsivle gercek handler i cagirir', () => {
        const spies = renderHeader();
        clickMenuItem('Arşivle');
        expect(spies.onArchive).toHaveBeenCalledTimes(1);
    });

    it('Sil gercek handler i cagirir', () => {
        const spies = renderHeader();
        clickMenuItem('Sil');
        expect(spies.onDelete).toHaveBeenCalledTimes(1);
    });

    it('Takip et watch toggle ini cagirir', () => {
        const spies = renderHeader();
        clickMenuItem('Takip et');
        expect(spies.onToggleWatch).toHaveBeenCalledTimes(1);
    });

    it('isWatched true iken madde Takibi birak yazar', () => {
        renderHeader({ isWatched: true });
        fireEvent.click(screen.getByRole('button', { name: /diğer seçenekler/i }));
        expect(screen.getByText('Takibi bırak')).toBeInTheDocument();
    });

    /* REGRESYON: menu modalin ICINE portal ediliyor ve DialogContent overflow-hidden
       + kalici transform tasiyor -> kirpan kap O. Yukseklik sinirlanmazsa alcak
       ekranda son satirlar (kisayollar) gorunmez oluyordu. */
    it('menuyu Radix in bildirdigi kullanilabilir yukseklikle sinirlar ve kaydirilabilir yapar', () => {
        renderHeader();
        fireEvent.click(screen.getByRole('button', { name: /diğer seçenekler/i }));
        const content = screen.getByText('Bağlantıyı kopyala').closest('button').parentElement;
        expect(content.className).toContain('max-h-[var(--radix-popover-content-available-height)]');
        expect(content.className).toContain('overflow-y-auto');
    });

    it('kisayol bloğundaki dort satirin tamami render edilir', () => {
        renderHeader();
        fireEvent.click(screen.getByRole('button', { name: /diğer seçenekler/i }));
        ['Kaydet', 'Yorum gönder', 'Kapat / iptal', 'Bağlantı kopyala'].forEach((label) => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });
    });

    // ── Su an ISLEVSIZ olan maddeler (yalnizca bildirim gosteriyorlar) ──
    it('STUB: Sablon olarak kaydet yalnizca handler i cagirir, gercek islev yok', () => {
        const spies = renderHeader();
        clickMenuItem('Şablon olarak kaydet');
        expect(spies.onSaveAsTemplate).toHaveBeenCalledTimes(1);
    });

    it('STUB: Alt goreve donustur yalnizca handler i cagirir, gercek islev yok', () => {
        const spies = renderHeader();
        clickMenuItem('Alt göreve dönüştür');
        expect(spies.onConvertToSubtask).toHaveBeenCalledTimes(1);
    });

    it('STUB: PDF olarak disa aktar yalnizca handler i cagirir, gercek islev yok', () => {
        const spies = renderHeader();
        clickMenuItem('PDF olarak dışa aktar');
        expect(spies.onExportPdf).toHaveBeenCalledTimes(1);
    });
});
