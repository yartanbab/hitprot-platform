import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SubtaskTableTabV3 } from './SubtaskTableTabV3';
import { SubtaskBoardTabV3 } from './SubtaskBoardTabV3';
import { TaskCalendarTabV3, isoDayKey } from './TaskCalendarTabV3';

function renderWithClient(ui) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

const task = {
    id: 't-1',
    title: 'Ana görev',
    status: 2,
    startDate: '2026-08-03T00:00:00Z',
    dueDate: '2026-08-28T00:00:00Z',
    subTasks: [
        { id: 's-1', code: 'GRV-2', title: 'Beta', status: 1, priority: 3, assigneeName: 'Ali Veli', dueDate: '2026-08-20T00:00:00Z', startDate: '2026-08-10T00:00:00Z' },
        { id: 's-2', code: 'GRV-3', title: 'Alfa', status: 4, priority: 1, assigneeName: null, dueDate: null, startDate: null },
        { id: 's-3', code: 'GRV-4', title: 'Gama', status: 2, priority: 2, assigneeName: 'Zeynep Ak', dueDate: '2026-08-05T00:00:00Z', startDate: null },
    ],
};

beforeEach(() => {
    window.apya = { platform: { tasks: { task: { updateStatus: vi.fn(() => Promise.resolve()) } } } };
});

describe('SubtaskTableTabV3', () => {
    const titlesInOrder = () => screen.getAllByRole('row')
        .slice(1) // başlık satırı
        .map((r) => within(r).getAllByRole('cell')[0].textContent);

    it('varsayilan olarak termine gore siralar, tarihsizi SONA atar', () => {
        renderWithClient(<SubtaskTableTabV3 task={task} />);
        const order = titlesInOrder();
        expect(order[0]).toContain('Gama');   // 05.08
        expect(order[1]).toContain('Beta');   // 20.08
        expect(order[2]).toContain('Alfa');   // tarihsiz → sonda
    });

    it('basliga tiklayinca alfabetik siralar, tekrar tiklayinca tersine cevirir', () => {
        renderWithClient(<SubtaskTableTabV3 task={task} />);
        fireEvent.click(screen.getByRole('button', { name: /Başlık/ }));
        expect(titlesInOrder()[0]).toContain('Alfa');
        fireEvent.click(screen.getByRole('button', { name: /Başlık/ }));
        expect(titlesInOrder()[0]).toContain('Gama');
    });

    it('tarihsiz satir ters siralamada da SONDA kalir', () => {
        renderWithClient(<SubtaskTableTabV3 task={task} />);
        fireEvent.click(screen.getByRole('button', { name: /Termin/ }));  // desc
        expect(titlesInOrder()[2]).toContain('Alfa');
    });

    it('satira tiklayinca alt gorev panelini acar', () => {
        const onOpen = vi.fn();
        renderWithClient(<SubtaskTableTabV3 task={task} onOpenSubtask={onOpen} />);
        fireEvent.click(screen.getByText('Beta').closest('tr'));
        expect(onOpen).toHaveBeenCalledWith('s-1');
    });

    it('alt gorev yoksa bos durum gosterir', () => {
        renderWithClient(<SubtaskTableTabV3 task={{ ...task, subTasks: [] }} />);
        expect(screen.getByText('Alt görev yok')).toBeInTheDocument();
    });
});

