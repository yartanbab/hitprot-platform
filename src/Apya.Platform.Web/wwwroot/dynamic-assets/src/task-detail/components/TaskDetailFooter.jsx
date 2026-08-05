import React from 'react';
import { Button } from '../../components/ui';

const fmtTime = (iso) => (iso
    ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
    : null);

/* onSave opsiyonel: Faz 1'de kaydedilecek bir şey olmadığı için hiç geçilmiyor. */
export function TaskDetailFooter({ lastSavedAt, isDirty, isSaving, onCancel, onSave }) {
    const saved = fmtTime(lastSavedAt);
    return (
        <footer className="flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]">
            <div className="flex items-center justify-between gap-[var(--apya-space-4)]">
                <span className="truncate text-[13px] text-text-tertiary">
                    {saved ? `Son kayıt: ${saved}` : ' '}
                </span>
                <div className="flex flex-none items-center gap-2">
                    <Button variant="secondary" onClick={onCancel} disabled={isSaving}>Vazgeç</Button>
                    {/* isLoading Button içinde zaten disabled + aria-busy yapıyor ve
                        loadingText'i children yerine gösteriyor → çift tıklama koruması
                        elle kurulmuyor. disabled={!isDirty} yalnız "değişiklik yok" hali. */}
                    <Button
                        variant="primary"
                        onClick={() => onSave?.()}
                        disabled={!isDirty || !onSave}
                        isLoading={isSaving}
                        loadingText="Kaydediliyor…"
                    >
                        Kaydet
                    </Button>
                </div>
            </div>
        </footer>
    );
}
