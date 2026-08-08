import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HistoryTab } from './HistoryTab';

describe('HistoryTab', () => {
    it('teknik audit geçmişini gösterir', () => {
        render(<HistoryTab task={{ id: '12345' }} />);
        expect(screen.getByText('Teknik Audit & Değişiklik Geçmişi')).toBeInTheDocument();
        expect(screen.getByText('12345')).toBeInTheDocument();
    });
});
