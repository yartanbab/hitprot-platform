import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageShell } from './PageShell';

describe('PageShell', () => {
    it('header, footer ve children ogelerini render eder', () => {
        render(
            <PageShell
                title="Görev Detayı: Test Görevi"
                header={<div>Header İçeriği</div>}
                footer={<div>Footer İçeriği</div>}
            >
                <div>Body İçeriği</div>
            </PageShell>,
        );

        expect(screen.getByText('Header İçeriği')).toBeInTheDocument();
        expect(screen.getByText('Body İçeriği')).toBeInTheDocument();
        expect(screen.getByText('Footer İçeriği')).toBeInTheDocument();
    });

    it('aria-label ile title degerini taşır', () => {
        render(
            <PageShell
                title="Görev Detayı: Test Görevi"
                header={<div>Header</div>}
                footer={<div>Footer</div>}
            >
                <div>Content</div>
            </PageShell>,
        );

        expect(screen.getByLabelText('Görev Detayı: Test Görevi')).toBeInTheDocument();
    });
});
