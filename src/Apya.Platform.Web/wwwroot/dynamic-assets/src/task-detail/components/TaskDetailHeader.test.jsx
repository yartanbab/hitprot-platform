import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskDetailHeader } from './TaskDetailHeader';
import { TaskDetailFooter } from './TaskDetailFooter';

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
        expect(screen.queryByRole('menuitem', { name: /Sil/ })).not.toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Görev işlemleri' }));
        expect(screen.getByRole('menuitem', { name: /Sil/ })).toBeInTheDocument();
    });

    it('silme yetkisi yoksa Sil menude gorunmez', async () => {
        render(<TaskDetailHeader task={task} canDelete={false} onClose={() => {}} onDelete={() => {}} onToggleFullscreen={() => {}} />);
        await userEvent.click(screen.getByRole('button', { name: 'Görev işlemleri' }));
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
