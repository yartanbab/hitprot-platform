import { describe, it, expect } from 'vitest';
import { createApyaQueryClient } from './queryClient';
import { ApiError } from './httpClient';

/**
 * Yeniden deneme kuralı: yalnız httpClient hatası (ApiError) ve yalnız ağ/sunucu
 * hatasında. ABP proxy reddi her denemede ABP hata penceresini yeniden açıyordu
 * (yorum sorgusunda aynı pencere 3 kez).
 */
const defaults = createApyaQueryClient().getDefaultOptions();
const retry = defaults.queries.retry;

describe('sorgu yeniden deneme', () => {
    it('ağ hatası (ApiError 0) ve 5xx en fazla iki kez yeniden denenir', () => {
        expect(retry(0, new ApiError('ağ', { status: 0 }))).toBe(true);
        expect(retry(1, new ApiError('sunucu', { status: 503 }))).toBe(true);
        expect(retry(2, new ApiError('sunucu', { status: 503 }))).toBe(false);
    });

    it('4xx yeniden denenmez', () => {
        expect(retry(0, new ApiError('yok', { status: 404 }))).toBe(false);
        expect(retry(0, new ApiError('oturum', { status: 401 }))).toBe(false);
    });

    it('ABP reddi (zarf nesnesi ya da jqXHR) ve düz Error yeniden denenmez', () => {
        expect(retry(0, { code: 'Platform:X', message: 'ABP' })).toBe(false);
        expect(retry(0, { status: 500, getResponseHeader() { return null; } })).toBe(false);
        expect(retry(0, new Error('servis yüklenmedi'))).toBe(false);
    });

    it('mutasyonlar hiç yeniden denenmez', () => {
        expect(defaults.mutations.retry).toBe(false);
    });
});
