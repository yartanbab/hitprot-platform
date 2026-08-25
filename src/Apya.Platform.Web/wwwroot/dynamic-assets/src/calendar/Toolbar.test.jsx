import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toolbar, NewTaskFab } from './Toolbar';

/* Ortak zorunlu proplar — testler yalnız `compact`'in etkisini ölçer. */
const base = {
    title: 'Ağustos 2026',
    view: 'month',
    onView: () => {},
    onPrev: () => {},
    onNext: () => {},
    onToday: () => {},
    overloadDays: 0,
    onHelp: () => {},
};

describe('Toolbar', () => {
    it('geniş kapta birincil eylem ve yardımcı düğmeler araç çubuğunda kalır', () => {
        render(<Toolbar {...base} />);
        expect(screen.getByRole('button', { name: /Yeni görev/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Yazdır' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Klavye kısayolları' })).toBeInTheDocument();
    });

    /* Regresyon: dar kapta bu üçü satırı 375px'in dışına taşırıyor, "Yeni görev"
       ekran dışında kalıyordu. Birincil eylem FAB'a taşındı, diğer ikisi
       (A4 baskı + klavye kısayolu) telefonda anlamsız olduğu için çizilmiyor. */
    it('dar kapta Yeni görev / Yazdır / Kısayol çizilmez', () => {
        render(<Toolbar {...base} compact />);
        expect(screen.queryByRole('button', { name: /Yeni görev/ })).toBeNull();
        expect(screen.queryByRole('button', { name: 'Yazdır' })).toBeNull();
        expect(screen.queryByRole('button', { name: 'Klavye kısayolları' })).toBeNull();
    });

    it('dar kapta görünüm sekmeleri ve gezinme KALIR', () => {
        render(<Toolbar {...base} compact />);
        expect(screen.getByRole('tab', { name: 'Ay' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Ajanda' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Bugün' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Öncekine git' })).toBeInTheDocument();
    });
});

describe('NewTaskFab', () => {
    it('erişilebilir ada sahiptir ve görev oluşturma modalini açar', () => {
        const open = vi.fn();
        window.abp = { ModalManager: vi.fn(function ModalManager() { this.open = open; }) };

        render(<NewTaskFab />);
        const fab = screen.getByRole('button', { name: 'Yeni görev' });
        fab.click();

        expect(window.abp.ModalManager).toHaveBeenCalledWith('/Tasks/CreateModal');
        expect(open).toHaveBeenCalled();
        delete window.abp;
    });

    /* Sağ altta SABİT durmalı: akışta kalırsa listeyi kaydırınca kaybolur.
       `position: fixed` sınıfı düşerse burada yakalanır. */
    it('sabit konumlu ve yuvarlaktır', () => {
        render(<NewTaskFab />);
        const fab = screen.getByRole('button', { name: 'Yeni görev' });
        expect(fab).toHaveClass('fixed', 'right-4', 'rounded-full');
        expect(fab.style.bottom).toContain('safe-area-inset-bottom');
    });
});
