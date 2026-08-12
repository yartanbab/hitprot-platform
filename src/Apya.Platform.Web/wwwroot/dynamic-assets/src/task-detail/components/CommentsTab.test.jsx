import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CommentsTab } from './CommentsTab';

const queryClient = new QueryClient();

describe('CommentsTab', () => {
    it('yorum bulunmadiginda bos durum mesajini gosterir', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <CommentsTab taskId="t1" task={{ comments: [] }} />
            </QueryClientProvider>,
        );

        expect(screen.getByText('Henüz yorum yapılmamış. İlk yorumu siz yazın!')).toBeInTheDocument();
    });

    it('mevcut yorumlari liste olarak render eder', () => {
        const task = {
            comments: [
                { id: 'c1', creatorName: 'Ahmet Yılmaz', text: 'Analiz dokümanı tamamlandı.' },
            ],
        };

        render(
            <QueryClientProvider client={queryClient}>
                <CommentsTab taskId="t1" task={task} />
            </QueryClientProvider>,
        );

        expect(screen.getByText('Ahmet Yılmaz')).toBeInTheDocument();
        expect(screen.getByText('Analiz dokümanı tamamlandı.')).toBeInTheDocument();
    });
});
