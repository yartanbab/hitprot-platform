import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createApyaPersistOptions, PERSIST_MAX_AGE_MS } from './queryPersister';
import { createApyaQueryClient } from './queryClient';

describe('createApyaPersistOptions', () => {
    beforeEach(() => {
        window.sessionStorage.clear();
        window.abp = { currentUser: { id: 'kullanici-1', tenantId: 'kiraci-a' } };
    });

    afterEach(() => {
        delete window.abp;
        vi.restoreAllMocks();
    });

    it('oturum açmış kullanıcıda kalıcılaştırma seçenekleri döner', () => {
        const o = createApyaPersistOptions();
        expect(o).not.toBeNull();
        expect(o.maxAge).toBe(PERSIST_MAX_AGE_MS);
    });

    it('ANONİM bağlamda hiçbir şey saklamaz', () => {
        window.abp = { currentUser: {} };
        expect(createApyaPersistOptions()).toBeNull();
    });

    it('buster kullanıcıya VE kiracıya bağlı — başka kullanıcı önbelleği devralamaz', () => {
        const ilk = createApyaPersistOptions().buster;

        window.abp = { currentUser: { id: 'kullanici-2', tenantId: 'kiraci-a' } };
        expect(createApyaPersistOptions().buster).not.toBe(ilk);

        window.abp = { currentUser: { id: 'kullanici-1', tenantId: 'kiraci-b' } };
        expect(createApyaPersistOptions().buster).not.toBe(ilk);
    });

    it('sessionStorage erişilemezse (gizli sekme) null döner, patlamaz', () => {
        vi.spyOn(window, 'sessionStorage', 'get').mockImplementation(() => {
            throw new DOMException('engellendi');
        });
        expect(createApyaPersistOptions()).toBeNull();
    });

    it('yalnız BAŞARILI sorgular saklanır — hata ekranı önbellekten gelmez', () => {
        const { shouldDehydrateQuery } = createApyaPersistOptions().dehydrateOptions;
        expect(shouldDehydrateQuery({ state: { status: 'success' } })).toBe(true);
        expect(shouldDehydrateQuery({ state: { status: 'error' } })).toBe(false);
        expect(shouldDehydrateQuery({ state: { status: 'pending' } })).toBe(false);
    });

    it('gcTime kalıcılaştırma penceresinden KÜÇÜK OLAMAZ', () => {
        // Küçük olsaydı geri yüklenen sorgular anında çöpe gider,
        // kalıcılaştırma sessizce etkisiz kalırdı.
        const gcTime = createApyaQueryClient().getDefaultOptions().queries.gcTime;
        expect(gcTime).toBeGreaterThanOrEqual(PERSIST_MAX_AGE_MS);
    });
});
