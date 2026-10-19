import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskSidePanelV3 } from './TaskSidePanelV3';

// B-15 · Görevi izleyenler Detaylar kartında görünür (bildirimleri kimin aldığı).
describe('TaskSidePanelV3 · izleyenler', () => {
    it('izleyenlerin adlarını gösterir', () => {
        render(<TaskSidePanelV3 task={{ watcherNames: ['Can Öztürk', 'Elif Şahin'] }} />);
        expect(screen.getByText('İzleyenler')).toBeInTheDocument();
        expect(screen.getByText('Can Öztürk, Elif Şahin')).toBeInTheDocument();
    });

    it('izleyen yoksa bunu açıkça söyler', () => {
        render(<TaskSidePanelV3 task={{}} />);
        expect(screen.getByText('Kimse izlemiyor')).toBeInTheDocument();
    });
});
