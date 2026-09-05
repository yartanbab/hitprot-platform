import { describe, it, expect } from 'vitest';
import { readPrintContext, resolvePeriod } from './printMeta';

/**
 * Künyedeki tarih penceresi sunucudaki `DashboardPeriod.Resolve` ile AYNI
 * kuralları uygulamalı: hafta pazartesi başlar, çeyrek takvim çeyreğidir.
 * Kayarsa çıktı "Bu ay" der ama başka bir ayı listeler.
 */
describe('resolvePeriod', () => {
    it('ayı ilk günden son güne kapatır', () => {
        const { start, end } = resolvePeriod('Month', new Date(2026, 8, 5));

        expect(start).toEqual(new Date(2026, 8, 1));
        expect(end).toEqual(new Date(2026, 8, 30)); /* KAPALI aralık: 30 Eylül, 1 Ekim değil */
    });

    it('haftayı PAZARTESİden başlatır', () => {
        /* 6 Eylül 2026 pazar — pazartesi başlangıcı 31 Ağustos'a geri gider. */
        const { start, end } = resolvePeriod('Week', new Date(2026, 8, 6));

        expect(start).toEqual(new Date(2026, 7, 31));
        expect(end).toEqual(new Date(2026, 8, 6));
    });

    it('çeyreği takvim çeyreğine oturtur', () => {
        const { start, end } = resolvePeriod('Quarter', new Date(2026, 8, 5));

        expect(start).toEqual(new Date(2026, 6, 1)); /* Temmuz */
        expect(end).toEqual(new Date(2026, 8, 30));  /* Eylül sonu */
    });

    it('bilinmeyen aralıkta aya düşer', () => {
        expect(resolvePeriod('Yıl', new Date(2026, 8, 5)).start).toEqual(new Date(2026, 8, 1));
    });
});

describe('readPrintContext', () => {
    it('gömülü künyeyi okur', () => {
        document.body.innerHTML = '';
        const node = document.createElement('script');
        node.type = 'application/json';
        node.id = 'apya-dashboard-print-context';
        node.textContent = JSON.stringify({ tenantName: 'Hitprot', userName: 'Yakup Babaoğlu' });
        document.body.appendChild(node);

        expect(readPrintContext()).toEqual({ tenantName: 'Hitprot', userName: 'Yakup Babaoğlu' });
    });

    it('düğüm yoksa ya da bozuksa null döner — baskı yine çıkmalı', () => {
        document.body.innerHTML = '';
        expect(readPrintContext()).toBeNull();

        const node = document.createElement('script');
        /* type ŞART: application/json olmayan düğümü jsdom ÇALIŞTIRIR ve bozuk
           içerik yakalanamayan SyntaxError'a döner. */
        node.type = 'application/json';
        node.id = 'apya-dashboard-print-context';
        node.textContent = '{bozuk';
        document.body.appendChild(node);

        expect(readPrintContext()).toBeNull();
    });
});
