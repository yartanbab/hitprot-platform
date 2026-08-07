import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FinanceTab } from './FinanceTab';

describe('FinanceTab', () => {
    it('finans ozet panellerini render eder', () => {
        render(<FinanceTab task={{ expenses: [{ amount: 100 }], incomes: [{ amount: 500 }] }} />);
        expect(screen.getByText('Toplam Gelir')).toBeInTheDocument();
        expect(screen.getByText('Toplam Gider')).toBeInTheDocument();
        expect(screen.getByText('Net Bakiye')).toBeInTheDocument();
    });
});
