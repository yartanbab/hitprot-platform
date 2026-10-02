import React, { useEffect } from 'react';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Popover from '@radix-ui/react-popover';
import { ToastProvider, useToast } from './Toast';
import { Sheet } from '../../components/ui/Sheet';
import { Dialog, DialogContent } from '../../components/ui/Dialog';

/* Bildirim, açık pencerenin (Radix Dialog/Sheet) ağacının DIŞINDA basılır. Yalıtım olmadan
   bildirime yapılan her tıklama pencere için "dışarı etkileşim"dir: Masraf Yakala'da başarısız
   kayıttan sonra bildirime ya da "×"ine basmak paneli kapatıp yazılanları siliyordu.

   Testte Tailwind yüklü değil: Radix'in body'ye verdiği pointer-events:none bildirime miras
   kalır (gerçekte .pointer-events-auto ezer) → userEvent'in pointer-events denetimi kapatılır. */
const user = () => userEvent.setup({ pointerEventsCheck: 0 });

function ShowOnMount() {
    const toast = useToast();
    useEffect(() => { toast.error('Kayıt başarısız', { description: 'Tutar alanını düzeltin.' }); }, [toast]);
    return null;
}

function SheetHarness({ onOpenChange }) {
    const toast = useToast();
    return (
        <Sheet open onOpenChange={onOpenChange}>
            <Sheet.Content title="Masraf detayları">
                <button type="button" onClick={() => toast.error('Kayıt başarısız', { description: 'Tutar alanını düzeltin.' })}>
                    Gönder
                </button>
            </Sheet.Content>
        </Sheet>
    );
}

function DialogHarness({ onOpenChange }) {
    const toast = useToast();
    return (
        <Dialog open onOpenChange={onOpenChange}>
            <DialogContent title="Görev Detayı">
                <button type="button" onClick={() => toast.success('Kaydedildi')}>Kaydet</button>
            </DialogContent>
        </Dialog>
    );
}

describe('Toast — üst katman yalıtımı', () => {
    it('bölge üst katman olarak işaretlenir (pencere açıkken konum kuralı ve yalıtım bu işarete bakar)', () => {
        render(<ToastProvider><ShowOnMount /></ToastProvider>);

        expect(screen.getByRole('region', { name: 'Bildirimler' })).toHaveAttribute('data-apya-overlay', 'toast');
    });

    it('bölgedeki basma/odak olayları belgeye sızmaz; click sızar', () => {
        render(<ToastProvider><ShowOnMount /></ToastProvider>);
        const isolated = ['pointerdown', 'mousedown', 'touchstart', 'focusin'];
        const outside = vi.fn();
        const clicked = vi.fn();
        isolated.forEach((name) => document.addEventListener(name, outside));
        document.addEventListener('click', clicked);

        const close = screen.getByLabelText('Bildirimi kapat');
        isolated.forEach((name) => close.dispatchEvent(new Event(name, { bubbles: true })));
        expect(outside).not.toHaveBeenCalled();

        screen.getByText('Kayıt başarısız').dispatchEvent(new Event('click', { bubbles: true }));
        expect(clicked).toHaveBeenCalledTimes(1);

        isolated.forEach((name) => document.removeEventListener(name, outside));
        document.removeEventListener('click', clicked);
    });

    it('panel açıkken bildirime ya da "×"ine basmak paneli kapatmaz; "×" yalnız bildirimi kapatır', async () => {
        const onOpenChange = vi.fn();
        const u = user();
        render(<ToastProvider><SheetHarness onOpenChange={onOpenChange} /></ToastProvider>);

        await u.click(screen.getByRole('button', { name: 'Gönder' }));
        await u.click(screen.getByText('Kayıt başarısız'));
        expect(onOpenChange).not.toHaveBeenCalled();

        await u.click(screen.getByLabelText('Bildirimi kapat'));
        expect(onOpenChange).not.toHaveBeenCalled();
        await waitFor(() => expect(screen.queryByText('Kayıt başarısız')).not.toBeInTheDocument());
        expect(screen.getByRole('dialog', { name: 'Masraf detayları' })).toBeInTheDocument();
    });

    it('merkezi pencere açıkken de bildirime basmak pencereyi kapatmaz', async () => {
        const onOpenChange = vi.fn();
        const u = user();
        render(<ToastProvider><DialogHarness onOpenChange={onOpenChange} /></ToastProvider>);

        await u.click(screen.getByRole('button', { name: 'Kaydet' }));
        await u.click(screen.getByText('Kaydedildi'));
        await u.click(screen.getByLabelText('Bildirimi kapat'));

        expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('arka plana tıklamak paneli kapatmaya devam eder (yalıtım yalnız bildirim bölgesinde)', async () => {
        const onOpenChange = vi.fn();
        const u = user();
        render(<ToastProvider><SheetHarness onOpenChange={onOpenChange} /></ToastProvider>);

        await u.click(screen.getByRole('button', { name: 'Gönder' }));
        await u.click(document.querySelector('.z-modal-backdrop'));

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });
});

/* Bildirim sağ-altta çıkar; açık pencerenin eylem düğmeleri de oradadır ("İptal / Gönder",
   "Vazgeç / Kaydet"). Pencere açıkken bildirim üst-ortaya alınır — kural apya-shell.css §4b'de,
   abp.notify balonuyla ortak. Konum canlıda ölçülür (jsdom yerleşim hesaplamaz); burada kuralın
   varlığı ve seçicilerinin gerçek DOM'la eşleştiği kilitlenir: işaret ya da Radix'in bastığı
   öznitelikler değişirse kural sessizce boşa düşer, bildirim yeniden düğmeleri örter. */
describe('Toast — pencere açıkken üst-orta (apya-shell.css §4b)', () => {
    const css = readFileSync(
        path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../css/apya-shell.css'), 'utf8');
    const WINDOW_OPEN = ':root:has([role="dialog"][data-state="open"]:not([data-radix-popper-content-wrapper] *), .modal.show)';

    it('kural iki bildirim sistemini de hedefler: ABP kabı ve bu bölgenin işareti', () => {
        expect(css).toContain(`${WINDOW_OPEN} .abp-toast-container,`);
        expect(css).toContain(`${WINDOW_OPEN} [data-apya-overlay="toast"] {`);
    });

    it('açık panel kuralın "pencere" tanımına uyar', () => {
        render(<ToastProvider><SheetHarness onOpenChange={() => {}} /></ToastProvider>);

        const sheet = screen.getByRole('dialog', { name: 'Masraf detayları' });
        expect(sheet).toHaveAttribute('data-state', 'open');
        expect(sheet.closest('[data-radix-popper-content-wrapper]')).toBeNull();
    });

    it('Popover pencere sayılmaz: o da role=dialog taşır ama popper sarmalayıcısının içindedir', () => {
        vi.stubGlobal('ResizeObserver', class { observe() { } unobserve() { } disconnect() { } });
        render(
            <Popover.Root open>
                <Popover.Trigger>Aç</Popover.Trigger>
                <Popover.Portal><Popover.Content>İçerik</Popover.Content></Popover.Portal>
            </Popover.Root>,
        );

        const content = screen.getByRole('dialog');
        expect(content).toHaveAttribute('data-state', 'open');
        expect(content.closest('[data-radix-popper-content-wrapper]')).not.toBeNull();
        vi.unstubAllGlobals();
    });
});
