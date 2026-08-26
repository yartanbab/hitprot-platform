import { describe, it, expect, beforeAll, beforeEach } from 'vitest';

// wwwroot/js/apya-quota-upsell.js bir IIFE; abp'yi global bekler.
// Burada KARAR mantığı test ediliyor: hangi hata kotaya sayılır, yükseltme düğmesi
// kime gösterilir ve kota dışındaki hatalar ABP'nin kendi kutusuna gidiyor mu.
// Modal'ın kendisi jQuery + Bootstrap istiyor (repoda jQuery devDependency yok,
// paket eklemek ayrı bir karar) — DOM canlı QA ile doğrulanıyor.

let upsell;
let delegatedErrors;
let granted;

beforeAll(async () => {
    delegatedErrors = [];
    granted = {};

    global.abp = {
        ajax: {
            showError: function (error) {
                delegatedErrors.push(error);
                return 'abp-kutusu';
            }
        },
        auth: {
            isGranted: function (name) { return granted[name] === true; }
        }
    };

    await import('../../../js/apya-quota-upsell.js');
    upsell = window.apya.quotaUpsell;
});

beforeEach(() => {
    delegatedErrors = [];
    granted = {};
});

describe('kota hatasının tanınması', () => {
    it('sunucunun iki kota kodunu tanır', () => {
        expect(upsell.isQuotaError({ code: 'Platform:Error:MaxProjectsReached' })).toBe(true);
        expect(upsell.isQuotaError({ code: 'Platform:Error:MaxUsersReached' })).toBe(true);
    });

    it('başka hataları kotaya saymaz', () => {
        expect(upsell.isQuotaError({ code: 'Volo.Authorization:010001' })).toBe(false);
        expect(upsell.isQuotaError({ message: 'kod yok' })).toBe(false);
        expect(upsell.isQuotaError(null)).toBe(false);
    });
});

describe('abp.ajax.showError override', () => {
    // Kritik: override yalnız iki koda dokunmalı. Geniş davranırsa uygulamadaki
    // TÜM hata kutuları sessizce yükseltme modalına dönerdi.
    it('kota dışındaki hatayı ABPnin kendi kutusuna devreder', () => {
        const result = abp.ajax.showError({ code: 'Volo.Authorization:010001', message: 'yetkisiz' });

        expect(result).toBe('abp-kutusu');
        expect(delegatedErrors).toHaveLength(1);
    });

    // jsdom'da Bootstrap yok → kota hatası da güvenli tarafa, ABPnin kutusuna düşer.
    // Ölçülen şey bu geri düşüş: betik eksik bağımlılıkta hatayı YUTMAMALI.
    it('Bootstrap yokken kota hatasını sessizce yutmaz', () => {
        const result = abp.ajax.showError({ code: 'Platform:Error:MaxUsersReached', message: 'limit' });

        expect(result).toBe('abp-kutusu');
        expect(delegatedErrors).toHaveLength(1);
    });
});

describe('yükseltme düğmesinin izin kapısı', () => {
    it('TenantSettings izni yoksa düğme gösterilmez', () => {
        expect(upsell.canViewSubscription()).toBe(false);
    });

    it('TenantSettings izni varsa düğme gösterilir', () => {
        granted['Platform.TenantSettings'] = true;
        expect(upsell.canViewSubscription()).toBe(true);
    });

    it('Paketim ekranının adresi sabittir', () => {
        expect(upsell.subscriptionUrl).toBe('/Subscription');
    });
});
