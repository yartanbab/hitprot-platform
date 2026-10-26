import React from 'react';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, beforeAll } from 'vitest';
import { render } from '@testing-library/react';
import { ApyaMark } from './ApyaMark';

/* jQuery tarafının üreticisi (/js/apya-mark.js) global bir IIFE; aynı jsdom
   penceresinde çalıştırılıp React çıktısıyla öğe öğe karşılaştırılır. */
beforeAll(() => {
    /* jsdom global URL'i Node'unkini ezer → new URL() readFileSync'e verilemez; yol üzerinden. */
    const here = path.dirname(fileURLToPath(import.meta.url));
    const code = readFileSync(path.resolve(here, '../../../../js/apya-mark.js'), 'utf8');
    new Function(code)();
});

const svgOf = (ui) => render(ui).container.querySelector('svg');
const rays = (svg) => svg.querySelectorAll('.apya-mark__ray');

/* Öznitelikleri karşılaştırılabilir biçime getir: style'daki boşluk/son ; farkı yok sayılır. */
function snapshot(el) {
    const attrs = [...el.attributes]
        .map((a) => [a.name, a.name === 'style' ? a.value.replace(/\s+/g, '').replace(/;$/, '') : a.value])
        .sort(([a], [b]) => a.localeCompare(b));
    return { tag: el.tagName.toLowerCase(), attrs, children: [...el.children].map(snapshot) };
}

describe('ApyaMark', () => {
    it('standart isaret 13 isin ve ready durumu basar', () => {
        const svg = svgOf(<ApyaMark size={48} />);
        expect(rays(svg)).toHaveLength(13);
        expect(svg.getAttribute('data-state')).toBe('ready');
        expect(svg.querySelector('g').getAttribute('stroke-width')).toBe('4.5');
        expect(svg).toHaveClass('apya-mark');
    });

    it('32 px altinda ve oneri durumunda cizgi kalinligi 6', () => {
        expect(svgOf(<ApyaMark size={24} />).querySelector('g').getAttribute('stroke-width')).toBe('6');
        expect(svgOf(<ApyaMark size={56} state="suggest" />).querySelector('g').getAttribute('stroke-width')).toBe('6');
    });

    it('16 px altinda 3 isinli mikro surume duser', () => {
        const svg = svgOf(<ApyaMark size={12} state="thinking" />);
        expect(rays(svg)).toHaveLength(0);
        expect(svg.querySelectorAll('line')).toHaveLength(3);
    });

    it('etiketsiz isaret ekran okuyucudan gizlenir, etiketli isaret adlandirilir', () => {
        expect(svgOf(<ApyaMark />).getAttribute('aria-hidden')).toBe('true');
        const named = svgOf(<ApyaMark label="Asistan düşünüyor" />);
        expect(named.getAttribute('role')).toBe('img');
        expect(named.getAttribute('aria-label')).toBe('Asistan düşünüyor');
        expect(named.hasAttribute('aria-hidden')).toBe(false);
    });

    it('tanimsiz durum ready sayilir', () => {
        expect(svgOf(<ApyaMark state="spinning" />).getAttribute('data-state')).toBe('ready');
    });

    it.each([
        [{ size: 48 }],
        [{ size: 20, state: 'thinking' }],
        [{ size: 56, state: 'suggest', label: 'Öneri' }],
        [{ size: 64, print: true }],
        [{ size: 12, state: 'off' }],
        [{ size: 32, state: 'listening', className: 'text-muted' }],
    ])('jQuery apya.mark ile birebir ayni SVG: %o', (props) => {
        const react = svgOf(<ApyaMark {...props} />);
        const host = document.createElement('div');
        host.innerHTML = window.apya.mark(props);
        expect(snapshot(react)).toEqual(snapshot(host.firstElementChild));
    });
});
