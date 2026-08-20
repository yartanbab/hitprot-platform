import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
    it('varsayilan olarak <button> render eder', () => {
        render(<Button>Kaydet</Button>);
        const el = screen.getByRole('button', { name: 'Kaydet' });
        expect(el.tagName).toBe('BUTTON');
    });

    /* Regresyon: asChild'da icerik <span> ile sarilirsa Radix Slot "tek element
       cocuk" bekledigi icin patlar ve tum adayi dusurur. Faz A'daki "Kapsami
       raporla" baglantisi bu yuzden Proje kapsami ekranini beyaz birakiyordu. */
    it('asChild ile cocuk elementi kok yapar ve patlamaz', () => {
        render(
            <Button asChild>
                <a href="/Documents/ReportBuilder">Kapsami raporla</a>
            </Button>,
        );
        const el = screen.getByRole('link', { name: 'Kapsami raporla' });
        expect(el.tagName).toBe('A');
        expect(el).toHaveClass('inline-flex');
    });

    it('asChild + leadingIcon ikonu cocugun icine enjekte eder', () => {
        render(
            <Button asChild leadingIcon={<i data-testid="ikon" />}>
                <a href="/Projects">Projelere git</a>
            </Button>,
        );
        const el = screen.getByRole('link', { name: 'Projelere git' });
        expect(el.querySelector('[data-testid="ikon"]')).not.toBeNull();
    });

    it('yuklenirken devre disi kalir ve aria-busy tasir', () => {
        render(<Button isLoading loadingText="Yukleniyor">Kaydet</Button>);
        const el = screen.getByRole('button');
        expect(el).toBeDisabled();
        expect(el).toHaveAttribute('aria-busy', 'true');
        expect(el).toHaveTextContent('Yukleniyor');
    });
});
