import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskGeneralTabV3 } from './TaskGeneralTabV3';

/**
 * Açıklama editörü contentEditable olduğu için içeriğini MOUNT anında bir kez
 * basar (caret'i korumak için bilinçli). Bu yüzden görev değiştiğinde editörün
 * yeniden kurulması ŞART: aksi halde kullanıcı B görevinde A görevinin metnini
 * görür ve üzerine yazıp kaydettiğinde B'nin açıklamasını A'nınkiyle ezer.
 * (Alt görev panelinden "tam ekran aç" ve "görevi çoğalt" bu yolu kullanıyor.)
 */

const A = { id: 'aaaaaaaa-0000-0000-0000-000000000001', description: '<p>A görevinin açıklaması</p>' };
const B = { id: 'bbbbbbbb-0000-0000-0000-000000000002', description: '<p>B görevinin açıklaması</p>' };

const editorText = () =>
    document.querySelector('[aria-label="Görev açıklaması"]')?.textContent ?? null;

function wrap(task, descriptionValue) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return (
        <QueryClientProvider client={qc}>
            <TaskGeneralTabV3
                task={task}
                descriptionValue={descriptionValue}
                checklist={{ items: [], addItem: vi.fn() }}
            />
        </QueryClientProvider>
    );
}

beforeEach(() => {
    window.apya = {
        platform: { tasks: { task: { getComments: vi.fn(() => Promise.resolve([])) } } },
    };
    window.abp = { notify: { info: vi.fn(), error: vi.fn(), success: vi.fn() } };
});

describe('TaskGeneralTabV3 açıklama editörü', () => {
    it('görev değişince editör yeni görevin açıklamasını gösterir', async () => {
        const view = render(wrap(A, A.description));
        await waitFor(() => expect(editorText()).toBe('A görevinin açıklaması'));

        view.rerender(wrap(B, B.description));
        await waitFor(() => expect(editorText()).toBe('B görevinin açıklaması'));
    });
});

describe('TaskGeneralTabV3 yoruma dosya (UX-5)', () => {
    it('yorumdaki ek satırı dosyanın indirme bağlantısıdır', async () => {
        window.apya.platform.tasks.task.getComments = vi.fn(() => Promise.resolve([
            { id: 'c-1', authorName: 'Can Öztürk', text: 'Teklifi ekledim\n📎 teklif.pdf', creationTime: '2026-10-19T10:00:00' },
        ]));
        window.apya.platform.tasks.task.getAttachments = vi.fn(() => Promise.resolve([
            { id: 'f-1', fileName: 'teklif.pdf', downloadUrl: '/file/get/abc.pdf' },
        ]));
        render(wrap(A, A.description));

        const link = await screen.findByRole('link', { name: /teklif\.pdf/ });
        expect(link).toHaveAttribute('href', '/file/get/abc.pdf');
    });

    it('ataç dosyayı yükler ve yoruma ek satırını yazar', async () => {
        const fetchMock = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) }));
        vi.stubGlobal('fetch', fetchMock);
        try {
            render(wrap(A, A.description));
            await userEvent.upload(screen.getByLabelText('Dosya ekle'), new File(['x'], 'rapor.pdf', { type: 'application/pdf' }));

            await waitFor(() => expect(screen.getByPlaceholderText(/Bir yorum yazın/)).toHaveValue('📎 rapor.pdf'));
            expect(fetchMock.mock.calls[0][0]).toBe('/api/tasks/attachments/upload/' + A.id);
        } finally {
            vi.unstubAllGlobals();
        }
    });
});

