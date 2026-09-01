import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryProvider } from '../../lib/api/QueryProvider';
import { StatStripCard } from './StatStripCard';
import { ApprovalsCard } from './ApprovalsCard';

/**
 * Kalıcı önbellek geri yükleme penceresi (PersistQueryClientProvider) — GERÇEK
 * QueryProvider ile kurulur. O pencerede sorgu `fetchStatus:'idle'` döndüğü için
 * `isLoading` FALSE olur ama `data` hâlâ undefined'dır; kartlar veriyi "geldi"
 * sanıp yanlış son durumu çizerdi:
 *   - StatStripCard  → `!data` dalı → "Özet yüklenemedi." (SAHTE hata)
 *   - CardShell'liler → items=[] → boş durum (SAHTE "kayıt yok")
 * Doğru davranış: iskelet. Kapı `isPending` olmalı.
 */

beforeEach(() => {
    window.sessionStorage.clear();
    /* Fetch hiç çözülmesin: ilk kare zaten geri yükleme penceresi, ölçtüğümüz o. */
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
    window.abp = { currentUser: { id: 'u1', tenantId: 't1' } };
});

afterEach(() => {
    vi.unstubAllGlobals();
    delete window.abp;
    window.sessionStorage.clear();
});

describe('Dashboard kartları — geri yükleme penceresi', () => {
    it('StatStripCard sahte "Özet yüklenemedi." göstermez', () => {
        render(<QueryProvider><StatStripCard filter={{ range: 'month' }} /></QueryProvider>);

        expect(screen.queryByText('Özet yüklenemedi.')).not.toBeInTheDocument();
    });

    it('ApprovalsCard sahte boş durum değil iskelet gösterir', () => {
        render(<QueryProvider><ApprovalsCard /></QueryProvider>);

        expect(screen.queryByText('Karar bekleyen yok')).not.toBeInTheDocument();
        expect(document.querySelector('[aria-busy="true"]')).not.toBeNull();
    });
});
