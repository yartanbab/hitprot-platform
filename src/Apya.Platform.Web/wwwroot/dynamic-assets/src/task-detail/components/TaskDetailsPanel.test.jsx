import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskDetailsPanel } from './TaskDetailsPanel';

const TASK = {
    creationTime: '2026-06-25T14:30:00Z',
    lastModificationTime: '2026-06-26T16:20:00Z',
    projectName: 'Otel Projesi',
};

describe('TaskDetailsPanel', () => {
    it('oluşturan/güncelleyen isimlerini gösterir', () => {
        render(<TaskDetailsPanel task={TASK} creatorName="Yakup B." lastModifierName="Elif A." />);
        expect(screen.getByText('Yakup B.')).toBeInTheDocument();
        expect(screen.getByText('Elif A.')).toBeInTheDocument();
    });

    it('proje adını gösterir', () => {
        render(<TaskDetailsPanel task={TASK} creatorName="Yakup B." lastModifierName="Elif A." />);
        expect(screen.getByText('Otel Projesi')).toBeInTheDocument();
    });

    it('isim çözümlenemezse tire gösterir', () => {
        render(<TaskDetailsPanel task={TASK} creatorName={undefined} lastModifierName={undefined} />);
        const dashes = screen.getAllByText('—');
        expect(dashes.length).toBeGreaterThan(0);
    });

    it('proje yoksa tire gösterir', () => {
        render(<TaskDetailsPanel task={{ ...TASK, projectName: null }} creatorName="Y" lastModifierName="E" />);
        expect(screen.getByText('Proje').nextSibling).toHaveTextContent('—');
    });
});
