import { describe, it, expect, vi } from 'vitest';
import { goToTaskPage } from './pageNavigation';

// QA-16 · Sayfa kipinde göreve geçiş adresi değiştirir (Çoğalt sonrası kopyanın kendi sayfası).
describe('goToTaskPage', () => {
    it('görevin kendi sayfasına gider', () => {
        const assign = vi.fn();
        const original = window.location;
        Object.defineProperty(window, 'location', { configurable: true, value: { ...original, assign } });
        try {
            goToTaskPage('dc101452-7648-7504-4110-3a24638b75b4');
            expect(assign).toHaveBeenCalledWith('/Tasks/Detail/dc101452-7648-7504-4110-3a24638b75b4');
        } finally {
            Object.defineProperty(window, 'location', { configurable: true, value: original });
        }
    });
});