describe('SubtaskBoardTabV3', () => {
    it('alt gorevleri duruma gore sutunlara dagitir', () => {
        renderWithClient(<SubtaskBoardTabV3 taskId="t-1" task={task} />);
        expect(within(screen.getByLabelText('Yapılacak sütunu')).getByText('Beta')).toBeInTheDocument();
        expect(within(screen.getByLabelText('Sürüyor sütunu')).getByText('Gama')).toBeInTheDocument();
        expect(within(screen.getByLabelText('Tamamlandı sütunu')).getByText('Alfa')).toBeInTheDocument();
    });

    it('baska sutuna birakinca updateStatus cagirir (DB ye yazar)', async () => {
        renderWithClient(<SubtaskBoardTabV3 taskId="t-1" task={task} />);
        fireEvent.drop(screen.getByLabelText('Tamamlandı sütunu'), {
            dataTransfer: { getData: () => 's-1' },
        });
        await waitFor(() => expect(window.apya.platform.tasks.task.updateStatus)
            .toHaveBeenCalledWith('s-1', 4));
    });

    it('ayni sutuna birakinca gereksiz istek ATMAZ', async () => {
        renderWithClient(<SubtaskBoardTabV3 taskId="t-1" task={task} />);
        fireEvent.drop(screen.getByLabelText('Yapılacak sütunu'), {
            dataTransfer: { getData: () => 's-1' },
        });
        await waitFor(() => expect(window.apya.platform.tasks.task.updateStatus).not.toHaveBeenCalled());
    });

    it('dokunmatik yedegi: secim kutusu da durumu yazar', async () => {
        renderWithClient(<SubtaskBoardTabV3 taskId="t-1" task={task} />);
        fireEvent.change(screen.getByLabelText('Beta durumunu değiştir'), { target: { value: '2' } });
        await waitFor(() => expect(window.apya.platform.tasks.task.updateStatus)
            .toHaveBeenCalledWith('s-1', 2));
    });
});

describe('TaskCalendarTabV3', () => {
    it('gun anahtarini ISO metninden keser — TZ kaydirmaz', () => {
        // TZ+03'te new Date('2026-08-20T00:00:00Z') yerel 03:00'tir; saat dilimi
        // negatif olsaydi bir onceki gune duserdi. Metinden kesmek bunu tamamen eler.
        expect(isoDayKey('2026-08-20T00:00:00Z')).toBe('2026-08-20');
        expect(isoDayKey('2026-08-20')).toBe('2026-08-20');
        expect(isoDayKey(null)).toBeNull();
    });

    it('gorevin baslangic ayini acar ve olaylari basar', () => {
        renderWithClient(<TaskCalendarTabV3 task={task} />);
        expect(screen.getByText('Ağustos 2026')).toBeInTheDocument();
        expect(screen.getAllByTitle(/Ana görev — başlangıç/).length).toBe(1);
        expect(screen.getAllByTitle(/Beta — termin/).length).toBe(1);
    });

    it('alt gorev olayina tiklayinca paneli acar, ana goreve tiklayinca ACMAZ', () => {
        const onOpen = vi.fn();
        renderWithClient(<TaskCalendarTabV3 task={task} onOpenSubtask={onOpen} />);
        fireEvent.click(screen.getByTitle('Beta — termin'));
        expect(onOpen).toHaveBeenCalledWith('s-1');

        onOpen.mockClear();
        fireEvent.click(screen.getByTitle('Ana görev — termin'));
        expect(onOpen).not.toHaveBeenCalled();
    });

    it('ay ileri/geri gider', () => {
        renderWithClient(<TaskCalendarTabV3 task={task} />);
        fireEvent.click(screen.getByLabelText('Sonraki ay'));
        expect(screen.getByText('Eylül 2026')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('Önceki ay'));
        fireEvent.click(screen.getByLabelText('Önceki ay'));
        expect(screen.getByText('Temmuz 2026')).toBeInTheDocument();
    });

    it('yil siniri: aralik ustune bir ay eklenince ocak/sonraki yil', () => {
        renderWithClient(<TaskCalendarTabV3 task={{ ...task, startDate: '2026-12-10T00:00:00Z', dueDate: null, subTasks: [] }} />);
        expect(screen.getByText('Aralık 2026')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('Sonraki ay'));
        expect(screen.getByText('Ocak 2027')).toBeInTheDocument();
    });

    it('hic tarih yoksa bos durum gosterir', () => {
        renderWithClient(<TaskCalendarTabV3 task={{ id: 't-1', title: 'x', subTasks: [] }} />);
        expect(screen.getByText('Takvimde gösterilecek tarih yok')).toBeInTheDocument();
    });
});
