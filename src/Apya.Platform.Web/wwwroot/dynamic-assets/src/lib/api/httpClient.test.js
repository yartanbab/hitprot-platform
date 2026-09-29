import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { api, apiFetch, ApiError, readAntiForgeryToken } from './httpClient';

/**
 * fetch tabanlı adaların hata kanalı: ağ reddi Türkçe ApiError(0) olur, bilinçli iptal
 * aynen fırlar; 401 ve gövdesiz 400 (güvenli olmayan yöntem) jQuery tarafıyla aynı
 * merkezi oturum penceresine (window.apya.session) gider.
 */

const NETWORK_TEXT = 'Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin; bu sayfada girdiğiniz bilgiler korunuyor.';
const SERVER_TEXT = 'Sunucuda beklenmeyen bir hata oluştu. Biraz sonra tekrar deneyin; sorun sürerse Geri bildirim ile bize iletin.';
const BAD_REQUEST_TEXT = 'İstek işlenemedi. Girdiğiniz bilgileri kontrol edip tekrar deneyin.';

function respond(status, body = '', contentType = 'text/plain') {
    return Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        headers: { get: () => contentType },
        text: () => Promise.resolve(body),
        json: () => Promise.resolve(JSON.parse(body)),
    });
}

let session;

beforeEach(() => {
    session = { expired: vi.fn(() => true), verify: vi.fn(() => Promise.resolve('retry')) };
    window.apya = { session };
    delete window.abp;
    document.head.innerHTML = '';
});

afterEach(() => {
    delete window.apya;
    vi.unstubAllGlobals();
});

describe('ağ hatası', () => {
    it('fetch reddi Türkçe ApiError(0) olur; ham "Failed to fetch" görünmez', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))));

        const err = await api.post('/api/x', {}).catch((e) => e);

        expect(err).toBeInstanceOf(ApiError);
        expect(err.status).toBe(0);
        expect(err.code).toBe('Network');
        expect(err.message).toBe(NETWORK_TEXT);
        expect(err.message).not.toContain('Failed to fetch');
    });

    it('bilinçli iptal (AbortError) aynen fırlar — kullanıcıya ağ hatası gösterilmez', async () => {
        const abort = new DOMException('The operation was aborted.', 'AbortError');
        vi.stubGlobal('fetch', vi.fn(() => Promise.reject(abort)));

        const err = await api.get('/api/x').catch((e) => e);

        expect(err).toBe(abort);
        expect(err).not.toBeInstanceOf(ApiError);
    });
});

describe('oturum hataları merkezi pencereye', () => {
    it('401: oturum penceresi açılır, hata "gösterildi" işaretlenir', async () => {
        vi.stubGlobal('fetch', vi.fn(() => respond(401)));

        const err = await api.get('/api/x').catch((e) => e);

        expect(session.expired).toHaveBeenCalledTimes(1);
        expect(err.apyaShown).toBe(true);
        expect(err.apyaCentral).toBe(true);
    });

    it('401: güvenli yöntem (GET/HEAD) arka plan sayılır — "Kapat"tan sonra pencereyi yeniden açmaz; mutasyon açar', async () => {
        vi.stubGlobal('fetch', vi.fn(() => respond(401)));

        await api.get('/api/x').catch(() => null);
        await apiFetch('/api/x', { method: 'HEAD' }).catch(() => null);
        await api.post('/api/x', {}).catch(() => null);
        await api.delete('/api/x').catch(() => null);

        expect(session.expired.mock.calls).toEqual([
            [{ background: true }], [{ background: true }], [{ background: false }], [{ background: false }],
        ]);
    });

    it('401 anonim sayfada (pencere yok): işaret yok, çağıranın metni kalır', async () => {
        session.expired.mockReturnValue(false);
        vi.stubGlobal('fetch', vi.fn(() => respond(401)));

        const err = await api.get('/api/x').catch((e) => e);

        expect(err.apyaShown).toBeUndefined();
        expect(err.message).toContain('Oturumunuz sona erdi');
    });

    it('POST gövdesiz 400: yoklama (bayat anahtar / oturum kaybı ayrımı), metin nedene uygun nötr', async () => {
        vi.stubGlobal('fetch', vi.fn(() => respond(400, '')));

        const err = await api.post('/api/x', { a: 1 }).catch((e) => e);

        expect(session.verify).toHaveBeenCalledTimes(1);
        expect(err.apyaShown).toBe(true);
        // Göçürülmemiş tüketici (err.message) merkezi pencereyle çelişen "girdinizi kontrol edin" demez.
        expect(err.message).toBe('İşlem doğrulanamadı');
    });

    it('GET gövdesiz 400, zarflı ve HTML gövdeli 400: yoklama yok, metin değişmez', async () => {
        vi.stubGlobal('fetch', vi.fn(() => respond(400, '')));
        const getErr = await api.get('/api/x').catch((e) => e);

        vi.stubGlobal('fetch', vi.fn(() => respond(400, '<html>Bad Request</html>', 'text/html')));
        const htmlErr = await api.post('/api/x', {}).catch((e) => e);

        vi.stubGlobal('fetch', vi.fn(() => respond(400, JSON.stringify({ error: { message: 'Tarih geçersiz.', code: 'X' } }), 'application/json')));
        const err = await api.post('/api/x', {}).catch((e) => e);

        expect(session.verify).not.toHaveBeenCalled();
        expect(getErr.message).toBe(BAD_REQUEST_TEXT);
        expect(htmlErr.message).toBe(BAD_REQUEST_TEXT);
        expect(err.message).toBe('Tarih geçersiz.');
        expect(err.code).toBe('X');
    });
});

