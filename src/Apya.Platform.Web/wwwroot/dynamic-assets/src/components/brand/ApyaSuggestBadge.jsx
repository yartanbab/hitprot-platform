import React from 'react';
import { ApyaMark } from './ApyaMark';

/**
 * Asistan öneri rozeti — marka paketi "Ürün içi yerleşim":
 * 14 px işaret (öneri durumu, çizgi 6) + 11 px metin, 1 px kenarlık, tam yuvarlak,
 * iç boşluk 5 12 5 9. Kullanıcı kararı (2026-10-26): 14 px'te mikro DEĞİL standart işaret.
 * Yalnız asistanın ürettiği/önerdiği değerin yanında kullanılır.
 */
export function ApyaSuggestBadge({ children = 'AI' }) {
    return (
        <span
            className="inline-flex items-center gap-1.5 rounded-full border border-current text-[11px] font-medium leading-none"
            style={{ padding: '5px 12px 5px 9px', color: 'var(--apya-brand-mark)' }}
        >
            <ApyaMark size={14} state="suggest" micro={false} />
            {children}
        </span>
    );
}
