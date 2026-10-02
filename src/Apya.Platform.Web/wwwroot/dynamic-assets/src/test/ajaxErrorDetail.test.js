import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { api } from '../lib/api/httpClient';

// wwwroot/js/ajax-error-detail.js bir IIFE: jQuery'nin $.ajaxPrefilter'ına kanca takar
// ve abp.ajax'ın hata yolunu SARAR. Repoda jQuery devDependency yok (bkz.
// apyaQuotaUpsell.test.js); burada ABP'nin sarılan fonksiyonları abp.jquery.js
// (ABP 10) ile AYNI mantıkla kurulur ve istekler jQuery 4'ün gerçek sırasıyla
// canlandırılır: prefilter'ın eklediği fail geri çağrısı → ABP'nin (ya da
// abpAjaxForm'un) hata işleyicisi. SweetAlert ve fetch (oturum yoklaması) sahtedir.
// abp.message.* gömülü abp-sweetalert2.js (ABP 10) ile aynı: config.default + tür
// birleştirilip Swal.fire, dönüş pencere kapanınca çözülen $.Deferred.

let abpOriginals;
let prefilters;
let dialogs;

const NETWORK_TITLE = 'Bağlantı kurulamadı';
const NETWORK_TEXT = 'Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin; bu sayfada girdiğiniz bilgiler korunuyor.';
const SERVER_TEXT = 'Sunucuda beklenmeyen bir hata oluştu. Biraz sonra tekrar deneyin; sorun sürerse Geri bildirim ile bize iletin.';
const RETRY_TEXT = 'Güvenlik anahtarınız yenilendi. Bu sayfada girdiğiniz bilgiler korunuyor; lütfen işlemi tekrar deneyin.';
const SESSION_TITLE = 'Oturumunuz sona erdi';

function installAbp({ authenticated = true, userId = 'u1' } = {}) {
    abpOriginals = {
        showError: vi.fn(() => ({ done() { return this; } })),
        handleErrorStatusCode: vi.fn(function (status) {
            switch (status) {
                case 401:
                    abp.ajax.handleUnAuthorizedRequest(abp.ajax.showError(abp.ajax.defaultError401), abp.appPath);
                    break;
                case 403:
                    abp.ajax.showError(abp.ajax.defaultError403);
                    break;
                case 404:
                    abp.ajax.showError(abp.ajax.defaultError404);
                    break;
                default:
                    abp.ajax.showError(abp.ajax.defaultError);
                    break;
            }
        }),
        handleUnAuthorizedRequest: vi.fn(function (messagePromise, targetUrl) {
            if (messagePromise) {
                messagePromise.done(function () { abp.ajax.handleTargetUrl(targetUrl); });
            } else {
                abp.ajax.handleTargetUrl(targetUrl);
            }
        }),
        handleTargetUrl: vi.fn()
    };

    // abp-sweetalert2.js showMessage ile aynı.
    const showMessage = (type) => vi.fn((message, title) => {
        const config = abp.libs.sweetAlert.config;
        const $dfd = $.Deferred();
        Swal.fire(Object.assign({}, config.default, config[type], { title, html: message })).then(() => $dfd.resolve());
        return $dfd;
    });

    // abp-sweetalert2.js confirm / prompt ile aynı: ikinci argüman başlık (prompt'ta seçenek
    // nesnesi de olabilir) ya da geri çağrı; dönüş, sonuçla çözülen $.Deferred.
    abpOriginals.confirm = vi.fn((message, titleOrCallback, callback) => {
        const config = abp.libs.sweetAlert.config;
        const userOpts = { text: message };
        if (typeof titleOrCallback === 'function') { callback = titleOrCallback; } else if (titleOrCallback) { userOpts.title = titleOrCallback; }
        const $dfd = $.Deferred();
        Swal.fire(Object.assign({}, config.default, config.confirm, userOpts)).then((result) => {
            if (callback) { callback(result.value); }
            $dfd.resolve(result.value);
        });
        return $dfd;
    });
    abpOriginals.prompt = vi.fn((message, titleOrOptionsOrCallback, callback) => {
        const config = abp.libs.sweetAlert.config;
        let userOpts = { html: message };
        if (typeof titleOrOptionsOrCallback === 'function') {
            callback = titleOrOptionsOrCallback;
        } else if (typeof titleOrOptionsOrCallback === 'string') {
            userOpts.title = titleOrOptionsOrCallback;
        } else if (titleOrOptionsOrCallback) {
            userOpts = Object.assign(userOpts, titleOrOptionsOrCallback);
        }
        const $dfd = $.Deferred();
        Swal.fire(Object.assign({}, config.default, config.prompt, userOpts)).then((result) => {
            const value = result && result.isConfirmed ? result.value : null;
            if (callback) { callback(value); }
            $dfd.resolve(value);
        });
        return $dfd;
    });

    window.abp = {
        appPath: '/',
        currentUser: { isAuthenticated: authenticated, id: authenticated ? userId : null },
        localization: { getResource: () => (key) => key },
        // abp.js ile aynı
        utils: { htmlEscape: (html) => html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') },
        libs: {
            sweetAlert: {
                config: {
                    default: { confirmButtonText: 'Tamam' },
                    error: { icon: 'error' },
                    warn: { icon: 'warning' },
                    info: { icon: 'info' },
                    confirm: { icon: 'warning', title: 'Emin misiniz?', confirmButtonText: 'Evet', showCancelButton: true, reverseButtons: true },
                    prompt: { icon: 'question', input: 'text', showCancelButton: true, reverseButtons: true }
                }
            }
        },
        notify: { error: vi.fn(), success: vi.fn(), warn: vi.fn() },
        message: {
            error: showMessage('error'), warn: showMessage('warn'), info: showMessage('info'),
            confirm: abpOriginals.confirm, prompt: abpOriginals.prompt
        },
        ajax: {
            defaultError: { message: 'Bir hata oluştu!', details: 'Hata detayı sunucu tarafından gönderilmedi.' },
            defaultError401: { message: 'Giriş yapılmamış!', details: 'Bu işlem için giriş yapmalısınız.' },
            defaultError403: { message: 'Yetkiniz yok!', details: 'Bu işlemi yapmaya yetkiniz yok.' },
            defaultError404: { message: 'Kaynak bulunamadı!', details: 'İstenen kaynak bulunamadı.' },
            logError() { },
            showError: abpOriginals.showError,
            handleTargetUrl: abpOriginals.handleTargetUrl,
            handleErrorStatusCode: abpOriginals.handleErrorStatusCode,
            handleUnAuthorizedRequest: abpOriginals.handleUnAuthorizedRequest,
            // abp.jquery.js ile aynı
            handleNonAbpErrorResponse(jqXHR, userOptions, $dfd) {
                if (userOptions.abpHandleError !== false) {
                    abp.ajax.handleErrorStatusCode(jqXHR.status);
                }
                $dfd.reject(jqXHR);
            },
            handleAbpErrorResponse(jqXHR, userOptions, $dfd) {
                let messagePromise = null;
                const responseJSON = jqXHR.responseJSON ? jqXHR.responseJSON : JSON.parse(jqXHR.responseText);
                if (userOptions.abpHandleError !== false) {
                    messagePromise = abp.ajax.showError(responseJSON.error);
                }
                abp.ajax.logError(responseJSON.error);
                $dfd && $dfd.reject(responseJSON.error, jqXHR);
                if (jqXHR.status === 401 && userOptions.abpHandleError !== false) {
                    abp.ajax.handleUnAuthorizedRequest(messagePromise);
                }
            }
        }
    };
}

function installJquery() {
    prefilters = [];
    const pending = () => ({ done() { return this; }, then() { return this; } });
    window.jQuery = window.$ = {
        ajaxPrefilter: (fn) => { prefilters.push(fn); },
        // Kullanılan yüzey: bekleyen söz (showError) ve çözülen Deferred (abp.message).
        Deferred: () => {
            const callbacks = [];
            const $dfd = {
                resolved: false,
                promise: pending,
                resolve(value) { $dfd.resolved = true; $dfd.value = value; callbacks.splice(0).forEach((cb) => cb(value)); return $dfd; },
                done(cb) { if ($dfd.resolved) { cb($dfd.value); } else { callbacks.push(cb); } return $dfd; }
            };
            return $dfd;
        }
    };
}

/** SweetAlert: tekil pencere; yenisi açılınca eskisi kapanır (gerçeğiyle aynı sıra). */
function installSwal() {
    dialogs = [];
    const current = () => dialogs.filter((d) => !d.closed).pop();
    window.Swal = {
        fire: vi.fn((opts) => {
            const previous = current();
            if (previous) { previous.close({ isDismissed: true }); }
            const container = document.createElement('div');
            container.className = 'swal2-container';
            const popup = document.createElement('div');
            popup.className = 'swal2-popup';
            const button = document.createElement('button');
            popup.appendChild(button);
            container.appendChild(popup);
            document.body.appendChild(container);
            let resolve;
            const promise = new Promise((r) => { resolve = r; });
            const dialog = {
                opts, container, popup, button, closed: false,
                close(result) {
                    if (dialog.closed) { return; }
                    dialog.closed = true;
                    container.remove();
                    if (opts.didDestroy) { opts.didDestroy(); }
                    resolve(result);
                }
            };
            dialogs.push(dialog);
            if (opts.willOpen) { opts.willOpen(popup); }
            return promise;
        }),
        update: vi.fn((params) => { Object.assign(current().opts, params); }),
        close: vi.fn(() => { const d = current(); if (d) { d.close({ isDismissed: true }); } })
    };
    return current;
}

/**
 * ABP 10 AbpToastService ile aynı iskelet (abp.notify.* her çağrıda yeni örnek kurar):
 * kap bulunur ya da oluşturulur, konum satır içi stille verilir, balon kaba eklenir.
 */
function installToastService() {
    function AbpToastService() {
        this.container = document.getElementById('toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'abp-toast-container';
            document.body.appendChild(this.container);
        }
        this.updateContainerPosition();
    }
    AbpToastService.prototype.updateContainerPosition = function () {
        Object.assign(this.container.style, { top: 'auto', right: '30px', bottom: '30px', left: 'auto' });
    };
    AbpToastService.prototype.error = function (message) {
        const toast = document.createElement('div');
        toast.className = 'abp-toast abp-toast-error';
        toast.innerHTML = '<button class="abp-toast-close-button"></button><p class="abp-toast-message"></p>';
        toast.querySelector('p').textContent = message;
        this.container.appendChild(toast);
        return toast;
    };
    window.AbpToastService = AbpToastService;
}

function probeReturns(user) {
    window.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ currentUser: user })
    }));
}

