import { describe, it, expect, beforeAll, vi } from 'vitest';

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

describe('DataTables bayat callback koruması', () => {
    it('geç dönen eski yanıt tabloya yazılmaz; istek iptal edilmez', () => {
        const serverMethod = vi.fn();
        const inputAction = vi.fn();
        const ajax = abp.libs.datatables.createAjax(serverMethod, inputAction);

        // İptal (4. parametre) açılmadı; ABP'ye argümanlar aynen gider.
        const call = createAjaxSpy.mock.calls.at(-1);
        expect(call[0]).toBe(serverMethod);
        expect(call[1]).toBe(inputAction);
        expect(call[3]).toBeUndefined();

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
