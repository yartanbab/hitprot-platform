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
        expect(content.className).toContain('h-[min(88dvh,940px)]');
    });

    it('fullscreen modunda kenar bosluklu tam viewport kaplar', () => {
        renderDialog({ fullscreen: true });
        const content = screen.getByRole('dialog');
        expect(content.className).toContain('h-[calc(100dvh-2*var(--apya-space-4))]');
        expect(content.className).not.toContain('w-[min(92vw,1400px)]');
    });

    it('mobilde tam ekrana duser', () => {
        renderDialog();
        const content = screen.getByRole('dialog');
        expect(content.className).toContain('mobile:w-screen');
        expect(content.className).toContain('mobile:h-[100dvh]');
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
});