/** Sahte jqXHR: prefilter'lar $.ajax içindeki gibi çalışır; fail() jQuery'nin reddini canlandırır. */
function request({ status, body = '', method = 'POST', dataType = 'json', headers = {}, json, background } = {}) {
    const failCallbacks = [];
    const xhr = {
        status,
        statusText: status === 0 ? 'error' : 'status',
        responseText: body,
        getResponseHeader: (name) => (name in headers ? headers[name] : null),
        fail(cb) { failCallbacks.push(cb); return xhr; }
    };
    if (json !== undefined) { xhr.responseJSON = json; }
    const settings = { type: method, dataTypes: [dataType] };
    if (background) { settings.apyaBackground = true; }
    prefilters.forEach((p) => p(settings, {}, xhr));
    return { xhr, fail: () => failCallbacks.forEach((cb) => cb(xhr)) };
}

/** abp.ajax'ın .fail'i: jQuery sırasında prefilter'ınkinden SONRA çalışır. Reddedilen değeri döner. */
function abpAjaxFails(req, userOptions = {}) {
    req.fail();
    let rejected;
    const $dfd = { reject(value) { rejected = value; } };
    if (req.xhr.getResponseHeader('_AbpErrorFormat') === 'true') {
        abp.ajax.handleAbpErrorResponse(req.xhr, userOptions, $dfd);
    } else {
        abp.ajax.handleNonAbpErrorResponse(req.xhr, userOptions, $dfd);
    }
    return rejected;
}

const flush = async () => {
    for (let i = 0; i < 5; i++) { await new Promise((r) => setTimeout(r, 0)); }
};

const shownErrors = () => abpOriginals.showError.mock.calls.map((c) => c[0]);
const sessionDialogs = () => dialogs.filter((d) => d.opts.titleText === SESSION_TITLE);

// Dosya her yüklenişte window'a durumlu bir 'storage' dinleyicisi ekler; üretimde tek kez
// yüklenir. Testte önceki yüklemenin dinleyicisi sökülür: kalsaydı olayı o keser, eski
// kapanış durumuyla (kendi "pencere açık mı" bilgisi) yanıt verirdi.
let storageListeners = [];

function removeStorageListeners() {
    storageListeners.splice(0).forEach((args) => window.removeEventListener(...args));
}

async function load(options) {
    removeStorageListeners();
    installAbp(options);
    installJquery();
    installSwal();
    if (options && options.toastService === false) { delete window.AbpToastService; } else { installToastService(); }
    probeReturns({ isAuthenticated: true, id: 'u1' });
    vi.resetModules();
    const added = vi.spyOn(window, 'addEventListener');
    await import('../../../js/ajax-error-detail.js');
    storageListeners = added.mock.calls.filter((args) => args[0] === 'storage');
    added.mockRestore();
}

beforeEach(async () => {
    await load();
});

afterEach(() => {
    removeStorageListeners();
    // Açık kalan pencere kapatılır: didDestroy dönüş dinleyicilerini (focus/visibilitychange)
    // söker; kalsalardı sonraki testin "sekmeye dönüş" olayına eski yükleme de yanıt verirdi.
    dialogs.filter((d) => !d.closed).forEach((d) => d.close({ isDismissed: true }));
    document.querySelectorAll('.swal2-container').forEach((n) => n.remove());
    document.querySelectorAll('.abp-toast-container').forEach((n) => n.remove());
    delete window.matchMedia;
    vi.unstubAllGlobals();
});

describe('kök neden: ABP varsayılan hata nesnesi', () => {
    it('abp.ajax.defaultError dosya yüklendikten sonra değişmez', () => {
        expect(abp.ajax.defaultError).toEqual({ message: 'Bir hata oluştu!', details: 'Hata detayı sunucu tarafından gönderilmedi.' });
    });
});

describe('durum koduna göre metin (zarfsız hata)', () => {
    it('ağ kopması (0): bağlantı metni; antiforgery/önbellek metni yok', () => {
        abpAjaxFails(request({ status: 0, method: 'GET' }));

        expect(shownErrors()).toEqual([{ message: NETWORK_TITLE, details: NETWORK_TEXT }]);
        const all = JSON.stringify(shownErrors());
        expect(all).not.toContain('İşlem doğrulanamadı');
        expect(all).not.toContain('Ctrl+Shift+R');
    });

    it.each([502, 503, 504])('%s: geçici kesinti metni', (status) => {
        abpAjaxFails(request({ status, body: '<html>Bad Gateway</html>', method: 'GET' }));

        expect(shownErrors()[0].message).toBe('Sunucu şu an yanıt vermiyor');
        expect(shownErrors()[0].details).toContain('geçici olarak kullanılamıyor');
    });

    it('500: sunucu metni; gövde (yığın izi olabilir) ASLA gösterilmez', () => {
        abpAjaxFails(request({ status: 500, body: 'System.InvalidOperationException: gizli yığın' }));

        expect(shownErrors()).toEqual([{ message: 'Bir hata oluştu!', details: SERVER_TEXT }]);
    });

    it('413: boyut metni', () => {
        abpAjaxFails(request({ status: 413 }));

        expect(shownErrors()[0].details).toContain('izin verilen boyutu aşıyor');
    });

    it('429 düz metin: sunucunun kendi cümlesi ayrıntıda (başlıkta değil)', () => {
        abpAjaxFails(request({ status: 429, body: 'Kısa sürede çok fazla istek gönderildi.' }));

        expect(shownErrors()).toEqual([{ message: 'Bir hata oluştu!', details: 'Kısa sürede çok fazla istek gönderildi.' }]);
    });

    it('GET gövdesiz 400: istek metni; yoklama yok', () => {
        abpAjaxFails(request({ status: 400, method: 'GET' }));

        expect(shownErrors()[0].details).toBe('İstek işlenemedi. Girdiğiniz bilgileri kontrol edip tekrar deneyin.');
        expect(fetch).not.toHaveBeenCalled();
    });

    it.each([[403, 'Yetkiniz yok!'], [404, 'Kaynak bulunamadı!']])('%s: ABP özgün işleyicisi', (status, title) => {
        abpAjaxFails(request({ status }));

        expect(abpOriginals.handleErrorStatusCode).toHaveBeenCalledWith(status);
        expect(shownErrors()[0].message).toBe(title);
    });

    it('modal formu (abpAjaxForm) handleErrorStatusCode\'u doğrudan çağırır: aynı metin', () => {
        const req = request({ status: 503 });
        req.fail();
        abp.ajax.handleErrorStatusCode(503);

        expect(shownErrors()[0].message).toBe('Sunucu şu an yanıt vermiyor');
        expect(apya.ajaxErrors.wasShown(req.xhr)).toBe(true);
    });

    it('pencere gösterilen hata "gösterildi" sayılır: notify ikinci bildirim basmaz', () => {
        const rejected = abpAjaxFails(request({ status: 500 }));

        expect(apya.ajaxErrors.wasShown(rejected)).toBe(true);
        apya.ajaxErrors.notify(rejected, 'Kaydedilemedi.');
        expect(abp.notify.error).not.toHaveBeenCalled();
    });
});

