import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RichTextEditorV3 } from './RichTextEditorV3';

describe('RichTextEditorV3 adı ve yer tutucusu (QA-42/43)', () => {
    it('belge editörü kendi adıyla okunur', () => {
        render(<RichTextEditorV3 value="" ariaLabel="Belge içeriği" />);
        expect(screen.getByRole('textbox', { name: 'Belge içeriği' })).toBeInTheDocument();
    });

    it('açıklama yer tutucusu çalışmayan @kişi/#etiket vaat etmez', () => {
        render(<RichTextEditorV3 value="" />);
        const box = screen.getByRole('textbox', { name: 'Görev açıklaması' });
        expect(box.getAttribute('data-ph')).toBe('Bu görevin detayları nelerdir?');
    });
});
