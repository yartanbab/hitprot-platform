import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GalleryTabV3 } from './GalleryTabV3';

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
                        { id: 'a-1', fileName: 'plan.png', fileSize: 4096, downloadUrl: '/file/get/1', uploaderName: 'ali' },
                        { id: 'a-2', fileName: 'rapor.pdf', fileSize: 2048, downloadUrl: '/file/get/2', uploaderName: 'ali' },
                    ])),
                    deleteAttachment: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
});

describe('GalleryTabV3', () => {
    it('yalniz gorsel ekleri gosterir, PDF i eler', async () => {
        renderWithClient(<GalleryTabV3 taskId="t-1" />);
        expect(await screen.findByText('plan.png')).toBeInTheDocument();
        expect(screen.queryByText('rapor.pdf')).not.toBeInTheDocument();
    });

    it('gorseli onizleme olarak basar', async () => {
        renderWithClient(<GalleryTabV3 taskId="t-1" />);
        const img = await screen.findByAltText('plan.png');
        expect(img).toHaveAttribute('src', '/file/get/1');
    });

    it('sil butonu deleteAttachment cagirir', async () => {
        renderWithClient(<GalleryTabV3 taskId="t-1" />);
        await screen.findByText('plan.png');
        fireEvent.click(screen.getByRole('button', { name: /plan\.png gorselini sil/i }));
        await waitFor(() => expect(window.apya.platform.tasks.task.deleteAttachment)
            .toHaveBeenCalledWith('a-1'));
    });

    it('hic gorsel yoksa bos durum mesaji gosterir', async () => {
        window.apya.platform.tasks.task.getAttachments = vi.fn(() => Promise.resolve([
            { id: 'a-2', fileName: 'rapor.pdf', fileSize: 2048, downloadUrl: '/file/get/2', uploaderName: 'ali' },
        ]));
        renderWithClient(<GalleryTabV3 taskId="t-1" />);
        expect(await screen.findByText(/henüz görsel yok/i)).toBeInTheDocument();
    });
});