describe('gövdesiz 400 + güvenli olmayan yöntem: bayat anahtar mı, oturum kaybı mı?', () => {
    it('anlık pencere yok; eşzamanlı iki hata tek yoklama', async () => {
        abpAjaxFails(request({ status: 400, method: 'POST' }));
        abpAjaxFails(request({ status: 400, method: 'PUT' }));

        expect(abpOriginals.showError).not.toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch.mock.calls[0][0]).toBe('/api/abp/application-configuration?includeLocalizationResources=false');
        expect(fetch.mock.calls[0][1]).toMatchObject({ credentials: 'same-origin', cache: 'no-store' });
    });

    it('oturum açık, aynı kullanıcı: "tekrar deneyin" penceresi, sayfa YENİLENMEZ', async () => {
        const reload = vi.fn();
        vi.stubGlobal('location', { ...window.location, reload, assign: vi.fn() });

        abpAjaxFails(request({ status: 400, method: 'POST' }));
        await flush();

        expect(dialogs).toHaveLength(1);
        expect(dialogs[0].opts.titleText).toBe('İşlem doğrulanamadı');
        expect(dialogs[0].opts.text).toBe(RETRY_TEXT);
        expect(reload).not.toHaveBeenCalled();
    });

    it('2 dk içinde tekrarlarsa "Sayfayı yenile" seçenekli uyarı; yenileme yalnız düğmeyle', async () => {
        const reload = vi.fn();
        vi.stubGlobal('location', { ...window.location, hostname: 'localhost', reload, assign: vi.fn() });

        abpAjaxFails(request({ status: 400, method: 'POST' }));
        await flush();
        abpAjaxFails(request({ status: 400, method: 'POST' }));
        await flush();

        const persist = dialogs[1];
        expect(persist.opts.text).toContain('Doğrulama yine başarısız oldu');
        expect(persist.opts.confirmButtonText).toBe('Sayfayı yenile');
        expect(persist.opts.focusCancel).toBe(true);
        expect(reload).not.toHaveBeenCalled();

        persist.close({ isConfirmed: true });
        await flush();
        expect(reload).toHaveBeenCalledTimes(1);
    });

    it('"Sayfayı yenile": kirli-form korumasına yenilemeden hemen ÖNCE izin verilir (tarayıcı ikinci kez sormaz)', async () => {
        const order = [];
        const reload = vi.fn(() => order.push('reload'));
        vi.stubGlobal('location', { ...window.location, hostname: 'localhost', reload, assign: vi.fn() });
        window.apya.dirtyGuard = { allowUnload: vi.fn(() => order.push('allow')) };
        probeReturns({ isAuthenticated: true, id: 'baska' });
        abpAjaxFails(request({ status: 400, method: 'DELETE' }));
        await flush();

        dialogs[0].close({ isConfirmed: true });
        await flush();

        expect(order).toEqual(['allow', 'reload']);
        delete window.apya.dirtyGuard;
    });

    it('yoklama anonim: oturum penceresi', async () => {
        probeReturns({ isAuthenticated: false });

        abpAjaxFails(request({ status: 400, method: 'POST' }));
        await flush();

        expect(sessionDialogs()).toHaveLength(1);
    });

    it('yoklamada başka kullanıcı: "sayfayı yenileyin", tekrar denetmez', async () => {
        probeReturns({ isAuthenticated: true, id: 'baska' });

        abpAjaxFails(request({ status: 400, method: 'DELETE' }));
        await flush();

        expect(dialogs[0].opts.text).toContain('başka bir kullanıcıyla giriş yapılmış');
        expect(dialogs[0].opts.confirmButtonText).toBe('Sayfayı yenile');
    });

    it('yoklama başarısız: ağ metni', async () => {
        window.fetch = vi.fn(() => Promise.reject(new TypeError('Failed to fetch')));

        abpAjaxFails(request({ status: 400, method: 'POST' }));
        await flush();

        expect(shownErrors()).toEqual([{ message: NETWORK_TITLE, details: NETWORK_TEXT }]);
    });

    it('arka plan isteği (apyaBackground): anahtar sessizce tazelenir, pencere yok', async () => {
        abpAjaxFails(request({ status: 400, method: 'POST', background: true }), { abpHandleError: false });
        await flush();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(dialogs).toHaveLength(0);
        expect(abpOriginals.showError).not.toHaveBeenCalled();
    });

    it('çağıranın metni null: merkezi pencere gösterecek', () => {
        const rejected = abpAjaxFails(request({ status: 400, method: 'POST' }), { abpHandleError: false });

        expect(apya.ajaxErrors.message(rejected, 'Kaydedilemedi.')).toBeNull();
        expect(apya.ajaxErrors.wasShown(rejected)).toBe(true);
    });
});

