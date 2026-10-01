import React, { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sheet, SheetContent, SheetClose, SheetTitle, SheetDescription } from './Sheet';

function renderSheet(props = {}, children = <button type="button">İçerik düğmesi</button>) {
    const { onOpenChange = () => {}, ...contentProps } = props;
    return render(
        <Sheet open onOpenChange={onOpenChange}>
            <SheetContent {...contentProps}>{children}</SheetContent>
        </Sheet>,
    );
}

/* Tutamak: alt panelin tepesindeki sürükleme ipucu (yalnız görsel; sürükleyerek kapatma yok). */
const handleOf = (sheet) => sheet.querySelector('.tablet\\:hidden');

describe('Sheet — erişilebilir ad ve açıklama', () => {
    it('title özelliği paneli adlandırır', () => {
        renderSheet({ title: 'Gün detayı' });

        expect(screen.getByRole('dialog', { name: 'Gün detayı' })).toBeInTheDocument();
    });

    it('<SheetTitle> görünür başlığı panele bağlar; sr-only kopya basılmaz', () => {
        renderSheet({ side: 'right', 'aria-describedby': undefined }, <SheetTitle>Yanıt Detayı</SheetTitle>);

        const sheet = screen.getByRole('dialog', { name: 'Yanıt Detayı' });
        expect(sheet.querySelector('.sr-only')).toBeNull();
        expect(screen.getAllByText('Yanıt Detayı')).toHaveLength(1);
    });

    /* Regresyon: `aria-describedby={description ? undefined : undefined}` özniteliği HER durumda
       siliyordu — description verilse bile açıklama panele bağlanmıyordu. */
    it('description verilince panel açıklamaya bağlıdır', () => {
        renderSheet({ title: 'Masraf detayları', description: 'Tutarları doğrulayın ve gönderin' });

        expect(screen.getByRole('dialog', { name: 'Masraf detayları' }))
            .toHaveAccessibleDescription('Tutarları doğrulayın ve gönderin');
    });

    it('<SheetDescription> görünür açıklamayı panele bağlar', () => {
        renderSheet({ title: 'Takvim senkronizasyonu' }, <SheetDescription>Bağlı takvim yok.</SheetDescription>);

        expect(screen.getByRole('dialog', { name: 'Takvim senkronizasyonu' }))
            .toHaveAccessibleDescription('Bağlı takvim yok.');
    });
});

describe('Sheet — sürükleme tutamağı', () => {
    /* Sağ panel telefonda da kenardan açılır; tepesindeki alt-panel tutamağı yanlış ipucuydu. */
    it("side='right' iken tutamak basılmaz", () => {
        renderSheet({ title: 'Akıllı erteleme', side: 'right' });

        expect(handleOf(screen.getByRole('dialog'))).toBeNull();
    });

    it("side verilmezse ve 'bottom'da tutamak basılır", () => {
        const { unmount } = renderSheet({ title: 'Masraf detayları' });
        expect(handleOf(screen.getByRole('dialog'))).not.toBeNull();
        unmount();

        renderSheet({ title: 'Gün detayı', side: 'bottom' });
        expect(handleOf(screen.getByRole('dialog'))).not.toBeNull();
    });
});

describe('Sheet — kapanma ve odak', () => {
    it('Escape onOpenChange(false) tetikler', async () => {
        const onOpenChange = vi.fn();
        renderSheet({ title: 'Gün detayı', onOpenChange });

        await userEvent.keyboard('{Escape}');

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('karartmaya tıklamak onOpenChange(false) tetikler', async () => {
        const onOpenChange = vi.fn();
        renderSheet({ title: 'Gün detayı', onOpenChange });

        await userEvent.click(document.querySelector('.z-modal-backdrop'));

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    /* Radix kapanışta odağı yalnız <Dialog.Trigger>'a verir; denetimli kullanımda (open özelliği)
       odak <body>'ye düşüyordu. İade FocusScope'ta setTimeout(0) ile gelir → waitFor. */
    function OpenerHarness({ contentProps }) {
        const [open, setOpen] = useState(false);
        return (
            <>
                <button type="button" onClick={() => setOpen(true)}>Detay</button>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetContent side="right" title="Yanıt Detayı" {...contentProps}>
                        <SheetClose>Kapat</SheetClose>
                    </SheetContent>
                </Sheet>
            </>
        );
    }

    it('kapanınca odak açan düğmeye döner', async () => {
        render(<OpenerHarness />);
        const opener = screen.getByRole('button', { name: 'Detay' });

        await userEvent.click(opener);
        expect(screen.getByRole('button', { name: 'Kapat' })).toHaveFocus();
        await userEvent.keyboard('{Escape}');

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        await waitFor(() => expect(opener).toHaveFocus());
    });

    it("çağıranın onCloseAutoFocus'u preventDefault ederse ortak iade devreye girmez", async () => {
        const onCloseAutoFocus = vi.fn((e) => e.preventDefault());
        render(<OpenerHarness contentProps={{ onCloseAutoFocus }} />);
        const opener = screen.getByRole('button', { name: 'Detay' });

        await userEvent.click(opener);
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(onCloseAutoFocus).toHaveBeenCalledTimes(1));

        expect(opener).not.toHaveFocus();
    });
});
