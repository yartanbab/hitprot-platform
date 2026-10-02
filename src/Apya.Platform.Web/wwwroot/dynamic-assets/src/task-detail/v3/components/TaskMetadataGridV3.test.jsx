import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { TaskMetadataGridV3 } from './TaskMetadataGridV3';

/**
 * Oncelik alani basliktan (TaskDetailHeaderV3) BURAYA tasindi. Tasima sirasinda
 * duzenleme yetenegi sessizce kaybolursa gorevin onceligi hicbir yerden
 * degistirilemez hale gelir — asagidaki testler tam olarak onu bekletir.
 */
const TASK = { id: 'task-1', priority: 2, status: 1 };

function renderGrid(overrides = {}) {
    const onFieldChange = vi.fn();
    render(<TaskMetadataGridV3 task={TASK} onFieldChange={onFieldChange} {...overrides} />);
    return { onFieldChange };
}

describe('TaskMetadataGridV3 / oncelik', () => {
    it('Oncelik hucresini gorev degerini yansitarak gosterir', () => {
        renderGrid({ priorityValue: 3 });
        expect(screen.getByText('Öncelik')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /yüksek/i })).toBeInTheDocument();
    });

    it('menuden secilen oncelik onFieldChange e id ile gider', () => {
        const { onFieldChange } = renderGrid({ priorityValue: 2 });
        fireEvent.click(screen.getByRole('button', { name: /orta/i }));
        const menu = screen.getByText('Öncelik seç').parentElement;
        fireEvent.click(within(menu).getByText('Kritik'));
        expect(onFieldChange).toHaveBeenCalledWith('priority', 4);
    });

    it('priorityValue verilmezse task.priority e duser', () => {
        renderGrid();
        expect(screen.getByRole('button', { name: /orta/i })).toBeInTheDocument();
    });
});

/* Yetki (ROL-04): duzenleme izni yoksa izgara salt okunur — alanlar forma, oradan
   UpdateAsync'e gidiyor ve yetkisiz kullanici Kaydet'te 403 aliyordu. */
