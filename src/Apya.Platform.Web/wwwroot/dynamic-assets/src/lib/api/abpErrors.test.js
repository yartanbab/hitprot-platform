import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { errorMessage, notifyError, wasShown } from './abpErrors';

/**
 * React adalarının tek kanal köprüsü. Köprü (window.apya.ajaxErrors) varken ABP ya da
 * merkezi oturum penceresi gösterdiyse ikinci bildirim yok; köprü yokken eski davranış.
 */
beforeEach(() => {
    window.abp = { notify: { error: vi.fn() } };
});

afterEach(() => {
    delete window.apya;
    delete window.abp;
});

describe('köprü yokken (eski davranış)', () => {
    it('bildirim gösterilir: hatanın mesajı, yoksa yedek', () => {
        expect(wasShown(new Error('Yetkiniz yok'))).toBe(false);

        notifyError(new Error('Yetkiniz yok'), 'Kaydedilemedi.');
        notifyError({}, 'Kaydedilemedi.');

        expect(window.abp.notify.error.mock.calls).toEqual([['Yetkiniz yok'], ['Kaydedilemedi.']]);
    });

    it('httpClient hatası merkezi pencereye gittiyse ikinci bildirim yok', () => {
        const err = Object.assign(new Error('Oturumunuz sona erdi.'), { status: 401, apyaShown: true, apyaCentral: true });

        expect(wasShown(err)).toBe(true);
        notifyError(err, 'Kaydedilemedi.');
        expect(window.abp.notify.error).not.toHaveBeenCalled();
    });

    it('sunucunun düz metni toast\'a kaçışlanarak gider (ABP toast\'ı innerHTML ile basar)', () => {
        // abp.js ile aynı
        window.abp.utils = { htmlEscape: (html) => html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') };

        notifyError(new Error('<img src=x onerror=alert(1)> "A&B"'), 'Kaydedilemedi.');

        expect(window.abp.notify.error).toHaveBeenCalledWith('&lt;img src=x onerror=alert(1)&gt; &quot;A&amp;B&quot;');
    });
});

describe('köprü varken', () => {
    beforeEach(() => {
        window.apya = {
            ajaxErrors: {
                wasShown: vi.fn((err) => err?.shownByAbp === true),
                message: vi.fn((err, fallback) => (err?.central ? null : (err?.message || fallback))),
            },
        };
    });

    it('ABP penceresi gösterdiyse hiçbir şey basılmaz', () => {
        notifyError({ shownByAbp: true, message: 'WIP sınırı aşıldı.' }, 'Görev taşınamadı.');

        expect(window.abp.notify.error).not.toHaveBeenCalled();
    });

    it('gösterilmediyse köprünün metniyle tek bildirim', () => {
        notifyError({ message: 'Kilitli belge silinemez.' }, 'Silinemedi.');

        expect(window.abp.notify.error).toHaveBeenCalledWith('Kilitli belge silinemez.');
    });

    it('errorMessage merkezi pencere için null döner (sayfa içi metin basılmaz)', () => {
        expect(errorMessage({ central: true }, 'Liste yüklenemedi.')).toBeNull();
        expect(errorMessage(null, 'Liste yüklenemedi.')).toBe('Liste yüklenemedi.');
    });
});