describe('401: oturum düştü', () => {
    it('zarfsız 401: ABP 401 işleyicisi ve köke yönlendirme YOK, tek oturum penceresi', () => {
        abpAjaxFails(request({ status: 401 }));
        abpAjaxFails(request({ status: 401 }));

        expect(abpOriginals.handleErrorStatusCode).not.toHaveBeenCalled();
        expect(abpOriginals.handleUnAuthorizedRequest).not.toHaveBeenCalled();
        expect(abpOriginals.handleTargetUrl).not.toHaveBeenCalled();
        expect(abpOriginals.showError).not.toHaveBeenCalled();
        expect(sessionDialogs()).toHaveLength(1);
        expect(dialogs).toHaveLength(1);
    });

    it('zarflı 401: ABP penceresi açılmaz, yönlendirme yok; reddedilen hata "merkezi"', () => {
        const rejected = abpAjaxFails(request({
            status: 401,
            headers: { _AbpErrorFormat: 'true' },
            json: { error: { code: 'Volo.Authorization:010001', message: 'Giriş yapmalısınız.' } }
        }));

        expect(abpOriginals.showError).not.toHaveBeenCalled();
        expect(abpOriginals.handleUnAuthorizedRequest).not.toHaveBeenCalled();
        expect(abpOriginals.handleTargetUrl).not.toHaveBeenCalled();
        expect(sessionDialogs()).toHaveLength(1);
        expect(apya.ajaxErrors.message(rejected, 'Kaydedilemedi.')).toBeNull();
    });

    it('giriş adresi bulunulan sayfaya döner (ReturnUrl + ReturnUrlHash)', () => {
        history.pushState({}, '', '/Tasks?view=kanban#x');

        expect(apya.session.loginUrl()).toBe('/Account/Login?ReturnUrl=%2FTasks%3Fview%3Dkanban&ReturnUrlHash=%23x');
        history.pushState({}, '', '/');
    });

    it('pencere düğmeleri: yeni sekmede giriş (pencere açık kalır), giriş sayfası, kapat', async () => {
        const open = vi.spyOn(window, 'open').mockImplementation(() => null);
        abpAjaxFails(request({ status: 401 }));
        const dialog = sessionDialogs()[0];

        expect(dialog.opts.confirmButtonText).toBe('Yeni sekmede giriş yap');
        expect(dialog.opts.denyButtonText).toBe('Giriş sayfasına git');
        expect(dialog.opts.cancelButtonText).toBe('Kapat');
        expect(dialog.opts.allowOutsideClick).toBe(false);

        expect(dialog.opts.preConfirm()).toBe(false);
        expect(open).toHaveBeenCalledWith(apya.session.loginUrl(), '_blank', 'noopener');
        expect(Swal.update).toHaveBeenCalledWith({ text: expect.stringContaining('bu sekmeye dönün') });
    });

    it('"Giriş sayfasına git": bulunulan sayfaya dönecek adrese gider', async () => {
        const assign = vi.fn();
        vi.stubGlobal('location', { ...window.location, pathname: '/Account/Manage', search: '', hash: '', assign });
        abpAjaxFails(request({ status: 401 }));

        sessionDialogs()[0].close({ isDenied: true });
        await flush();

        expect(assign).toHaveBeenCalledWith('/Account/Login?ReturnUrl=%2FAccount%2FManage');
    });

    // Pencere metni kaybı zaten söylüyor: kirli-form koruması (apya-dirty-guard.js, bu dosyadan
    // SONRA yüklenir) tarayıcı uyarısıyla ikinci kez sormasın.
    it('"Giriş sayfasına git": kirli-form korumasına yönlendirmeden ÖNCE izin verilir', async () => {
        const order = [];
        const assign = vi.fn(() => order.push('assign'));
        vi.stubGlobal('location', { ...window.location, pathname: '/Projects/Edit/1', search: '', hash: '', assign });
        window.apya.dirtyGuard = { allowUnload: vi.fn(() => order.push('allow')) };
        abpAjaxFails(request({ status: 401 }));

        sessionDialogs()[0].close({ isDenied: true });
        await flush();

        expect(order).toEqual(['allow', 'assign']);
        delete window.apya.dirtyGuard;
    });

    it('"Kapat" ve "Yeni sekmede giriş yap" izin vermez: sayfada kalınıyor', async () => {
        vi.spyOn(window, 'open').mockImplementation(() => null);
        window.apya.dirtyGuard = { allowUnload: vi.fn() };
        abpAjaxFails(request({ status: 401 }));

        sessionDialogs()[0].opts.preConfirm();
        sessionDialogs()[0].close({ isDismissed: true, dismiss: 'cancel' });
        await flush();

        expect(window.apya.dirtyGuard.allowUnload).not.toHaveBeenCalled();
        delete window.apya.dirtyGuard;
    });

    it('kurulu PWA: yeni sekme düğmesi yok, tek yol giriş sayfası', () => {
        window.matchMedia = () => ({ matches: true });

        abpAjaxFails(request({ status: 401 }));
        const dialog = sessionDialogs()[0];

        expect(dialog.opts.showDenyButton).toBeUndefined();
        expect(dialog.opts.confirmButtonText).toBe('Giriş sayfasına git');
        expect(dialog.opts.preConfirm).toBeUndefined();
    });

    it('sekmeye dönüşte oturum algılanırsa pencere kapanır ve bildirim gelir', async () => {
        abpAjaxFails(request({ status: 401 }));
        const dialog = sessionDialogs()[0];

        window.dispatchEvent(new Event('focus'));
        await flush();

        expect(dialog.closed).toBe(true);
        expect(abp.notify.success).toHaveBeenCalledWith('Oturumunuz yenilendi. İşleminizi tekrar deneyebilirsiniz.');
    });

    it('dönüşte oturum hâlâ yoksa pencere açık kalır', async () => {
        probeReturns({ isAuthenticated: false });
        abpAjaxFails(request({ status: 401 }));

        window.dispatchEvent(new Event('focus'));
        await flush();

        expect(sessionDialogs()[0].closed).toBe(false);
    });

    it('"Kapat"tan sonra arka plan isteği pencereyi yeniden açmaz; kullanıcı işlemi açar', async () => {
        abpAjaxFails(request({ status: 401 }));
        sessionDialogs()[0].close({ isDismissed: true, dismiss: 'cancel' });
        await flush();

        abpAjaxFails(request({ status: 401, background: true }), { abpHandleError: false });
        expect(sessionDialogs()).toHaveLength(1);

        abpAjaxFails(request({ status: 401 }));
        expect(sessionDialogs()).toHaveLength(2);
    });

    it('"Kapat"tan ÖNCE ilk 401 — GET de olsa — pencereyi açar', () => {
        abpAjaxFails(request({ status: 401, method: 'GET' }));

        expect(sessionDialogs()).toHaveLength(1);
        expect(sessionDialogs()[0].closed).toBe(false);
    });

    it('"Kapat"tan sonra güvenli yöntemin (GET; zarflı ya da zarfsız) 401\'i pencereyi yeniden açmaz; değiştiren istek açar', async () => {
        abpAjaxFails(request({ status: 401, method: 'GET' }));
        sessionDialogs()[0].close({ isDismissed: true, dismiss: 'esc' });
        await flush();

        const rejected = abpAjaxFails(request({ status: 401, method: 'GET' }), { abpHandleError: false });
        abpAjaxFails(request({
            status: 401,
            method: 'GET',
            headers: { _AbpErrorFormat: 'true' },
            json: { error: { code: 'Volo.Authorization:010001', message: 'Giriş yapmalısınız.' } }
        }));
        expect(sessionDialogs()).toHaveLength(1);
        // Pencere kapalı olsa da hata merkezi kanalda: sayfa içi ikinci metin basılmaz.
        expect(apya.ajaxErrors.message(rejected, 'Liste yüklenemedi.')).toBeNull();

        abpAjaxFails(request({ status: 401, method: 'DELETE' }));
        expect(sessionDialogs()).toHaveLength(2);
    });

    it('anonim sayfada ABP\'nin özgün 401 akışı korunur', async () => {
        await load({ authenticated: false });

        abpAjaxFails(request({ status: 401 }));

        expect(abpOriginals.handleErrorStatusCode).toHaveBeenCalledWith(401);
        expect(abpOriginals.handleUnAuthorizedRequest).toHaveBeenCalled();
        expect(dialogs).toHaveLength(0);
        expect(apya.session.expired()).toBe(false);
    });
});

