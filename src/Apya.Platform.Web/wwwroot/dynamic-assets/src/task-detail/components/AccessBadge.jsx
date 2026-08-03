import React from 'react';

/**
 * Erişim göstergesi. Eski EditModal'daki `text-danger` + fa-user-secret + "Gizli"
 * kombinasyonu bir uyarı/hata gibi okunuyordu; bu bir DURUM bilgisi, tehlike değil.
 * Nötr renk + kilit ikonu + açıklayıcı title.
 */
export function AccessBadge({ isPrivate }) {
    if (!isPrivate) return null;
    return (
        <span
            className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary"
            title="Bu görev yalnızca yetkilendirilmiş kullanıcılar tarafından görüntülenebilir."
        >
            <i className="fa fa-lock text-text-tertiary" aria-hidden="true" />
            Sınırlı erişim
        </span>
    );
}
