import React, { useRef } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { Button } from './Button';
import { t } from '../../lib/i18n';

/**
 * UnsavedChangesDialog — ortak "kaydedilmemiş değişiklik" penceresi.
 *
 * Denetimli ve durumsuz: açık/kapalı `open` ile gelir; kaydetmeyi kendisi yapmaz, yalnız
 * `onSave`'i çağırır (verilmezse iki düğme). useDirtyGuard kullanan her bileşen bunu
 * `open={guard.pendingClose}` ile çizer (lib/feedback/useDirtyGuard.js sözleşmesi).
 *
 * DialogContent KULLANILMAZ, Radix ilkelleri doğrudan: büyük modal ölçüleri + mobilde tam
 * ekran burada yanlış; ayrıca karartma z-modal-backdrop (1040) olsaydı görev modalının
 * (z-modal, 1050) ALTINDA kalırdı. Burada karartma da z-modal: DOM'da sonra geldiği için
 * üstte çizilir. SweetAlert (hata / oturum penceresi) ve bildirim bunun üstünde açılır.
 *
 * role=alertdialog (dialog DEĞİL): kullanıcıdan karar bekler; ayrıca ekrandaki
 * getByRole('dialog') sorguları ve bildirim konumu kuralı (apya-shell.css §4b) etkilenmez.
 *
 * Esc = "kal" (onStay). Dışarı tıklama hiçbir şey yapmaz: pencere çoğu kez arka plan
 * tıklamasıyla açılır, çift tıklamanın ikinci tıkı onu sessizce kapatmamalı. Başlangıç
 * odağı en az yıkıcı eylemde ("Düzenlemeye devam et"): boş Enter veri kaybettirmez.
 *
 * HAFİF ADALARDA KULLANILMAZ (form-builder, forms, responses, customers, public-form):
 * Radix'i (ui-vendor) o adalara taşır — islandMount.wiring.test.js "karar 11".
 */
export function UnsavedChangesDialog({
    open,
    onStay,
    onDiscard,
    onSave,
    isSaving = false,
    errorText,
    title,
    description,
    stayLabel,
    discardLabel,
    saveLabel,
    savingLabel,
}) {
    const stayRef = useRef(null);
    const returnFocusRef = useRef(null);

    return (
        <RadixDialog.Root open={open} onOpenChange={(next) => { if (!next) onStay?.(); }}>
            <RadixDialog.Portal>
                <RadixDialog.Overlay className="fixed inset-0 z-modal bg-surface-overlay animate-overlay-fade" />
                <div className="fixed inset-0 z-modal flex items-center justify-center p-4 pointer-events-none">
                    <RadixDialog.Content
                        role="alertdialog"
                        /* Alttaki pencerenin onInteractOutside'ı bu katmanı "dışarı" saymasın. */
                        data-apya-overlay="unsaved"
                        className="pointer-events-auto w-full max-w-lg rounded-xl border border-default bg-surface-elevated p-[var(--apya-space-5)] shadow-xl animate-dialog-in focus-visible:outline-none"
                        onOpenAutoFocus={(e) => {
                            returnFocusRef.current = document.activeElement;
                            e.preventDefault();
                            stayRef.current?.focus();
                        }}
                        /* Radix modal Dialog tetikleyicisi olmayınca odağı iade ETMEZ. Odak yalnız
                           boşa düştüyse (body) geri verilir: çağıran başka yere taşıdıysa (ör.
                           hatalı alana) ezilmez. */
                        onCloseAutoFocus={(e) => {
                            e.preventDefault();
                            const el = returnFocusRef.current;
                            returnFocusRef.current = null;
                            const active = document.activeElement;
                            if (el?.isConnected && (!active || active === document.body)) el.focus();
                        }}
                        onPointerDownOutside={(e) => e.preventDefault()}
                        onInteractOutside={(e) => e.preventDefault()}
                        onEscapeKeyDown={(e) => { if (isSaving) e.preventDefault(); }}
                    >
                        <RadixDialog.Title className="text-base font-semibold text-text-primary">
                            {title ?? t('Common:Unsaved:Title', 'Kaydedilmemiş değişiklikleriniz var')}
                        </RadixDialog.Title>
                        <RadixDialog.Description className="mt-2 text-sm text-text-secondary">
                            {description ?? t('Common:Unsaved:Body', 'Devam ederseniz kaydetmediğiniz değişiklikler kaybolur.')}
                        </RadixDialog.Description>
                        {errorText && (
                            <p role="alert" className="mt-3 text-sm text-text-negative">{errorText}</p>
                        )}
                        {/* DOM sırası = Tab sırası: kal → at → kaydet. */}
                        <div className="mt-[var(--apya-space-5)] flex flex-wrap justify-end gap-2 lt-560:flex-col lt-560:items-stretch">
                            <Button ref={stayRef} variant="secondary" onClick={onStay} disabled={isSaving}>
                                {stayLabel ?? t('Common:Unsaved:Stay', 'Düzenlemeye devam et')}
                            </Button>
                            <Button variant="destructive" onClick={onDiscard} disabled={isSaving}>
                                {discardLabel ?? t('Common:Unsaved:Discard', 'Değişiklikleri at')}
                            </Button>
                            {onSave && (
                                <Button
                                    variant="primary"
                                    onClick={onSave}
                                    isLoading={isSaving}
                                    loadingText={savingLabel ?? t('Common:Unsaved:Saving', 'Kaydediliyor…')}
                                >
                                    {saveLabel ?? t('Common:Unsaved:SaveAndClose', 'Kaydet ve çık')}
                                </Button>
                            )}
                        </div>
                    </RadixDialog.Content>
                </div>
            </RadixDialog.Portal>
        </RadixDialog.Root>
    );
}
