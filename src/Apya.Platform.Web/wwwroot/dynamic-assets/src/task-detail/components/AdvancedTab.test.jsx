import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdvancedTab } from './AdvancedTab';

describe('AdvancedTab', () => {
    it('bagimlilik ve zaman takibi alanlarini render eder', () => {
        render(<AdvancedTab task={{ predecessorIds: [] }} />);
        expect(screen.getByText(/Öncül Görev Bağımlılıkları/)).toBeInTheDocument();
        expect(screen.getByText(/Zaman Takibi/)).toBeInTheDocument();
    });
});
