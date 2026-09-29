import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { taskDetailStore } from './task-detail/taskDetailStore';

/**
 * Görev modalı çökünce (RES-11): kökün kabı (#task-detail-island) sayfanın sonunda; satır içi
 * kart orada görünmez kalırdı, kullanıcı "modal kendiliğinden kapandı" sanardı. İç sınır kartı
 * AYNI yerde, diyalogda gösterir: Tekrar dene / Sayfayı yenile / Kapat. Kapat ?task= derin
 * bağlantısını da siler (yenileme aynı görevi açıp yeniden çökmesin) ve V3 kapanış sözleşmesine
 * uyar (yalnız yazma olduysa kanban/liste tazelenir). Kapatınca sınır sökülür: takılı kalmaz.
 *
 * task-detail.entry.test.jsx'ten AYRI dosya: vi.mock dosya geneline yayılır. Modül bir kez
 * içe aktarılır (ES modülü tekil); testler SIRAYLA birbirinin durumuna dayanır.
 */
const TASK_ID = '22222222-3333-4444-5555-666666666666';
const crash = vi.hoisted(() => ({ on: true }));

vi.mock('./task-detail/v3/TaskDetailRootV3', async () => {
    const React = await import('react');
    return {
        TaskDetailRootV3: ({ taskId }) => {
            if (crash.on) throw new Error('çöktü');
            return React.createElement('p', null, `görev modalı ${taskId}`);
        },
    };
});

const reportIslandError = vi.fn();

async function open() {
    await act(async () => { window.apya.taskDetail.open(TASK_ID); });
}

beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    window.ApyaTelemetry = { reportIslandError };
});

describe('task-detail.jsx — çöken görev modalı', () => {
    it('derin bağlantıyla açılan görev çökünce kart AYNI yerde diyalogda; sayfa sonunda görünmez kart yok', async () => {
        document.body.innerHTML = '<div id="task-detail-island"></div>';
        window.history.replaceState(null, '', `/Tasks?task=${TASK_ID}`);
        window.apya = {};
        window.abp = { auth: { isGranted: () => true }, notify: { info: vi.fn(), error: vi.fn() } };

        await act(async () => { await import('./task-detail.jsx'); });

        const dialog = await screen.findByRole('dialog');
        expect(dialog).toHaveAccessibleName('Bu bölüm gösterilemedi');
        expect(within(dialog).getByRole('alert')).toHaveTextContent('Bu bölüm gösterilemedi');
        expect(within(dialog).getByRole('button', { name: 'Tekrar dene' })).toBeInTheDocument();
        expect(within(dialog).getByRole('button', { name: 'Sayfayı yenile' })).toBeInTheDocument();
        expect(within(dialog).getByRole('button', { name: 'Kapat' })).toBeInTheDocument();
        expect(document.getElementById('task-detail-island').querySelector('[data-island-error]')).toBeNull();
        expect(reportIslandError).toHaveBeenCalledTimes(1);
        expect(reportIslandError).toHaveBeenCalledWith('task-detail', expect.any(Error), expect.any(String));
    });

    it('"Kapat" modalı kapatır ve ?task= parametresini siler', async () => {
        fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Kapat' }));

        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        expect(taskDetailStore.getSnapshot()).toBeNull();
        expect(window.location.search).not.toContain('task=');
    });

    it('yeniden açılınca sınır takılı kalmaz: görev çizilir', async () => {
        crash.on = false;
        await open();

        expect(await screen.findByText(`görev modalı ${TASK_ID}`)).toBeInTheDocument();
        expect(screen.queryByRole('alert')).toBeNull();

        await act(async () => { taskDetailStore.close(); });
        crash.on = true;
    });

    it('Esc de kapatır', async () => {
        await open();
        await screen.findByRole('dialog');

        await userEvent.keyboard('{Escape}');

        await waitFor(() => expect(taskDetailStore.getSnapshot()).toBeNull());
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('kapanış V3 sözleşmesine uyar: yalnız çökmeden önce yazma olduysa kanban/liste tazelenir', async () => {
        const onResult = vi.fn();
        window.apya.taskDetail.onResult(onResult);

        await open();
        fireEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Kapat' }));
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        expect(onResult).not.toHaveBeenCalled();

        await open();
        taskDetailStore.markChanged();
        fireEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Kapat' }));
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        expect(onResult).toHaveBeenCalledTimes(1);
    });
});
