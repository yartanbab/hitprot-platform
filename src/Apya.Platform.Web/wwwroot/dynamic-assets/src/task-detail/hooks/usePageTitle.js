import { useEffect, useRef } from 'react';

/**
 * Görev detayı SAYFA kipinde tarayıcı sekmesinin başlığı görevi izler (QA-25): başlık
 * yeniden adlandırılınca sekme eski adı göstermeye devam ediyordu. Marka eki ("| Apya")
 * sunucunun çizdiği ilk başlıktan bir kez alınır; null başlık dokunmaz (modal kipi).
 */
export function usePageTitle(title) {
    const suffixRef = useRef(null);
    useEffect(() => {
        if (!title || typeof document === 'undefined') return;
        if (suffixRef.current === null) {
            const i = document.title.lastIndexOf(' | ');
            suffixRef.current = i >= 0 ? document.title.slice(i) : '';
        }
        document.title = title + suffixRef.current;
    }, [title]);
}