describe('başka sekmede giriş/çıkış: ABP dinleyicisi bu sekmeyi yenilemez ya da köke yollamaz', () => {
    // Gömülü authentication-state-listener.js (ABP 10): her sayfa yüklenişinde localStorage'a
    // kullanıcı kimliğini yazar (oturumsuz sayfada siler) ve 'load'da — yani bu dosyadan
    // SONRA — yakalamasız bir 'storage' dinleyicisi ekler: eski değer varsa ya da yenisi
    // yoksa sekmeyi yeniden yükler, yoksa köke gider. Burada o dinleyici sahtedir.
    const KEY = 'authentication-state-id';
    let abpListener;

    const storage = (oldValue, newValue, key = KEY) =>
        window.dispatchEvent(new StorageEvent('storage', { key, oldValue, newValue }));
    const setVisibility = (state) =>
        Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state });

    beforeEach(() => {
        abpListener = vi.fn();
        window.addEventListener('storage', abpListener);
    });

    afterEach(() => {
        window.removeEventListener('storage', abpListener);
        delete document.visibilityState;
    });

    it('"Yeni sekmede giriş yap": giriş sayfası anahtarı silince sekme yenilenmez, pencere yerinde kalır', () => {
        vi.spyOn(window, 'open').mockImplementation(() => null);
        abpAjaxFails(request({ status: 401 }));
        sessionDialogs()[0].opts.preConfirm();

        storage('u1', null);

        expect(abpListener).not.toHaveBeenCalled();
        expect(dialogs).toHaveLength(1);
        expect(sessionDialogs()[0].closed).toBe(false);
    });

    it('yeni sekmede aynı kullanıcı girince köke gidilmez; pencere kullanıcı sekmeye dönünce kapanır', async () => {
        abpAjaxFails(request({ status: 401 }));
        setVisibility('hidden');   // kullanıcı giriş yaptığı sekmede
        storage('u1', null);

        storage(null, 'u1');
        await flush();

        expect(abpListener).not.toHaveBeenCalled();
        // Gizli sekmede kapatılmaz: "Oturumunuz yenilendi" bildirimi kimse görmeden sönerdi.
        expect(sessionDialogs()[0].closed).toBe(false);
        expect(abp.notify.success).not.toHaveBeenCalled();

        setVisibility('visible');
        document.dispatchEvent(new Event('visibilitychange'));
        await flush();

        expect(dialogs).toHaveLength(1);
        expect(sessionDialogs()[0].closed).toBe(true);
        expect(abp.notify.success.mock.calls).toEqual([['Oturumunuz yenilendi. İşleminizi tekrar deneyebilirsiniz.']]);
    });

    it('sekme görünürken (yan yana pencere) aynı kullanıcı girerse pencere hemen kapanır', async () => {
        abpAjaxFails(request({ status: 401 }));

        storage(null, 'u1');
        await flush();

        expect(abpListener).not.toHaveBeenCalled();
        expect(sessionDialogs()[0].closed).toBe(true);
        expect(abp.notify.success).toHaveBeenCalledTimes(1);
    });

    it('GİZLİLİK: oturum akışı yokken başka sekmede bilerek çıkış → ABP\'nin davranışı aynen (sekme giriş sayfasına düşer), pencere açılmaz', () => {
        // Çıkıştan sonra veri oturum penceresinin arkasında ekranda kalmasın (paylaşılan bilgisayar).
        storage('u1', null);

        expect(abpListener).toHaveBeenCalledTimes(1);
        expect(dialogs).toHaveLength(0);
        expect(fetch).not.toHaveBeenCalled();
    });

    it('GİZLİLİK: oturum akışı yokken başka kullanıcı girerse olay ABP\'ye bırakılır (sekme yenilenir)', () => {
        storage('u1', 'baska');

        expect(abpListener).toHaveBeenCalledTimes(1);
        expect(dialogs).toHaveLength(0);
    });

    it('oturum penceresi açıkken yinelenen çıkış olayı kesilir, ikinci pencere açılmaz', () => {
        abpAjaxFails(request({ status: 401 }));

        storage('u1', null);
        storage('u1', null);

        expect(abpListener).not.toHaveBeenCalled();
        expect(sessionDialogs()).toHaveLength(1);
        expect(dialogs).toHaveLength(1);
    });

    it('"Kapat"tan sonra başka sekmede giriş sayfası açılırsa pencere yeniden açılmaz', async () => {
        abpAjaxFails(request({ status: 401 }));
        sessionDialogs()[0].close({ isDismissed: true, dismiss: 'cancel' });
        await flush();

        storage('u1', null);

        expect(abpListener).not.toHaveBeenCalled();
        expect(dialogs).toHaveLength(1);
    });

    it('"Kapat"tan sonra aynı kullanıcı başka sekmede girerse yeni oturum dönemi başlar: sonraki düşüşte GET de pencereyi açar', async () => {
        abpAjaxFails(request({ status: 401 }));
        sessionDialogs()[0].close({ isDismissed: true, dismiss: 'cancel' });
        await flush();
        abpAjaxFails(request({ status: 401, method: 'GET' }), { abpHandleError: false });
        expect(sessionDialogs()).toHaveLength(1);   // "Kapat" geçerli

        storage(null, 'u1');
        await flush();

        expect(abpListener).not.toHaveBeenCalled();
        expect(dialogs).toHaveLength(1);
        expect(abp.notify.success).not.toHaveBeenCalled();   // kapanan pencere yok: bildirim de yok

        abpAjaxFails(request({ status: 401, method: 'GET' }), { abpHandleError: false });
        expect(sessionDialogs()).toHaveLength(2);
    });

    it('GİZLİLİK: oturum penceresi açıkken BAŞKA kullanıcı girerse olay ABP\'ye bırakılır (sekme köke gider), eski kullanıcının ekranı kalmaz', () => {
        abpAjaxFails(request({ status: 401 }));
        storage('u1', null);            // giriş sayfası açıldı: kesilir
        expect(abpListener).not.toHaveBeenCalled();

        storage(null, 'baska');         // başka kullanıcı girdi: ABP köke yollar

        expect(abpListener).toHaveBeenCalledTimes(1);
        expect(dialogs).toHaveLength(1);   // "sayfayı yenileyin" penceresi açılmaz
    });

    it('GİZLİLİK: pencere açık ve sekme gizliyken aynı kullanıcı girip SONRA çıkış yaparsa bu gerçek çıkıştır: ABP\'ye bırakılır', async () => {
        abpAjaxFails(request({ status: 401 }));
        setVisibility('hidden');
        storage('u1', null);            // giriş sayfası açıldı: kesilir
        storage(null, 'u1');            // yeniden giriş: kesilir, pencere kullanıcı dönünce kapanacak
        await flush();
        expect(abpListener).not.toHaveBeenCalled();
        expect(sessionDialogs()[0].closed).toBe(false);

        storage('u1', null);            // bilerek çıkış

        expect(abpListener).toHaveBeenCalledTimes(1);
    });

    it('yeniden giriş işareti yeni oturum penceresine taşınmaz: sonraki düşüşte giriş sayfasının açılması yine kesilir', async () => {
        abpAjaxFails(request({ status: 401 }));
        setVisibility('hidden');
        storage('u1', null);
        storage(null, 'u1');            // gizli sekmede yeniden giriş → işaret kuruldu
        setVisibility('visible');
        document.dispatchEvent(new Event('visibilitychange'));
        await flush();
        expect(sessionDialogs()[0].closed).toBe(true);

        abpAjaxFails(request({ status: 401 }));   // oturum yine düştü, yeni pencere
        storage('u1', null);                      // "Yeni sekmede giriş yap": giriş sayfası anahtarı siler

        expect(abpListener).not.toHaveBeenCalled();
        expect(sessionDialogs()[1].closed).toBe(false);
    });

    it('dinleyici dosya değerlendirilirken kaydolur (pencere "load" olayını beklemez)', () => {
        // ABP'ninkinden ÖNCE çalışmasının güvencesi KAYIT sırasıdır: Chrome, window'a gelen
        // olayda dinleyicileri kayıt sırasıyla çağırır, yakalama bayrağı sırayı değiştirmez
        // (canlıda ölçüldü). jsdom yakalamayı önce çağırdığı için sıra burada sınanamaz;
        // ABP kendi dinleyicisini 'load'da ekler, bu dosya ondan önce kaydolmuş olmalı.
        expect(storageListeners).toHaveLength(1);
        expect(typeof storageListeners[0][1]).toBe('function');
    });

    it('başka anahtar ve değeri değişmeyen olay kesilmez', () => {
        storage('a', 'b', 'apya-rq-cache');
        storage('u1', 'u1');

        expect(abpListener).toHaveBeenCalledTimes(2);
        expect(dialogs).toHaveLength(0);
    });

    it('oturumsuz sayfada (giriş sayfası vb.) ABP\'nin davranışı aynen: olay kesilmez, pencere yok', async () => {
        await load({ authenticated: false });

        storage(null, 'u1');
        storage('u1', null);

        expect(abpListener).toHaveBeenCalledTimes(2);
        expect(dialogs).toHaveLength(0);
        expect(fetch).not.toHaveBeenCalled();
    });
});

describe('oturum penceresi açıkken ABP mesajı onu ezmez (SweetAlert tekil)', () => {
    it('jQuery 401 → çağıranın abp.message.error\'u: oturum penceresi açık kalır, çözülmüş Deferred döner', () => {
        abpAjaxFails(request({ status: 401 }));
        const done = vi.fn();

        abp.message.error('Başka bir aktif sayaç olabilir.', 'Zaman kaydı başlatılamadı').done(done);

        expect(dialogs).toHaveLength(1);
        expect(sessionDialogs()[0].closed).toBe(false);
        expect(done).toHaveBeenCalledTimes(1);
    });

    it('fetch (httpClient) 401 → catch\'teki abp.message.error: oturum penceresi açık kalır', async () => {
        window.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 401, text: () => Promise.resolve('') }));

        await api.post('/api/app/form', { title: 'QA' }).catch((e) => abp.message.error(e.message));

        expect(dialogs).toHaveLength(1);
        expect(sessionDialogs()[0].closed).toBe(false);
    });

    it('"başka kullanıcı" penceresi açıkken de açılmaz (warn/info dahil)', async () => {
        probeReturns({ isAuthenticated: true, id: 'baska' });
        abpAjaxFails(request({ status: 400, method: 'DELETE' }));
        await flush();

        abp.message.warn('x');
        abp.message.info('y');

        expect(dialogs).toHaveLength(1);
        expect(dialogs[0].opts.text).toContain('başka bir kullanıcıyla giriş yapılmış');
        expect(dialogs[0].closed).toBe(false);
    });

    it('pencere yokken ya da kapatıldıktan sonra ABP mesajı normal açılır', async () => {
        abp.message.error('Kilitli belge silinemez.', 'Silinemedi');
        expect(dialogs).toHaveLength(1);
        expect(dialogs[0].opts).toMatchObject({ icon: 'error', title: 'Silinemedi', html: 'Kilitli belge silinemez.' });

        abpAjaxFails(request({ status: 401 }));
        sessionDialogs()[0].close({ isDismissed: true, dismiss: 'cancel' });
        await flush();
        abp.message.error('Sunucu hatası.');

        const last = dialogs[dialogs.length - 1];
        expect(last.opts.html).toBe('Sunucu hatası.');
        expect(last.closed).toBe(false);
    });
});

