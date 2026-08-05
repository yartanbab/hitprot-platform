import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskGeneralForm } from './TaskGeneralForm';

const VALUES = {
    title: 'Otel Konaklama Anlaşması',
    description: 'Detaylar',
    startDate: '2026-06-25',
    dueDate: '2026-07-10',
    status: 4,
    priority: 4,
    assigneeId: 'u1',
    tagNames: ['Konaklama', 'Anlaşma'],
};

const ASSIGNEE_OPTIONS = [
    { value: 'u1', label: 'Yakup Babaoğlu' },
    { value: 'u2', label: 'Elif A.' },
];

function TaskGeneralFormWrapper({ onFieldChange: onFieldChangeExternal, ...props }) {
    const [values, setValues] = React.useState(props.values);
    const onFieldChange = React.useCallback((name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
        onFieldChangeExternal(name, value);
    }, [onFieldChangeExternal]);
    return <TaskGeneralForm {...props} values={values} onFieldChange={onFieldChange} />;
}

function setup(overrides = {}) {
    const onFieldChange = vi.fn();
    render(
        <TaskGeneralFormWrapper
            values={VALUES}
            errors={{}}
            onFieldChange={onFieldChange}
            assigneeOptions={ASSIGNEE_OPTIONS}
            isLoadingAssignees={false}
            {...overrides}
        />,
    );
    return { onFieldChange };
}

describe('TaskGeneralForm', () => {
    it('mevcut değerleri render eder', () => {
        setup();
        expect(screen.getByLabelText('Başlık')).toHaveValue('Otel Konaklama Anlaşması');
        expect(screen.getByLabelText('Açıklama')).toHaveValue('Detaylar');
        expect(screen.getByLabelText('Başlangıç Tarihi')).toHaveValue('2026-06-25');
        expect(screen.getByLabelText('Son Tarih')).toHaveValue('2026-07-10');
    });

    it('başlık değişince onFieldChange(title, ...) çağrılır', async () => {
        const { onFieldChange } = setup();
        const input = screen.getByLabelText('Başlık');
        await userEvent.clear(input);
        await userEvent.type(input, 'X');
        expect(onFieldChange).toHaveBeenCalledWith('title', 'X');
    });

    it('durum select değişince onFieldChange(status, sayı) çağrılır', async () => {
        const { onFieldChange } = setup();
        await userEvent.selectOptions(screen.getByLabelText('Durum'), '2');
        expect(onFieldChange).toHaveBeenCalledWith('status', 2);
    });

    it('öncelik select değişince onFieldChange(priority, sayı) çağrılır', async () => {
        const { onFieldChange } = setup();
        await userEvent.selectOptions(screen.getByLabelText('Öncelik'), '1');
        expect(onFieldChange).toHaveBeenCalledWith('priority', 1);
    });

    it('mevcut etiketler chip olarak görünür', () => {
        setup();
        expect(screen.getByText('Konaklama')).toBeInTheDocument();
        expect(screen.getByText('Anlaşma')).toBeInTheDocument();
    });

    it('yeni etiket yazip Enter\'a basinca onFieldChange(tagNames, [...+yeni]) çağrılır', async () => {
        const { onFieldChange } = setup();
        const tagInput = screen.getByPlaceholderText('Etiket yazıp Enter\'a basın');
        await userEvent.type(tagInput, 'Yeni{Enter}');
        expect(onFieldChange).toHaveBeenCalledWith('tagNames', ['Konaklama', 'Anlaşma', 'Yeni']);
    });

    it('etiket chip\'indeki kaldır butonuna basınca o etiket olmadan liste döner', async () => {
        const { onFieldChange } = setup();
        await userEvent.click(screen.getByLabelText('Konaklama etiketini kaldır'));
        expect(onFieldChange).toHaveBeenCalledWith('tagNames', ['Anlaşma']);
    });

    it('başlık hatası verilirse alan altında gösterilir', () => {
        setup({ errors: { title: 'Başlık zorunlu.' } });
        expect(screen.getByText('Başlık zorunlu.')).toBeInTheDocument();
    });

    it('atanan listesi yüklenirken combobox disabled olur', () => {
        setup({ isLoadingAssignees: true });
        expect(screen.getByLabelText('Atanan')).toBeDisabled();
    });
});
