import React, { useState } from 'react';
import { Button, Input } from '../../components/ui';
import { useTaskChecklist } from '../hooks/useTaskChecklist';

export function ChecklistTab({ taskId }) {
    const { items, addItem, toggleItem, removeItem } = useTaskChecklist(taskId);
    const [draft, setDraft] = useState('');

    const onAdd = async () => {
        const text = draft.trim();
        if (!text) return;
        try {
            await addItem(text);
            setDraft('');
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Madde eklenemedi.');
        }
    };

    const onToggle = async (itemId) => {
        try {
            await toggleItem(itemId);
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Madde güncellenemedi.');
        }
    };

    const onRemove = async (itemId, text) => {
        try {
            await removeItem(itemId);
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || `${text} silinemedi.`);
        }
    };

    return (
        <div className="space-y-[var(--apya-space-4)]">
            <div className="flex gap-2">
                <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') onAdd(); }}
                    placeholder="Yeni madde"
                />
                <Button variant="secondary" onClick={onAdd} disabled={!draft.trim()}>Ekle</Button>
            </div>

            {items.length === 0 ? (
                <p className="text-sm text-text-tertiary">Henüz madde eklenmemiş.</p>
            ) : (
                <ul className="space-y-1.5">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between gap-2 py-1">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={item.isDone}
                                    onChange={() => onToggle(item.id)}
                                />
                                <span className={item.isDone ? 'text-text-tertiary line-through' : 'text-text-primary'}>
                                    {item.text}
                                </span>
                            </label>
                            <Button variant="ghost" onClick={() => onRemove(item.id, item.text)} aria-label={`${item.text} maddesini sil`}>
                                Sil
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
