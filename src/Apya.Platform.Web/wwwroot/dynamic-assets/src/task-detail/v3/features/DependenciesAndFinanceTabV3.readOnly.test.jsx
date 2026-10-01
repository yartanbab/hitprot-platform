import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DependenciesTabV3 } from './DependenciesAndFinanceTabV3';

/* Yetki (ROL-04, Faz 1 devamı): bağlantı kaldırma görevin tam güncellemesidir
   (UpdateAsync → Edit + sahiplik). Kök `readOnly` geçirir; sekme düğmeyi çizmez. */
const TASK = { id: 't-1', title: 'Ana görev', status: 1, priority: 2, predecessorIds: ['p-1'] };

function renderTab(props) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={qc}>
            <DependenciesTabV3 task={TASK} {...props} />
        </QueryClientProvider>,
    );
}

beforeEach(() => {
    window.apya = {
        platform: {
            tasks: {
                task: {
                    get: vi.fn(() => Promise.resolve({ id: 'p-1', title: 'Öncül iş', status: 1, code: 'GRV-5' })),
                    update: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
});

afterEach(() => { delete window.apya; });

describe('DependenciesTabV3 / salt okunur', () => {
    it('readOnly iken oncul listelenir ama baglanti kaldirma dugmesi yok', async () => {
        renderTab({ readOnly: true });
        expect(await screen.findByText('Öncül iş')).toBeInTheDocument();
        expect(screen.queryByLabelText('Öncül iş bağlantısını kaldır')).not.toBeInTheDocument();
    });

    it('varsayilan (yetkili) durumda baglanti kaldirma dugmesi var', async () => {
        renderTab();
        expect(await screen.findByLabelText('Öncül iş bağlantısını kaldır')).toBeInTheDocument();
    });
});
