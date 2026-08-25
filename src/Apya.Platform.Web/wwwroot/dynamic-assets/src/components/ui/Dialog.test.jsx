import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogContent } from './Dialog';

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
