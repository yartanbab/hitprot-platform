import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskDetailRoot } from './TaskDetailRoot';

const TASK = {
    id: '11111111-2222-3333-4444-555555555555',
    title: 'Otel Konaklama Anlaşması',
    status: 4, priority: 4, isPrivate: true,
    lastModificationTime: '2026-07-10T09:45:00Z',
};

function wrap(ui) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
    window.apya = { platform: { tasks: { task: { get: vi.fn(() => Promise.resolve(TASK)) } } } };
    window.abp = { auth: { isGranted: () => true }, notify: { info: vi.fn(), error: vi.fn() } };
    window.history.replaceState(null, '', '/Tasks');
});

describe('TaskDetailRoot', () => {
    it('yuklenirken iskelet gosterir', () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByLabelText('Görev yükleniyor')).toBeInTheDocument();
    });

    it('veri gelince baslik gorunur', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        expect(await screen.findByText('Otel Konaklama Anlaşması')).toBeInTheDocument();
    });

    it('temizken kapat dogrudan kapatir', async () => {
        const onClose = vi.fn();
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={onClose} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        await userEvent.click(screen.getByRole('button', { name: 'Kapat' }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('API hatasinda hata mesaji ve tekrar dene gosterir', async () => {
        window.apya.platform.tasks.task.get = vi.fn(() => Promise.reject(new Error('403')));
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        expect(await screen.findByText(/Görev yüklenemedi/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Tekrar dene' })).toBeInTheDocument();
    });

    it('acilinca URLe ?task ekler', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await waitFor(() => expect(window.location.search).toBe(`?task=${TASK.id}`));
    });

    it('Kaydet Faz 1de hep devre disi (duzenlenebilir alan yok)', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        expect(screen.getByRole('button', { name: 'Kaydet' })).toBeDisabled();
    });

    it('silme onayinda SIL yazilmadan buton aktif olmaz', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        await userEvent.click(screen.getByRole('button', { name: 'Görev işlemleri' }));
        await userEvent.click(screen.getByRole('menuitem', { name: /Sil/ }));

        const confirmBtn = screen.getByRole('button', { name: 'Evet, sil' });
        expect(confirmBtn).toBeDisabled();

        await userEvent.type(screen.getByLabelText('Onay metni'), 'SİL');
        expect(confirmBtn).toBeEnabled();
    });

    it('silme onaylaninca servis cagrilir ve modal kapanir', async () => {
        const onClose = vi.fn();
        window.apya.platform.tasks.task.delete = vi.fn(() => Promise.resolve());
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={onClose} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        await userEvent.click(screen.getByRole('button', { name: 'Görev işlemleri' }));
        await userEvent.click(screen.getByRole('menuitem', { name: /Sil/ }));
        await userEvent.type(screen.getByLabelText('Onay metni'), 'SİL');
        await userEvent.click(screen.getByRole('button', { name: 'Evet, sil' }));

        await waitFor(() => expect(window.apya.platform.tasks.task.delete).toHaveBeenCalledWith(TASK.id));
        await waitFor(() => expect(onClose).toHaveBeenCalled());
    });
});
