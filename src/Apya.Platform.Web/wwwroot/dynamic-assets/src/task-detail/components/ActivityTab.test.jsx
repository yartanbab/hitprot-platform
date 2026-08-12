import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityTab } from './ActivityTab';

describe('ActivityTab', () => {
    /* V4 zaman çizelgesi satırı "aktör + olay" biçiminde: aktör <strong> içinde,
       olay metni kardeş düğümde — bu yüzden metin eşleşmesi düğüm-bağımsız yapılır. */
    it('aktivite zaman çizelgesini aktör ve olayla gösterir', () => {
        render(<ActivityTab task={{ creationTime: '2026-08-01T10:00:00Z', creatorName: 'Ali' }} />);
        expect(screen.getByText('Aktivite Zaman Çizelgesi')).toBeInTheDocument();
        expect(screen.getByText('Ali')).toBeInTheDocument();
        expect(screen.getByText(/görevi oluşturdu/)).toBeInTheDocument();
    });

    it('kayit yoksa bos durum gosterir', () => {
        render(<ActivityTab task={{}} />);
        expect(screen.getByText('Aktivite kaydı bulunamadı.')).toBeInTheDocument();
    });
});
