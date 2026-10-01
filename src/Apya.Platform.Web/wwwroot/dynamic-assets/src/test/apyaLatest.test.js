import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';

// wwwroot/js/apya-latest.js bir IIFE: apya.latest bilet sayacını kurar ve
// abp.libs.datatables.createAjax'ı sarar. jQuery GEREKMEZ; sarmalayıcı Deferred
// kullanmaz. ABP'nin createAjax'ı yerine, DataTables callback'lerini sırayla
// biriktiren sahte bir ajax fonksiyonu döndüren casus kurulur.

let created;   // casusun her çağrıda döndürdüğü sahte ajax fonksiyonları
let requests;  // sahte ajax'a gelen istekler: { args, callback }
let createAjaxSpy;

beforeAll(async () => {
    created = [];
    requests = [];
    createAjaxSpy = vi.fn(function () {
        const ajax = function (requestData, callback, settings) {
            requests.push({ self: this, args: [requestData, callback, settings], callback });
            return { jqXHR: null };
        };
        created.push(ajax);
        return ajax;
    });
    window.abp = { libs: { datatables: { createAjax: createAjaxSpy } } };
    await import('../../../js/apya-latest.js');
});

describe('apya.latest', () => {
    it('yeni bilet alınınca önceki bayatlar, sonuncusu geçerli kalır', () => {
        const next = apya.latest();
        const first = next();
        expect(first()).toBe(true);

        const second = next();
        expect(first()).toBe(false);
        expect(second()).toBe(true);
    });

    it('iki ayrı sayaç birbirini etkilemez', () => {
        const list = apya.latest();
        const detail = apya.latest();
        const listTicket = list();
        const detailTicket = detail();

        list();
        expect(listTicket()).toBe(false);
        expect(detailTicket()).toBe(true);
    });
});

// ABP 10 createAjax'ın iç işleyişi (datatables-extensions): serverMethod DataTables çağrısının
// İÇİNDE eşzamanlı çağrılır, söze yalnız başarı dalı bağlanır, söz DÖNDÜRÜLMEZ. Gerçek ABP jQuery
// sözü kullanır (ret raporlanmaz); native sözde ret kolu verilmezse vitest yakalanmamış ret
// sayar — boş ret kolu yalnız bu yüzden var.
function abpLikeCreateAjax(serverMethod, inputAction, responseCallback) {
    return function (requestData, callback) {
        if (!callback) { return undefined; }
        const promise = serverMethod({});
        if (promise && typeof promise.then === 'function') {
            promise.then((r) => callback(responseCallback ? responseCallback(r) : r), () => { });
        }
        return undefined;
    };
}

function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
}

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('DataTables hata dalı: yükleme hatası tablo kartına gider (Faz 4)', () => {
    let failTable;

    beforeEach(() => {
        createAjaxSpy.mockImplementation(abpLikeCreateAjax);
        failTable = vi.fn();
        window.apya.loadState = { failTable };
    });

    afterEach(() => {
        delete window.apya.loadState;
    });

    it('son isteğin reddi failTable\'ı settings, ÖZGÜN DataTables callback\'i ve hatayla çağırır', async () => {
        const d = deferred();
        const ajax = abp.libs.datatables.createAjax(() => d.promise);
        const callback = vi.fn();
        const settings = { nTable: {} };

        ajax({}, callback, settings);
        const error = { message: 'Sunucu hatası' };
        d.reject(error);
        await flush();

        expect(failTable).toHaveBeenCalledTimes(1);
        expect(failTable).toHaveBeenCalledWith(settings, callback, error);
        expect(callback).not.toHaveBeenCalled();
    });

    it('bayat ret yutulur: yeni istek başarılıyken geç düşen eski hata tabloyu ezmez', async () => {
        const old = deferred();
        const fresh = deferred();
        const queue = [old, fresh];
        const ajax = abp.libs.datatables.createAjax(() => queue.shift().promise);
        const callback = vi.fn();

        ajax({}, callback, {});
        ajax({}, callback, {});
        fresh.resolve({ data: ['yeni'] });
        await flush();
        old.reject(new Error('geç düşen'));
        await flush();

        expect(failTable).not.toHaveBeenCalled();
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith({ data: ['yeni'] });
    });

    it('serverMethod söz döndürmezse hata atmaz', () => {
        const ajax = abp.libs.datatables.createAjax(() => undefined);
        expect(() => ajax({}, vi.fn(), {})).not.toThrow();
    });

    it('apya.loadState yokken ret sessizce yutulur (yakalanmamış ret yok)', async () => {
        delete window.apya.loadState;
        const d = deferred();
        const ajax = abp.libs.datatables.createAjax(() => d.promise);

        ajax({}, vi.fn(), {});
        d.reject(new Error('x'));
        await flush();

        expect(failTable).not.toHaveBeenCalled();
    });

    it('iptal kipinde (4. parametre true) hata dalı yok: ABP fonksiyonu aynen döner', () => {
        const ajax = abp.libs.datatables.createAjax(vi.fn(), null, null, true);
        expect(ajax).toBe(createAjaxSpy.mock.results.at(-1).value);
    });
});