describe('oturum penceresi açıkken onay / soru da onu ezmez: "vazgeçildi" sayılır (CON-02)', () => {
    it('abp.message.confirm(mesaj, başlık, geriÇağrı): pencere açılmaz, geri çağrı ve Deferred false', () => {
        abpAjaxFails(request({ status: 401 }));
        const callback = vi.fn();
        const done = vi.fn();

        abp.message.confirm('Görev silinsin mi?', 'Emin misiniz?', callback).done(done);

        expect(dialogs).toHaveLength(1);
        expect(sessionDialogs()[0].closed).toBe(false);
        expect(abpOriginals.confirm).not.toHaveBeenCalled();
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(false);
        expect(done).toHaveBeenCalledWith(false);
    });

    it('abp.message.confirm(mesaj, geriÇağrı) imzası (ABP ModalManager\'ın kendi onayı) da aynı', () => {
        abpAjaxFails(request({ status: 401 }));
        const callback = vi.fn();
        const done = vi.fn();

        abp.message.confirm('Kaydedilmemiş değişiklikler var.', callback, false).done(done);

        expect(dialogs).toHaveLength(1);
        expect(callback).toHaveBeenCalledWith(false);
        expect(done).toHaveBeenCalledWith(false);
    });

    it('geri çağrısız çağrı: yalnız Deferred false ile çözülür', () => {
        abpAjaxFails(request({ status: 401 }));
        const done = vi.fn();

        abp.message.confirm('Kaynak silinsin mi?').done(done);

        expect(dialogs).toHaveLength(1);
        expect(done).toHaveBeenCalledWith(false);
    });

    it('abp.message.prompt: geri çağrı ve Deferred null (iptal) — seçenek nesneli ve düz imzada', () => {
        abpAjaxFails(request({ status: 401 }));
        const withOptions = vi.fn();
        const plain = vi.fn();
        const done = vi.fn();

        abp.message.prompt('Ret gerekçesi', { inputPlaceholder: 'Gerekçe' }, withOptions).done(done);
        abp.message.prompt('Ret gerekçesi', plain);

        expect(dialogs).toHaveLength(1);
        expect(sessionDialogs()[0].closed).toBe(false);
        expect(abpOriginals.prompt).not.toHaveBeenCalled();
        expect(withOptions).toHaveBeenCalledWith(null);
        expect(plain).toHaveBeenCalledWith(null);
        expect(done).toHaveBeenCalledWith(null);
    });

    it('"başka kullanıcı" penceresi açıkken de açılmaz', async () => {
        probeReturns({ isAuthenticated: true, id: 'baska' });
        abpAjaxFails(request({ status: 400, method: 'DELETE' }));
        await flush();
        const callback = vi.fn();

        abp.message.confirm('Silinsin mi?', callback);

        expect(dialogs).toHaveLength(1);
        expect(dialogs[0].opts.text).toContain('başka bir kullanıcıyla giriş yapılmış');
        expect(callback).toHaveBeenCalledWith(false);
    });

    it('pencere kapalıyken confirm / prompt özgün fonksiyona gider (argümanlar aynen)', async () => {
        const callback = vi.fn();
        const options = { inputPlaceholder: 'Gerekçe' };

        abp.message.confirm('Kaynak silinsin mi?', 'Emin misiniz?', callback);
        expect(abpOriginals.confirm).toHaveBeenCalledWith('Kaynak silinsin mi?', 'Emin misiniz?', callback);
        expect(dialogs).toHaveLength(1);
        expect(dialogs[0].opts).toMatchObject({ icon: 'warning', text: 'Kaynak silinsin mi?', showCancelButton: true });

        dialogs[0].close({ isConfirmed: true, value: true });
        await flush();
        expect(callback).toHaveBeenCalledWith(true);

        abp.message.prompt('Ret gerekçesi', options, callback);
        expect(abpOriginals.prompt).toHaveBeenCalledWith('Ret gerekçesi', options, callback);
        expect(dialogs[1].opts).toMatchObject({ input: 'text', inputPlaceholder: 'Gerekçe' });
    });

    it('oturum penceresi "Kapat"la kapatıldıktan sonra onay yine açılır', async () => {
        abpAjaxFails(request({ status: 401 }));
        sessionDialogs()[0].close({ isDismissed: true, dismiss: 'cancel' });
        await flush();

        abp.message.confirm('Silinsin mi?');

        expect(abpOriginals.confirm).toHaveBeenCalledTimes(1);
        expect(dialogs[dialogs.length - 1].opts.text).toBe('Silinsin mi?');
    });
});

describe('apya.session.isDialogOpen: ortak onay (apya.confirm) merkezi pencereyi ezmesin', () => {
    it('pencere yokken false', () => {
        expect(apya.session.isDialogOpen()).toBe(false);
    });

    it('oturum penceresi açıkken true; kapanınca false', async () => {
        abpAjaxFails(request({ status: 401 }));
        expect(apya.session.isDialogOpen()).toBe(true);

        sessionDialogs()[0].close({ isDismissed: true, dismiss: 'cancel' });
        await flush();
        expect(apya.session.isDialogOpen()).toBe(false);
    });

    it('"başka kullanıcı" penceresinde true', async () => {
        probeReturns({ isAuthenticated: true, id: 'baska' });
        abpAjaxFails(request({ status: 400, method: 'DELETE' }));
        await flush();

        expect(apya.session.isDialogOpen()).toBe(true);
    });

    it('güvenlik anahtarı ("tekrar deneyin") penceresinde false: o pencere ezilebilir', async () => {
        abpAjaxFails(request({ status: 400, method: 'POST' }));
        await flush();

        expect(dialogs).toHaveLength(1);
        expect(dialogs[0].opts.text).toBe(RETRY_TEXT);
        expect(apya.session.isDialogOpen()).toBe(false);
    });
});

describe('httpClient (React adaları) aynı oturum penceresine gider', () => {
    const fails401 = () => {
        window.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 401, text: () => Promise.resolve('') }));
    };

    it('ilk 401 — odakta tazeleme (GET) de olsa — pencereyi açar', async () => {
        fails401();

        const err = await api.get('/api/app/task/1').catch((e) => e);

        expect(sessionDialogs()).toHaveLength(1);
        expect(err.apyaCentral).toBe(true);
    });

    it('"Kapat"tan sonra GET 401 (React Query odak/yeniden bağlanma) pencereyi yeniden açmaz; mutasyon açar', async () => {
        fails401();
        await api.get('/api/app/task/1').catch(() => null);
        sessionDialogs()[0].close({ isDismissed: true, dismiss: 'cancel' });
        await flush();

        const refetch = await api.get('/api/app/task/1').catch((e) => e);
        expect(sessionDialogs()).toHaveLength(1);
        expect(refetch.apyaCentral).toBe(true);

        await api.put('/api/app/task/1', {}).catch(() => null);
        expect(sessionDialogs()).toHaveLength(2);
    });
});

describe('yükleme isteği: ABP penceresi bastırılır (abpHandleError:false), 401 yine merkezi pencereye', () => {
    it('401: ABP penceresi yok, oturum penceresi var; çağıranın metni null', () => {
        const rejected = abpAjaxFails(request({ status: 401, method: 'GET' }), { abpHandleError: false });

        expect(abpOriginals.showError).not.toHaveBeenCalled();
        expect(sessionDialogs()).toHaveLength(1);
        expect(apya.ajaxErrors.message(rejected, 'Liste yüklenemedi.')).toBeNull();
        expect(apya.ajaxErrors.wasShown(rejected)).toBe(true);
    });

    it('500: hiçbir pencere yok; sayfa içi metin durum kodundan', () => {
        const rejected = abpAjaxFails(request({ status: 500, method: 'GET' }), { abpHandleError: false });

        expect(abpOriginals.showError).not.toHaveBeenCalled();
        expect(dialogs).toHaveLength(0);
        expect(apya.ajaxErrors.wasShown(rejected)).toBe(false);
        expect(apya.ajaxErrors.message(rejected, 'Liste yüklenemedi.')).toBe(SERVER_TEXT);
    });

    it('zarflı doğrulama hatası: ilk doğrulama mesajı', () => {
        const rejected = abpAjaxFails(request({
            status: 400,
            headers: { _AbpErrorFormat: 'true' },
            body: JSON.stringify({ error: { message: 'İsteğiniz geçerli değil!', validationErrors: [{ message: 'Ad zorunlu.' }] } })
        }), { abpHandleError: false });

        expect(abpOriginals.showError).not.toHaveBeenCalled();
        expect(apya.ajaxErrors.message(rejected, 'Kaydedilemedi.')).toBe('Ad zorunlu.');
    });
});

