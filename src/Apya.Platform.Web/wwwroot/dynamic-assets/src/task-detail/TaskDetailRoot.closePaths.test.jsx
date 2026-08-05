import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Bu dosya ayrı tutuluyor çünkü useDirtyGuard'ı burada MOCK'luyoruz.
 * Faz 1'de düzenlenebilir alan yok → gerçek hook'ta isDirty hiç true olmuyor,
 * bu da "requestClose çağrıldı mı yoksa onClose'a doğrudan mı gidildi" ayrımını
 * davranışsal olarak GÖRÜNMEZ kılıyor (ikisi de aynı sonucu üretiyor).
 * requestClose'u casus (spy) bir fonksiyonla değiştirip her üç kapatma yolunun
 * (✕, ESC, backdrop) GERÇEKTEN bu fonksiyondan geçtiğini — guard'ı atlayıp
 * onClose'a doğrudan gitmediğini — kanıtlıyoruz.
 */
const requestCloseSpy = vi.fn((onClose) => onClose());

vi.mock('./hooks/useDirtyGuard', () => ({
    useDirtyGuard: () => ({
        isDirty: false,
        markDirty: vi.fn(),
        markClean: vi.fn(),
        pendingClose: false,
        requestClose: requestCloseSpy,
        resolvePendingClose: vi.fn(),
    }),
}));

// eslint-disable-next-line import/first
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
    requestCloseSpy.mockClear();
    window.apya = { platform: { tasks: { task: { get: vi.fn(() => Promise.resolve(TASK)) } } } };
    window.abp = { auth: { isGranted: () => true }, notify: { info: vi.fn(), error: vi.fn() } };
    window.history.replaceState(null, '', '/Tasks');
});

describe('TaskDetailRoot — üç kapatma yolu da guard.requestClose üzerinden geçer', () => {
    it('✕ butonu requestClose çağırır', async () => {
        const onClose = vi.fn();
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={onClose} />);
        await screen.findByText('Otel Konaklama Anlaşması');

        await userEvent.click(screen.getByRole('button', { name: 'Kapat' }));

        expect(requestCloseSpy).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('Escape requestClose çağırır', async () => {
        const onClose = vi.fn();
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={onClose} />);
        await screen.findByText('Otel Konaklama Anlaşması');

        await userEvent.keyboard('{Escape}');

        expect(requestCloseSpy).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('backdrop tiklamasi requestClose cagirir', async () => {
        const onClose = vi.fn();
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={onClose} />);
        await screen.findByText('Otel Konaklama Anlaşması');

        const overlay = document.querySelector('.z-modal-backdrop');
        expect(overlay).not.toBeNull();
        await userEvent.click(overlay);

        expect(requestCloseSpy).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
