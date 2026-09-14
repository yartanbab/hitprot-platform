import { describe, it, expect } from 'vitest';
import { publicFormPath, formTenantFromSearch } from './publicFormLink';

const TENANT = "6c1e2f3a-4b5c-4d6e-8f70-819203a4b5c6";

describe('publicFormPath', () => {
    it('kiraci formu baglantisi formun kiracisini tasir', () => {
        expect(publicFormPath('talep-formu-3fa2b1', TENANT)).toBe('/f/talep-formu-3fa2b1?tenant=' + TENANT);
    });

    it('host formu kiraci tasimaz', () => {
        expect(publicFormPath('proje-fikri', null)).toBe('/f/proje-fikri');
    });
});

describe('formTenantFromSearch', () => {
    it('adresteki kiraciyi okur', () => {
        expect(formTenantFromSearch('?grant=1501&tenant=' + TENANT)).toBe(TENANT);
    });

    it('kimlik bicimi disindaki degeri yok sayar', () => {
        expect(formTenantFromSearch('?tenant=akim-teknoloji')).toBeNull();
        expect(formTenantFromSearch('')).toBeNull();
    });
});