describe('TaskGeneralTabV3 yanıtta bahsetme (B-17)', () => {
    it('yanıttaki @Ad Soyad kişi listesinden eşlenip kimliğiyle gider', async () => {
        const reply = vi.fn(() => Promise.resolve('r-1'));
        window.apya.platform.tasks.task.getComments = vi.fn(() => Promise.resolve([
            { id: 'c-1', authorName: 'Can Öztürk', text: 'İlk yorum', creationTime: '2026-10-19T10:00:00' },
        ]));
        window.apya.platform.tasks.task.getUsersLookup = vi.fn(() => Promise.resolve({ items: [
            { id: 'u-1', name: 'Ayşe', surname: 'Yılmaz', userName: 'ayse' },
            { id: 'u-2', name: 'Mehmet', surname: 'Kaya', userName: 'mehmet' },
        ] }));
        window.apya.platform.tasks.task.replyToComment = reply;
        render(wrap(A, A.description));

        await userEvent.click(await screen.findByRole('button', { name: /Yanıtla/ }));
        const box = await screen.findByPlaceholderText(/yanıt/i);
        await userEvent.type(box, '@Ayşe Yılmaz bakar mısın{enter}');

        await waitFor(() => expect(reply).toHaveBeenCalledWith('c-1', '@Ayşe Yılmaz bakar mısın', ['u-1']));
    });
});

describe('TaskGeneralTabV3 kişi bahsetme (P-09)', () => {
    const people = [
        { id: 'u-1', name: 'Ayşe', surname: 'Yılmaz', userName: 'ayse' },
        { id: 'u-2', name: 'Mehmet', surname: 'Kaya', userName: 'mehmet' },
    ];

    it('seçilen kişi metne girer ve gönderimde kimliğiyle gider', async () => {
        const addComment = vi.fn(() => Promise.resolve('c-1'));
        window.apya.platform.tasks.task.getUsersLookup = vi.fn(() => Promise.resolve({ items: people }));
        window.apya.platform.tasks.task.addComment = addComment;
        render(wrap(A, A.description));

        await userEvent.click(await screen.findByRole('button', { name: 'Kişi bahset' }));
        await userEvent.type(screen.getByLabelText('Kişi ara'), 'ayş');
        await userEvent.click(await screen.findByRole('button', { name: /Ayşe Yılmaz/ }));

        const box = screen.getByPlaceholderText(/Bir yorum yazın/);
        expect(box).toHaveValue('@Ayşe Yılmaz ');
        await userEvent.type(box, 'bakar mısın');
        await userEvent.click(screen.getByRole('button', { name: /Gönder/ }));

        await waitFor(() => expect(addComment).toHaveBeenCalledWith(A.id, '@Ayşe Yılmaz bakar mısın', ['u-1']));
    });

    it('metinden silinen bahsetme gönderilmez', async () => {
        const addComment = vi.fn(() => Promise.resolve('c-2'));
        window.apya.platform.tasks.task.getUsersLookup = vi.fn(() => Promise.resolve({ items: people }));
        window.apya.platform.tasks.task.addComment = addComment;
        render(wrap(A, A.description));

        await userEvent.click(await screen.findByRole('button', { name: 'Kişi bahset' }));
        await userEvent.click(await screen.findByRole('button', { name: /Mehmet Kaya/ }));
        const box = screen.getByPlaceholderText(/Bir yorum yazın/);
        await userEvent.clear(box);
        await userEvent.type(box, 'genel not');
        await userEvent.click(screen.getByRole('button', { name: /Gönder/ }));

        await waitFor(() => expect(addComment).toHaveBeenCalledWith(A.id, 'genel not', []));
    });
});

describe('TaskGeneralTabV3 kontrol listesi', () => {
    it('madde eklenemezse yazılan metin giriş alanına geri konur', async () => {
        const addItem = vi.fn(() => Promise.reject(new Error('Sunucu reddetti')));
        const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        render(
            <QueryClientProvider client={qc}>
                <TaskGeneralTabV3 task={A} descriptionValue={A.description} checklist={{ items: [], addItem }} />
            </QueryClientProvider>,
        );
        const input = await screen.findByPlaceholderText(/Yeni madde yaz/);

        await userEvent.type(input, 'QA-UX madde{Enter}');

        await waitFor(() => expect(addItem).toHaveBeenCalledWith('QA-UX madde'));
        await waitFor(() => expect(input).toHaveValue('QA-UX madde'));
    });
});
