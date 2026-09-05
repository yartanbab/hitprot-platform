import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FormsTabV3 } from './FormsTabV3';

function renderWithClient(ui) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

const LINKS = [
    { id: 'l-1', taskId: 't-1', documentId: 'd-1', title: 'Saha kontrol formu', slug: 'saha-kontrol', isPublished: true, isGuestFillable: false, responseCount: 2, creationTime: '2026-09-01T10:00:00Z' },
    { id: 'l-2', taskId: 't-1', documentId: 'd-2', title: 'Kabul tutanağı', slug: null, isPublished: false, isGuestFillable: false, responseCount: 0, creationTime: '2026-09-02T10:00:00Z' },
];

const OPTIONS = [
    { documentId: 'd-1', title: 'Saha kontrol formu', isPublished: true, isLinked: true },
    { documentId: 'd-3', title: 'Memnuniyet anketi', isPublished: true, isLinked: false },
];

const RESPONSES = [
    { id: 'r-1', documentId: 'd-1', creationTime: '2026-09-02T12:00:00Z', respondentName: 'Ayşe', isGuestSubmission: false, status: 0 },
    { id: 'r-2', documentId: 'd-1', creationTime: '2026-09-01T12:00:00Z', respondentName: 'Mehmet Usta', isGuestSubmission: true, status: 0 },
];

let granted;

beforeEach(() => {
    granted = ['Platform.Tasks.ShareExternally'];
    window.abp = {
        auth: { isGranted: (p) => granted.includes(p) },
        notify: { success: vi.fn(), error: vi.fn() },
    };
    window.apya = {
        platform: { tasks: { task: {
            getLinkedForms: vi.fn(() => Promise.resolve(LINKS)),
            getFormOptions: vi.fn(() => Promise.resolve(OPTIONS)),
            getFormResponses: vi.fn(() => Promise.resolve(RESPONSES)),
            linkForm: vi.fn(() => Promise.resolve(LINKS[0])),
            unlinkForm: vi.fn(() => Promise.resolve()),
            setFormGuestFillable: vi.fn(() => Promise.resolve()),
        } } },
    };
});

describe('FormsTabV3 — liste', () => {
    it('bagli formlari ve BU GOREVDEKI yanit sayisini gosterir', async () => {
        renderWithClient(<FormsTabV3 taskId="t-1" />);
        expect(await screen.findByText('Saha kontrol formu')).toBeInTheDocument();
        expect(screen.getByText(/2 yanıt · bu görevde/)).toBeInTheDocument();
    });

    it('yayinlanmamis formu taslak olarak isaretler', async () => {
        renderWithClient(<FormsTabV3 taskId="t-1" />);
        await screen.findByText('Kabul tutanağı');
        expect(screen.getByText('taslak')).toBeInTheDocument();
    });

    it('yaniti olmayan formda sayi yerine acik metin yazar', async () => {
        renderWithClient(<FormsTabV3 taskId="t-1" />);
        await screen.findByText('Kabul tutanağı');
        expect(screen.getByText('Bu görevde henüz yanıt yok')).toBeInTheDocument();
    });

    it('hic bagli form yoksa bos durum gosterir', async () => {
        window.apya.platform.tasks.task.getLinkedForms = vi.fn(() => Promise.resolve([]));
        renderWithClient(<FormsTabV3 taskId="t-1" />);
        expect(await screen.findByText('Göreve bağlı form yok')).toBeInTheDocument();
    });

    it('YAYINDA olan forma doldurma baglantisi verir, taslaga VERMEZ', async () => {
        renderWithClient(<FormsTabV3 taskId="t-1" />);
        await screen.findByText('Saha kontrol formu');
        const link = screen.getByRole('link', { name: /Saha kontrol formu formunu doldur/ });
        expect(link).toHaveAttribute('href', '/f/saha-kontrol?taskId=t-1');
        expect(screen.queryByRole('link', { name: /Kabul tutanağı formunu doldur/ })).not.toBeInTheDocument();
    });
});

