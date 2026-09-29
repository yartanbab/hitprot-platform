import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from './EmptyState';

/**
 * EmptyState sözleşmesi — G3 (hata sınırı eşlik testi) ve G6 (locked) buna bağlı.
 *
 * 1) Varsayılan varyant BUGÜNKÜ çıktısını korur (30+ kullanım variant geçmiyor).
 * 2) error: role=alert, fa-triangle-exclamation, açıklama G1 hata kanalından
 *    (errorMessage) ya da Common:FetchError; kanal null (merkezi oturum penceresi)
 *    dönerse açıklama basılmaz; onRetry argümansız çağrılır; açık action onu ezer.
 * 3) locked: fa-lock, role=status, varsayılan açıklama/eylem yok.
 */

afterEach(() => {
    delete window.apya;
});

describe('EmptyState · varsayılan (mevcut kullanımların kilidi)', () => {
    it('role=status + aria-live=polite; ikon verilmezse halka çizilmez', () => {
        const { container } = render(<EmptyState title="Kayıt yok" description="Açıklama" action={<a href="/x">Git</a>} />);

        const root = container.firstChild;
        expect(root).toHaveAttribute('role', 'status');
        expect(root).toHaveAttribute('aria-live', 'polite');
        expect(root.className).toBe('flex flex-col items-center justify-center text-center gap-3 py-6');
        expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
        expect(screen.getByText('Kayıt yok')).toBeInTheDocument();
        expect(screen.getByText('Açıklama')).toHaveClass('max-w-sm', 'text-text-tertiary', 'text-sm');
        expect(screen.getByRole('link', { name: 'Git' }).parentElement).toHaveClass('mt-1');
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('verilen ikon eski halkayla çizilir; compact sınıfları korunur', () => {
        const { container } = render(<EmptyState compact icon={<i className="fa fa-inbox" />} title="Boş" />);

        expect(container.firstChild).toHaveClass('gap-2', 'py-3');
        const ring = container.querySelector('[aria-hidden="true"]');
        expect(ring).toHaveClass('rounded-full', 'bg-neutral-100', 'text-neutral-500', 'h-8', 'w-8');
        expect(ring.querySelector('.fa-inbox')).not.toBeNull();
        expect(screen.getByText('Boş')).toHaveClass('text-sm');
    });

    it('bilinmeyen variant default\'a düşer', () => {
        const { container } = render(<EmptyState variant="yok-boyle" icon={<i className="fa fa-x" />} title="T" />);
        expect(container.firstChild).toHaveAttribute('role', 'status');
        expect(container.querySelector('[aria-hidden="true"]')).toHaveClass('bg-neutral-100');
    });
});

describe('EmptyState · error', () => {
    it('role=alert (aria-live yok), varsayılan ikon ve sessiz halka, Common:FetchError açıklaması', () => {
        const { container } = render(<EmptyState variant="error" title="Liste yüklenemedi" />);

        const root = container.firstChild;
        expect(root).toHaveAttribute('role', 'alert');
        expect(root).not.toHaveAttribute('aria-live');
        const ring = container.querySelector('[aria-hidden="true"]');
        expect(ring).toHaveClass('bg-surface-sunken', 'text-text-secondary', 'h-12', 'w-12');
        expect(ring.querySelector('i')).toHaveClass('fa', 'fa-triangle-exclamation');
        expect(screen.getByText('Liste yüklenemedi')).toBeInTheDocument();
        expect(screen.getByText('Veri alınırken bir hata oluştu.')).toHaveClass('text-text-secondary');
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('açıklama hata nesnesinden, G1 hata kanalıyla üretilir', () => {
        const message = vi.fn((err, fallback) => err.detail || fallback);
        window.apya = { ajaxErrors: { message } };

        render(<EmptyState variant="error" title="T" error={{ detail: 'Sunucuya ulaşılamadı.' }} />);

        expect(screen.getByText('Sunucuya ulaşılamadı.')).toBeInTheDocument();
        expect(message).toHaveBeenCalledWith({ detail: 'Sunucuya ulaşılamadı.' }, 'Veri alınırken bir hata oluştu.');
    });

    it('kanal null dönerse (merkezi oturum penceresi açık) açıklama basılmaz, başlık ve düğme kalır', () => {
        window.apya = { ajaxErrors: { message: () => null } };

        const { container } = render(
            <EmptyState variant="error" title="Liste yüklenemedi" error={{ apyaCentral: true }} onRetry={() => {}} />,
        );

        expect(container.querySelectorAll('p')).toHaveLength(1);
        expect(screen.getByText('Liste yüklenemedi')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Tekrar dene' })).toBeInTheDocument();
    });

    it('description={null} açıklamayı bastırır; açık description kanalı ezer', () => {
        const { container, rerender } = render(<EmptyState variant="error" title="T" description={null} />);
        expect(container.querySelectorAll('p')).toHaveLength(1);

        rerender(<EmptyState variant="error" title="T" description="Özel metin" error={new Error('x')} />);
        expect(screen.getByText('Özel metin')).toBeInTheDocument();
        expect(screen.queryByText('x')).toBeNull();
    });

    it('onRetry → outline "Tekrar dene"; tıklamada ARGÜMANSIZ çağrılır', () => {
        const onRetry = vi.fn();
        render(<EmptyState variant="error" title="T" onRetry={onRetry} />);

        const button = screen.getByRole('button', { name: 'Tekrar dene' });
        expect(button).toHaveAttribute('type', 'button');
        expect(button.querySelector('.fa-rotate-right')).not.toBeNull();
        expect(button.parentElement).toHaveClass('mt-1');
        fireEvent.click(button);
        expect(onRetry).toHaveBeenCalledTimes(1);
        expect(onRetry).toHaveBeenCalledWith();
    });

    it('açık action onRetry düğmesini ezer', () => {
        render(<EmptyState variant="error" title="T" onRetry={() => {}} action={<button type="button">Sayfayı yenile</button>} />);

        expect(screen.getByRole('button', { name: 'Sayfayı yenile' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Tekrar dene' })).toBeNull();
    });

    it('compact: küçük halka ve metin', () => {
        const { container } = render(<EmptyState compact variant="error" title="T" />);
        expect(container.firstChild).toHaveClass('gap-2', 'py-3');
        expect(container.querySelector('[aria-hidden="true"]')).toHaveClass('h-8', 'w-8');
        expect(screen.getByText('Veri alınırken bir hata oluştu.')).toHaveClass('text-xs');
    });
});

describe('EmptyState · locked (G6)', () => {
    it('fa-lock, role=status, varsayılan açıklama ve düğme YOK', () => {
        const { container } = render(<EmptyState variant="locked" title="Bu bölümü görme yetkiniz yok" />);

        const root = container.firstChild;
        expect(root).toHaveAttribute('role', 'status');
        expect(root).toHaveAttribute('aria-live', 'polite');
        const ring = container.querySelector('[aria-hidden="true"]');
        expect(ring).toHaveClass('bg-surface-sunken', 'text-text-secondary');
        expect(ring.querySelector('i')).toHaveClass('fa', 'fa-lock');
        expect(container.querySelectorAll('p')).toHaveLength(1);
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('açıklama ve eylem çağırandan gelir', () => {
        render(
            <EmptyState
                variant="locked"
                title="Bu bölümü görme yetkiniz yok"
                description="Gelirler izni gerekir; yöneticiniz verebilir."
                action={<a href="/x">Yöneticiye yaz</a>}
            />,
        );
        expect(screen.getByText('Gelirler izni gerekir; yöneticiniz verebilir.')).toHaveClass('text-text-secondary');
        expect(screen.getByRole('link', { name: 'Yöneticiye yaz' })).toBeInTheDocument();
    });
});
