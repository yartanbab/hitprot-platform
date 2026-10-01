import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from './sanitizeHtml';

describe('sanitizeHtml', () => {
    it('olay özniteliklerini atar, görseli bırakır', () => {
        const out = sanitizeHtml('<p>a<img src="x" onerror="alert(1)"></p>');
        expect(out).not.toMatch(/onerror/i);
        expect(out).toContain('<img');
    });

    it('betik taşıyan öğeleri içeriğiyle atar', () => {
        const out = sanitizeHtml('<p>ok</p><script>alert(1)</script><iframe src="https://x"></iframe><svg onload="x()"></svg>');
        expect(out).toBe('<p>ok</p>');
    });

    it('javascript: bağlantısını ve güvensiz görsel kaynağını düşürür', () => {
        const out = sanitizeHtml('<a href="javascript:alert(1)">x</a><a href="https://apya.test/a" target="_x">y</a><img src="javascript:1">');
        expect(out).not.toMatch(/javascript:/i);
        expect(out).toContain('href="https://apya.test/a"');
        expect(out).toContain('rel="noopener noreferrer"');
    });

    it('bilinmeyen etiketi açar, metni korur', () => {
        expect(sanitizeHtml('<custom-x><b>kalın</b> metin</custom-x>')).toBe('<b>kalın</b> metin');
    });

    it('editörün biçimlerini korur (tablo, liste, bahsetme)', () => {
        const html = '<table class="apya-rte-table"><tbody><tr><th>K1</th></tr></tbody></table><ul><li>m</li></ul><span class="apya-rte-mention">@pm1</span>';
        expect(sanitizeHtml(html)).toBe(html);
    });

    it('style yalnız güvenli biçim özellikleriyle kalır', () => {
        const out = sanitizeHtml('<span style="color: red; background-image: url(https://x/t.png); position: fixed">t</span>');
        expect(out).toBe('<span style="color: red">t</span>');
    });
});
