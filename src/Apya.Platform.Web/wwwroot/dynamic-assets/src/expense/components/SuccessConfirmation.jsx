import React from 'react';
import { Button } from '../../components/ui';
import { formatMoney } from '../../lib/utils';

/**
 * Başarı ekranı — 1.5 saniye sonra otomatik dismiss yerine kullanıcıya
 * "bir tane daha" / "bitir" seçeneği veriliyor (saha kullanım: peş peşe
 * 5-6 fatura çekmek normal). UX § 8 — "3 saniyede işlem" hedefini bozmamak için.
 */
export function SuccessConfirmation({ result, onAddAnother, onClose }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 text-center">
            <CheckCircleIcon />
            <div>
                <h2 className="text-xl font-semibold text-text-primary">Masraf gönderildi</h2>
                <p className="text-sm text-text-secondary mt-1">
                    {result?.amount && formatMoney(result.amount, result.currency || 'TRY')}
                    {result?.vendor && ` · ${result.vendor}`}
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                    Onaya gitti. Bildirim ile durumu takip edebilirsin.
                </p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-xs">
                <Button variant="primary" size="lg" onClick={onAddAnother}>
                    Bir tane daha çek
                </Button>
                <Button variant="ghost" size="md" onClick={onClose}>
                    Bitir
                </Button>
            </div>
        </div>
    );
}

const CheckCircleIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
         className="text-positive-500" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <path d="m9 12 2 2 4-4"/>
    </svg>
);
