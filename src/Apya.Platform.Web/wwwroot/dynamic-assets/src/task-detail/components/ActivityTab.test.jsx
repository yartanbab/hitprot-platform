import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityTab } from './ActivityTab';

describe('ActivityTab', () => {
    it('aktivite zaman çizelgesini gösterir', () => {
        render(<ActivityTab task={{ creationTime: '2026-08-01T10:00:00Z', creatorName: 'Ali' }} />);
        expect(screen.getByText('Aktivite Zaman Çizelgesi')).toBeInTheDocument();
        expect(screen.getByText('Görev oluşturuldu')).toBeInTheDocument();
    });
});
