import React, { useState } from 'react';
import { Input, Combobox, Badge } from '../../components/ui';
import { STATUS, PRIORITY } from '../statusMaps';

const selectClassName = 'block h-10 w-full rounded-md border border-default bg-surface-base '
    + 'px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus '
    + 'focus-visible:border-focus';

const textareaClassName = 'block w-full rounded-md border border-default bg-surface-base px-3 '
    + 'py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none '
    + 'focus-visible:shadow-focus focus-visible:border-focus';

function Field({ label, htmlFor, error, children }) {
    return (
        <div>
            <label htmlFor={htmlFor} className="mb-1 block text-[13px] font-medium text-text-secondary">
                {label}
            </label>
            {children}
            {error && <p className="mt-1 text-[13px] text-text-negative">{error}</p>}
        </div>
    );
}

function TagInput({ value, onChange }) {
    const [draft, setDraft] = useState('');

    const commit = () => {
        const name = draft.trim();
        if (name && !value.includes(name)) onChange([...value, name]);
        setDraft('');
    };

    return (
        <div>
            <div className="mb-1.5 flex flex-wrap gap-1.5">
                {value.map((name) => (
                    <Badge key={name} variant="neutral">
                        {name}
                        <button
                            type="button"
                            aria-label={`${name} etiketini kaldır`}
                            onClick={() => onChange(value.filter((t) => t !== name))}
                            className="ml-1"
                        >
                            ×
                        </button>
                    </Badge>
                ))}
            </div>
            <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        commit();
                    } else if (e.key === 'Backspace' && !draft && value.length) {
                        onChange(value.slice(0, -1));
                    }
                }}
                onBlur={commit}
                placeholder="Etiket yazıp Enter'a basın"
            />
        </div>
    );
}

export function TaskGeneralForm({
    values, errors, onFieldChange, assigneeOptions = [], isLoadingAssignees = false,
}) {
    return (
        <div className="space-y-[var(--apya-space-4)]">
            <Field label="Başlık" htmlFor="task-title" error={errors.title}>
                <Input
                    id="task-title"
                    value={values.title}
                    onChange={(e) => onFieldChange('title', e.target.value)}
                    invalid={Boolean(errors.title)}
                />
            </Field>

            <div className="grid grid-cols-2 gap-[var(--apya-space-4)]">
                <Field label="Durum" htmlFor="task-status">
                    <select
                        id="task-status"
                        value={values.status}
                        onChange={(e) => onFieldChange('status', Number(e.target.value))}
                        className={selectClassName}
                    >
                        {Object.entries(STATUS).map(([v, s]) => (
                            <option key={v} value={v}>{s.text}</option>
                        ))}
                    </select>
                </Field>
                <Field label="Öncelik" htmlFor="task-priority">
                    <select
                        id="task-priority"
                        value={values.priority}
                        onChange={(e) => onFieldChange('priority', Number(e.target.value))}
                        className={selectClassName}
                    >
                        {Object.entries(PRIORITY).map(([v, p]) => (
                            <option key={v} value={v}>{p.text}</option>
                        ))}
                    </select>
                </Field>
            </div>

            <Field label="Atanan" htmlFor="task-assignee">
                <Combobox
                    id="task-assignee"
                    options={assigneeOptions}
                    value={values.assigneeId}
                    onChange={(v) => onFieldChange('assigneeId', v)}
                    placeholder={isLoadingAssignees ? 'Yükleniyor…' : 'Atanacak kişi seç'}
                    disabled={isLoadingAssignees}
                />
            </Field>

            <div className="grid grid-cols-2 gap-[var(--apya-space-4)]">
                <Field label="Başlangıç Tarihi" htmlFor="task-start">
                    <Input
                        id="task-start"
                        type="date"
                        value={values.startDate}
                        onChange={(e) => onFieldChange('startDate', e.target.value)}
                    />
                </Field>
                <Field label="Son Tarih" htmlFor="task-due" error={errors.dueDate}>
                    <Input
                        id="task-due"
                        type="date"
                        value={values.dueDate}
                        onChange={(e) => onFieldChange('dueDate', e.target.value)}
                        invalid={Boolean(errors.dueDate)}
                    />
                </Field>
            </div>

            <Field label="Etiketler" htmlFor="task-tags-input">
                <TagInput value={values.tagNames} onChange={(v) => onFieldChange('tagNames', v)} />
            </Field>

            <Field label="Açıklama" htmlFor="task-description">
                <textarea
                    id="task-description"
                    rows={5}
                    value={values.description}
                    onChange={(e) => onFieldChange('description', e.target.value)}
                    className={textareaClassName}
                />
            </Field>
        </div>
    );
}
