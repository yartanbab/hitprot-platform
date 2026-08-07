import React, { useState } from 'react';
import { Button } from '../../../components/ui';
import { ChecklistTab } from '../../components/ChecklistTab';
import { CommentsTab } from '../../components/CommentsTab';

// A mock rich text toolbar
function RichTextToolbar() {
    return (
        <div className="flex items-center gap-1 border-b border-subtle bg-surface-base px-2 py-1.5 rounded-t-[var(--apya-radius-md)]">
            <Button variant="ghost" size="sm" icon="fa-bold" className="h-7 w-7 text-text-secondary" />
            <Button variant="ghost" size="sm" icon="fa-italic" className="h-7 w-7 text-text-secondary" />
            <Button variant="ghost" size="sm" icon="fa-underline" className="h-7 w-7 text-text-secondary" />
            <div className="h-4 w-px bg-subtle mx-1" />
            <Button variant="ghost" size="sm" icon="fa-list-ul" className="h-7 w-7 text-text-secondary" />
            <Button variant="ghost" size="sm" icon="fa-list-ol" className="h-7 w-7 text-text-secondary" />
            <Button variant="ghost" size="sm" icon="fa-align-left" className="h-7 w-7 text-text-secondary" />
            <div className="h-4 w-px bg-subtle mx-1" />
            <Button variant="ghost" size="sm" icon="fa-link" className="h-7 w-7 text-text-secondary" />
            <Button variant="ghost" size="sm" icon="fa-image" className="h-7 w-7 text-text-secondary" />
            <Button variant="ghost" size="sm" icon="fa-code" className="h-7 w-7 text-text-secondary" />
            <Button variant="ghost" size="sm" icon="fa-at" className="h-7 w-7 text-text-secondary" />
        </div>
    );
}

export function TaskGeneralTabV3({ task }) {
    const [desc, setDesc] = useState(task.description || 'Önce metne sonra mekke 60 kişilik detaylar dosyada belirtilmiş ve otel rezervasyonları yapılmıştır.');

    return (
        <div className="flex flex-col gap-[var(--apya-space-6)]">
            
            {/* Description Section */}
            <section className="flex flex-col gap-3">
                <h2 className="text-[14px] font-semibold text-text-primary">Açıklama</h2>
                <div className="rounded-[var(--apya-radius-md)] border border-subtle bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all">
                    <RichTextToolbar />
                    <textarea 
                        className="w-full min-h-[120px] p-3 text-[14px] text-text-primary bg-transparent focus:outline-none resize-y"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Bir açıklama ekleyin..."
                    />
                </div>
            </section>

            {/* Checklist Section (Collapsible in real app, simplified here) */}
            <section className="flex flex-col gap-3 rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-base p-[var(--apya-space-5)]">
                <div className="flex items-center justify-between cursor-pointer group">
                    <h2 className="text-[14px] font-semibold text-text-primary">Kontrol Listesi</h2>
                    <i className="fa-solid fa-chevron-up text-text-tertiary group-hover:text-text-secondary transition-colors" />
                </div>
                
                {/* Embedded V2 ChecklistTab component wrapped or adapted */}
                <div className="mt-2">
                    <ChecklistTab taskId={task.id} task={task} />
                </div>
            </section>

            {/* Comments Section */}
            <section className="flex flex-col gap-3 rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-base p-[var(--apya-space-5)]">
                <div className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                        <h2 className="text-[14px] font-semibold text-text-primary">Yorumlar & Güncellemeler</h2>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-subtle text-primary text-[10px] font-bold">
                            4
                        </span>
                    </div>
                    <i className="fa-solid fa-chevron-up text-text-tertiary group-hover:text-text-secondary transition-colors" />
                </div>

                <div className="mt-2">
                    <CommentsTab taskId={task.id} task={task} />
                </div>
            </section>

        </div>
    );
}
