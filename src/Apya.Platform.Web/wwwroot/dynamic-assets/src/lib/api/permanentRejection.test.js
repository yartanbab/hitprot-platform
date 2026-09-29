import { describe, it, expect } from 'vitest';
import { isPermanentRejection } from './permanentRejection';

const err = (status, extra = {}) => Object.assign(new Error('x'), { status, ...extra });

/**
 * Çevrimdışı kuyrukların "sil ya da tut" kararı. Yanlış tarafa düşen her durum ya
 * kullanıcının kaydını siler (geçici hata kalıcı sayılırsa) ya da kuyruğu sonsuza dek
 * kilitler (kalıcı ret geçici sayılırsa).
 */
describe('isPermanentRejection', () => {
    it('oturum dusmesi (401), zaman asimi (408) ve hiz siniri (429) gecicidir', () => {
        expect(isPermanentRejection(err(401))).toBe(false);
        expect(isPermanentRejection(err(408))).toBe(false);
        expect(isPermanentRejection(err(429))).toBe(false);
    });

    it('govdesiz 400 (bayat guvenlik belirteci) gecicidir', () => {
        expect(isPermanentRejection(err(400))).toBe(false);
    });

    it('ABP zarfli 400 (dogrulama) kalicidir', () => {
        expect(isPermanentRejection(err(400, { validationErrors: [{ message: 'Tarih geçersiz' }] }))).toBe(true);
        expect(isPermanentRejection(err(400, { code: 'Platform:Expense:Invalid' }))).toBe(true);
    });

    it('yetki (403), kayit yok (404) ve cakisma (409) kalicidir', () => {
        expect(isPermanentRejection(err(403))).toBe(true);
        expect(isPermanentRejection(err(404))).toBe(true);
        expect(isPermanentRejection(err(409))).toBe(true);
    });

    it('ag hatasi ve 5xx kalici ret degildir', () => {
        expect(isPermanentRejection(new TypeError('Failed to fetch'))).toBe(false);
        expect(isPermanentRejection(err(500))).toBe(false);
        expect(isPermanentRejection(err(503))).toBe(false);
        expect(isPermanentRejection(undefined)).toBe(false);
    });
});
