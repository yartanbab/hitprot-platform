import { useEffect } from 'react';

/**
 * Takvimin genel klavye kısayolları.
 *
 * Tasarımın kuralı: sürükle-bırakla yapılabilen her şey klavyeyle de yapılabilir.
 * Bu yüzden ertele (⇧+→ / ⇧+←) ve geri al (⌘/Ctrl+Z) buradadır; gün gezinmesi
 * grid'in kendi roving tabindex'inde.
 *
 * Yazı alanlarında (input/textarea/contenteditable) HİÇ tetiklenmez — kullanıcı
 * bir tarih yazarken "T" tuşu takvimi bugüne atlamasın.
 */
const TEXT_FIELDS = ['INPUT', 'TEXTAREA', 'SELECT'];

export function useCalendarKeyboard({
    onView, onToday, onPrev, onNext, onDeferSelected, onUndo, onToggleHelp, enabled = true,
}) {
    useEffect(() => {
        if (!enabled) return undefined;

        const handler = (e) => {
            const target = e.target;
            if (TEXT_FIELDS.includes(target?.tagName) || target?.isContentEditable) return;

            /* Geri alma her yerde çalışır (modal içinde de). */
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                onUndo?.();
                return;
            }

            if (e.metaKey || e.ctrlKey || e.altKey) return;

            if (e.shiftKey) {
                if (e.key === 'ArrowRight') { e.preventDefault(); onDeferSelected?.(1); }
                if (e.key === 'ArrowLeft') { e.preventDefault(); onDeferSelected?.(-1); }
                if (e.key === '?') { e.preventDefault(); onToggleHelp?.(); }
                return;
            }

            switch (e.key) {
                case '?': e.preventDefault(); onToggleHelp?.(); break;
                case 't': case 'T': e.preventDefault(); onToday?.(); break;
                case 'm': case 'M': e.preventDefault(); onView?.('month'); break;
                case 'w': case 'W': e.preventDefault(); onView?.('week'); break;
                case 'd': case 'D': e.preventDefault(); onView?.('day'); break;
                case 'a': case 'A': e.preventDefault(); onView?.('agenda'); break;
                case 'PageUp': e.preventDefault(); onPrev?.(); break;
                case 'PageDown': e.preventDefault(); onNext?.(); break;
                default: break;
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [enabled, onView, onToday, onPrev, onNext, onDeferSelected, onUndo, onToggleHelp]);
}
