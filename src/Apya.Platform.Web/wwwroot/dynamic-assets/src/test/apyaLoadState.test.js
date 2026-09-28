import { describe, it, expect, beforeAll, afterEach } from 'vitest';

// wwwroot/js/apya-load-state.js bir IIFE: Razor/jQuery sayfalarının satır içi
// yükleme ve hata kutusunu (apya.loadState) kurar. jQuery GEREKMEZ. Yarış koruması
// bu dosyada değil, apya.latest'te (apyaLatest.test.js).

let loadState;

function parse(html) {
    return new DOMParser().parseFromString(html, 'text/html').body;
}

beforeAll(async () => {
    delete global.abp;
    await import('../../../js/apya-load-state.js');
    loadState = window.apya.loadState;
});

afterEach(() => {
    delete global.abp;
});

describe('errorHtml', () => {
    it('başlığı kaçışlar: HTML metin olarak basılır, öğe oluşmaz', () => {
        const body = parse(loadState.errorHtml('<img src=x onerror=alert(1)>', 'js-x-retry'));

        expect(body.querySelector('img')).toBeNull();
        expect(body.querySelector('strong').textContent).toBe('<img src=x onerror=alert(1)>');
    });

    it('role=alert taşır; retryClass type=button düğmeye konur', () => {
        const body = parse(loadState.errorHtml('Liste yüklenemedi.', 'js-x-retry'));

        const box = body.querySelector('.apya-console-state');
        expect(box.getAttribute('role')).toBe('alert');

        const button = box.querySelector('button.js-x-retry');
        expect(button).not.toBeNull();
        expect(button.getAttribute('type')).toBe('button');
    });

    it('abp yokken Türkçe varsayılan metinleri basar', () => {
        const body = parse(loadState.errorHtml('Liste yüklenemedi.', 'js-x-retry'));

        expect(body.querySelector('p').textContent).toBe('Veri alınırken bir hata oluştu.');
        expect(body.querySelector('button').textContent).toBe('Tekrar dene');
    });

    it('metinleri Platform kaynağından alır; anahtar geri dönerse varsayılana düşer', () => {
        global.abp = {
            localization: {
                getResource: () => (k) => (k === 'Common:Retry' ? 'Try again' : k)
            }
        };

        const body = parse(loadState.errorHtml('Liste yüklenemedi.', 'js-x-retry'));

        expect(body.querySelector('button').textContent).toBe('Try again');
        expect(body.querySelector('p').textContent).toBe('Veri alınırken bir hata oluştu.');
    });
});

describe('loadingHtml', () => {
    it('role=status taşır ve mesajı kaçışlar', () => {
        const body = parse(loadState.loadingHtml('<b>Olay</b> yükleniyor…'));

        const box = body.querySelector('.apya-console-state');
        expect(box.getAttribute('role')).toBe('status');
        expect(body.querySelector('b')).toBeNull();
        expect(box.querySelector('p').textContent).toBe('<b>Olay</b> yükleniyor…');
    });
});
