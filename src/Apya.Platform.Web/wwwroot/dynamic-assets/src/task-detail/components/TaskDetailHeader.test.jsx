import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskDetailHeader } from './TaskDetailHeader';
import { TaskDetailFooter } from './TaskDetailFooter';
import { AccessBadge } from './AccessBadge';

const task = { id: 'x', title: 'Otel Konaklama Anlaşması', status: 4, priority: 4, isPrivate: true };

describe('TaskDetailHeader', () => {
    it('gorev basligini gosterir', () => {
        render(<TaskDetailHeader task={task} canDelete onClose={() => {}} onDelete={() => {}} onToggleFullscreen={() => {}} />);
        expect(screen.getByText('Otel Konaklama Anlaşması')).toBeInTheDocument();
    });

    it('gizli gorevde kirmizi "Gizli" degil, notr "Sinirli erisim" gosterir', () => {
        render(<TaskDetailHeader task={task} canDelete onClose={() => {}} onDelete={() => {}} onToggleFullscreen={() => {}} />);
        expect(screen.getByText('Sınırlı erişim')).toBeInTheDocument();
        expect(screen.queryByText('Gizli')).not.toBeInTheDocument();
    });

    it('Sil butonu sekmelerde degil, ucnokta menusunde', async () => {
        render(<TaskDetailHeader task={task} canDelete onClose={() => {}} onDelete={() => {}} onToggleFullscreen={() => {}} />);
        // Before menu opens: Sil must not exist anywhere (role-agnostic catch for plain button regression)
        expect(screen.queryByText('Sil')).not.toBeInTheDocument();
        expect(screen.queryByRole('menuitem', { name: /Sil/ })).not.toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Görev işlemleri' }));
        // After menu opens: Sil must be present and in the menu
        expect(screen.getByRole('menuitem', { name: /Sil/ })).toBeInTheDocument();
        expect(screen.getByText('Sil')).toBeInTheDocument();
    });

    it('silme yetkisi yoksa Sil menude gorunmez', async () => {
        render(<TaskDetailHeader task={task} canDelete={false} onClose={() => {}} onDelete={() => {}} onToggleFullscreen={() => {}} />);
        await userEvent.click(screen.getByRole('button', { name: 'Görev işlemleri' }));
        // Sil must not exist anywhere, even if someone moved it back to plain button (role-agnostic)
        expect(screen.queryByText('Sil')).not.toBeInTheDocument();
        expect(screen.queryByRole('menuitem', { name: /Sil/ })).not.toBeInTheDocument();
    });

    it('kapat butonu onClose cagirir', async () => {
        const onClose = vi.fn();
        render(<TaskDetailHeader task={task} canDelete onClose={onClose} onDelete={() => {}} onToggleFullscreen={() => {}} />);
        await userEvent.click(screen.getByRole('button', { name: 'Kapat' }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});

describe('TaskDetailFooter', () => {
    it('degisiklik yokken Kaydet devre disi', () => {
        render(<TaskDetailFooter isDirty={false} isSaving={false} onCancel={() => {}} onSave={() => {}} />);
        expect(screen.getByRole('button', { name: 'Kaydet' })).toBeDisabled();
    });

    it('degisiklik varken Kaydet aktif', () => {
        render(<TaskDetailFooter isDirty isSaving={false} onCancel={() => {}} onSave={() => {}} />);
        expect(screen.getByRole('button', { name: 'Kaydet' })).toBeEnabled();
    });

    it('kaydederken buton devre disi ve durum metni gosterir (cift tiklama korumasi)', () => {
        render(<TaskDetailFooter isDirty isSaving onCancel={() => {}} onSave={() => {}} />);
        expect(screen.getByRole('button', { name: 'Kaydediliyor…' })).toBeDisabled();
    });
});

describe('AccessBadge', () => {
    it('gizli gorevde sinirli erisim göstergesi ve kilit ikonu goruntulenir', () => {
        render(<AccessBadge isPrivate />);
        expect(screen.getByText('Sınırlı erişim')).toBeInTheDocument();
        expect(document.querySelector('.fa-lock')).toBeInTheDocument();
    });

    it('herkese acik gorevde hicbir sey goruntulenmez', () => {
        const { container } = render(<AccessBadge isPrivate={false} />);
        expect(container.firstChild).toBeNull();
        expect(screen.queryByText('Sınırlı erişim')).not.toBeInTheDocument();
    });
});
