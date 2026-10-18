import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseFormSheet } from './ExpenseFormSheet';
import { CameraCapture } from './CameraCapture';
import { ToastProvider } from '../../lib/feedback';

/*
 * F-01 · Masraf Yakala'nın "okuma"sı sahteydi: tutar dosya boyutundan, tedarikçi hazır bir
 * listeden geliyor, ekran "AI otomatik okur" diyor ve alanlarda güven rozeti gösteriyordu.
 * Kullanıcı uydurma değeri kaydedebiliyordu. Gerçek okuma ucu gelene dek form BOŞ açılır,
 * fotoğraf formda görünür; sunucuya hiç gitmeyen KDV alanı da yoktur.
 */
const context = { projects: [], accounts: [{ id: 'k1', name: 'Merkez kasa', currency: 'TRY' }] };

function renderForm(props = {}) {
    return render(
        <ExpenseFormSheet
            open
            onOpenChange={() => {}}
            onSubmit={vi.fn()}
            isSubmitting={false}
            context={context}
            onProjectChange={() => {}}
            isOffline={false}
            {...props}
        />,
    );
}

describe('ExpenseFormSheet — sahte okuma yok', () => {
    it('form boş açılır ve yapay zekâ okuması vaat etmez', () => {
        renderForm({ previewUrl: 'blob:fis-1' });

        const dialog = screen.getByRole('dialog', { name: 'Masraf detayları' });
        expect(dialog).toHaveAccessibleDescription('Fişteki bilgileri girin ve gönderin');
        expect(dialog.textContent).not.toMatch(/\bAI\b|güven/i);
        expect(screen.getByPlaceholderText('örn. Migros A.Ş.')).toHaveValue('');
    });

    it('çekilen fotoğrafı formun üstünde gösterir; fotoğraf yoksa görsel basılmaz', () => {
        const { unmount } = renderForm({ previewUrl: 'blob:fis-1' });
        expect(screen.getByRole('img', { name: 'Çekilen fiş fotoğrafı' })).toHaveAttribute('src', 'blob:fis-1');
        unmount();

        renderForm({ previewUrl: null });
        expect(screen.queryByRole('img', { name: 'Çekilen fiş fotoğrafı' })).toBeNull();
    });

    it('sunucuya gitmeyen KDV alanı yoktur', async () => {
        renderForm({ previewUrl: 'blob:fis-1' });

        await userEvent.click(screen.getByRole('button', { name: 'Daha fazla alan' }));

        expect(screen.queryByText(/KDV/)).toBeNull();
        expect(screen.getByText('Not')).toBeInTheDocument();
    });
});

describe('CameraCapture — vaat', () => {
    it('otomatik okuma vaat etmez, kullanıcıya fotoğrafa bakarak girmesini söyler', () => {
        render(<ToastProvider><CameraCapture onFile={vi.fn()} /></ToastProvider>);

        expect(document.body.textContent).not.toMatch(/\bAI\b|otomatik okur/);
        expect(screen.getByText(/ona bakarak girersin/)).toBeInTheDocument();
    });
});
