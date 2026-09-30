import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryProvider } from '../../lib/api/QueryProvider';
import { buttonVariants } from '../../components/ui';
import { cn } from '../../lib/utils';
import { TaskDetailRootV3 } from './TaskDetailRootV3';
import { taskDetailStore } from '../taskDetailStore';

/**
 * Görev detayı — silinmiş / gizli görev bağlantısı (TSK-23).
 *
 * ?task= modalı ve tam sayfa adası 404'ü (görev yok) ve 403'ü (gizli görev) genel "Görev detayları
 * yüklenemedi." + işe yaramayan "Tekrar Dene" ile gösteriyordu. abp.ajax zarflı hatada yalnız zarfla
 * reddeder; HTTP durumu isteğin jqXHR'ındadır (useTaskDetail onu hataya yazar) — sahte de öyle kurulur.
 *
 * "Tekrar dene" rol + harf duyarsız adla aranır: genel kart kanonik "Tekrar dene"ye (Common:Retry, karar 10)
 * geçince de 404/403'te yanlışlıkla çizilmesi yakalanır.
 */

const RETRY = { name: /tekrar dene/i };

const TASK_ID = '11111111-2222-3333-4444-555555555555';

/** abp.ajax sözü gibi: zarfla reddeder, durum yalnız jqXHR'da. */
function abpReject(status, envelope) {
    const request = Promise.reject(envelope);
    request.jqXHR = { status };
    return request;
}

let svc;

beforeEach(() => {
    window.sessionStorage.clear();
    taskDetailStore.reset();
    svc = {
        get: vi.fn(),
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
    window.history.replaceState(null, '', `/Tasks?task=${TASK_ID}`);
});

afterEach(() => {
    delete window.abp;
    window.sessionStorage.clear();
});

function open(presentation, onClose = () => {}) {
    return render(
        <QueryProvider>
            <TaskDetailRootV3 taskId={TASK_ID} presentation={presentation} onClose={onClose} />
        </QueryProvider>,
    );
}

describe('TaskDetailRootV3 — bulunamayan / gizli görev (TSK-23)', () => {
    it('modal 404: "Bu görev bulunamadı", Tekrar Dene YOK; Kapat modalı kapatır', async () => {
        svc.get.mockImplementation(() => abpReject(404, { code: null, message: 'Aradığınız kayıt bulunamadı.' }));
        const onClose = vi.fn();

        open('modal', onClose);

        expect(await screen.findByText('Bu görev bulunamadı')).toBeInTheDocument();
        expect(screen.getByText('Görev silinmiş ya da bağlantı eskimiş olabilir.')).toBeInTheDocument();
        expect(screen.queryByRole('button', RETRY)).toBeNull();
        expect(screen.queryByText('Görev detayları yüklenemedi.')).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Kapat' }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('modal 403 (gizli görev): açıklama sunucunun yerelleştirilmiş cümlesi, Tekrar Dene YOK', async () => {
        svc.get.mockImplementation(() => abpReject(403, {
            code: 'Platform:Task:ViewPrivateDenied',
            message: 'Bu gizli görevi görüntüleme yetkiniz yok.',
        }));

        open('modal');

        expect(await screen.findByText('Bu görevi görüntüleyemezsiniz')).toBeInTheDocument();
        expect(screen.getByText('Bu gizli görevi görüntüleme yetkiniz yok.')).toBeInTheDocument();
        expect(screen.queryByRole('button', RETRY)).toBeNull();
        expect(screen.queryByText('Görev detayları yüklenemedi.')).not.toBeInTheDocument();
    });

    it('tam sayfa 404: Kapat yerine /Tasks\'a dönüş — birincil küçük düğme (Razor _EmptyState ile aynı kural)', async () => {
        svc.get.mockImplementation(() => abpReject(404, { code: null, message: 'x' }));

        open('page');

        expect(await screen.findByText('Bu görev bulunamadı')).toBeInTheDocument();
        const back = screen.getByRole('link', { name: 'Görevlere dön' });
        expect(back.getAttribute('href')).toBe('/Tasks');
        expect(back.className).toBe(cn(buttonVariants({ variant: 'primary', size: 'sm' })));
        expect(screen.queryByRole('button', { name: 'Kapat' })).not.toBeInTheDocument();
    });

    it('geçici hata (500): eski kart ve Tekrar Dene aynen (gerileme yok)', async () => {
        svc.get.mockImplementation(() => abpReject(500, { code: null, message: 'Sunucu hatası' }));

        open('modal');

        expect(await screen.findByText('Görev detayları yüklenemedi.')).toBeInTheDocument();
        expect(screen.getByRole('button', RETRY)).toBeInTheDocument();
        expect(screen.queryByText('Bu görev bulunamadı')).not.toBeInTheDocument();
    });
});