describe('TaskMetadataGridV3 / salt okunur', () => {
    it('readOnly iken tum dugme ve tarih girdileri kilitli, etiket ekleme yok', () => {
        renderGrid({ readOnly: true, tagsValue: ['acil'] });
        screen.getAllByRole('button').forEach((b) => expect(b).toBeDisabled());
        document.querySelectorAll('input[type=date]').forEach((i) => expect(i).toBeDisabled());
        expect(screen.queryByLabelText('Yeni etiket ekle')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Etiketi kaldır')).not.toBeInTheDocument();
        expect(screen.getByText('acil')).toBeInTheDocument();
    });

    it('varsayilan durumda alanlar duzenlenebilir', () => {
        renderGrid();
        expect(screen.getByRole('button', { name: /orta/i })).not.toBeDisabled();
        expect(screen.getByLabelText('Yeni etiket ekle')).toBeInTheDocument();
    });
});

/* CON-01: dogrulama dusunce yalniz bildirim cikiyordu; hata artik ilgili hucrenin altinda. */
describe('TaskMetadataGridV3 / dogrulama hatasi', () => {
    const DATES = { startDateValue: '2026-06-25', dueDateValue: '2020-01-01' };   // son tarih gecmiste → "gecikti" ipucu

    it('tarih girdilerinin erisilebilir adi var; hata yokken aria-invalid ve uyari yok', () => {
        renderGrid(DATES);
        expect(screen.getByLabelText('Başlangıç')).toHaveValue('2026-06-25');
        expect(screen.getByLabelText('Son tarih')).toHaveValue('2020-01-01');
        expect(screen.getByLabelText('Başlangıç')).not.toHaveAttribute('aria-invalid');
        expect(screen.getByLabelText('Son tarih')).not.toHaveAttribute('aria-invalid');
        expect(screen.queryByRole('alert')).toBeNull();
        expect(screen.getByText(/gün gecikti/)).toBeInTheDocument();
    });

    it('dueDateError: Son tarih girdisi aria-invalid, hata hucrede gorunur, aciliyet ipucu gizlenir', () => {
        renderGrid({ ...DATES, dueDateError: 'Son tarih başlangıç tarihinden önce olamaz.' });
        const input = screen.getByLabelText('Son tarih');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAccessibleDescription('Son tarih başlangıç tarihinden önce olamaz.');
        const alert = screen.getByRole('alert');
        expect(input.closest('label').parentElement).toContainElement(alert);
        expect(screen.queryByText(/gün gecikti/)).toBeNull();
        expect(screen.getByLabelText('Başlangıç')).not.toHaveAttribute('aria-invalid');
    });

    it('startDateError: Baslangic girdisi aria-invalid, hata hucrede gorunur', () => {
        renderGrid({ ...DATES, startDateValue: '', startDateError: 'Başlangıç tarihi zorunlu.' });
        const input = screen.getByLabelText('Başlangıç');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAccessibleDescription('Başlangıç tarihi zorunlu.');
        expect(input.closest('label').parentElement).toContainElement(screen.getByRole('alert'));
        expect(screen.getByLabelText('Son tarih')).not.toHaveAttribute('aria-invalid');
        expect(screen.getByText(/gün gecikti/)).toBeInTheDocument();
    });
});

/* Durum = projenin kanban kolonları: panoda eklenen özel kolon ("Test") Durum
   menüsünde de seçenektir; seçilince görev o kolona bağlanır, Status kolonun
   temel durumuna çekilir. */
describe('TaskMetadataGridV3 / durum = proje kolonları', () => {
    const COLUMNS = [
        { id: 'c1', statusValue: 1, name: 'Yapılacak', colorClass: 'secondary', order: 0, isSystem: true },
        { id: 'c2', statusValue: 2, name: 'Sürüyor', colorClass: 'warning', order: 1, isSystem: true },
        { id: 'c3', statusValue: 3, name: 'Testte', colorClass: 'info', order: 2, isSystem: true },
        { id: 'c4', statusValue: 4, name: 'Tamamlandı', colorClass: 'success', order: 3, isSystem: true },
        { id: 'x9', statusValue: 3, name: 'Test', colorClass: 'primary', order: 4, isSystem: false },
    ];
    const statusMenu = () => screen.getByText('Durumu değiştir').parentElement;

    it('menü projenin kolonlarını pano sırasıyla listeler', () => {
        renderGrid({ boardColumns: COLUMNS, statusValue: 1, boardColumnValue: null });
        fireEvent.click(screen.getByRole('button', { name: /yapılacak/i }));
        const labels = within(statusMenu()).getAllByRole('button').map((b) => b.textContent.trim());
        expect(labels).toEqual(['Yapılacak', 'Sürüyor', 'Testte', 'Tamamlandı', 'Test']);
    });

    it('özel kolon seçilince kolon bağı ve temel durumu birlikte gider', () => {
        const { onFieldChange } = renderGrid({ boardColumns: COLUMNS, statusValue: 1, boardColumnValue: null });
        fireEvent.click(screen.getByRole('button', { name: /yapılacak/i }));
        fireEvent.click(within(statusMenu()).getByText('Test'));
        expect(onFieldChange).toHaveBeenCalledWith('status', 3);
        expect(onFieldChange).toHaveBeenCalledWith('boardColumnId', 'x9');
    });

    it('sistem durumu seçilince kolon bağı temizlenir', () => {
        const { onFieldChange } = renderGrid({ boardColumns: COLUMNS, statusValue: 3, boardColumnValue: 'x9' });
        fireEvent.click(screen.getByRole('button', { name: /^test$/i }));
        fireEvent.click(within(statusMenu()).getByText('Sürüyor'));
        expect(onFieldChange).toHaveBeenCalledWith('status', 2);
        expect(onFieldChange).toHaveBeenCalledWith('boardColumnId', null);
    });

    it('rozet görevin özel kolonunu gösterir (aynı temel durumdaki sistem kolonunu değil)', () => {
        renderGrid({ boardColumns: COLUMNS, statusValue: 3, boardColumnValue: 'x9' });
        expect(screen.getByRole('button', { name: /^test$/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /testte/i })).not.toBeInTheDocument();
    });

    it('kolon yoksa (projesiz görev) dört temel durum', () => {
        renderGrid({ statusValue: 2 });
        fireEvent.click(screen.getByRole('button', { name: /sürüyor/i }));
        const labels = within(statusMenu()).getAllByRole('button').map((b) => b.textContent.trim());
        expect(labels).toEqual(['Yapılacak', 'Sürüyor', 'Testte', 'Tamamlandı']);
    });
});
