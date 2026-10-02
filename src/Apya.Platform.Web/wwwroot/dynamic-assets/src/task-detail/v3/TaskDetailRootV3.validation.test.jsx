import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryProvider } from '../../lib/api/QueryProvider';
import { TaskDetailRootV3 } from './TaskDetailRootV3';
import { taskDetailStore } from '../taskDetailStore';

/**
 * Görev detayı V3 — doğrulama hatası alanın altında (CON-01).
 *
 * Doğrulama düşünce yalnız "Zorunlu alanları kontrol edin." bildirimi çıkıyordu; hangi
 * alanın yanlış olduğu görünmüyordu (form.errors yalnız v2'de okunuyordu). Ayrıca başlık
 * yalnız odak çıkışında forma yazıldığı için başlık odaktayken Esc modalı uyarısız kapatıyordu.
 * Kurulum TaskDetailRootV3.dirtyGuard.test.jsx ile aynı.
 */

const TASK = {
    id: '11111111-2222-3333-4444-555555555555',
    code: 'GRV-30',
    title: 'Otel Konaklama Anlaşması',
    description: '<p>Kayıtlı açıklama metni</p>',
    startDate: '2026-06-25T00:00:00Z',
    dueDate: '2026-07-10T00:00:00Z',
    status: 2, priority: 2, isPrivate: false,
    assigneeId: null, projectId: null, parentTaskId: null,
    predecessorIds: [], boardColumnId: null, tags: [],
    subTasks: [], comments: [], attachments: [],
    lastModificationTime: '2026-07-10T09:45:00Z',
};

const DIRTY = 'Kaydedilmemiş değişiklikler var';
const START_REQUIRED = 'Başlangıç tarihi zorunlu.';
const DUE_BEFORE_START = 'Son tarih başlangıç tarihinden önce olamaz.';
const TITLE_REQUIRED = 'Başlık zorunlu.';

let svc;

beforeEach(() => {
    window.sessionStorage.clear();
    taskDetailStore.reset();
    svc = {
        get: vi.fn(() => Promise.resolve(TASK)),
        update: vi.fn(() => Promise.resolve(TASK)),
        getUsersLookup: vi.fn(() => Promise.resolve({ items: [] })),
        getProjectsLookup: vi.fn(() => Promise.resolve([])),
        getFeatureAssignments: vi.fn(() => Promise.resolve([])),
        getChecklistItems: vi.fn(() => Promise.resolve([])),
        getComments: vi.fn(() => Promise.resolve([])),
    };
    window.apya = { platform: { tasks: { task: svc } } };
    window.abp = {
        currentUser: { id: 'u1', tenantId: 't1', userName: 'ybaba' },
        auth: { isGranted: () => true },
        notify: { info: vi.fn(), error: vi.fn(), success: vi.fn() },
    };
    window.history.replaceState(null, '', '/Tasks');
});

afterEach(() => {
    delete window.abp;
    delete window.apya;
    window.sessionStorage.clear();
});

async function open(onClose = vi.fn()) {
    render(
        <QueryProvider>
            <TaskDetailRootV3 taskId={TASK.id} presentation="modal" onClose={onClose} />
        </QueryProvider>,
    );
    await screen.findByText(TASK.title);
    return onClose;
}

const startInput = () => screen.getByLabelText('Başlangıç');
const dueInput = () => screen.getByLabelText('Son tarih');
const titleBox = () => screen.getByRole('textbox', { name: 'Görev başlığı' });
const save = () => fireEvent.click(screen.getByRole('button', { name: 'Kaydet' }));
const cellOf = (input) => input.closest('label').parentElement;

/** contentEditable başlığa yazar (odak çıkışı OLMADAN). */
function typeTitle(text) {
    const title = titleBox();
    title.textContent = text;
    fireEvent.input(title);
}

