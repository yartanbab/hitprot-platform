import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FinanceTab } from './FinanceTab';

function renderWithClient(ui) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

/* Testler arasi sizinti olmasin: izin koprusu ve ABP proxy'si her testte
   sifirdan kurulur (jsdom window dosya boyunca YASAR). */
beforeEach(() => {
    delete window.abp;
    delete window.apya;
});

describe('FinanceTab', () => {
    it('gercek veriden para-birimi bazli ozet render eder', () => {
        renderWithClient(<FinanceTab task={{
            expenses: [{ id: 'e1', amount: 100, currency: 'TRY', title: 'Gider' }],
            incomes: [{ id: 'i1', amount: 500, currency: 'TRY', title: 'Gelir' }],
        }} />);
        expect(screen.getByText(/Toplam Gelir/)).toBeInTheDocument();
        expect(screen.getByText(/Toplam Gider/)).toBeInTheDocument();
        expect(screen.getByText(/Net Bakiye/)).toBeInTheDocument();
    });

    it('kayit yoksa bos durum gosterir', () => {
        renderWithClient(<FinanceTab task={{ expenses: [], incomes: [] }} />);
        expect(screen.getByText(/gider\/gelir kaydı yok/i)).toBeInTheDocument();
    });
});

describe('FinanceTab · butce bagi karti (4a)', () => {
    const linked = {
        budgetLineId: 'b1',
        budgetLineName: 'Personel',
        plannedAmount: 10000,
        budgetLineRemaining: 40000,
    };

    it('bagli gorevde plan/gerceklesen/kalan gosterir', () => {
        renderWithClient(<FinanceTab task={{
            ...linked,
            expenses: [{ id: 'e1', amount: 4000, currency: 'TRY', title: 'Gider' }],
            incomes: [],
        }} />);

        expect(screen.getByText('Bütçe bağı')).toBeInTheDocument();
        expect(screen.getByText('Personel')).toBeInTheDocument();
        expect(screen.getByText('Görev bütçesi')).toBeInTheDocument();
        // 10.000 plan − 4.000 gider = 6.000 kalan
        expect(screen.getByText(/6\.000,00/)).toBeInTheDocument();
        expect(screen.getByText('%40')).toBeInTheDocument();
    });

    it('kaydi olmayan ama plani olan gorevde de basilir', () => {
        renderWithClient(<FinanceTab task={{ ...linked, expenses: [], incomes: [] }} />);

        expect(screen.getByText('Bütçe bağı')).toBeInTheDocument();
        expect(screen.getByText(/gider\/gelir kaydı yok/i)).toBeInTheDocument();
    });

    it('bagi olmayan gorevde hic basilmaz', () => {
        renderWithClient(<FinanceTab task={{
            expenses: [{ id: 'e1', amount: 100, currency: 'TRY', title: 'Gider' }],
            incomes: [],
        }} />);

        expect(screen.queryByText('Bütçe bağı')).not.toBeInTheDocument();
    });

    it('plan asilirsa uyarir', () => {
        renderWithClient(<FinanceTab task={{
            ...linked,
            plannedAmount: 1000,
            expenses: [{ id: 'e1', amount: 2500, currency: 'TRY', title: 'Gider' }],
            incomes: [],
        }} />);

        expect(screen.getByText(/görev bütçesi aşıldı/i)).toBeInTheDocument();
    });

    it('gerceklesen YALNIZ TRY kayitlarindan toplanir', () => {
        // Plan proje defterinde (TRY); EUR gider capraz kur olmadan toplanmaz.
        renderWithClient(<FinanceTab task={{
            ...linked,
            expenses: [
                { id: 'e1', amount: 2000, currency: 'TRY', title: 'TRY gider' },
                { id: 'e2', amount: 5000, currency: 'EUR', title: 'EUR gider' },
            ],
            incomes: [],
        }} />);

        // 10.000 − 2.000 = 8.000 (EUR gider kalana KARISMAZ)
        expect(screen.getByText(/8\.000,00/)).toBeInTheDocument();
    });
});

