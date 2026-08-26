import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { QueryProvider } from './QueryProvider';

const CACHE_KEY = 'apya-rq-cache';

function Ekran() {
    const { data } = useQuery({ queryKey: ['deneme'], queryFn: async () => 'merhaba' });
    return <div>{data ?? 'yükleniyor'}</div>;
}

describe('QueryProvider kalıcılaştırma kablosu', () => {
    beforeEach(() => window.sessionStorage.clear());
    afterEach(() => { delete window.abp; window.sessionStorage.clear(); });

    it('oturum açmışken başarılı sorguyu sessionStorage\'a YAZAR', async () => {
        window.abp = { currentUser: { id: 'k1', tenantId: 't1' } };

        render(<QueryProvider><Ekran /></QueryProvider>);
        await screen.findByText('merhaba');

        // throttleTime 1000 → yazma gecikmeli.
        await waitFor(() => expect(window.sessionStorage.getItem(CACHE_KEY)).not.toBeNull(),
                      { timeout: 4000 });

        expect(window.sessionStorage.getItem(CACHE_KEY)).toContain('deneme');
    });

    it('ANONİM bağlamda sessionStorage\'a HİÇBİR ŞEY yazmaz', async () => {
        window.abp = { currentUser: {} };

        render(<QueryProvider><Ekran /></QueryProvider>);
        await screen.findByText('merhaba');

        await new Promise(r => setTimeout(r, 1500));
        expect(window.sessionStorage.getItem(CACHE_KEY)).toBeNull();
    });
});
