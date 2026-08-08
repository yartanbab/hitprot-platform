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
