import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SubtaskSheetV3 } from './SubtaskSheetV3';

/**
 * Alt görev paneli yetkisi (ROL-04, Faz 1 devamı). Panel eskiden yetki bilgisi
 * almıyordu: salt okur kullanıcı açıklama, durum, öncelik, kontrol listesi ve
 * silmeye basıp 403 alıyordu. Yetki ALT GÖREVİN kendi kaydından hesaplanır;
 * yorum herkese açık kalır.
 */
const SUB = {
    id: 's-1', code: 'GRV-21', title: 'Alt iş', description: 'Eski açıklama',
    status: 1, priority: 2, creatorId: 'u-owner', assigneeId: null, tags: [],
};

const ALL = () => true;
const NOT_MANAGER = (p) => p !== 'Platform.Projects.ManageTeam';

function setup({ me, granted = ALL, sub = SUB } = {}) {
    window.abp = { currentUser: { id: me }, auth: { isGranted: granted } };
    window.apya = {
        platform: {
            tasks: {
                task: {
                    get: vi.fn(() => Promise.resolve(sub)),
                    getChecklistItems: vi.fn(() => Promise.resolve([{ id: 'c-1', text: 'Madde bir', isDone: false }])),
                    getAttachments: vi.fn(() => Promise.resolve([])),
                    getComments: vi.fn(() => Promise.resolve([])),
                    update: vi.fn(() => Promise.resolve()),
                    updateStatus: vi.fn(() => Promise.resolve()),
                    setPriority: vi.fn(() => Promise.resolve()),
                    delete: vi.fn(() => Promise.resolve()),
                    addComment: vi.fn(() => Promise.resolve('cm-1')),
                    addChecklistItem: vi.fn(() => Promise.resolve('c-2')),
                    toggleChecklistItem: vi.fn(() => Promise.resolve()),
                    deleteChecklistItem: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
        <QueryClientProvider client={qc}>
            <SubtaskSheetV3 subtaskId="s-1" parentCode="GRV-20" onClose={vi.fn()} />
        </QueryClientProvider>,
    );
    return window.apya.platform.tasks.task;
}

afterEach(() => { delete window.abp; delete window.apya; });

describe('SubtaskSheetV3 / yetki', () => {
    it('alt gorevin sahibi olmayan: aciklama, durum, oncelik ve silme kilitli; Salt okunur rozeti var', async () => {
        const svc = setup({ me: 'u-other', granted: NOT_MANAGER });
        expect(await screen.findByText('Alt iş')).toBeInTheDocument();

        const statusBtn = screen.getByTitle('Durumu değiştir');
        const priorityBtn = screen.getByTitle('Önceliği değiştir');
        expect(statusBtn).toBeDisabled();
        expect(priorityBtn).toBeDisabled();
        fireEvent.click(statusBtn);
        fireEvent.click(priorityBtn);

        expect(screen.queryByTitle('Alt görevi sil')).not.toBeInTheDocument();
        expect(screen.getByText('Salt okunur')).toBeInTheDocument();

        const description = screen.getByDisplayValue('Eski açıklama');
        expect(description).toHaveAttribute('readonly');
        fireEvent.change(description, { target: { value: 'Yeni açıklama' } });
        fireEvent.blur(description);

        expect(svc.update).not.toHaveBeenCalled();
        expect(svc.updateStatus).not.toHaveBeenCalled();
        expect(svc.setPriority).not.toHaveBeenCalled();
    });

    it('alt gorevin sahibi olmayan: kontrol listesinde ekleme/silme yok, isaret kutusu kilitli', async () => {
        const svc = setup({ me: 'u-other', granted: NOT_MANAGER });
        await screen.findByText('Alt iş');

        fireEvent.click(screen.getByRole('button', { name: /Kontrol/ }));
        expect(await screen.findByText('Madde bir')).toBeInTheDocument();

        const toggle = screen.getByLabelText('Tamamlandı işaretle');
        expect(toggle).toBeDisabled();
        fireEvent.click(toggle);
        expect(screen.queryByLabelText('Maddeyi sil')).not.toBeInTheDocument();
        expect(screen.queryByPlaceholderText(/Yeni madde yaz/)).not.toBeInTheDocument();
        expect(svc.toggleChecklistItem).not.toHaveBeenCalled();
    });

    it('salt okur kullanici yine de yorum yazar', async () => {
        const svc = setup({ me: 'u-other', granted: NOT_MANAGER });
        await screen.findByText('Alt iş');

        fireEvent.click(screen.getByRole('button', { name: /Yorumlar/ }));
        fireEvent.change(screen.getByPlaceholderText(/Yorum yaz/), { target: { value: 'Bir not' } });
        fireEvent.click(screen.getByLabelText('Yorumu gönder'));

        await waitFor(() => expect(svc.addComment).toHaveBeenCalledWith('s-1', 'Bir not'));
    });

    it('alt gorevin ATANANI ust gorevin sahibi olmasa da duzenler', async () => {
        const svc = setup({ me: 'u-me', granted: NOT_MANAGER, sub: { ...SUB, assigneeId: 'u-me' } });
        await screen.findByText('Alt iş');

        expect(screen.getByTitle('Durumu değiştir')).toBeEnabled();
        expect(screen.getByTitle('Önceliği değiştir')).toBeEnabled();
        expect(screen.getByTitle('Alt görevi sil')).toBeInTheDocument();
        expect(screen.queryByText('Salt okunur')).not.toBeInTheDocument();

        const description = screen.getByDisplayValue('Eski açıklama');
        fireEvent.change(description, { target: { value: 'Yeni açıklama' } });
        fireEvent.blur(description);
        await waitFor(() => expect(svc.update).toHaveBeenCalledTimes(1));
    });

    it('sahiplik uc iznini atlatmaz: yalniz ChangeStatus varsa durum acik, oncelik ve silme kapali', async () => {
        const svc = setup({ me: 'u-owner', granted: (p) => p === 'Platform.Tasks.ChangeStatus' });
        await screen.findByText('Alt iş');

        expect(screen.getByTitle('Önceliği değiştir')).toBeDisabled();
        expect(screen.queryByTitle('Alt görevi sil')).not.toBeInTheDocument();

        /* Kapı (ChangeStatus) ile çağrılan uç eşleşmeli: açık rozet Tasks.Edit isteyen
           tam güncellemeye (update) giderse bu kullanıcı 403 alır. */
        const statusBtn = screen.getByTitle('Durumu değiştir');
        expect(statusBtn).toBeEnabled();
        fireEvent.click(statusBtn);
        await waitFor(() => expect(svc.updateStatus).toHaveBeenCalledWith('s-1', 2));
        expect(svc.update).not.toHaveBeenCalled();
    });
});
