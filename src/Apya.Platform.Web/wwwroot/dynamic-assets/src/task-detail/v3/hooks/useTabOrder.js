import { useCallback, useMemo, useState } from 'react';

const ORDER_KEY = 'apya.taskDetail.tabOrder';

function readStoredOrder() {
    try {
        const raw = localStorage.getItem(ORDER_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter((c) => typeof c === 'string') : [];
    } catch {
        return []; /* bozuk JSON / storage kapalı */
    }
}

function writeStoredOrder(order) {
    try {
        localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    } catch {
        /* quota / private mode */
    }
}

/**
 * Sekme sırası — ÜST ÇUBUK ve SOL RAY tek bir `order` dizisini paylaşır (tasarım
 * gereği: "sıra üst çubukla paylaşılır").
 *
 * Saklanan sıra yalnızca bir TERCİH'tir, kaynak listesi değil: görünür sekmeler her
 * zaman `visibleTabs`'ten gelir. Bu yüzden kaydedilmiş sırada olup artık görünmeyen
 * kodlar süzülür, sırada olmayan yeni kodlar sona eklenir. Aksi halde kullanıcı bir
 * özelliği kaldırdığında ya da yeni bir özellik eklendiğinde sıra sessizce bozulurdu.
 */
export function useTabOrder(visibleTabs) {
    const [preference, setPreference] = useState(readStoredOrder);
    const [draggingCode, setDraggingCode] = useState(null);

    const orderedTabs = useMemo(() => {
        const byCode = new Map(visibleTabs.map((t) => [t.code, t]));
        const ordered = [];

        for (const code of preference) {
            const tab = byCode.get(code);
            if (tab) {
                ordered.push(tab);
                byCode.delete(code);
            }
        }
        // Tercihte olmayanlar (yeni eklenen özellikler) registry sırasıyla sona
        for (const tab of visibleTabs) {
            if (byCode.has(tab.code)) ordered.push(tab);
        }
        return ordered;
    }, [visibleTabs, preference]);

    /** dragover sırasında CANLI yeniden sıralama — ayrı bir "drop indicator" yok,
     *  öğeler anında yer değiştirir (tasarım kararı). */
    const reorderTo = useCallback((targetCode) => {
        setPreference((prev) => {
            const from = draggingCode;
            if (!from || from === targetCode) return prev;

            // Tercih dizisi eksikse (ilk sürükleme) o anki görünür sıradan başlat
            const base = prev.length ? prev.slice() : orderedTabs.map((t) => t.code);
            const a = base.indexOf(from);
            const b = base.indexOf(targetCode);
            if (a === -1 || b === -1) return prev;

            base.splice(a, 1);
            base.splice(b, 0, from);
            return base;
        });
    }, [draggingCode, orderedTabs]);

    const handleDragStart = useCallback((code) => setDraggingCode(code), []);

    const handleDragEnd = useCallback(() => {
        setDraggingCode(null);
        setPreference((prev) => {
            const next = prev.length ? prev : orderedTabs.map((t) => t.code);
            writeStoredOrder(next);
            return next;
        });
    }, [orderedTabs]);

    return { orderedTabs, draggingCode, handleDragStart, handleDragEnd, reorderTo };
}
