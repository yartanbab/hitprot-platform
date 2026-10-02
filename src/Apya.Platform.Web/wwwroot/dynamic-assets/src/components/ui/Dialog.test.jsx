import React, { useEffect, useRef, useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from './Dialog';
import { restoreOpenerFocus } from './openerFocus';

function renderDialog(props = {}) {
    return render(
        <Dialog open onOpenChange={props.onOpenChange ?? (() => {})}>
            <DialogContent title="Görev Detayı" {...props}>
                <button type="button">İçerik butonu</button>
            </DialogContent>
        </Dialog>,
    );
}

describe('Dialog', () => {
    it('acikken role=dialog ve erisilebilir isimle render eder', () => {
        renderDialog();
        expect(screen.getByRole('dialog', { name: 'Görev Detayı' })).toBeInTheDocument();
    });

    it('varsayilan boyutta viewport-orantili genislik kullanir, sabit px degil', () => {
        renderDialog();
        const content = screen.getByRole('dialog');
        expect(content.className).toContain('w-[min(92vw,1400px)]');
        expect(content.className).toContain('h-[min(88svh,940px)]');
    });

    /* Regresyon: ciplak `tablet:min-h-[520px]` yatay telefonda (932x430 -> genislik
       768'i astigi icin tablet: devrede) paneli viewport'tan uzun yapiyor, panel
       ortalandigi ve overflow-hidden oldugu icin ustten VE alttan kirpiliyordu.
       min-h daima viewport'a kiskaclanmali. */
    it('min-height i viewport a kiskaclar, sabit px e sabitlemez', () => {
        renderDialog();
        const content = screen.getByRole('dialog');
        expect(content.className).toContain('tablet:min-h-[min(520px,88svh)]');
        expect(content.className).not.toContain('tablet:min-h-[520px]');
    });

    it('fullscreen modunda kenar bosluklu tam viewport kaplar', () => {
        renderDialog({ fullscreen: true });
        const content = screen.getByRole('dialog');
        expect(content.className).toContain('h-[calc(100svh-2*var(--apya-space-4))]');
        expect(content.className).not.toContain('w-[min(92vw,1400px)]');
    });

    it('mobilde tam ekrana duser', () => {
        renderDialog();
        const content = screen.getByRole('dialog');
        expect(content.className).toContain('mobile:w-screen');
        expect(content.className).toContain('mobile:h-[100svh]');
    });

    it('Escape onOpenChange(false) tetikler', async () => {
        const onOpenChange = vi.fn();
        renderDialog({ onOpenChange });
        await userEvent.keyboard('{Escape}');
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('onInteractOutside verilirse backdrop tiklamasi engellenebilir', async () => {
        const onInteractOutside = vi.fn((e) => e.preventDefault());
        const onOpenChange = vi.fn();
        renderDialog({ onInteractOutside, onOpenChange });
        // Click on the overlay backdrop (which has z-modal-backdrop class)
        const overlay = document.querySelector('.z-modal-backdrop');
        await userEvent.click(overlay);
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
    });

    // dialogIn keyframe konumlamayı transform(-50%,-50%) ile yapiyordu; giris
    // animasyonuyla ayni property'yi paylasinca animasyon "both" fill-mode ile
    // kalici olarak kazaniyor ve modal mobilde ekran disinda sabitleniyordu.
    // Fix: konum artik flexbox wrapper'da, transform sadece scale/opacity icin.
    it('konumlama artik transform/translate degil, flexbox wrapper ile yapiliyor', () => {
        renderDialog();
        const content = screen.getByRole('dialog');
        // Eski transform-tabanli merkezleme siniflari kalmamali.
        expect(content.className).not.toContain('left-1/2');
        expect(content.className).not.toContain('top-1/2');
        expect(content.className).not.toContain('-translate-x-1/2');
        expect(content.className).not.toContain('-translate-y-1/2');
        expect(content.className).not.toContain('mobile:left-0');
        expect(content.className).not.toContain('mobile:top-0');
        expect(content.className).not.toContain('mobile:translate-x-0');
        expect(content.className).not.toContain('mobile:translate-y-0');
    });

    // pointer-events cifti: wrapper "none" olmazsa backdrop tiklamasi wrapper'a
    // takilir ve Radix'in outside-click algisi (dirty-guard bunun uzerinden
    // kapaniyor) bozulur. Content "auto" olmazsa pointer-events:none INHERIT
    // eder ve modal icindeki HICBIR tiklama calismaz (sessiz regresyon).
    it('sarmalayici pointer-events-none, icerik pointer-events-auto tasir', () => {
        renderDialog();
        const content = screen.getByRole('dialog');
        const wrapper = content.parentElement;
        expect(wrapper.className).toContain('pointer-events-none');
        expect(wrapper.className).toContain('fixed');
        expect(wrapper.className).toContain('inset-0');
        expect(content.className).toContain('pointer-events-auto');
    });

    it('icerik icindeki bir buton tiklanabilir kalir (pointer-events zinciri kirilmamis)', async () => {
        const onClick = vi.fn();
        render(
            <Dialog open onOpenChange={() => {}}>
                <DialogContent title="Görev Detayı">
                    <button type="button" onClick={onClick}>Kaydet</button>
                </DialogContent>
            </Dialog>,
        );
        await userEvent.click(screen.getByRole('button', { name: 'Kaydet' }));
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});

const classesOf = (el) => el.className.split(/\s+/);

/* size="compact": onay / kisa form pencereleri. Elle yazilmis kabuklar (Kategoriler, Yayinla,
   Dokumanlar kurulumu...) ortak Dialog'a bununla tasinir; her cagrida alti `mobile:` sinifini
   ezmek gerekmesin diye boyut bilesenin icinde. */
describe('Dialog — compact boyut', () => {
    it('icerige gore boylanir, telefonda kart kalir', () => {
        renderDialog({ size: 'compact' });
        const classes = classesOf(screen.getByRole('dialog'));

        expect(classes).toEqual(expect.arrayContaining([
            'w-[calc(100vw-2*var(--apya-space-4))]',
            'max-w-md',
            'h-auto',
            'max-h-[calc(100svh-2*var(--apya-space-4))]',
            'overflow-y-auto',
            'overflow-x-hidden',
        ]));
        [
            'w-[min(92vw,1400px)]',
            'h-[min(88svh,940px)]',
            'tablet:min-h-[min(520px,88svh)]',
            'overflow-hidden',
            'mobile:w-screen',
            'mobile:h-[100svh]',
            'mobile:max-w-none',
            'mobile:rounded-none',
            'mobile:border-0',
            'mobile:pb-[env(safe-area-inset-bottom)]',
        ].forEach((name) => expect(classes).not.toContain(name));
    });

    /* Genislik, zemin ve cerceve cagirandan gelir. tailwind-merge ozel renk adlarini
       (surface-*, border-strong) ayni gruba almazsa iki sinif birden basilir ve hangisinin
       kazanacagi stil dosyasindaki siraya kalir. */
    it('className genisligi, zemini ve cerceveyi ezer', () => {
        renderDialog({ size: 'compact', className: 'max-w-lg bg-surface-elevated border-strong' });
        const classes = classesOf(screen.getByRole('dialog'));

        expect(classes).toEqual(expect.arrayContaining(['max-w-lg', 'bg-surface-elevated', 'border-strong']));
        expect(classes).not.toContain('max-w-md');
        expect(classes).not.toContain('bg-surface-base');
        expect(classes).not.toContain('border-default');
    });

    it('fullscreen verilirse fullscreen kazanir', () => {
        renderDialog({ size: 'compact', fullscreen: true });
        const classes = classesOf(screen.getByRole('dialog'));

        expect(classes).toContain('h-[calc(100svh-2*var(--apya-space-4))]');
        expect(classes).toContain('mobile:w-screen');
        expect(classes).not.toContain('h-auto');
        expect(classes).not.toContain('max-w-md');
    });

    it('varsayilan boyut degismedi: tasma kirpilir, telefonda tam ekran', () => {
        renderDialog();
        const classes = classesOf(screen.getByRole('dialog'));

        expect(classes).toEqual(expect.arrayContaining([
            'overflow-hidden',
            'mobile:w-screen',
            'mobile:h-[100svh]',
            'mobile:max-w-none',
            'mobile:rounded-none',
            'mobile:border-0',
            'mobile:pb-[env(safe-area-inset-bottom)]',
        ]));
        expect(classes).not.toContain('h-auto');
        expect(classes).not.toContain('overflow-y-auto');
    });
});

describe('Dialog — gorunur baslik ve aciklama', () => {
    /* Eskiden title verilmese de bos bir sr-only <h2> basiliyordu: gorunur basligi
       <DialogTitle> ile veren pencerede ayni id iki kez gecer, ad BOS okunurdu. */
    it('title verilmezse bos sr-only baslik basilmaz; DialogTitle pencereyi adlandirir', () => {
        render(
            <Dialog open onOpenChange={() => {}}>
                <DialogContent size="compact" aria-describedby={undefined}>
                    <DialogTitle>Kategoriler</DialogTitle>
                    <button type="button">Ekle</button>
                </DialogContent>
            </Dialog>,
        );

        const dialog = screen.getByRole('dialog', { name: 'Kategoriler' });
        expect(dialog.querySelector('.sr-only')).toBeNull();
        expect(screen.getAllByRole('heading')).toHaveLength(1);
        expect(screen.getAllByText('Kategoriler')).toHaveLength(1);
    });

    it('DialogDescription erisilebilir aciklama olur; asChild verilen div e id basar', () => {
        render(
            <Dialog open onOpenChange={() => {}}>
                <DialogContent title="Üretim öncesi kontrol" size="compact">
                    <DialogDescription asChild>
                        <div>Paket üretilebilir.</div>
                    </DialogDescription>
                </DialogContent>
            </Dialog>,
        );

        const dialog = screen.getByRole('dialog', { name: 'Üretim öncesi kontrol' });
        const description = screen.getByText('Paket üretilebilir.');
        expect(dialog).toHaveAccessibleDescription('Paket üretilebilir.');
        expect(description.tagName).toBe('DIV');
        expect(description.id).toBe(dialog.getAttribute('aria-describedby'));
    });
});

/* Radix modal Dialog kapanista odagi YALNIZ <Dialog.Trigger>'a verir. Depodaki kullanimlar
   denetimli (open ozelligi, Trigger yok) → kapanista odak <body>'ye dusuyordu. Iade Radix'in
   FocusScope'unda setTimeout(0) ile gelir: beklentiler waitFor ile. */
function OpenerHarness({ keepMounted = false, contentProps }) {
    const [open, setOpen] = useState(false);
    const dialog = (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent title="Görev Detayı" {...contentProps}>
                <DialogClose>Kapat</DialogClose>
            </DialogContent>
        </Dialog>
    );
    return (
        <>
            <button type="button" onClick={() => setOpen(true)}>Aç</button>
            <button type="button" onClick={() => setOpen(true)}>Diğerinden aç</button>
            {keepMounted ? dialog : open && dialog}
        </>
    );
}

describe('Dialog — odak', () => {
    it('odak acilista pencerenin icinde baslar', () => {
        renderDialog();
        expect(screen.getByRole('button', { name: 'İçerik butonu' })).toHaveFocus();
    });

    it('Tab pencere icinde doner (son ogeden ilk ogeye)', async () => {
        render(
            <>
                <button type="button">Arkadaki</button>
                <Dialog open onOpenChange={() => {}}>
                    <DialogContent title="Görev Detayı">
                        <button type="button">İlk</button>
                        <button type="button">Son</button>
                    </DialogContent>
                </Dialog>
            </>,
        );
        expect(screen.getByRole('button', { name: 'İlk' })).toHaveFocus();

        await userEvent.tab();
        expect(screen.getByRole('button', { name: 'Son' })).toHaveFocus();
        await userEvent.tab();
        expect(screen.getByRole('button', { name: 'İlk' })).toHaveFocus();
    });

    it('kapaninca odak acan dugmeye doner — kosullu baglanan kullanim', async () => {
        render(<OpenerHarness />);
        const opener = screen.getByRole('button', { name: 'Aç' });

        await userEvent.click(opener);
        expect(screen.getByRole('button', { name: 'Kapat' })).toHaveFocus();
        await userEvent.keyboard('{Escape}');

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        await waitFor(() => expect(opener).toHaveFocus());
    });

    it('kapaninca odak acan dugmeye doner — hep bagli kullanim', async () => {
        render(<OpenerHarness keepMounted />);
        const opener = screen.getByRole('button', { name: 'Aç' });

        await userEvent.click(opener);
        await userEvent.click(screen.getByRole('button', { name: 'Kapat' }));

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        await waitFor(() => expect(opener).toHaveFocus());

        // Her acilista acan oge YENIDEN yakalanir (ilk acilistaki kalici degil).
        const second = screen.getByRole('button', { name: 'Diğerinden aç' });
        await userEvent.click(second);
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(second).toHaveFocus());
    });

    it('acan oge belgeden kalktiysa odak calinmaz, hata da vermez', async () => {
        const onCloseAutoFocus = vi.fn();
        function Harness() {
            const [open, setOpen] = useState(false);
            const [showOpener, setShowOpener] = useState(true);
            return (
                <>
                    {showOpener && <button type="button" onClick={() => setOpen(true)}>Aç</button>}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent title="Görev Detayı" onCloseAutoFocus={onCloseAutoFocus}>
                            <button type="button" onClick={() => setShowOpener(false)}>Açanı kaldır</button>
                        </DialogContent>
                    </Dialog>
                </>
            );
        }
        render(<Harness />);

        await userEvent.click(screen.getByRole('button', { name: 'Aç' }));
        await userEvent.click(screen.getByRole('button', { name: 'Açanı kaldır' }));
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(onCloseAutoFocus).toHaveBeenCalledTimes(1));

        expect(document.body).toHaveFocus();

        // Kopuk ogede olaya dokunulmaz: Radix'in kendi dali (<Dialog.Trigger>) calisabilsin.
        const event = new Event('closeAutoFocus', { cancelable: true });
        restoreOpenerFocus(event, { current: document.createElement('button') });
        expect(event.defaultPrevented).toBe(false);
    });

    /* Kapanirken cagiran odagi baska yere tasidiysa (hatali alan, yeni acilan pencere)
       ortak iade onu ezmemeli. */
    it('odagi baska bir oge aldiysa odak calinmaz', async () => {
        const onCloseAutoFocus = vi.fn();
        function Harness() {
            const [open, setOpen] = useState(false);
            const wasOpen = useRef(false);
            const otherRef = useRef(null);
            useEffect(() => {
                if (!open && wasOpen.current) otherRef.current.focus();
                wasOpen.current = open;
            }, [open]);
            return (
                <>
                    <button type="button" onClick={() => setOpen(true)}>Aç</button>
                    <button type="button" ref={otherRef}>Başka</button>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent title="Görev Detayı" onCloseAutoFocus={onCloseAutoFocus}>
                            <DialogClose>Kapat</DialogClose>
                        </DialogContent>
                    </Dialog>
                </>
            );
        }
        render(<Harness />);

        await userEvent.click(screen.getByRole('button', { name: 'Aç' }));
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(onCloseAutoFocus).toHaveBeenCalledTimes(1));

        expect(screen.getByRole('button', { name: 'Başka' })).toHaveFocus();
    });

    it('cagiranin onCloseAutoFocus u preventDefault ederse ortak iade devreye girmez', async () => {
        const onCloseAutoFocus = vi.fn((e) => e.preventDefault());
        render(<OpenerHarness contentProps={{ onCloseAutoFocus }} />);
        const opener = screen.getByRole('button', { name: 'Aç' });

        await userEvent.click(opener);
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(onCloseAutoFocus).toHaveBeenCalledTimes(1));

        expect(opener).not.toHaveFocus();
        expect(document.body).toHaveFocus();
    });
});
