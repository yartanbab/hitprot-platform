import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
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
        expect(zIndex['modal-backdrop']).toBeGreaterThan(1030);
    });

    it('ABP/Bootstrap modali (1055) task-detail modalinin USTUNDE acilir', () => {
        expect(zIndex.modal).toBeLessThan(1055);
    });

    it('toast, modal, popover, tooltip ustunde', () => {
        expect(zIndex.toast).toBeGreaterThan(zIndex.modal);
        expect(zIndex.toast).toBeGreaterThan(zIndex.popover);
        expect(zIndex.toast).toBeGreaterThan(zIndex.tooltip);
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

describe('tailwind zIndex drift guard', () => {
    it('tokens.css --apya-z-* degerleriile hizali kalir', () => {
        // tokens.css'ten --apya-z-* ozel ozellikleri cikart
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const tokensCssPath = resolve(__dirname, 'styles', 'tokens.css');
        const tokensCss = readFileSync(tokensCssPath, 'utf-8');

        // tokens.css'te tanimli z-index degerleri
        const zIndexTokens = {};
        const zIndexPattern = /--apya-z-([a-z-]+):\s*(\d+)/g;
        let match;
        while ((match = zIndexPattern.exec(tokensCss)) !== null) {
            zIndexTokens[match[1]] = parseInt(match[2], 10);
        }

        // Tailwind config'daki her z-index degeri tokens.css ile eslestirilir
        // (aynı key'ler ve aynı sayısal degerler)
        for (const [key, value] of Object.entries(zIndex)) {
            expect(zIndexTokens[key]).toBeDefined();
            expect(zIndexTokens[key]).toBe(value);
        }

        // Tersi de dogru: tokens.css'te olan her --apya-z-* Tailwind'de de olmali
        for (const [key, value] of Object.entries(zIndexTokens)) {
            expect(zIndex[key]).toBeDefined();
            expect(zIndex[key]).toBe(value);
        }
    });
});
