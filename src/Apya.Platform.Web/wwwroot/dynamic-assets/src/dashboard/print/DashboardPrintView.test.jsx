import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { DashboardPrintView } from './DashboardPrintView';

/**
 * Baskı çıktısının ekrandan İKİ farkı var; ikisi de burada kilitleniyor:
 *   1. kırpma yok — ekranda ilk 3/4 satır çizilen listeler kağıtta TAM basılır,
 *      istatistiklerin tek sekmesi değil BEŞ grubu birden basılır,
 *   2. bağlam var — kurum, görünüm, dönem penceresi ve yazdıran künyede durur.
 * Bir de kilit sözleşmesi: kilitli kutucuk kağıda sayı sızdırmaz.
 */

/* Ekranda ProjectHealthCard yalnız 4 satır çizer (VISIBLE_ROWS); 6 proje veriyoruz. */
const PROJELER = Array.from({ length: 6 }, (_, i) => ({
    projectId: `p${i}`,
    name: `Proje ${i + 1}`,
    state: i === 0 ? 2 : 0, /* 2 = Risky */
    daysRemaining: 10 + i,
    timeRatio: 0.5,
    budgetRatio: 0.4,
    tasksDone: i,
    tasksTotal: 10,
}));

/* Ekranda tek sekme görünür; iki AYRI grup veriyoruz (0 = Work, 1 = Finance). */
const ISTATISTIKLER = [
    { key: 'ontime', group: 0, label: 'Zamanında teslim', value: 82, formatted: '%82', deltaFormatted: '+4 puan', trend: 1, requiredPermission: 'Platform.Tasks', locked: false },
    { key: 'cash', group: 1, label: 'Kasa bakiyesi', value: null, formatted: '', deltaFormatted: '', trend: 0, requiredPermission: 'Platform.CashAccounts', locked: true },
];

const YANITLAR = {
    'summary': {
        dueThisPeriod: 12, dueThisWeek: 4, overdue: 3, oldestOverdueDays: 9, overdueProjectCount: 2,
        blocked: 5, blockedAvgIdleDays: 6.4, pendingApprovals: null, pendingApprovalAmount: null,
        pendingApprovalAvgAgeHours: null, budgetUsedRatio: 0.62, budgetSpent: 620, budgetTotal: 1000,
        dueTrend: [1, 2, 3], currency: 'TRY',
    },
    'statistics': ISTATISTIKLER,
    'deliveries': [
        { taskId: 't1', title: 'Sözleşme teslimi', projectName: 'Sözleşme Projesi', dueDate: '2026-09-10T00:00:00Z', state: 3, overdueDays: 4, assigneeName: 'Ayşe', assigneeInitials: 'A', groupKey: 0 },
    ],
    'project-health': PROJELER,
    'pending-approvals': [],
    'blocked-tasks': [
        { taskId: 'b1', code: 'APY-9', title: 'Ödeme talebi', blockReason: 2, idleDays: 11, dependentCount: 1 },
    ],
    'income-expense': { points: [{ month: '2026-09-01T00:00:00Z', income: 100, expense: 40 }], currency: 'TRY', net: 60 },
    'delivery-heatmap': Array.from({ length: 7 }, (_, i) => ({
        date: `2026-09-0${i + 1}T00:00:00Z`, count: i, isGrantDeadline: i === 3,
    })),
};

function stubFetch(override = {}) {
    const bodies = { ...YANITLAR, ...override };
    vi.stubGlobal('fetch', vi.fn((url) => {
        const section = String(url).replace('/api/dashboard/', '').split('?')[0];
        const body = bodies[section];
        /* httpClient content-type'a bakıyor → stub'ın headers'ı OLMALI. */
        const headers = { get: () => 'application/json' };
        if (body instanceof Error) return Promise.resolve({ ok: false, status: 500, headers, json: () => Promise.resolve({}) });
        return Promise.resolve({ ok: true, status: 200, headers, json: () => Promise.resolve(body) });
    }));
}

