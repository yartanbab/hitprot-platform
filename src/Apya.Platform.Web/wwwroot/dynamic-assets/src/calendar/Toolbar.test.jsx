import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toolbar, NewTaskFab, openNewTask } from './Toolbar';

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
        window.abp = { ModalManager: vi.fn(function ModalManager() { this.open = open; this.onResult = vi.fn(); }) };

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

/* CAL-04: modal sonucu hiçbir yere bağlı değildi; kayıttan sonra geri bildirim
   yoktu. Takvimin tazelenmesi modalın 'apya:data-changed' yayınından gelir
   (bkz. lib/api/dataChanged.test.js → useInvalidateTaskDerivedOnChange). */
describe('openNewTask', () => {
    afterEach(() => { delete window.abp; });

    it('kayıt sonucu gelince "Görev oluşturuldu." bildirir', () => {
        let onResultCb;
        const success = vi.fn();
        window.abp = {
            notify: { success },
            ModalManager: vi.fn(function ModalManager() {
                this.open = vi.fn();
                this.onResult = vi.fn((cb) => { onResultCb = cb; });
            }),
        };

        openNewTask();
        expect(success).not.toHaveBeenCalled();
        onResultCb();

        expect(success).toHaveBeenCalledWith('Görev oluşturuldu.');
    });

    it('ModalManager yoksa oluşturma sayfasına gider', () => {
        const original = Object.getOwnPropertyDescriptor(window, 'location');
        let href = '';
        /* jsdom gerçek gezinmeyi uygulamaz; href atamasını gözlemlemek için değiştirilebilir kılınır. */
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { get href() { return href; }, set href(v) { href = v; } },
        });
        try {
            window.abp = {};
            openNewTask();
            expect(href).toBe('/Tasks/CreateModal');
        } finally {
            Object.defineProperty(window, 'location', original);
        }
    });
});
