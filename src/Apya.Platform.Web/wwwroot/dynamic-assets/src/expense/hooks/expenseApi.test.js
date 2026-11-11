import { describe, it, expect, vi, afterEach } from 'vitest';
import { attachReceipt, receiptFileName } from './expenseApi';

/*
 * Masraf Yakala'da çekilen fiş, gider kaydedildikten sonra Belge Merkezi'ne eklenir
 * (kullanıcı isteği, 2026-11-11). Ad ve istek sözleşmesi sunucu ucuyla
 * (Pages/Expenses/Capture → OnPostAttachReceiptAsync) aynı olmalı.
 */
describe('receiptFileName', () => {
    it('kamera adı yerine tedarikçi ve tarih kullanır, uzantıyı korur', () => {
        const file = new File(['x'], 'image.JPG', { type: 'image/jpeg' });
        expect(receiptFileName(file, { vendor: 'Migros A.Ş.', date: '2026-11-11' }))
            .toBe('Fiş - Migros A.Ş. - 2026-11-11.jpg');
    });

    it('uzantısız dosyada türden uzantı üretir; dosya adında geçersiz karakter bırakmaz', () => {
        const file = new File(['x'], 'blob', { type: 'image/png' });
        expect(receiptFileName(file, { vendor: 'A/B: "Kırtasiye"', date: '2026-11-11' }))
            .toBe('Fiş - A B Kırtasiye - 2026-11-11.png');
    });
});

describe('attachReceipt', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        delete window.abp;
    });

    it('fişi gider kimliğiyle, antiforgery başlığıyla çok parçalı gönderir', async () => {
        window.abp = { security: { antiForgery: { getToken: () => 'jeton' } } };
        const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204 });
        vi.stubGlobal('fetch', fetchMock);

        const file = new File(['x'], 'image.jpg', { type: 'image/jpeg' });
        await attachReceipt('gider-1', file, { vendor: 'Shell', date: '2026-11-11' });

        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe('/Expenses/Capture?handler=AttachReceipt');
        expect(init.method).toBe('POST');
        expect(init.headers.RequestVerificationToken).toBe('jeton');
        expect(init.body.get('expenseId')).toBe('gider-1');
        expect(init.body.get('file').name).toBe('Fiş - Shell - 2026-11-11.jpg');
    });

    it('sunucu reddederse ABP hata iletisini fırlatır', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false,
            status: 403,
            json: async () => ({ error: { message: 'Dosya türü desteklenmiyor.' } }),
        }));

        await expect(attachReceipt('gider-1', new File(['x'], 'a.heic'), {}))
            .rejects.toThrow('Dosya türü desteklenmiyor.');
    });
});
