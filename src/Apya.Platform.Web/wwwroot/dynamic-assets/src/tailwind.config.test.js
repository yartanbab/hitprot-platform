import { describe, it, expect } from 'vitest';
import config from '../tailwind.config.js';

const { screens, zIndex, animation, keyframes } = config.theme.extend;

describe('tailwind screens', () => {
    it('Sheet.jsx ve Toast.jsx tablet: prefixini kullaniyor, tanimli olmali', () => {
        expect(screens.tablet).toBe('768px');
    });

    it('useDeviceMode sinirlariyla hizali kalir', () => {
        expect(screens.mobile).toEqual({ max: '767.98px' });
    });
});

describe('tailwind zIndex', () => {
    it('task-detail modali LeptonX sidebarin ustunde kalir', () => {
        expect(zIndex['modal-backdrop']).toBeGreaterThan(1040);
    });

    it('ABP/Bootstrap modali (1055) task-detail modalinin USTUNDE acilir', () => {
        expect(zIndex.modal).toBeLessThan(1055);
    });

    it('toast her seyin ustunde', () => {
        expect(zIndex.toast).toBe(1080);
    });
});

describe('tailwind animation', () => {
    it('Sheet.jsx ve Toast.jsx tarafindan kullanilan animasyonlar tanimli', () => {
        expect(animation['sheet-bottom']).toBeDefined();
        expect(animation['sheet-right']).toBeDefined();
        expect(animation['overlay-fade']).toBeDefined();
    });

    it('Dialog icin giris animasyonu tanimli', () => {
        expect(animation['dialog-in']).toBeDefined();
        expect(keyframes.dialogIn).toBeDefined();
    });
});
