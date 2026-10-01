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
