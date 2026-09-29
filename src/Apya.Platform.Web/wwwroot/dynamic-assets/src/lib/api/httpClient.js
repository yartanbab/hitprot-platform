/**
 * httpClient — fetch wrapper with ABP-aware defaults.
 * - Cookie-based auth (same-site session); no manual token plumbing.
 * - RequestVerificationToken eklenir (ABP anti-forgery; XSRF-TOKEN çerezi, yoksa sayfadaki alan).
 * - JSON normalization + ABP error envelope parse.
 * - Hata kanalı (wwwroot/js/ajax-error-detail.js ile aynı kural): ağ reddi → ApiError(0);
 *   401 ve oturum kaybından doğan gövdesiz 400 → merkezi oturum penceresi
 *   (window.apya.session). O zaman hata apyaShown/apyaCentral taşır; çağıran ikinci
 *   bildirim basmaz (lib/api/abpErrors.js).
 *
 * Dış bağımlılık YOK (axios eklemekten kaçındık).
 */

import { t } from '../i18n';

const DEFAULT_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
};

class ApiError extends Error {
    constructor(message, { status, code, details, validationErrors } = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.details = details;
        this.validationErrors = validationErrors;
    }
}

export function readAntiForgeryToken() {
    if (typeof document === 'undefined') return null;
    /* XSRF-TOKEN çerezi her sayfa/modal GET'inde ve oturum yoklamasında tazelenir; sayfa
       yüklemesindeki gizli alandan hiçbir zaman daha bayat değildir (abp.ajax da bunu kullanır). */
    const cookieToken = window?.abp?.security?.antiForgery?.getToken?.();
    if (cookieToken) return cookieToken;
    const meta = document.querySelector('meta[name="__RequestVerificationToken"]');
    if (meta) return meta.getAttribute('content');
    const input = document.querySelector('input[name="__RequestVerificationToken"]');
    return input ? input.value : null;
}

/**
 * Zarfsız hatada gösterilecek metin. ABP'nin hata zarfı yoksa (ağ kopması,
 * antiforgery reddi, kimlik doğrulama challenge'ı, ters vekil 502/503) elimizde
 * yalnız durum kodu kalır; `HTTP 401` kullanıcıya hiçbir şey anlatmaz. jQuery
 * tarafıyla (ajax-error-detail.js) aynı Api:Error:* anahtarları.
 */
function defaultMessage(status) {
    switch (status) {
        case 0: return t('Api:Error:Network',
            'Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin; bu sayfada girdiğiniz bilgiler korunuyor.');
        case 400: return t('Api:Error:BadRequest',
            'İstek işlenemedi. Girdiğiniz bilgileri kontrol edip tekrar deneyin.');
        case 401: return t('Api:Error:Unauthorized',
            'Oturumunuz sona erdi. Yeniden giriş yaptıktan sonra tekrar deneyin; bu sayfada girdiğiniz bilgiler korunuyor.');
        case 403: return t('Api:Error:Forbidden',
            'Bu işlem için yetkiniz yok.');
        case 404: return t('Api:Error:NotFound',
            'Aradığınız kayıt bulunamadı.');
        case 413: return t('Api:Error:PayloadTooLarge',
            'Gönderilen dosya ya da veri izin verilen boyutu aşıyor. Daha küçük bir dosyayla tekrar deneyin.');
        case 502:
        case 503:
        case 504: return t('Api:Error:ServerUnavailable',
            'Sunucu geçici olarak kullanılamıyor. Birkaç dakika sonra tekrar deneyin; bu sayfada girdiğiniz bilgiler korunuyor.');
        default:
            if (status >= 500) {
                return t('Api:Error:Server',
                    'Sunucuda beklenmeyen bir hata oluştu. Biraz sonra tekrar deneyin; sorun sürerse Geri bildirim ile bize iletin.');
            }
            return t('Api:Error:Generic',
                'İşlem tamamlanamadı, lütfen tekrar deneyin.');
    }
}

const PLAIN_TEXT_MAX = 300;

/**
 * Hata yanıtını ApiError'a çevirir; gövdenin boş olup olmadığını da döner (gövdesiz
 * 400 = bayat anahtar ya da oturum kaybı adayı). Zarfsız 4xx düz metni (hız sınırı,
 * "Doğrulama Hatası: …") sunucunun kendi cümlesidir; 5xx gövdesi ASLA gösterilmez
 * (geliştirme ortamında yığın izi olabilir).
 */
async function parseError(response) {
    let text = '';
    try { text = (await response.text()) || ''; } catch (_) { /* gövde okunamadı */ }
    const body = text.trim();
    let env = null;
    if (body.startsWith('{')) {
        try { env = JSON.parse(body)?.error ?? null; } catch (_) { /* JSON değil */ }
    }
    const plain = !env && response.status < 500 && body && body.length <= PLAIN_TEXT_MAX && !/^[<{[]/.test(body)
        ? body
        : null;
    const error = new ApiError(
        env?.message || plain || defaultMessage(response.status),
        {
            status: response.status,
            code: env?.code,
            details: env?.details,
            validationErrors: env?.validationErrors,
        },
    );
    return { error, empty: body === '' };
}

/** Oturum hataları merkezi pencereye (jQuery tarafıyla aynı window.apya.session). */
function routeSessionError(error, bodylessMutation) {
    const session = typeof window === 'undefined' ? null : window.apya?.session;
    if (!session) return;
    if (error.status === 401) {
        if (session.expired()) error.apyaShown = error.apyaCentral = true;
    } else if (error.status === 400 && bodylessMutation) {
        session.verify();
        error.apyaShown = error.apyaCentral = true;
    }
}

export async function apiFetch(path, { method = 'GET', body, signal, headers = {} } = {}) {
    const isMutation = method !== 'GET' && method !== 'HEAD';
    const finalHeaders = { ...DEFAULT_HEADERS, ...headers };

    if (isMutation) {
        const token = readAntiForgeryToken();
        if (token) finalHeaders['RequestVerificationToken'] = token;
    }

    let response;
    try {
        response = await fetch(path, {
            method,
            credentials: 'include', /* ABP cookie session */
            signal,
            headers: finalHeaders,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    } catch (e) {
        /* Bilinçli iptal (react-query, sökülen bileşen) ağ hatası değildir — aynen fırlar. */
        if (e?.name === 'AbortError') throw e;
        throw new ApiError(defaultMessage(0), { status: 0, code: 'Network' });
    }

    if (!response.ok) {
        const { error, empty } = await parseError(response);
        routeSessionError(error, isMutation && empty);
        throw error;
    }

    if (response.status === 204) return null;
    const ct = response.headers.get('content-type') || '';
    if (ct.includes('application/json')) return response.json();
    return response.text();
}

export const api = {
    get:    (path, opts) => apiFetch(path, { ...opts, method: 'GET' }),
    post:   (path, body, opts) => apiFetch(path, { ...opts, method: 'POST', body }),
    put:    (path, body, opts) => apiFetch(path, { ...opts, method: 'PUT', body }),
    patch:  (path, body, opts) => apiFetch(path, { ...opts, method: 'PATCH', body }),
    delete: (path, opts) => apiFetch(path, { ...opts, method: 'DELETE' }),
};

export { ApiError };