describe('handleAbpErrorResponse: tek kanal işareti', () => {
    it('pencere gösterilen zarf "gösterildi" işaretlenir; ABP aynı nesneyi gösterir ve reddeder', () => {
        const error = { code: 'Platform:Kanban:WipLimit', message: 'WIP sınırı aşıldı.' };
        const rejected = abpAjaxFails(request({ status: 403, headers: { _AbpErrorFormat: 'true' }, json: { error } }));

        expect(rejected).toBe(error);
        expect(error.apyaShown).toBe(true);
        expect(abpOriginals.showError).toHaveBeenCalledWith(error);
    });

    it('zarfta details varken mesaj pencere BAŞLIĞINA gider (ABP başlığı HTML basar): kaçışlanır, çağıranın nesnesi değişmez', () => {
        const error = { message: 'QA <img src=x onerror=alert(1)> reddedildi', details: 'Ayrıntı <b>metni</b>' };
        const rejected = abpAjaxFails(request({ status: 403, headers: { _AbpErrorFormat: 'true' }, json: { error } }));

        expect(shownErrors()).toEqual([expect.objectContaining({
            message: 'QA &lt;img src=x onerror=alert(1)&gt; reddedildi',
            details: 'Ayrıntı <b>metni</b>',   // ABP metni kendisi kaçışlar
        })]);
        // Çağıran (sayfa içi metin, notifyError) düz metni görmeye devam eder.
        expect(rejected).toBe(error);
        expect(error.message).toBe('QA <img src=x onerror=alert(1)> reddedildi');
    });

    it('abpHandleError:false: işaret yok, pencere yok', () => {
        const error = { message: 'WIP sınırı aşıldı.' };
        const rejected = abpAjaxFails(request({ status: 403, headers: { _AbpErrorFormat: 'true' }, json: { error } }), { abpHandleError: false });

        expect(rejected.apyaShown).toBeUndefined();
        expect(abpOriginals.showError).not.toHaveBeenCalled();
    });

    it('responseJSON yoksa gövde ayrıştırılıp jqXHR\'a yazılır (işaret kaybolmaz)', () => {
        const rejected = abpAjaxFails(request({
            status: 500,
            headers: { _AbpErrorFormat: 'true' },
            body: JSON.stringify({ error: { message: 'Sunucu hatası.' } })
        }));

        expect(rejected.apyaShown).toBe(true);
        expect(shownErrors()[0]).toBe(rejected);
    });
});

describe('ModalManager .load() hatası (dataType html)', () => {
    // Gömülü modal-manager.js: responseJSON yoksa JSON.parse(responseText) — boş/HTML gövdede çöküyordu.
    const modalManagerOpenFails = (xhr) => {
        const responseJSON = xhr.responseJSON ? xhr.responseJSON : JSON.parse(xhr.responseText);
        abp.ajax.showError(responseJSON.error ? responseJSON.error : abp.ajax.defaultError);
    };

    it('ağ kopması (boş gövde): çökme yok, bağlantı metni', () => {
        const req = request({ status: 0, method: 'GET', dataType: 'html' });
        req.fail();

        expect(() => modalManagerOpenFails(req.xhr)).not.toThrow();
        expect(shownErrors()).toEqual([{ message: NETWORK_TITLE, details: NETWORK_TEXT }]);
    });

    it('HTML 502 gövdesi: çökme yok, geçici kesinti metni', () => {
        const req = request({ status: 502, method: 'GET', dataType: 'html', body: '<html>Bad Gateway</html>' });
        req.fail();

        expect(() => modalManagerOpenFails(req.xhr)).not.toThrow();
        expect(shownErrors()[0].message).toBe('Sunucu şu an yanıt vermiyor');
    });

    it('JSON zarflı gövde ayrıştırılır', () => {
        const req = request({ status: 403, method: 'GET', dataType: 'html', body: JSON.stringify({ error: { message: 'Bu faturayı açamazsınız.' } }) });
        req.fail();

        expect(req.xhr.responseJSON.error.message).toBe('Bu faturayı açamazsınız.');
    });

    it('oturum düşmüşken modal açılışı: yalnız oturum penceresi', () => {
        const req = request({ status: 401, method: 'GET', dataType: 'html' });
        req.fail();
        modalManagerOpenFails(req.xhr);

        expect(abpOriginals.showError).not.toHaveBeenCalled();
        expect(sessionDialogs()).toHaveLength(1);
    });

    it('"Kapat"tan sonra modal açılışı: pencere yeniden açılmaz, ölü tık yerine hatırlatma (30 sn\'de en çok bir)', async () => {
        const now = vi.spyOn(Date, 'now').mockReturnValue(1_000_000);
        const openModal = () => {
            const req = request({ status: 401, method: 'GET', dataType: 'html' });
            req.fail();
            modalManagerOpenFails(req.xhr);
        };
        openModal();
        expect(abp.notify.warn).not.toHaveBeenCalled();   // ilk 401 pencereyi açtı: bildirim gereksiz
        sessionDialogs()[0].close({ isDismissed: true, dismiss: 'cancel' });
        await flush();

        openModal();
        openModal();

        expect(sessionDialogs()).toHaveLength(1);
        expect(abpOriginals.showError).not.toHaveBeenCalled();
        // Pencereyle aynı başlık ve metin (yeni anahtar yok).
        expect(abp.notify.warn.mock.calls).toEqual([[sessionDialogs()[0].opts.text, SESSION_TITLE]]);
        expect(abp.notify.warn.mock.calls[0][0]).toContain('yeniden giriş yapmanız gerekiyor');

        now.mockReturnValue(1_000_000 + 30 * 1000);
        openModal();
        expect(abp.notify.warn).toHaveBeenCalledTimes(2);
        expect(sessionDialogs()).toHaveLength(1);
    });

    it('"Kapat"tan sonra liste/odak tazelemesi (JSON GET) ve arka plan isteği hatırlatma göstermez', async () => {
        abpAjaxFails(request({ status: 401 }));
        sessionDialogs()[0].close({ isDismissed: true, dismiss: 'cancel' });
        await flush();

        abpAjaxFails(request({ status: 401, method: 'GET' }), { abpHandleError: false });
        request({ status: 401, method: 'GET', dataType: 'html', background: true }).fail();

        expect(abp.notify.warn).not.toHaveBeenCalled();
        expect(sessionDialogs()).toHaveLength(1);
    });

    it('dataType json\'a dokunulmaz', () => {
        const req = request({ status: 500, method: 'GET', dataType: 'json', body: '' });
        req.fail();

        expect(req.xhr.responseJSON).toBeUndefined();
    });
});