describe('TaskDetailRootV3 — doğrulama hatası alanın altında (CON-01)', () => {
    it('başlangıç tarihi boşken Kaydet: hata Başlangıç hücresinde, girdi aria-invalid ve odakta, kayıt gitmez', async () => {
        await open();
        fireEvent.change(startInput(), { target: { value: '' } });
        await screen.findByText(DIRTY);

        save();

        const error = await screen.findByText(START_REQUIRED);
        expect(cellOf(startInput())).toContainElement(error);
        expect(startInput()).toHaveAttribute('aria-invalid', 'true');
        expect(startInput()).toHaveAccessibleDescription(START_REQUIRED);
        await waitFor(() => expect(startInput()).toHaveFocus());
        expect(svc.update).not.toHaveBeenCalled();
        expect(window.abp.notify.error).toHaveBeenCalledWith('Kaydedilemedi: işaretli alanları düzeltin.');
    });

    it('son tarih başlangıçtan önceyken Kaydet: hata Son tarih hücresinde, aciliyet ipucunun yerinde', async () => {
        await open();
        expect(screen.getByText(/gün gecikti/)).toBeInTheDocument();
        fireEvent.change(dueInput(), { target: { value: '2026-06-01' } });
        await screen.findByText(DIRTY);

        save();

        const error = await screen.findByText(DUE_BEFORE_START);
        expect(cellOf(dueInput())).toContainElement(error);
        expect(dueInput()).toHaveAttribute('aria-invalid', 'true');
        expect(screen.queryByText(/gün gecikti/)).toBeNull();
        expect(startInput()).not.toHaveAttribute('aria-invalid');
        await waitFor(() => expect(dueInput()).toHaveFocus());
        expect(svc.update).not.toHaveBeenCalled();
    });

    it('başlık boşken Kaydet: hata başlığın altında; başlık aria-invalid + aria-describedby; odak ilk hatalı alanda', async () => {
        await open();
        typeTitle('');
        fireEvent.change(startInput(), { target: { value: '' } });
        await screen.findByText(DIRTY);

        save();

        expect(await screen.findByText(TITLE_REQUIRED)).toBeInTheDocument();
        expect(titleBox()).toHaveAttribute('aria-invalid', 'true');
        expect(titleBox()).toHaveAccessibleDescription(TITLE_REQUIRED);
        expect(screen.getByText(START_REQUIRED)).toBeInTheDocument();
        // İki hata var: odak DOM sırasındaki ilkine (başlık) gider.
        await waitFor(() => expect(titleBox()).toHaveFocus());
        expect(svc.update).not.toHaveBeenCalled();
    });

    it('alan düzeltilince o alanın hatası hemen kalkar', async () => {
        await open();
        typeTitle('');
        fireEvent.change(startInput(), { target: { value: '' } });
        await screen.findByText(DIRTY);
        save();
        await screen.findByText(TITLE_REQUIRED);

        typeTitle('Yeni başlık');

        await waitFor(() => expect(screen.queryByText(TITLE_REQUIRED)).toBeNull());
        expect(titleBox()).not.toHaveAttribute('aria-invalid');
        expect(screen.getByText(START_REQUIRED)).toBeInTheDocument();   // diğer hata yerinde
    });

    it('başlangıç değişince son tarih hatası da kalkar; yeniden Kaydet geçerli formu gönderir', async () => {
        await open();
        fireEvent.change(dueInput(), { target: { value: '2026-06-01' } });
        await screen.findByText(DIRTY);
        save();
        await screen.findByText(DUE_BEFORE_START);

        fireEvent.change(startInput(), { target: { value: '2026-05-01' } });

        await waitFor(() => expect(screen.queryByText(DUE_BEFORE_START)).toBeNull());
        expect(dueInput()).not.toHaveAttribute('aria-invalid');

        save();
        await waitFor(() => expect(svc.update).toHaveBeenCalledTimes(1));
        expect(svc.update.mock.calls[0][1]).toMatchObject({ startDate: '2026-05-01', dueDate: '2026-06-01' });
    });

    it('"Kaydet ve çık" doğrulama hatasında: pencere kapanır, hata alanın altında, odak hatalı alanda', async () => {
        const onClose = await open();
        fireEvent.change(startInput(), { target: { value: '' } });
        await screen.findByText(DIRTY);
        await userEvent.click(screen.getByRole('button', { name: 'Vazgeç' }));
        await screen.findByRole('alertdialog');

        await userEvent.click(screen.getByRole('button', { name: 'Kaydet ve çık' }));

        await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
        expect(screen.getByText(START_REQUIRED)).toBeInTheDocument();
        await waitFor(() => expect(startInput()).toHaveFocus());
        // Pencerenin odak iadesi (açan "Vazgeç" düğmesi) hatalı alandaki odağı ezmez.
        await new Promise((resolve) => setTimeout(resolve, 20));
        expect(startInput()).toHaveFocus();
        expect(svc.update).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
    });
});

describe('TaskDetailRootV3 — başlık yazarken forma işlenir (CON-01)', () => {
    it('başlık yazılırken (odak çıkışı olmadan) Esc pencereyi açar; modal kapanmaz', async () => {
        const onClose = await open();
        titleBox().focus();
        typeTitle('Otel Konaklama Anlaşması v2');

        await screen.findByText(DIRTY);
        await userEvent.keyboard('{Escape}');

        expect(await screen.findByRole('alertdialog')).toBeInTheDocument();
        expect(onClose).not.toHaveBeenCalled();
    });

    it('yazılan başlık Kaydet ile gönderilir (odak çıkışı beklenmez)', async () => {
        await open();
        typeTitle('  Otel Konaklama Anlaşması v2 ');
        await screen.findByText(DIRTY);

        save();

        await waitFor(() => expect(svc.update).toHaveBeenCalledTimes(1));
        expect(svc.update.mock.calls[0][1].title).toBe('Otel Konaklama Anlaşması v2');
    });
});