function gomKunye() {
    document.getElementById('apya-dashboard-print-context')?.remove();
    const node = document.createElement('script');
    node.type = 'application/json';
    node.id = 'apya-dashboard-print-context';
    node.textContent = JSON.stringify({ tenantName: 'Hitprot A.Ş.', userName: 'Yakup Babaoğlu' });
    /* head'e: body'de dursa JSON metni getAllByText sonuçlarına da karışırdı. */
    document.head.appendChild(node);
}

function ciz(props = {}) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={client}>
            <DashboardPrintView viewKey="finance" range="Month" {...props} />
        </QueryClientProvider>,
    );
}

beforeEach(() => {
    document.body.innerHTML = '';
    gomKunye();
    stubFetch();
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('Dashboard baskı çıktısı', () => {
    it('künyede kurum, görünüm, dönem ve yazdıran bulunur', async () => {
        ciz();

        /* Künye her bölümün üstünde tekrarlanır (sayfalar ayrılabilir) → getAllBy. */
        await waitFor(() => expect(screen.getAllByText('Hitprot A.Ş.').length).toBe(3));
        expect(screen.getAllByText(/Yazdıran: Yakup Babaoğlu/).length).toBe(3);
        /* Görünüm ve dönem <strong> içinde; aralık ADI yetmez, PENCERE de yazmalı. */
        expect(screen.getAllByText('Finans').length).toBe(3);
        expect(screen.getAllByText(/^Bu ay · .+2026$/).length).toBe(3);
    });

    it('proje sağlığını KIRPMADAN basar — ekranda 4, kağıtta 6 satır', async () => {
        ciz();

        await waitFor(() => expect(screen.getByText('Proje 1')).toBeInTheDocument());
        /* Ekrandaki kart 5. ve 6. projeyi altbilgiye düşürüyor; çıktı hepsini satır yapar. */
        expect(screen.getByText('Proje 5')).toBeInTheDocument();
        expect(screen.getByText('Proje 6')).toBeInTheDocument();
    });

    it('istatistiklerin BÜTÜN gruplarını basar, kilitli olan sayı sızdırmaz', async () => {
        ciz();

        /* Ekranda aynı anda tek sekme görünür; kağıtta iki grup da var. */
        await waitFor(() => expect(screen.getByText('Zamanında teslim')).toBeInTheDocument());
        expect(screen.getByText('Kasa bakiyesi')).toBeInTheDocument();

        /* Kilitli kutucuk: değer yerine tire, gerekçe olarak izin adı. */
        expect(screen.getAllByText('yetki gerekli').length).toBeGreaterThan(0);
        expect(screen.getByText('Platform.CashAccounts')).toBeInTheDocument();
    });

    it('yetkisiz özet kutucuğu sıfır değil "— —" basar', async () => {
        ciz();

        /* pendingApprovals null geldi → sunucu değeri hiç göndermedi, uydurulmaz. */
        await waitFor(() => expect(screen.getAllByText('— —').length).toBeGreaterThan(0));
        expect(screen.getByText(/Platform.Invoices/)).toBeInTheDocument();
    });

    it('bir bölüm hata verse bile kalanı basılır ve baskı BEKLEMEDE kalmaz', async () => {
        stubFetch({ 'income-expense': new Error('500') });
        const onReady = vi.fn();

        ciz({ onReady });

        await waitFor(() => expect(onReady).toHaveBeenCalled());
        expect(screen.getByText('Veri alınamadı.')).toBeInTheDocument();
        expect(screen.getByText('Ödeme talebi')).toBeInTheDocument();
    });

    it('boş bölüm sessizce atlanmaz, boş olduğunu YAZAR', async () => {
        ciz();

        /* Onaylar listesi boş: kağıtta bölüm başlığı ve gerekçesi durmalı, yoksa
           okuyan "bu bölüm basılmamış mı, gerçekten boş mu" diye bilemez. */
        await waitFor(() => expect(screen.getByText('Bende bekleyen kararlar')).toBeInTheDocument());
        expect(screen.getByText('Taslak durumdaki fatura bulunmuyor.')).toBeInTheDocument();
    });
});
