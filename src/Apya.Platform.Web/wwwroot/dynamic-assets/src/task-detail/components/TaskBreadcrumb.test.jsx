import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskBreadcrumb } from './TaskBreadcrumb';

describe('TaskBreadcrumb', () => {
    it('trail bosken hicbir sey render etmez', () => {
        const { container } = render(<TaskBreadcrumb trail={[]} current={{ id: 'a', title: 'A' }} onNavigate={vi.fn()} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('trail + current gorevleri sirayla gosterir', () => {
        render(
            <TaskBreadcrumb
                trail={[{ id: 'root', title: 'Kök Görev' }]}
                current={{ id: 'sub-1', title: 'Alt Görev' }}
                onNavigate={vi.fn()}
            />,
        );
        expect(screen.getByText('Kök Görev')).toBeInTheDocument();
        expect(screen.getByText('Alt Görev')).toBeInTheDocument();
    });

    it('gecmisteki bir crumb a tiklayinca onNavigate o id ile cagirilir', () => {
        const onNavigate = vi.fn();
        render(
            <TaskBreadcrumb
                trail={[{ id: 'root', title: 'Kök Görev' }]}
                current={{ id: 'sub-1', title: 'Alt Görev' }}
                onNavigate={onNavigate}
            />,
        );
        fireEvent.click(screen.getByText('Kök Görev'));
        expect(onNavigate).toHaveBeenCalledWith('root');
    });

    it('mevcut (son) crumb tiklanabilir DEGILDIR', () => {
        render(
            <TaskBreadcrumb
                trail={[{ id: 'root', title: 'Kök Görev' }]}
                current={{ id: 'sub-1', title: 'Alt Görev' }}
                onNavigate={vi.fn()}
            />,
        );
        expect(screen.getByText('Alt Görev').tagName).not.toBe('BUTTON');
    });
});
