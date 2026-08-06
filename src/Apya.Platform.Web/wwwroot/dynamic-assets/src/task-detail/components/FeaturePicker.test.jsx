import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeaturePicker } from './FeaturePicker';

const ENTRIES = [
    { code: 'checklist', title: 'Kontrol Listesi', icon: 'fa-square-check', category: 'gorev', implemented: false, isAssigned: false },
    { code: 'comments', title: 'Yorumlar', icon: 'fa-comments', category: 'iletisim', implemented: true, isAssigned: false },
    { code: 'finance', title: 'Finans', icon: 'fa-coins', category: 'finans', implemented: true, isAssigned: true },
];

// Dışa-tıklama/Escape kapatma davranışı artık burada test edilmiyor: mantık
// TaskDetailRoot'taki ortak wrapper'a taşındı (bkz. TaskDetailRoot.jsx'teki
// pickerRef effect'i) çünkü bug yalnız "+" butonu ve panel GERÇEK kardeşlerken
// ortaya çıkıyordu — FeaturePicker'ı burada tek başına render etmek bunu hiç
// tetiklemiyordu. Entegrasyon testi: TaskDetailRoot.featureTabs.test.jsx.
describe('FeaturePicker', () => {
    it('implemented olmayan entry Yakinda rozetiyle gorunur, Ekle butonu yok', () => {
        render(<FeaturePicker entries={ENTRIES} onAdd={() => {}} onRemove={() => {}} busyCode={null} />);
        const row = screen.getByText('Kontrol Listesi').closest('div');
        expect(row).toHaveTextContent('Yakında');
        // Verify no Ekle button in the unimplemented row
        const buttons = row.querySelectorAll('button');
        expect(buttons.length).toBe(0);
    });

    it('implemented ve atanmamis entry Ekle butonu gosterir, tiklayinca onAdd cagirir', async () => {
        const onAdd = vi.fn();
        render(<FeaturePicker entries={ENTRIES} onAdd={onAdd} onRemove={() => {}} busyCode={null} />);
        await userEvent.click(screen.getByRole('button', { name: 'Ekle' }));
        expect(onAdd).toHaveBeenCalledWith('comments');
    });

    it('implemented ve atanmis entry Kaldir butonu gosterir, tiklayinca onRemove cagirir', async () => {
        const onRemove = vi.fn();
        render(<FeaturePicker entries={ENTRIES} onAdd={() => {}} onRemove={onRemove} busyCode={null} />);
        await userEvent.click(screen.getByRole('button', { name: 'Kaldır' }));
        expect(onRemove).toHaveBeenCalledWith('finance');
    });

    it('arama kutusu baslikta filtreler', async () => {
        render(<FeaturePicker entries={ENTRIES} onAdd={() => {}} onRemove={() => {}} busyCode={null} />);
        await userEvent.type(screen.getByLabelText('Özellik ara'), 'finans');
        // Look for the entry title specifically (in the span, not category label)
        const entries = screen.getAllByText('Finans');
        expect(entries.some((el) => el.className.includes('text-text-primary'))).toBe(true);
        expect(screen.queryByText('Yorumlar')).not.toBeInTheDocument();
    });

    it('busyCode eslesen satirin butonunu devre disi birakir', () => {
        render(<FeaturePicker entries={ENTRIES} onAdd={() => {}} onRemove={() => {}} busyCode="comments" />);
        expect(screen.getByRole('button', { name: 'Ekle' })).toBeDisabled();
    });
});
