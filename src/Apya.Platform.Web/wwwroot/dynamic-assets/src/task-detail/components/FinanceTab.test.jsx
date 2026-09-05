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