describe('yükleme isteği ABP hata penceresini açmaz (abpHandleError: false)', () => {
    let calls;
    let original;

    beforeEach(() => {
        createAjaxSpy.mockImplementation(abpLikeCreateAjax);
        calls = [];
        // abp.ajax taklidi: seçenekleri birleştirirken defaultOpts'u abp.ajax'tan okur (ABP 10 gibi).
        original = function (userOptions) {
            calls.push({ userOptions, defaultOpts: abp.ajax.defaultOpts });
            return new Promise(() => { });
        };
        original.defaultOpts = { dataType: 'json' };
        window.abp.ajax = original;
        window.jQuery = { extend: Object.assign };
    });

    afterEach(() => {
        delete window.abp.ajax;
        delete window.jQuery;
    });

    it('serverMethod içindeki abp.ajax isteği abpHandleError:false taşır; sonra abp.ajax geri gelir', () => {
        const ajax = abp.libs.datatables.createAjax(() => abp.ajax({ url: '/api/app/x', type: 'GET' }));
        ajax({}, vi.fn(), {});

        expect(calls).toHaveLength(1);
        expect(calls[0].userOptions).toEqual({ url: '/api/app/x', type: 'GET', abpHandleError: false });
        expect(calls[0].defaultOpts).toEqual({ dataType: 'json' });
        expect(abp.ajax).toBe(original);
    });

    it('serverMethod hata atsa da abp.ajax geri yüklenir', () => {
        const ajax = abp.libs.datatables.createAjax(() => { throw new Error('boom'); });

        expect(() => ajax({}, vi.fn(), {})).toThrow('boom');
        expect(abp.ajax).toBe(original);
    });

    it('eşzamanlı pencere kapanınca sonraki istekler (işlemler) pencereyi korur', () => {
        const ajax = abp.libs.datatables.createAjax(() => abp.ajax({ url: '/a' }));
        ajax({}, vi.fn(), {});
        abp.ajax({ url: '/b', type: 'POST' });

        expect(calls[1].userOptions.abpHandleError).toBeUndefined();
    });
});

describe('DataTables bayat callback koruması', () => {
    it('geç dönen eski yanıt tabloya yazılmaz; istek iptal edilmez', () => {
        const promise = { then() { return this; } };
        const serverMethod = vi.fn(() => promise);
        const inputAction = vi.fn();
        const ajax = abp.libs.datatables.createAjax(serverMethod, inputAction);

        // İptal (4. parametre) açılmadı; ABP'ye serverMethod SARILI gider (hata dalı onun
        // sözüne bağlanır), diğer argümanlar aynen.
        const call = createAjaxSpy.mock.calls.at(-1);
        expect(call[0]).not.toBe(serverMethod);
        expect(call[1]).toBe(inputAction);
        expect(call[3]).toBeUndefined();

        // Sarılı fonksiyon serverMethod'u aynı argümanla çağırır ve ÖZGÜN sözü döndürür
        // (ABP .always ve .jqXHR'i onun üzerinde bekler).
        expect(call[0]({ skipCount: 10 })).toBe(promise);
        expect(serverMethod).toHaveBeenCalledWith({ skipCount: 10 });

        const dtCallback = vi.fn();
        const settings = { oInstance: {} };
        const thisArg = { table: 1 };
        requests.length = 0;
        ajax.call(thisArg, { draw: 1 }, dtCallback, settings);
        ajax.call(thisArg, { draw: 2 }, dtCallback, settings);

        // İlk üç argüman aynen iletilir (callback sarılı hâliyle).
        expect(requests[0].args[0]).toEqual({ draw: 1 });
        expect(requests[0].args[2]).toBe(settings);
        expect(requests[0].self).toBe(thisArg);

        // Önce yeni, sonra eski yanıt döner.
        requests[1].callback({ draw: 2, data: ['yeni'] });
        requests[0].callback({ draw: 1, data: ['eski'] });

        expect(dtCallback).toHaveBeenCalledTimes(1);
        expect(dtCallback).toHaveBeenCalledWith({ draw: 2, data: ['yeni'] });
    });

    it('açıkça iptal istenirse ABP davranışı aynen korunur (sarmalanmaz)', () => {
        const ajax = abp.libs.datatables.createAjax(vi.fn(), vi.fn(), null, true);
        expect(ajax).toBe(created.at(-1));
    });

    it('canlı geçit: sarılmış createAjax kaynağı apya.latest() çağrısını taşır', () => {
        // Global demet her ortamda küçültülür (BundleAndMinify, NUglify CrunchAll): yerel
        // adlar (isLatest, next) tek harfe iner; küresel apya ve .latest özelliği korunur.
        // Canlı geçit bu yüzden 'isLatest' değil bu ifadeyi arar.
        expect(/apya\.latest\(\)/.test(abp.libs.datatables.createAjax.toString())).toBe(true);
    });

    it('abp.libs yokken yüklenmek hata atmaz ve apya.latest yeniden tanımlanır', async () => {
        // Guard (apya.latest varsa çık) yüzünden latest silinmeden yeniden import hiçbir şey yapmaz.
        delete window.apya.latest;
        delete window.abp.libs;
        vi.resetModules();

        await expect(import('../../../js/apya-latest.js')).resolves.toBeDefined();
        expect(typeof apya.latest).toBe('function');
    });
});
