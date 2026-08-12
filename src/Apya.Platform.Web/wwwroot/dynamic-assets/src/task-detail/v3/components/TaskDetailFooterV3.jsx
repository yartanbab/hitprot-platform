import React from 'react';
import { Button } from '../../../components/ui';

export function TaskDetailFooterV3({
    lastSavedAt,
    isDirty,
    isSaving,
    onCancel,
    onSave
}) {
    const formattedDate = lastSavedAt
        ? new Intl.DateTimeFormat('tr-TR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        }).format(new Date(lastSavedAt))
        : '—';

    return (
        <footer className="flex items-center justify-between border-t border-subtle bg-surface-base px-6 py-4 mt-auto">
            {/* Left: Last Saved indicator */}
            <div className="flex items-center gap-2 text-xs text-text-tertiary">
                <i className="fa-regular fa-clock" />
                <span>Son kayıt: <strong className="font-medium text-text-secondary">{formattedDate}</strong></span>
                {isDirty && (
                    <span className="flex items-center gap-1.5 text-warning font-medium ml-2">
                        <span className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                        Kaydedilmemiş değişiklikler var
                    </span>
                )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    className="text-text-secondary hover:bg-surface-hover px-4"
                >
                    Vazgeç
                </Button>
                
                <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={onSave}
                    disabled={!isDirty || isSaving}
                    isLoading={isSaving}
                    loadingText="Kaydediliyor…"
                    className="bg-primary hover:bg-primary-hover text-white px-6 font-medium shadow-sm transition-all rounded-lg"
                >
                    Kaydet
                </Button>
            </div>
        </footer>
    );
}
