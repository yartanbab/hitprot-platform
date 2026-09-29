import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// wwwroot/js/ajax-error-detail.js bir IIFE: jQuery'nin $.ajaxPrefilter'ına kanca takar
// ve abp.ajax'ın hata yolunu SARAR. Repoda jQuery devDependency yok (bkz.
// apyaQuotaUpsell.test.js); burada ABP'nin sarılan fonksiyonları abp.jquery.js
// (ABP 10) ile AYNI mantıkla kurulur ve istekler jQuery 4'ün gerçek sırasıyla
// canlandırılır: prefilter'ın eklediği fail geri çağrısı → ABP'nin (ya da
// abpAjaxForm'un) hata işleyicisi. SweetAlert ve fetch (oturum yoklaması) sahtedir.

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

    window.abp = {
        appPath: '/',
        currentUser: { isAuthenticated: authenticated, id: authenticated ? userId : null },
        localization: { getResource: () => (key) => key },
        libs: { sweetAlert: { config: { default: { confirmButtonText: 'Tamam' } } } },
        notify: { error: vi.fn(), success: vi.fn(), warn: vi.fn() },
        message: { warn: vi.fn() },
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
        Deferred: () => ({ promise: pending })
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

async function load(options) {
    installAbp(options);
    installJquery();
    installSwal();
    probeReturns({ isAuthenticated: true, id: 'u1' });
    vi.resetModules();
    await import('../../../js/ajax-error-detail.js');
}

beforeEach(async () => {
    await load();
});

afterEach(() => {
    document.querySelectorAll('.swal2-container').forEach((n) => n.remove());
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

    it('anonim sayfada ABP\'nin özgün 401 akışı korunur', async () => {
        await load({ authenticated: false });

        abpAjaxFails(request({ status: 401 }));

        expect(abpOriginals.handleErrorStatusCode).toHaveBeenCalledWith(401);
        expect(abpOriginals.handleUnAuthorizedRequest).toHaveBeenCalled();
        expect(dialogs).toHaveLength(0);
        expect(apya.session.expired()).toBe(false);
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
});
