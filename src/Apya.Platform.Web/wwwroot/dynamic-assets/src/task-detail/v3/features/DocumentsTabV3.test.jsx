import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DocumentsTabV3 } from './DocumentsTabV3';

function renderWithClient(ui) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

const DOCS = [
    { id: 'd-1', taskId: 't-1', title: 'Toplantı notu', content: null, contentLength: 120, editorName: 'Ayşe', lastModificationTime: '2026-08-20T14:00:00Z', creationTime: '2026-08-01T09:00:00Z' },
    { id: 'd-2', taskId: 't-1', title: 'Boş taslak', content: null, contentLength: 0, editorName: 'Ayşe', lastModificationTime: null, creationTime: '2026-08-02T09:00:00Z' },
];

beforeEach(() => {
    window.apya = {
        platform: { tasks: { task: {
            getDocuments: vi.fn(() => Promise.resolve(DOCS)),
            getDocument: vi.fn((id) => Promise.resolve({
                ...DOCS.find((d) => d.id === id), content: '<p>Gövde metni</p>',
            })),
            createDocument: vi.fn(() => Promise.resolve({ id: 'd-3', taskId: 't-1', title: 'Yeni belge', content: '', contentLength: 0, editorName: 'Ayşe' })),
            updateDocument: vi.fn((id, title, content) => Promise.resolve({ id, taskId: 't-1', title, content, contentLength: (content || '').length, editorName: 'Ayşe' })),
            deleteDocument: vi.fn(() => Promise.resolve()),
        } } },
        notify: { success: vi.fn(), error: vi.fn() },
    };
    window.abp = { notify: { success: vi.fn(), error: vi.fn() } };
});

describe('DocumentsTabV3 — liste', () => {
    it('belgeleri listeler', async () => {
        renderWithClient(<DocumentsTabV3 taskId="t-1" />);
        expect(await screen.findByText('Toplantı notu')).toBeInTheDocument();
        expect(screen.getByText('Boş taslak')).toBeInTheDocument();
    });

    it('bos belgeyi ayri isaretler, dolu belgede yazar+tarih gosterir', async () => {
        renderWithClient(<DocumentsTabV3 taskId="t-1" />);
        await screen.findByText('Toplantı notu');
        expect(screen.getByText(/Boş belge/)).toBeInTheDocument();
        expect(screen.getByText(/Ayşe ·/)).toBeInTheDocument();
    });

    it('hic belge yoksa bos durum gosterir', async () => {
        window.apya.platform.tasks.task.getDocuments = vi.fn(() => Promise.resolve([]));
        renderWithClient(<DocumentsTabV3 taskId="t-1" />);
        expect(await screen.findByText('Henüz belge yok')).toBeInTheDocument();
    });

    it('sil dugmesi deleteDocument cagirir', async () => {
        renderWithClient(<DocumentsTabV3 taskId="t-1" />);
        await screen.findByText('Toplantı notu');
        fireEvent.click(screen.getByRole('button', { name: /Toplantı notu belgesini sil/ }));
        await waitFor(() => expect(window.apya.platform.tasks.task.deleteDocument)
            .toHaveBeenCalledWith('d-1'));
    });

    it('yeni belge olusturup DOGRUDAN editorunu acar', async () => {
        renderWithClient(<DocumentsTabV3 taskId="t-1" />);
        await screen.findByText('Toplantı notu');
        fireEvent.click(screen.getByRole('button', { name: /Yeni belge/ }));
        await waitFor(() => expect(window.apya.platform.tasks.task.createDocument)
            .toHaveBeenCalledWith('t-1', 'Yeni belge'));
        expect(await screen.findByLabelText('Belge başlığı')).toBeInTheDocument();
    });
});

describe('DocumentsTabV3 — editör', () => {
    const openFirst = async () => {
        renderWithClient(<DocumentsTabV3 taskId="t-1" />);
        fireEvent.click(await screen.findByText('Toplantı notu'));
        return screen.findByLabelText('Belge başlığı');
    };

    it('secilen belgenin TAM govdesini ayri sorguyla ceker', async () => {
        await openFirst();
        await waitFor(() => expect(window.apya.platform.tasks.task.getDocument)
            .toHaveBeenCalledWith('d-1'));
    });

    it('degisiklik yokken Kaydet dugmesi PASIF', async () => {
        const input = await openFirst();
        await waitFor(() => expect(input).toHaveValue('Toplantı notu'));
        expect(screen.getByRole('button', { name: /Kaydedildi/ })).toBeDisabled();
    });

    it('baslik degisince kaydeder', async () => {
        const input = await openFirst();
        await waitFor(() => expect(input).toHaveValue('Toplantı notu'));

        fireEvent.change(input, { target: { value: 'Kickoff notu' } });
        fireEvent.click(screen.getByRole('button', { name: /^Kaydet$/ }));

        await waitFor(() => expect(window.apya.platform.tasks.task.updateDocument)
            .toHaveBeenCalledWith('d-1', 'Kickoff notu', '<p>Gövde metni</p>'));
    });

    it('bos baslikla kaydetmeyi REDDEDER, sunucuya gitmez', async () => {
        const input = await openFirst();
        await waitFor(() => expect(input).toHaveValue('Toplantı notu'));

        fireEvent.change(input, { target: { value: '   ' } });
        fireEvent.click(screen.getByRole('button', { name: /^Kaydet$/ }));

        await waitFor(() => expect(window.abp.notify.error).toHaveBeenCalled());
        expect(window.apya.platform.tasks.task.updateDocument).not.toHaveBeenCalled();
    });

    it('kaydedilmemis degisiklikle kapatmak ONAY ister; hayir denince kapanmaz', async () => {
        const input = await openFirst();
        await waitFor(() => expect(input).toHaveValue('Toplantı notu'));
        fireEvent.change(input, { target: { value: 'Değişti' } });

        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
        fireEvent.click(screen.getByRole('button', { name: 'Belge listesine dön' }));

        expect(confirmSpy).toHaveBeenCalled();
        expect(screen.getByLabelText('Belge başlığı')).toBeInTheDocument();
        confirmSpy.mockRestore();
    });

    it('degisiklik yokken kapatmak ONAY SORMAZ', async () => {
        const input = await openFirst();
        await waitFor(() => expect(input).toHaveValue('Toplantı notu'));

        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
        fireEvent.click(screen.getByRole('button', { name: 'Belge listesine dön' }));

        expect(confirmSpy).not.toHaveBeenCalled();
        expect(await screen.findByText('Belgeler')).toBeInTheDocument();
        confirmSpy.mockRestore();
    });
});