describe('FinanceTab · kayit ekleme aksiyonlari', () => {
    function grant(...permissions) {
        window.abp = {
            appPath: '/',
            auth: { isGranted: (p) => permissions.includes(p) },
            ModalManager: vi.fn(function ModalManager() {
                this.onResult = vi.fn();
                this.open = vi.fn();
            }),
        };
        return window.abp.ModalManager;
    }

    it('izin varsa gider ve gelir butonlari basilir', () => {
        grant('Platform.Expenses.Create', 'Platform.Incomes.Create');
        renderWithClient(<FinanceTab taskId="t-1" task={{ id: 't-1', expenses: [], incomes: [] }} />);

        expect(screen.getByRole('button', { name: /gider ekle/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /gelir ekle/i })).toBeInTheDocument();
    });

    it('izin yoksa ilgili buton hic basilmaz', () => {
        grant('Platform.Expenses.Create');
        renderWithClient(<FinanceTab taskId="t-1" task={{ id: 't-1', expenses: [], incomes: [] }} />);

        expect(screen.getByRole('button', { name: /gider ekle/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /gelir ekle/i })).not.toBeInTheDocument();
    });

    it('gider butonu ABP modalini TaskId ile acar', () => {
        const ModalManager = grant('Platform.Expenses.Create');
        renderWithClient(<FinanceTab taskId="t-1" task={{ id: 't-1', expenses: [], incomes: [] }} />);

        fireEvent.click(screen.getByRole('button', { name: /gider ekle/i }));

        expect(ModalManager).toHaveBeenCalledWith({ viewUrl: '/Expenses/CreateModal?TaskId=t-1' });
        expect(ModalManager.mock.instances[0].open).toHaveBeenCalled();
    });

    it('gelir butonu kendi modalini acar', () => {
        const ModalManager = grant('Platform.Incomes.Create');
        renderWithClient(<FinanceTab taskId="t-1" task={{ id: 't-1', expenses: [], incomes: [] }} />);

        fireEvent.click(screen.getByRole('button', { name: /gelir ekle/i }));

        expect(ModalManager).toHaveBeenCalledWith({ viewUrl: '/Incomes/CreateModal?TaskId=t-1' });
    });
});

describe('FinanceTab · butce bagi atamasi', () => {
    const LINES = [
        { id: 'b1', code: 'A.1', name: 'Personel', approvedAmount: 50000, spentAmount: 10000, remainingAmount: 40000 },
        { id: 'b2', code: 'A.2', name: 'Ekipman', approvedAmount: 20000, spentAmount: 0, remainingAmount: 20000 },
    ];

    function setup({ values, canViewBudget = true, lines = LINES } = {}) {
        window.abp = { appPath: '/', auth: { isGranted: (p) => canViewBudget && p === 'Platform.Projects.ViewBudget' } };
        window.apya = {
            platform: {
                projectBudgets: {
                    projectBudget: {
                        getRecordFormLookup: vi.fn(() => Promise.resolve({ projectId: 'p1', currency: 'TRY', lines })),
                    },
                },
            },
        };
        const setField = vi.fn();
        const form = { values: { projectId: 'p1', budgetLineId: null, plannedAmount: null, ...values }, setField };
        renderWithClient(
            <FinanceTab taskId="t-1" task={{ id: 't-1', projectId: 'p1', expenses: [], incomes: [] }} form={form} />,
        );
        return { form, setField };
    }

    it('yetki + proje varsa kalem secici ve tutar alani basilir', async () => {
        setup();
        expect(await screen.findByText('Bütçe bağı')).toBeInTheDocument();
        expect(await screen.findByPlaceholderText('Kalem seç')).toBeInTheDocument();
        expect(screen.getByText('Bütçe kalemi')).toBeInTheDocument();
        expect(screen.getByText('Görev bütçesi')).toBeInTheDocument();
    });

    it('lookup gelene kadar "kalem tanimli degil" YAZMAZ', () => {
        setup();
        expect(screen.queryByText(/bütçe kalemi tanımlı değil/i)).not.toBeInTheDocument();
    });

    it('kalem secimi form state ine yazilir', async () => {
        const { setField } = setup();
        const combo = await screen.findByPlaceholderText('Kalem seç');

        fireEvent.focus(combo);
        // Combobox secimi mousedown ile commit eder (outside-click'ten once).
        fireEvent.mouseDown(await screen.findByText('A.1 · Personel'));

        expect(setField).toHaveBeenCalledWith('budgetLineId', 'b1');
    });

    it('secili kalemin kalani lookup tan okunur (DTO daki bayat deger degil)', async () => {
        setup({ values: { budgetLineId: 'b2', plannedAmount: 5000 } });
        expect(await screen.findByText(/kalemde kalan/)).toHaveTextContent('20.000,00');
    });

    it('bagi kaldir iki alani da temizler', async () => {
        const { setField } = setup({ values: { budgetLineId: 'b1', plannedAmount: 5000 } });

        fireEvent.click(await screen.findByRole('button', { name: /bağı kaldır/i }));

        expect(setField).toHaveBeenCalledWith('budgetLineId', null);
        expect(setField).toHaveBeenCalledWith('plannedAmount', null);
    });

    /* Tarayicida yakalandi: TAB_CARD'in overflow-hidden'i kalem listesini kartin
       alt kenarinda kesiyordu (jsdom kirpma yapmadigi icin test gormezdi). */
    it('butce karti KIRPMAYAN kart sinifini kullanir', async () => {
        setup();
        const header = await screen.findByText('Bütçe bağı');
        const card = header.closest('[class*="rounded-2xl"]');

        expect(card).not.toBeNull();
        expect(card.className).not.toContain('overflow-hidden');
    });

    it('projede kalem yoksa secici yerine aciklama basar', async () => {
        setup({ lines: [] });
        expect(await screen.findByText(/bütçe kalemi tanımlı değil/i)).toBeInTheDocument();
        expect(screen.queryByPlaceholderText('Kalem seç')).not.toBeInTheDocument();
    });

    it('butce gorme yetkisi yoksa duzenleme acilmaz ve lookup CAGRILMAZ', async () => {
        setup({ canViewBudget: false });

        await waitFor(() => expect(screen.getByText(/gider\/gelir kaydı yok/i)).toBeInTheDocument());
        expect(screen.queryByText('Bütçe bağı')).not.toBeInTheDocument();
        expect(window.apya.platform.projectBudgets.projectBudget.getRecordFormLookup).not.toHaveBeenCalled();
    });
});

