import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { StatisticsBand, permissionLabel } from './StatisticsBand';
import { StatStripCard } from './StatStripCard';

/**
 * Genel Bakış kutucuklarında ham izin kodu ("Platform.Invoices") müşteriye basılmaz (canlı doğrulama L3 E7).
 *
 * İstatistik bandı sunucudan gelen KODU izin tanımının görünen adına çevirir ("Platform.X" ↔
 * "Permission:X"; iki izin " + " ile gelir, kendi metniyle birleşir). Özet şeridi kendi iki kilidinde
 * aynı adı kullanır.
 *
 * Görünen ad gerçek uygulamada ABP yerelleştirmesinden çözülür. lib/i18n kaynağı ilk çözülüşte önbelleğe
 * aldığı için sahte kaynak dosya boyunca aynıdır: yalnız izin adlarını bilir, diğer her anahtar
 * bileşenin Türkçe yedeğine düşer.
 */

const IZIN_ADLARI = {
    'Permission:Tasks': 'Görevler',
    'Permission:CashAccounts': 'Kasalar',
    'Permission:Incomes': 'Gelirler',
    'Permission:Expenses': 'Giderler',
    'Permission:Projects.ViewBudget': 'Bütçe Görüntüleme',
};

const FILTER = { range: 'Month' };

function stubBody(body) {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(body),
        text: () => Promise.resolve(JSON.stringify(body)),
    })));
}

function renderWithClient(ui) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
    window.abp = { localization: { getResource: () => (key) => IZIN_ADLARI[key] ?? key } };
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('permissionLabel', () => {
    it('izin kodu → izin tanımının görünen adı (alt izin dahil)', () => {
        expect(permissionLabel('Platform.CashAccounts')).toBe('Kasalar');
        expect(permissionLabel('Platform.Projects.ViewBudget')).toBe('Bütçe Görüntüleme');
    });

    it('iki izin " + " ile değil kendi metniyle birleşir', () => {
        expect(permissionLabel('Platform.Incomes + Platform.Expenses')).toBe('Gelirler ve Giderler');
    });

    it('adı çözülemeyen kod olduğu gibi kalır; değer yoksa boş döner', () => {
        expect(permissionLabel('Platform.Bilinmeyen')).toBe('Platform.Bilinmeyen');
        expect(permissionLabel(undefined)).toBe('');
    });
});

/* 0 = Work, 1 = Finance (sunucu enum'u sayı yollar; hook isme çevirir). */
const ISTATISTIKLER = [
    { key: 'ontime-delivery', group: 0, label: 'Zamanında teslim', value: 0.82, formatted: '%82', deltaFormatted: '', trend: 0, requiredPermission: 'Platform.Tasks', locked: false },
    { key: 'cash-balance', group: 1, label: 'Kasa bakiyesi', value: null, formatted: '', deltaFormatted: '', trend: 0, requiredPermission: 'Platform.CashAccounts', locked: true },
    { key: 'monthly-net', group: 1, label: 'Dönem net', value: null, formatted: '', deltaFormatted: '', trend: 0, requiredPermission: 'Platform.Incomes + Platform.Expenses', locked: true },
];

describe('StatisticsBand · izin adı', () => {
    it('açık ve kilitli kutucuk ham kod değil görünen ad basar', async () => {
        stubBody(ISTATISTIKLER);

        const { container } = renderWithClient(<StatisticsBand filter={FILTER} />);

        /* Varsayılan sekme (İş & teslim): açık kutucuğun izin satırı. */
        expect(await screen.findByText('Zamanında teslim')).toBeInTheDocument();
        expect(screen.getByText('Görevler')).toBeInTheDocument();
        expect(container.textContent).not.toMatch(/Platform\./);

        /* Finans sekmesi: iki kilitli kutucuk; "Dönem net" iki izin ister. */
        fireEvent.click(screen.getByRole('button', { name: 'Finans' }));
        expect(screen.getByText('Kasalar')).toBeInTheDocument();
        expect(screen.getByText('Gelirler ve Giderler')).toBeInTheDocument();
        expect(screen.getAllByText('yetki gerekli')).toHaveLength(2);
        expect(container.textContent).not.toMatch(/Platform\./);
    });
});

const KILITLI_OZET = {
    dueThisPeriod: 12, dueThisWeek: 4, overdue: 3, oldestOverdueDays: 9, overdueProjectCount: 2,
    blocked: 5, blockedAvgIdleDays: 6.4,
    /* Sunucu yetkisiz alanı NULL yollar: fatura (Bende onay) ve bütçe kutucukları kilitli. */
    pendingApprovals: null, pendingApprovalAmount: null, pendingApprovalAvgAgeHours: null,
    budgetUsedRatio: null, budgetSpent: null, budgetTotal: null,
    dueTrend: [], currency: 'TRY',
};

describe('StatStripCard · izin adı', () => {
    it('kilitli "Bende onay" ve "Bütçe kullanımı" kutucukları ham kod değil görünen ad basar', async () => {
        stubBody(KILITLI_OZET);

        const { container } = renderWithClient(<StatStripCard filter={FILTER} />);

        expect(await screen.findByText('Bende onay')).toBeInTheDocument();
        expect(screen.getByText('Faturalar')).toBeInTheDocument();
        /* Bütçe kutucuğunda kod "yetki" olduğunu kendi söylüyordu; ad tek başına etiket gibi okunurdu →
           baskıdaki özet kutucuğuyla aynı satır. */
        expect(screen.getByText('yetki gerekli · Bütçe Görüntüleme')).toBeInTheDocument();
        expect(container.textContent).not.toMatch(/Platform\./);
    });
});

describe('metinler tek kaynaktan: tr.json / en.json', () => {
    it('JS yedekleri tr.json ile aynı, en.json\'da karşılıkları var (metin sessizce kaymasın)', () => {
        const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)),
            '../../../../../../Apya.Platform.Domain.Shared/Localization/Platform');
        const texts = (file) => JSON.parse(readFileSync(path.join(dir, file), 'utf8').replace(/^﻿/, '')).texts;
        const tr = texts('tr.json');
        const en = texts('en.json');

        const yedekler = {
            'Dashboard:Stat:PermissionPair': '{0} ve {1}',
            'Dashboard:Stat:Locked': 'yetki gerekli',
            'Permission:Invoices': 'Faturalar',
            'Permission:Projects.ViewBudget': 'Bütçe Görüntüleme',
        };
        for (const [key, fallback] of Object.entries(yedekler)) {
            expect(tr[key], key).toBe(fallback);
            expect(en[key], key).toBeTruthy();
        }
    });
});
