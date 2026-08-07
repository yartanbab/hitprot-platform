import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FilesTab } from './FilesTab';

function renderWithClient(ui) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
    window.apya = {
        platform: {
            tasks: {
                task: {
                    getAttachments: vi.fn(() => Promise.resolve([
                        { id: 'att-1', fileName: 'rapor.pdf', fileSize: 2048, downloadUrl: '/file/get/x', uploaderName: 'ali' },
                    ])),
                    deleteAttachment: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
});

describe('FilesTab', () => {
    it('dosya listesini gosterir', async () => {
        renderWithClient(<FilesTab taskId="t-1" task={{ id: 't-1' }} />);
        expect(await screen.findByText('rapor.pdf')).toBeInTheDocument();
        expect(screen.getByText(/2 KB/)).toBeInTheDocument();
    });

    it('sil butonuna basinca deleteAttachment cagirir', async () => {
        renderWithClient(<FilesTab taskId="t-1" task={{ id: 't-1' }} />);
        await screen.findByText('rapor.pdf');
        fireEvent.click(screen.getByRole('button', { name: /rapor\.pdf dosyasini sil/i }));
        await waitFor(() => expect(window.apya.platform.tasks.task.deleteAttachment).toHaveBeenCalledWith('att-1'));
    });

    it('hic dosya yoksa bos durum mesaji gosterir', async () => {
        window.apya.platform.tasks.task.getAttachments = vi.fn(() => Promise.resolve([]));
        renderWithClient(<FilesTab taskId="t-1" task={{ id: 't-1' }} />);
        expect(await screen.findByText(/henüz dosya yüklenmemiş/i)).toBeInTheDocument();
    });
});
