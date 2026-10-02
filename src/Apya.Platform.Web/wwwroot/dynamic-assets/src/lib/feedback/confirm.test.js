import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { confirmAsync } from './confirm';

const here = path.dirname(fileURLToPath(import.meta.url));

// React adalarının tek onay girişi: pencere global demettedir (wwwroot/js/apya-confirm.js);
// burası yalnız köprü. Sıra: window.apya.confirm → abp.message.confirm → false.

let nativeConfirm;

beforeEach(() => {
    delete window.apya;
    delete window.abp;
    nativeConfirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
});

afterEach(() => {
    delete window.apya;
    delete window.abp;
});

describe('köprü varken (global demet yüklü)', () => {
    it('seçenekleri aynen iletir, sonucu boolean yapar', async () => {
        const bridge = vi.fn(() => Promise.resolve(true));
        window.apya = { confirm: bridge };
        const options = { message: 'Görev silinecek.', title: 'Görev silinecek', danger: true, typeToConfirm: true, confirmText: 'Evet, sil' };

        expect(await confirmAsync(options)).toBe(true);
        expect(bridge).toHaveBeenCalledTimes(1);
        expect(bridge).toHaveBeenCalledWith(options);
    });

    it.each([[undefined, false], [null, false], [0, false], [false, false], [1, true]])('köprü %s dönerse → %s', async (value, expected) => {
        window.apya = { confirm: () => value };

        expect(await confirmAsync({ message: 'm' })).toBe(expected);
    });

    it('köprü reddederse false (çağıran yakalanmamış ret görmez)', async () => {
        window.apya = { confirm: () => Promise.reject(new Error('x')) };

        expect(await confirmAsync({ message: 'm' })).toBe(false);
    });

    it('dize kısayolu: confirmAsync("mesaj")', async () => {
        const bridge = vi.fn(() => Promise.resolve(false));
        window.apya = { confirm: bridge };

        expect(await confirmAsync('Kural silinecek.')).toBe(false);
        expect(bridge).toHaveBeenCalledWith({ message: 'Kural silinecek.' });
    });

    it('köprü varken abp.message.confirm çağrılmaz', async () => {
        window.apya = { confirm: () => Promise.resolve(true) };
        window.abp = { message: { confirm: vi.fn() } };

        await confirmAsync({ message: 'm' });

        expect(window.abp.message.confirm).not.toHaveBeenCalled();
    });
});

describe('köprü yokken (vitest, global demet yüklenmemiş sayfa)', () => {
    it('abp.message.confirm(mesaj, başlık, geriÇağrı) çağrılır ve geri çağrının değeriyle çözülür', async () => {
        const confirm = vi.fn((message, title, callback) => callback(true));
        window.abp = { message: { confirm } };

        expect(await confirmAsync({ message: 'Form silinecek.', title: 'Form silinecek' })).toBe(true);
        expect(confirm).toHaveBeenCalledWith('Form silinecek.', 'Form silinecek', expect.any(Function));
    });

    it('başlık verilmezse ikinci argüman undefined: ABP kendi başlığını ("Emin misiniz?") basar', async () => {
        const confirm = vi.fn((message, title, callback) => callback(undefined));
        window.abp = { message: { confirm } };

        expect(await confirmAsync('Silinsin mi?')).toBe(false);
        expect(confirm.mock.calls[0][0]).toBe('Silinsin mi?');
        expect(confirm.mock.calls[0][1]).toBeUndefined();
        expect(typeof confirm.mock.calls[0][2]).toBe('function');
    });

    it('yazarak onay istenmişse abp.message.confirm ÇAĞRILMAZ ve false döner: koruma düşürülmez', async () => {
        const confirm = vi.fn((message, title, callback) => callback(true));
        window.abp = { message: { confirm } };

        expect(await confirmAsync({ message: 'Görev silinecek.', typeToConfirm: true })).toBe(false);
        expect(confirm).not.toHaveBeenCalled();
    });

    it('ikisi de yoksa false', async () => {
        expect(await confirmAsync({ message: 'm' })).toBe(false);
    });
});

describe('tarayıcının yerel onay penceresi hiçbir yolda kullanılmaz', () => {
    it.each([
        ['köprü var', () => { window.apya = { confirm: () => Promise.resolve(false) }; }],
        ['yalnız abp var', () => { window.abp = { message: { confirm: (m, t, cb) => cb(false) } }; }],
        ['ikisi de yok', () => { }]
    ])('%s', async (_, arrange) => {
        arrange();

        expect(await confirmAsync({ message: 'm' })).toBe(false);
        expect(nativeConfirm).not.toHaveBeenCalled();
    });

    it('modül hiçbir şey içe aktarmaz (hafif adalara ağır parça taşımaz)', () => {
        const source = readFileSync(path.join(here, 'confirm.js'), 'utf8');

        expect(source).not.toMatch(/^\s*import\s/m);
        expect(source).not.toMatch(/\brequire\(/);
    });

    it('lib/feedback/index.js varilinden dışa aktarılmaz (Toast.jsx hafif adalara çekilmesin)', () => {
        const barrel = readFileSync(path.join(here, 'index.js'), 'utf8');

        expect(barrel).not.toMatch(/['"]\.\/confirm(?:\.js)?['"]/);
    });
});
