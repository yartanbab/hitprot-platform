import React, { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as RadixDialog from '@radix-ui/react-dialog';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';

/**
 * Ortak "kaydedilmemiş değişiklik" penceresi (CON-01, TSK-04, DOC-09).
 * Sözleşme: role=alertdialog · odak "Düzenlemeye devam et"te · Esc = kal · dışarı tıklama
 * hiçbir şey yapmaz · düğme sırası kal → at → kaydet · kayıt sürerken kilitli · iç içe
 * açılınca alttaki pencereye Esc / dışarı etkileşim gitmez.
 */

const STAY = 'Düzenlemeye devam et';
const DISCARD = 'Değişiklikleri at';
const SAVE = 'Kaydet ve çık';

function setup(props = {}) {
    const handlers = { onStay: vi.fn(), onDiscard: vi.fn(), onSave: vi.fn() };
    const view = render(<UnsavedChangesDialog open {...handlers} {...props} />);
    return { ...handlers, ...view };
}

const tick = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)));

describe('UnsavedChangesDialog — görünüm ve erişilebilirlik', () => {
    it('open=false iken hiçbir şey çizmez', () => {
        render(<UnsavedChangesDialog open={false} onStay={() => {}} onDiscard={() => {}} onSave={() => {}} />);
        expect(screen.queryByRole('alertdialog')).toBeNull();
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('role=alertdialog; adı başlık, açıklaması gövde metni (dialog DEĞİL)', () => {
        setup();
        const dialog = screen.getByRole('alertdialog', { name: 'Kaydedilmemiş değişiklikleriniz var' });
        expect(dialog).toHaveAccessibleDescription('Devam ederseniz kaydetmediğiniz değişiklikler kaybolur.');
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('onSave verilirse üç düğme: kal → at → kaydet (DOM sırası = Tab sırası)', () => {
        setup();
        expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual([STAY, DISCARD, SAVE]);
    });

    it('onSave verilmezse iki düğme', () => {
        setup({ onSave: undefined });
        expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual([STAY, DISCARD]);
    });

    it('metinler değiştirilebilir (belge bağlamı: açıklama + kaydet etiketi)', () => {
        setup({ description: 'Bu belgede yaptığınız değişiklikler kaydedilmedi.', saveLabel: 'Kaydet ve devam et' });
        expect(screen.getByRole('alertdialog')).toHaveAccessibleDescription('Bu belgede yaptığınız değişiklikler kaydedilmedi.');
        expect(screen.getByRole('button', { name: 'Kaydet ve devam et' })).toBeInTheDocument();
    });

    it('errorText role=alert ile görünür; verilmezse uyarı satırı yok', () => {
        const { rerender, onStay, onDiscard, onSave } = setup();
        expect(screen.queryByRole('alert')).toBeNull();
        rerender(<UnsavedChangesDialog open onStay={onStay} onDiscard={onDiscard} onSave={onSave} errorText="Kaydedilemedi." />);
        expect(screen.getByRole('alert')).toHaveTextContent('Kaydedilemedi.');
    });

    it('katman: içerik data-apya-overlay taşır; karartma ve sarmalayıcı z-modal (z-modal-backdrop değil)', () => {
        setup();
        const dialog = screen.getByRole('alertdialog');
        expect(dialog).toHaveAttribute('data-apya-overlay', 'unsaved');
        expect(dialog.parentElement).toHaveClass('z-modal');
        const overlay = document.querySelector('.bg-surface-overlay');
        expect(overlay).toHaveClass('z-modal');
        expect(overlay).not.toHaveClass('z-modal-backdrop');
    });
});

describe('UnsavedChangesDialog — odak ve klavye', () => {
    it('açılışta odak "Düzenlemeye devam et"te: boş Enter veri kaybettirmez', () => {
        setup();
        expect(screen.getByRole('button', { name: STAY })).toHaveFocus();
    });

    it('Tab / Shift+Tab yalnız pencerenin düğmeleri arasında döner', async () => {
        const user = userEvent.setup();
        render(
            <>
                <button type="button">Dışarıdaki düğme</button>
                <UnsavedChangesDialog open onStay={() => {}} onDiscard={() => {}} onSave={() => {}} />
            </>,
        );
        const stay = screen.getByRole('button', { name: STAY });
        const discard = screen.getByRole('button', { name: DISCARD });
        const save = screen.getByRole('button', { name: SAVE });

        expect(stay).toHaveFocus();
        await user.tab();
        expect(discard).toHaveFocus();
        await user.tab();
        expect(save).toHaveFocus();
        await user.tab();
        expect(stay).toHaveFocus();
        await user.tab({ shift: true });
        expect(save).toHaveFocus();
    });

    it('Esc onStay\'i çağırır; onDiscard ve onSave çağrılmaz', async () => {
        const { onStay, onDiscard, onSave } = setup();
        await userEvent.keyboard('{Escape}');
        expect(onStay).toHaveBeenCalledTimes(1);
        expect(onDiscard).not.toHaveBeenCalled();
        expect(onSave).not.toHaveBeenCalled();
    });

    it('arka plana tıklamak hiçbir geri çağrıyı tetiklemez', async () => {
        const { onStay, onDiscard, onSave } = setup();
        await userEvent.click(document.querySelector('.bg-surface-overlay'));
        expect(onStay).not.toHaveBeenCalled();
        expect(onDiscard).not.toHaveBeenCalled();
        expect(onSave).not.toHaveBeenCalled();
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    it('düğmeler kendi geri çağrısını çağırır', async () => {
        const { onStay, onDiscard, onSave } = setup();
        await userEvent.click(screen.getByRole('button', { name: DISCARD }));
        expect(onDiscard).toHaveBeenCalledTimes(1);
        await userEvent.click(screen.getByRole('button', { name: SAVE }));
        expect(onSave).toHaveBeenCalledTimes(1);
        await userEvent.click(screen.getByRole('button', { name: STAY }));
        expect(onStay).toHaveBeenCalledTimes(1);
    });

    it('isSaving: üç düğme kilitli, birincil düğme aria-busy + "Kaydediliyor…"; Esc yok sayılır', async () => {
        const { onStay } = setup({ isSaving: true });
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(3);
        buttons.forEach((b) => expect(b).toBeDisabled());
        expect(buttons[2]).toHaveAttribute('aria-busy', 'true');
        expect(buttons[2]).toHaveTextContent('Kaydediliyor…');

        await userEvent.keyboard('{Escape}');
        expect(onStay).not.toHaveBeenCalled();
    });
});

describe('UnsavedChangesDialog — odak iadesi', () => {
    function Harness() {
        const [open, setOpen] = useState(false);
        return (
            <>
                <button type="button" onClick={() => setOpen(true)}>Vazgeç</button>
                <input aria-label="Başka alan" />
                <UnsavedChangesDialog open={open} onStay={() => setOpen(false)} onDiscard={() => setOpen(false)} />
            </>
        );
    }

    it('kapanınca odak, açılmadan önce odakta olan öğeye döner', async () => {
        render(<Harness />);
        const opener = screen.getByRole('button', { name: 'Vazgeç' });
        opener.focus();
        fireEvent.click(opener);
        expect(screen.getByRole('button', { name: STAY })).toHaveFocus();

        fireEvent.click(screen.getByRole('button', { name: STAY }));

        await waitFor(() => expect(opener).toHaveFocus());
    });

    it('çağıran odağı başka öğeye taşıdıysa ezilmez', async () => {
        render(<Harness />);
        const opener = screen.getByRole('button', { name: 'Vazgeç' });
        opener.focus();
        fireEvent.click(opener);

        fireEvent.click(screen.getByRole('button', { name: DISCARD }));
        const other = screen.getByLabelText('Başka alan');
        other.focus();                       // ör. doğrulama hatasında hatalı alana odak
        await tick();
        await tick();

        expect(other).toHaveFocus();
    });
});

describe('UnsavedChangesDialog — iç içe katman', () => {
    it('bir pencerenin içinden açılınca alttaki pencereye Esc / dışarı etkileşim gitmez; kapanınca alttaki açık kalır', async () => {
        const parentEscape = vi.fn();
        const parentOutside = vi.fn();
        const parentOpenChange = vi.fn();

        function Nested() {
            const [open, setOpen] = useState(true);
            return (
                <RadixDialog.Root open onOpenChange={parentOpenChange}>
                    <RadixDialog.Portal>
                        <RadixDialog.Overlay />
                        <RadixDialog.Content
                            aria-describedby={undefined}
                            onEscapeKeyDown={parentEscape}
                            onInteractOutside={parentOutside}
                        >
                            <RadixDialog.Title>Alttaki pencere</RadixDialog.Title>
                            <UnsavedChangesDialog open={open} onStay={() => setOpen(false)} onDiscard={() => {}} onSave={() => {}} />
                        </RadixDialog.Content>
                    </RadixDialog.Portal>
                </RadixDialog.Root>
            );
        }
        render(<Nested />);
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();

        await userEvent.click(document.querySelector('.bg-surface-overlay'));
        expect(parentOutside).not.toHaveBeenCalled();
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();

        await userEvent.keyboard('{Escape}');

        expect(parentEscape).not.toHaveBeenCalled();
        expect(parentOpenChange).not.toHaveBeenCalled();
        await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
        expect(screen.getByRole('dialog', { name: 'Alttaki pencere' })).toBeInTheDocument();
    });
});
