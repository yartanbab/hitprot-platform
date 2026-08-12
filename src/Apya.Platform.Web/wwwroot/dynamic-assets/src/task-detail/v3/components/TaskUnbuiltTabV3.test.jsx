import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskUnbuiltTabV3 } from './TaskUnbuiltTabV3';

/**
 * Faz 10-B'de backend'i olmayan sekmeler bu bilesene yonlendirildi. Testler
 * "bos pano gosterme, ne oldugunu soyle ve iki cikis yolu sun" kuralini korur.
 */
describe('TaskUnbuiltTabV3', () => {
    it('ozelligin basligini ve aciklamasini gosterir', () => {
        render(<TaskUnbuiltTabV3 code="approvals" />);
        expect(screen.getByText('Onaylar')).toBeInTheDocument();
        expect(screen.getByText(/onay akışları/i)).toBeInTheDocument();
    });

    it('yapim asamasinda uyarisini gosterir', () => {
        render(<TaskUnbuiltTabV3 code="ai" />);
        expect(screen.getByText(/yapım aşamasında/i)).toBeInTheDocument();
    });

    it('kaldir dugmesi onRemoveFeature i kendi koduyla cagirir', () => {
        const onRemoveFeature = vi.fn();
        render(<TaskUnbuiltTabV3 code="automations" onRemoveFeature={onRemoveFeature} />);
        fireEvent.click(screen.getByRole('button', { name: /bu özelliği kaldır/i }));
        expect(onRemoveFeature).toHaveBeenCalledWith('automations');
    });

    it('baska ozellik ekle dugmesi picker i acar', () => {
        const onOpenPicker = vi.fn();
        render(<TaskUnbuiltTabV3 code="approvals" onOpenPicker={onOpenPicker} />);
        fireEvent.click(screen.getByRole('button', { name: /başka özellik ekle/i }));
        expect(onOpenPicker).toHaveBeenCalledTimes(1);
    });

    /** Core sekme kaldirilamaz — kaldir dugmesi hic basilmamali. */
    it('canRemove false iken kaldir dugmesi gosterilmez', () => {
        render(<TaskUnbuiltTabV3 code="approvals" canRemove={false} />);
        expect(screen.queryByRole('button', { name: /bu özelliği kaldır/i })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /başka özellik ekle/i })).toBeInTheDocument();
    });

    it('handler verilmese de tiklama cokmez', () => {
        render(<TaskUnbuiltTabV3 code="approvals" />);
        expect(() => {
            fireEvent.click(screen.getByRole('button', { name: /bu özelliği kaldır/i }));
            fireEvent.click(screen.getByRole('button', { name: /başka özellik ekle/i }));
        }).not.toThrow();
    });

    it('katalogda olmayan kod icin de coker degil, kodu baslik olarak gosterir', () => {
        render(<TaskUnbuiltTabV3 code="boyle-bir-kod-yok" />);
        expect(screen.getByText('boyle-bir-kod-yok')).toBeInTheDocument();
    });
});