describe('FinanceTab · faturalar', () => {
    const INVOICE = {
        id: 'inv1', invoiceNumber: 'FTR-2026-001', direction: 0, status: 1,
        invoiceDate: '2026-09-01T00:00:00Z', dueDate: '2026-09-16T00:00:00Z',
        totalAmount: 24000, currency: 'TRY',
    };

    function grantAll() {
        window.abp = {
            appPath: '/',
            auth: { isGranted: () => true },
            ModalManager: vi.fn(function ModalManager() {
                this.onResult = vi.fn();
                this.open = vi.fn();
            }),
        };
        window.apya = { platform: { projectBudgets: { projectBudget: { getRecordFormLookup: vi.fn(() => Promise.resolve({ lines: [] })) } } } };
        return window.abp.ModalManager;
    }

    it('fatura satirini numara, vade, durum ve KDV dahil tutarla basar', () => {
        grantAll();
        renderWithClient(<FinanceTab taskId="t-1" task={{ id: 't-1', expenses: [], incomes: [], invoices: [INVOICE] }} />);

        expect(screen.getByText('Faturalar')).toBeInTheDocument();
        expect(screen.getByText(/FTR-2026-001/)).toBeInTheDocument();
        expect(screen.getByText('Gönderildi')).toBeInTheDocument();
        // Tarih ayiraci node ICU surumune gore degisiyor (16.09 / 16/09) — gunu dogrula.
        expect(screen.getByText(/vade 16/)).toBeInTheDocument();
        expect(screen.getByText(/24\.000,00/)).toBeInTheDocument();
    });

    it('alis faturasi Alis olarak isaretlenir', () => {
        grantAll();
        renderWithClient(<FinanceTab taskId="t-1" task={{
            id: 't-1', expenses: [], incomes: [], invoices: [{ ...INVOICE, direction: 1, status: 4 }],
        }} />);

        expect(screen.getByText('Alış')).toBeInTheDocument();
        expect(screen.getByText('Gecikti')).toBeInTheDocument();
    });

    it('YALNIZ fatura varsa bos durum basilmaz ve aksiyonlar fatura kartinda kalir', () => {
        grantAll();
        renderWithClient(<FinanceTab taskId="t-1" task={{ id: 't-1', expenses: [], incomes: [], invoices: [INVOICE] }} />);

        expect(screen.queryByText(/gider\/gelir kaydı yok/i)).not.toBeInTheDocument();
        expect(screen.queryByText('Finans kalemleri')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /fatura ekle/i })).toBeInTheDocument();
    });

    it('fatura tutari gider/gelir toplamlarina KARISMAZ', () => {
        grantAll();
        renderWithClient(<FinanceTab taskId="t-1" task={{
            id: 't-1',
            expenses: [{ id: 'e1', amount: 100, currency: 'TRY', title: 'Gider' }],
            incomes: [],
            invoices: [INVOICE],
        }} />);

        // Toplam Gider KPI'si 100 kalmali; 24.100 olsaydi fatura toplama girmis olurdu.
        const kpi = screen.getByText(/Toplam Gider/).parentElement;
        expect(kpi).toHaveTextContent('100,00');
        expect(kpi).not.toHaveTextContent('24.100');
    });

    it('fatura ekle butonu modali TaskId ile acar', () => {
        const ModalManager = grantAll();
        renderWithClient(<FinanceTab taskId="t-1" task={{ id: 't-1', expenses: [], incomes: [], invoices: [] }} />);

        fireEvent.click(screen.getByRole('button', { name: /fatura ekle/i }));

        expect(ModalManager).toHaveBeenCalledWith({ viewUrl: '/Invoices/CreateModal?TaskId=t-1' });
    });

    it('Invoices.Create izni yoksa fatura dugmesi basilmaz', () => {
        window.abp = { appPath: '/', auth: { isGranted: (p) => p !== 'Platform.Invoices.Create' } };
        renderWithClient(<FinanceTab taskId="t-1" task={{ id: 't-1', expenses: [], incomes: [], invoices: [] }} />);

        expect(screen.queryByRole('button', { name: /fatura ekle/i })).not.toBeInTheDocument();
    });
});

