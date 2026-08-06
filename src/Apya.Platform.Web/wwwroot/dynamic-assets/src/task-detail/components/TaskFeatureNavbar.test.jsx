import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskFeatureNavbar } from './TaskFeatureNavbar';

const TABS = [
    { code: 'general', title: 'Genel', icon: 'fa-circle-info' },
    { code: 'checklist', title: 'Kontrol Listesi', icon: 'fa-square-check' },
];

describe('TaskFeatureNavbar', () => {
    it('sekmeleri gosterir, aktif olan aria-selected=true tasir', () => {
        render(<TaskFeatureNavbar tabs={TABS} activeCode="general" onSelect={() => {}} onOpenPicker={() => {}} pickerOpen={false} />);
        expect(screen.getByRole('tab', { name: /Genel/ })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tab', { name: /Kontrol Listesi/ })).toHaveAttribute('aria-selected', 'false');
    });

    it('tiklama onSelect cagirir', async () => {
        const onSelect = vi.fn();
        render(<TaskFeatureNavbar tabs={TABS} activeCode="general" onSelect={onSelect} onOpenPicker={() => {}} pickerOpen={false} />);
        await userEvent.click(screen.getByRole('tab', { name: /Kontrol Listesi/ }));
        expect(onSelect).toHaveBeenCalledWith('checklist');
    });

    it('yalniz aktif sekme tabIndex=0 tasir (roving tabindex)', () => {
        render(<TaskFeatureNavbar tabs={TABS} activeCode="checklist" onSelect={() => {}} onOpenPicker={() => {}} pickerOpen={false} />);
        expect(screen.getByRole('tab', { name: /Genel/ })).toHaveAttribute('tabindex', '-1');
        expect(screen.getByRole('tab', { name: /Kontrol Listesi/ })).toHaveAttribute('tabindex', '0');
    });

    it('sag ok sonraki sekmeye gecer (basa sarar)', async () => {
        const onSelect = vi.fn();
        render(<TaskFeatureNavbar tabs={TABS} activeCode="checklist" onSelect={onSelect} onOpenPicker={() => {}} pickerOpen={false} />);
        screen.getByRole('tab', { name: /Kontrol Listesi/ }).focus();
        await userEvent.keyboard('{ArrowRight}');
        expect(onSelect).toHaveBeenCalledWith('general');
    });

    it('sol ok onceki sekmeye gecer (basa sarar)', async () => {
        const onSelect = vi.fn();
        render(<TaskFeatureNavbar tabs={TABS} activeCode="general" onSelect={onSelect} onOpenPicker={() => {}} pickerOpen={false} />);
        screen.getByRole('tab', { name: /Genel/ }).focus();
        await userEvent.keyboard('{ArrowLeft}');
        expect(onSelect).toHaveBeenCalledWith('checklist');
    });

    it('Ozellik ekle butonu onOpenPicker cagirir', async () => {
        const onOpenPicker = vi.fn();
        render(<TaskFeatureNavbar tabs={TABS} activeCode="general" onSelect={() => {}} onOpenPicker={onOpenPicker} pickerOpen={false} />);
        await userEvent.click(screen.getByRole('button', { name: 'Özellik ekle' }));
        expect(onOpenPicker).toHaveBeenCalledTimes(1);
    });
});