describe('apya.ajaxErrors.message / notify', () => {
    it('zarf nesnesi: ilk doğrulama mesajı önce, sonra mesaj', () => {
        expect(apya.ajaxErrors.message({ message: 'Geçersiz!', validationErrors: [{ message: 'Tarih geçersiz.' }] })).toBe('Tarih geçersiz.');
        expect(apya.ajaxErrors.message({ message: 'Kilitli belge silinemez.' })).toBe('Kilitli belge silinemez.');
    });

    it('jqXHR 0: ağ metni', () => {
        const req = request({ status: 0, method: 'GET' });
        req.fail();

        expect(apya.ajaxErrors.message(req.xhr, 'x')).toBe(NETWORK_TEXT);
    });

    it('yükleme kartı bağlamı ({ load: true }): ağ ve geçici kesinti metni "girdiğiniz bilgiler korunuyor" demez', () => {
        const offline = request({ status: 0, method: 'GET' });
        offline.fail();
        const unavailable = request({ status: 503, method: 'GET' });
        unavailable.fail();

        expect(apya.ajaxErrors.message(offline.xhr, 'x', { load: true }))
            .toBe('Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.');
        expect(apya.ajaxErrors.message(unavailable.xhr, 'x', { load: true }))
            .toBe('Sunucu geçici olarak kullanılamıyor. Birkaç dakika sonra tekrar deneyin.');
        // fetch (httpClient ApiError): ağ hatası status 0 + code 'Network'; zarfsız 503'te code yok.
        expect(apya.ajaxErrors.message({ status: 0, code: 'Network', message: NETWORK_TEXT }, 'x', { load: true }))
            .toBe('Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.');
        expect(apya.ajaxErrors.message({ status: 503, message: 'eski metin' }, 'x', { load: true }))
            .toBe('Sunucu geçici olarak kullanılamıyor. Birkaç dakika sonra tekrar deneyin.');
    });

    it('yükleme bağlamı diğer hatalara dokunmaz; seçenek yokken işlem metni aynen', () => {
        // sunucunun kendi cümlesi (zarf / kodlu hata) korunur
        expect(apya.ajaxErrors.message({ status: 503, code: 'Platform:X', message: 'Bakım var.' }, 'x', { load: true })).toBe('Bakım var.');
        expect(apya.ajaxErrors.message({ status: 400, message: 'Tarih geçersiz.' }, 'x', { load: true })).toBe('Tarih geçersiz.');
        // işlem (kaydet) bağlamı: güvence cümlesi yerinde
        expect(apya.ajaxErrors.message({ status: 0, code: 'Network', message: NETWORK_TEXT }, 'x')).toBe(NETWORK_TEXT);
    });

    it('Error: kendi mesajı; teknik çalışma zamanı hatası: yedek', () => {
        expect(apya.ajaxErrors.message(new Error('Proje servisi yüklenmedi.'), 'x')).toBe('Proje servisi yüklenmedi.');
        expect(apya.ajaxErrors.message(new TypeError("Cannot read properties of undefined (reading 'id')"), 'Kaydedilemedi.')).toBe('Kaydedilemedi.');
    });

    it('null/undefined: yedek', () => {
        expect(apya.ajaxErrors.message(null, 'Yedek.')).toBe('Yedek.');
        expect(apya.ajaxErrors.message(undefined, 'Yedek.')).toBe('Yedek.');
    });

    it('notify: gösterilmemiş hatayı tek bildirimle gösterir', () => {
        apya.ajaxErrors.notify(new Error('Görev taşınamadı.'), 'x');

        expect(abp.notify.error).toHaveBeenCalledWith('Görev taşınamadı.');
    });

    it('notify: sunucunun düz metni kaçışlanır (ABP toast\'ı innerHTML ile basar); htmlEscape yoksa düz metin', () => {
        apya.ajaxErrors.notify({ message: '<img src=x onerror=alert(1)> "A&B"' }, 'x');
        expect(abp.notify.error).toHaveBeenLastCalledWith('&lt;img src=x onerror=alert(1)&gt; &quot;A&amp;B&quot;');

        delete abp.utils;
        apya.ajaxErrors.notify({ message: 'Kilitli belge silinemez.' }, 'x');
        expect(abp.notify.error).toHaveBeenLastCalledWith('Kilitli belge silinemez.');
    });
});

describe('pencere yalıtımı (Radix/Bootstrap modalı üstünde)', () => {
    it('kapsayıcı işaretlenir, tıklama/odak belge dinleyicilerine sızmaz', () => {
        const outside = vi.fn();
        document.addEventListener('pointerdown', outside);
        document.addEventListener('focusin', outside);

        abpAjaxFails(request({ status: 401 }));
        const { container, button } = sessionDialogs()[0];

        expect(container.hasAttribute('data-apya-overlay')).toBe(true);
        expect(container.style.pointerEvents).toBe('auto');
        expect(sessionDialogs()[0].opts.keydownListenerCapture).toBe(true);

        button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
        button.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
        expect(outside).not.toHaveBeenCalled();

        document.removeEventListener('pointerdown', outside);
        document.removeEventListener('focusin', outside);
    });

    it('odak penceremize geçerken alttaki odak kapanı "focusout"u görmez', () => {
        const trap = vi.fn();
        document.addEventListener('focusout', trap);
        const field = document.createElement('input');
        document.body.appendChild(field);

        abpAjaxFails(request({ status: 401 }));
        const { button } = sessionDialogs()[0];

        field.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: button }));
        expect(trap).not.toHaveBeenCalled();

        field.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }));
        expect(trap).toHaveBeenCalledTimes(1);

        field.remove();
        document.removeEventListener('focusout', trap);
    });

    it('ABP\'nin kendi pencereleri de yalıtılır: config.default\'a birleşir, diğer alanlar korunur', () => {
        const defaults = abp.libs.sweetAlert.config.default;
        expect(defaults.confirmButtonText).toBe('Tamam');
        expect(defaults.keydownListenerCapture).toBe(true);
        expect(typeof defaults.willOpen).toBe('function');

        const outside = vi.fn();
        document.addEventListener('pointerdown', outside);
        document.addEventListener('focusin', outside);

        abp.message.error('WIP sınırı aşıldı.');
        const { container, button, opts } = dialogs[0];

        expect(opts.keydownListenerCapture).toBe(true);
        expect(container.hasAttribute('data-apya-overlay')).toBe(true);
        expect(container.style.pointerEvents).toBe('auto');
        button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
        button.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
        expect(outside).not.toHaveBeenCalled();

        document.removeEventListener('pointerdown', outside);
        document.removeEventListener('focusin', outside);
    });

    // RSP-05.2 gerileme pini: modal dışında açılan onayın düğmelerine klavyeyle ulaşılamıyor,
    // ikinci Esc kapatmıyordu. Onay da config.default'u birleştirdiği için yalıtılır: odak
    // Bootstrap odak kapanına sızmaz, Esc / Tab pencere düzeyinde SweetAlert'te kalır.
    it('abp.message.confirm de yalıtılır (kirli-form onayı Bootstrap modalı üstünde klavyeyle kullanılır)', () => {
        const outside = vi.fn();
        document.addEventListener('pointerdown', outside);
        document.addEventListener('focusin', outside);

        abp.message.confirm('Kaydedilmemiş değişiklikler var.');
        const { container, button, opts } = dialogs[0];

        expect(opts.keydownListenerCapture).toBe(true);
        expect(opts.showCancelButton).toBe(true);
        expect(container.hasAttribute('data-apya-overlay')).toBe(true);
        expect(container.style.pointerEvents).toBe('auto');
        button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
        button.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
        expect(outside).not.toHaveBeenCalled();

        document.removeEventListener('pointerdown', outside);
        document.removeEventListener('focusin', outside);
    });

    // Balon açık pencerenin (Radix) üstünde tıklanabilir ama "dışı" sayılıyordu: balona ya da
    // "×"ine basmak görev detayını kapatıyor, kirli formda "Kaydet" tıklamasını yutuyordu.
    it('ABP bildirim balonu da yalıtılır: tıklama/odak belgeye sızmaz, click sızar, konum ve pointer-events korunur', () => {
        const isolated = ['pointerdown', 'mousedown', 'touchstart', 'focusin'];
        const outside = vi.fn();
        const clicked = vi.fn();
        isolated.forEach((name) => document.addEventListener(name, outside));
        document.addEventListener('click', clicked);

        const toast = new AbpToastService().error('Kaydedilemedi.');
        const container = document.getElementById('toast-container');
        const close = toast.querySelector('.abp-toast-close-button');

        expect(container.getAttribute('data-apya-overlay')).toBe('toast');
        // Kabın pointer-events'ine dokunulmaz: balonlar arası boşluk tıklamayı alttakine geçirir.
        expect(container.style.pointerEvents).toBe('');
        expect(container.style.bottom).toBe('30px');

        isolated.forEach((name) => close.dispatchEvent(new Event(name, { bubbles: true })));
        expect(outside).not.toHaveBeenCalled();

        // click durdurulmaz: "×" ve sayfanın click dinleyicileri çalışmaya devam eder.
        close.dispatchEvent(new Event('click', { bubbles: true }));
        expect(clicked).toHaveBeenCalledTimes(1);

        isolated.forEach((name) => document.removeEventListener(name, outside));
        document.removeEventListener('click', clicked);
    });

    it('her bildirim yeni servis örneği kurar: kap yalnız bir kez yalıtılır', () => {
        new AbpToastService().error('1');
        const container = document.getElementById('toast-container');
        const added = vi.spyOn(container, 'addEventListener');

        new AbpToastService().error('2');

        expect(added).not.toHaveBeenCalled();
        expect(container.querySelectorAll('.abp-toast')).toHaveLength(2);
    });

    it('AbpToastService yoksa dosya hatasız yüklenir, pencere yalıtımı çalışır', async () => {
        await load({ toastService: false });

        abp.message.error('WIP sınırı aşıldı.');
        expect(dialogs[0].container.hasAttribute('data-apya-overlay')).toBe(true);
    });
});