describe('FormsTabV3 — bağlama', () => {
    it('secici acilinca formlari listeler, ZATEN BAGLI olani pasif birakir', async () => {
        renderWithClient(<FormsTabV3 taskId="t-1" />);
        await screen.findByText('Saha kontrol formu');
        fireEvent.click(screen.getByRole('button', { name: /Form bağla/ }));

        expect(await screen.findByText('Memnuniyet anketi')).toBeInTheDocument();
        expect(screen.getByText('zaten bağlı')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Memnuniyet anketi/ })).not.toBeDisabled();
    });

    it('secilen formu baglar', async () => {
        renderWithClient(<FormsTabV3 taskId="t-1" />);
        await screen.findByText('Saha kontrol formu');
        fireEvent.click(screen.getByRole('button', { name: /Form bağla/ }));
        fireEvent.click(await screen.findByRole('button', { name: /Memnuniyet anketi/ }));

        await waitFor(() => expect(window.apya.platform.tasks.task.linkForm)
            .toHaveBeenCalledWith('t-1', 'd-3'));
    });

    it('baglanti kaldirmak ONAY ister ve formun silinmedigini soyler', async () => {
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
        renderWithClient(<FormsTabV3 taskId="t-1" />);
        await screen.findByText('Saha kontrol formu');
        fireEvent.click(screen.getByRole('button', { name: /Saha kontrol formu bağlantısını kaldır/ }));

        expect(confirmSpy.mock.calls[0][0]).toMatch(/yanıtlar silinmez/i);
        expect(window.apya.platform.tasks.task.unlinkForm).not.toHaveBeenCalled();
        confirmSpy.mockRestore();
    });
});

describe('FormsTabV3 — dışarı açma', () => {
    it('paylasim yetkisi VARSA anahtari gosterir ve durumu yazar', async () => {
        renderWithClient(<FormsTabV3 taskId="t-1" />);
        await screen.findByText('Saha kontrol formu');
        const kutu = screen.getByLabelText(/ekip dışından da doldurulabilsin/i);
        fireEvent.click(kutu);
        await waitFor(() => expect(window.apya.platform.tasks.task.setFormGuestFillable)
            .toHaveBeenCalledWith('l-1', true));
    });

    it('paylasim yetkisi YOKSA anahtar HIC cizilmez', async () => {
        granted = [];
        renderWithClient(<FormsTabV3 taskId="t-1" />);
        await screen.findByText('Saha kontrol formu');
        expect(screen.queryByLabelText(/ekip dışından da doldurulabilsin/i)).not.toBeInTheDocument();
    });

    it('TASLAK formda dışarı açma anahtari cikmaz', async () => {
        renderWithClient(<FormsTabV3 taskId="t-1" />);
        await screen.findByText('Kabul tutanağı');
        // Yalnız yayındaki form için tek kutu olmalı
        expect(screen.getAllByLabelText(/ekip dışından da doldurulabilsin/i).length).toBe(1);
    });
});

describe('FormsTabV3 — yanıtlar', () => {
    it('satir acilinca yanitlari ceker ve misafiri isaretler', async () => {
        renderWithClient(<FormsTabV3 taskId="t-1" />);
        fireEvent.click(await screen.findByText('Saha kontrol formu'));

        expect(await screen.findByText('Mehmet Usta')).toBeInTheDocument();
        expect(screen.getByText('Ayşe')).toBeInTheDocument();
        expect(screen.getByText('· dış')).toBeInTheDocument();
        expect(window.apya.platform.tasks.task.getFormResponses).toHaveBeenCalledWith('t-1', 'd-1');
    });

    it('satir kapaliyken yanit sorgusu HIC atilmaz', async () => {
        renderWithClient(<FormsTabV3 taskId="t-1" />);
        await screen.findByText('Saha kontrol formu');
        expect(window.apya.platform.tasks.task.getFormResponses).not.toHaveBeenCalled();
    });
});
