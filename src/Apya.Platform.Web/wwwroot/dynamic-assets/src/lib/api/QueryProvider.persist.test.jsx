import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { QueryProvider } from './QueryProvider';

const CACHE_KEY = 'apya-rq-cache';

function Ekran() {
    const { data } = useQuery({ queryKey: ['deneme'], queryFn: async () => 'merhaba' });
    return <div>{data ?? 'yükleniyor'}</div>;
}

function IkiSorgu() {
    const kalici = useQuery({ queryKey: ['kalici-sorgu'], queryFn: async () => 'kalıcı' });
    const canli = useQuery({ queryKey: ['canli-sorgu'], queryFn: async () => 'canlı', meta: { persist: false } });
    return <div>{kalici.data && canli.data ? 'ikisi de geldi' : 'yükleniyor'}</div>;
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

    it('meta.persist:false taşıyan sorguyu YAZMAZ, aynı ağaçtaki işaretsiz sorguyu yazar', async () => {
        window.abp = { currentUser: { id: 'k1', tenantId: 't1' } };

        render(<QueryProvider><IkiSorgu /></QueryProvider>);
        await screen.findByText('ikisi de geldi');

        await waitFor(() => expect(window.sessionStorage.getItem(CACHE_KEY)).toContain('kalici-sorgu'),
                      { timeout: 4000 });

        expect(window.sessionStorage.getItem(CACHE_KEY)).not.toContain('canli-sorgu');
    });
});

/* Veri-değişti damgası (lib/api/dataChanged.js): başka bir sayfada ya da adada
   görev yazıldıysa, restore edilen görev türevi sorgu staleTime'a rağmen bayat
   sayılır. Senaryo: Pano açıldı → başka sayfada görev değişti (damga) → Pano'ya
   dönüldü. */
describe('QueryProvider restore — veri-değişti damgası', () => {
    const STAMP_KEY = 'apya-data-changed-at';

    function Pano({ qk, fn }) {
        const { data } = useQuery({ queryKey: qk, queryFn: fn, staleTime: 60_000 });
        return <div>{data ?? 'yükleniyor'}</div>;
    }

    /** İlk açılış: 'eski' döner, sessionStorage'a yazılır (throttle 1 sn), sayfadan çıkılır. */
    async function ilkAcilis(qk) {
        const ilk = render(<QueryProvider><Pano qk={qk} fn={async () => 'eski'} /></QueryProvider>);
        await screen.findByText('eski');
        await waitFor(() => expect(window.sessionStorage.getItem(CACHE_KEY)).toContain(qk[1]),
                      { timeout: 4000 });
        ilk.unmount();
    }

    beforeEach(() => {
        window.sessionStorage.clear();
        window.abp = { currentUser: { id: 'k1', tenantId: 't1' } };
    });
    // Testin son render'ı kalıcılaştırıcıya gecikmeli (throttleTime 1000) bir yazma bırakır ve bu
    // yazma bileşen kaldırıldıktan sonra da düşer. Beklenmezse önceki testin 'yeni' önbelleği
    // sonraki testin 'eski' kaydını ezip onu kararsız yapıyordu (10 koşuda ~3 kırmızı).
    afterEach(async () => {
        cleanup();
        await new Promise((r) => setTimeout(r, 1200));
        delete window.abp;
        window.sessionStorage.clear();
    });

    it('damga restore edilen veriden yeniyse görev türevi sorgu staleTime\'a rağmen yeniden çekilir', async () => {
        const qk = ['dashboard', 'summary', {}];
        await ilkAcilis(qk);
        window.sessionStorage.setItem(STAMP_KEY, String(Date.now()));

        render(<QueryProvider><Pano qk={qk} fn={async () => 'yeni'} /></QueryProvider>);

        expect(await screen.findByText('yeni')).toBeInTheDocument();
    });

    it('damga yoksa restore edilen veri taze sayılır, yeniden çekilmez', async () => {
        const qk = ['dashboard', 'summary', {}];
        await ilkAcilis(qk);
        const ikinci = vi.fn(async () => 'yeni');

        render(<QueryProvider><Pano qk={qk} fn={ikinci} /></QueryProvider>);

        expect(await screen.findByText('eski')).toBeInTheDocument();
        await new Promise((r) => setTimeout(r, 100));
        expect(ikinci).not.toHaveBeenCalled();
        expect(screen.getByText('eski')).toBeInTheDocument();
    });

    it('pano düzeni (dashboard/layout) damgadan etkilenmez', async () => {
        const qk = ['dashboard', 'layout', 'v'];
        await ilkAcilis(qk);
        window.sessionStorage.setItem(STAMP_KEY, String(Date.now()));
        const ikinci = vi.fn(async () => 'yeni');

        render(<QueryProvider><Pano qk={qk} fn={ikinci} /></QueryProvider>);

        expect(await screen.findByText('eski')).toBeInTheDocument();
        await new Promise((r) => setTimeout(r, 100));
        expect(ikinci).not.toHaveBeenCalled();
    });
});
