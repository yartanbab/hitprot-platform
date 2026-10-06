import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RiskDialog } from './RiskDialog';

/**
 * Risk kayıt penceresi (PRJ-09).
 *
 * Dört ardışık tarayıcı istem kutusunun yerine geçti. Burada ölçülen, o zincirin üç kusuru:
 * yarıda vazgeçince öncekilerin kaybolması, sayı yerine yazılan her şeyin sessizce 3
 * sayılması ve risk puanının ancak kayıttan sonra görülmesi.
 */
function setup(props = {}) {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(<RiskDialog open busy={false} onClose={onClose} onSubmit={onSubmit} {...props} />);
    return { onSubmit, onClose, user: userEvent.setup() };
}

describe('RiskDialog', () => {
    it('dört alanı birlikte sorar ve tek kayıtta gönderir', async () => {
        const { onSubmit, user } = setup();

        await user.type(screen.getByLabelText('Risk başlığı'), '  Tedarikçi gecikmesi  ');
        await user.selectOptions(screen.getByLabelText('Olasılık (1-5)'), '4');
        await user.selectOptions(screen.getByLabelText('Etki (1-5)'), '5');
        await user.type(screen.getByLabelText('Önlem (boş bırakılabilir)'), 'İkinci tedarikçi');
        await user.click(screen.getByRole('button', { name: 'Riski ekle' }));

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith({
            title: 'Tedarikçi gecikmesi',
            likelihood: 4,
            impact: 5,
            mitigation: 'İkinci tedarikçi',
        });
    });

    it('puanı kayıttan önce gösterir', async () => {
        const { user } = setup();

        expect(screen.getByTestId('risk-score')).toHaveTextContent('9');

        await user.selectOptions(screen.getByLabelText('Olasılık (1-5)'), '5');
        await user.selectOptions(screen.getByLabelText('Etki (1-5)'), '4');

        expect(screen.getByTestId('risk-score')).toHaveTextContent('20');
    });

    it('başlık boşken kaydetmez; boş önlem null gider', async () => {
        const { onSubmit, user } = setup();
        const submit = screen.getByRole('button', { name: 'Riski ekle' });

        expect(submit).toBeDisabled();

        await user.type(screen.getByLabelText('Risk başlığı'), '   ');
        expect(submit).toBeDisabled();

        await user.type(screen.getByLabelText('Risk başlığı'), 'Kur riski');
        await user.click(submit);

        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ title: 'Kur riski', mitigation: null }));
    });

    it('olasılık ve etki yalnız 1-5 seçilebilir; serbest metin yok', () => {
        setup();

        const options = (label) => Array.from(screen.getByLabelText(label).querySelectorAll('option'))
            .map((o) => o.value);

        expect(options('Olasılık (1-5)')).toEqual(['1', '2', '3', '4', '5']);
        expect(options('Etki (1-5)')).toEqual(['1', '2', '3', '4', '5']);
    });

    it('vazgeçmek hiçbir şey göndermez', async () => {
        const { onSubmit, onClose, user } = setup();

        await user.type(screen.getByLabelText('Risk başlığı'), 'Yarım kayıt');
        await user.click(screen.getByRole('button', { name: 'Vazgeç' }));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('başlık sunucudaki sınırla sınırlıdır', () => {
        setup();

        expect(screen.getByLabelText('Risk başlığı')).toHaveAttribute('maxlength', '200');
        expect(screen.getByLabelText('Önlem (boş bırakılabilir)')).toHaveAttribute('maxlength', '1000');
    });
});
