import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FinanceTab } from './FinanceTab';

describe('FinanceTab', () => {
    it('gercek veriden para-birimi bazli ozet render eder', () => {
        render(<FinanceTab task={{
            expenses: [{ id: 'e1', amount: 100, currency: 'TRY', title: 'Gider' }],
            incomes: [{ id: 'i1', amount: 500, currency: 'TRY', title: 'Gelir' }],
        }} />);
        expect(screen.getByText(/Toplam Gelir/)).toBeInTheDocument();
        expect(screen.getByText(/Toplam Gider/)).toBeInTheDocument();
        expect(screen.getByText(/Net Bakiye/)).toBeInTheDocument();
    });

    it('kayit yoksa bos durum gosterir', () => {
        render(<FinanceTab task={{ expenses: [], incomes: [] }} />);
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
        render(<FinanceTab task={{
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
        render(<FinanceTab task={{ ...linked, expenses: [], incomes: [] }} />);

        expect(screen.getByText('Bütçe bağı')).toBeInTheDocument();
        expect(screen.getByText(/gider\/gelir kaydı yok/i)).toBeInTheDocument();
    });

    it('bagi olmayan gorevde hic basilmaz', () => {
        render(<FinanceTab task={{
            expenses: [{ id: 'e1', amount: 100, currency: 'TRY', title: 'Gider' }],
            incomes: [],
        }} />);

        expect(screen.queryByText('Bütçe bağı')).not.toBeInTheDocument();
    });

    it('plan asilirsa uyarir', () => {
        render(<FinanceTab task={{
            ...linked,
            plannedAmount: 1000,
            expenses: [{ id: 'e1', amount: 2500, currency: 'TRY', title: 'Gider' }],
            incomes: [],
        }} />);

        expect(screen.getByText(/görev bütçesi aşıldı/i)).toBeInTheDocument();
    });

    it('gerceklesen YALNIZ TRY kayitlarindan toplanir', () => {
        // Plan proje defterinde (TRY); EUR gider capraz kur olmadan toplanmaz.
        render(<FinanceTab task={{
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