describe('durum koduna göre metin', () => {
    it('502: geçici kesinti', async () => {
        vi.stubGlobal('fetch', vi.fn(() => respond(502, '<html>Bad Gateway</html>', 'text/html')));

        const err = await api.get('/api/x').catch((e) => e);

        expect(err.message).toContain('geçici olarak kullanılamıyor');
    });

    it('429 düz metin: sunucunun kendi cümlesi', async () => {
        vi.stubGlobal('fetch', vi.fn(() => respond(429, 'Kısa sürede çok fazla istek gönderildi.')));

        const err = await api.post('/api/x', {}).catch((e) => e);

        expect(err.message).toBe('Kısa sürede çok fazla istek gönderildi.');
    });

    it('500 HTML ya da düz metin gövde: sunucu metni, gövde gösterilmez', async () => {
        vi.stubGlobal('fetch', vi.fn(() => respond(500, '<!DOCTYPE html><html>Hata</html>', 'text/html')));
        const htmlErr = await api.get('/api/x').catch((e) => e);

        vi.stubGlobal('fetch', vi.fn(() => respond(500, 'System.Exception: gizli yığın')));
        const textErr = await api.get('/api/x').catch((e) => e);

        expect(htmlErr.message).toBe(SERVER_TEXT);
        expect(textErr.message).toBe(SERVER_TEXT);
    });

    it('400 metni artık "sayfayı yenileyin" demiyor', async () => {
        vi.stubGlobal('fetch', vi.fn(() => respond(400, '')));

        const err = await api.get('/api/x').catch((e) => e);

        expect(err.message).toBe('İstek işlenemedi. Girdiğiniz bilgileri kontrol edip tekrar deneyin.');
    });
});

describe('güvenlik anahtarı', () => {
    it('önce XSRF-TOKEN çerezi (yoklamada tazelenen), yoksa sayfadaki alan', () => {
        document.head.innerHTML = '<meta name="__RequestVerificationToken" content="sayfa-anahtari">';
        expect(readAntiForgeryToken()).toBe('sayfa-anahtari');

        window.abp = { security: { antiForgery: { getToken: () => 'cerez-anahtari' } } };
        expect(readAntiForgeryToken()).toBe('cerez-anahtari');
    });

    it('değiştiren istek çerezdeki anahtarı başlığa koyar', async () => {
        window.abp = { security: { antiForgery: { getToken: () => 'cerez-anahtari' } } };
        const fetchSpy = vi.fn(() => respond(204));
        vi.stubGlobal('fetch', fetchSpy);

        await api.post('/api/x', {});

        expect(fetchSpy.mock.calls[0][1].headers.RequestVerificationToken).toBe('cerez-anahtari');
    });
});