describe('FinanceTab · gider satirinda evrak', () => {
    const TASK = {
        id: 't-1',
        projectId: 'p1',
        expenses: [{ id: 'e1', amount: 1500, currency: 'TRY', title: 'Sunucu kirasi' }],
        incomes: [{ id: 'i1', amount: 500, currency: 'TRY', title: 'Tahsilat' }],
        invoices: [],
    };

    function deferred(value) {
        return { done(f) { setTimeout(() => f(value), 0); return this; }, fail() { return this; } };
    }

    function setup({ canSeeDocuments = true, matches = [] } = {}) {
        window.abp = {
            appPath: '/',
            auth: { isGranted: (p) => (p === 'Platform.Documents.Default' ? canSeeDocuments : true) },
            notify: { error: vi.fn() },
            ajax: vi.fn((options) => deferred(options.url.includes('handler=Matches') ? matches : [])),
        };
        window.apya = { platform: { projectBudgets: { projectBudget: { getRecordFormLookup: vi.fn(() => Promise.resolve({ lines: [] })) } } } };
        renderWithClient(<FinanceTab taskId="t-1" task={TASK} />);
    }

    it('evrak dugmesi YALNIZ gider satirinda cikar', async () => {
        setup();
        await waitFor(() => expect(screen.getAllByRole('button', { name: /evrak/i })).toHaveLength(1));

        // Gelir satirinda dugme yok: bag modeli gider tarafinda yasiyor.
        const row = screen.getByText('Tahsilat').closest('div');
        expect(row.textContent).not.toMatch(/Evrak/);
    });

    it('bagli evrak sayisi dugmede gorunur', async () => {
        setup({ matches: [{ id: 'm1', expenseId: 'e1', documentFileId: 'd1', documentFileName: 'Fatura.pdf' }] });
        expect(await screen.findByRole('button', { name: /evrak 1/i })).toBeInTheDocument();
    });

    it('panel ACILMADAN aday sorgusu ATILMAZ, acilinca atilir', async () => {
        setup();
        const btn = await screen.findByRole('button', { name: /evrak/i });

        const candidateCall = () => window.abp.ajax.mock.calls.some(([o]) => o.url.includes('handler=Candidates'));
        expect(candidateCall()).toBe(false);

        fireEvent.click(btn);
        await waitFor(() => expect(candidateCall()).toBe(true));
        expect(screen.getByText('Aday evraklar')).toBeInTheDocument();
    });

    it('Documents izni yoksa evrak dugmesi hic basilmaz ve eslestirme SORULMAZ', async () => {
        setup({ canSeeDocuments: false });
        await screen.findByText('Finans kalemleri');

        expect(screen.queryByRole('button', { name: /evrak/i })).not.toBeInTheDocument();
        expect(window.abp.ajax).not.toHaveBeenCalled();
    });
});
