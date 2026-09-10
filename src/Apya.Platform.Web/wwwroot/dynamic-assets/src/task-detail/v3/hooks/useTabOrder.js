import { useCallback, useEffect, useMemo, useState } from 'react';

const ORDER_KEY = 'apya.taskDetail.tabOrder';

/** Shell.BoardTabs ayarındaki görev-detay yüzeyi (bkz. ShellBoardTabsSetting). */
const BOARD_TABS_SCOPE = 'taskdetail';

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
 * Sunucuda saklanan sıra — island'a SAYFAYLA gelir (host .cshtml, mount
 * elemanının `data-tab-order` attribute'ü; ayrı GET ucu yok, gerekçe
 * IShellAppService.SetBoardTabsAsync notu). Değer Shell.BoardTabs'ın
 * "taskdetail" scope'u: [{kind:"checklist"}...] — kind = özellik kodu.
 * `null` = scope hiç yazılmamış (localStorage'a düşülür).
 */
function readServerOrder() {
    const el = document.querySelector('[data-tab-order]');
    const raw = el?.getAttribute('data-tab-order');
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return null;
        return parsed.map((t) => t?.kind).filter((c) => typeof c === 'string');
    } catch {
        return null;
    }
}

/** /Tasks şeridiyle aynı uç ve aynı "sessizce yut" sözleşmesi
 *  (apya-task-console.js → createTabs → persistTabs). */
function persistServerOrder(order) {
    try {
        const token = (document.cookie.match(/XSRF-TOKEN=([^;]+)/) || [])[1];
        fetch('/api/app/shell/set-board-tabs', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': token ? decodeURIComponent(token) : '',
            },
            body: JSON.stringify({
                scope: BOARD_TABS_SCOPE,
                tabs: order.map((code) => ({ kind: code, ref: '', title: '' })),
            }),
        }).catch(() => { /* yoksay — bir sonraki yüklemede sunucu hâli döner */ });
    } catch {
        /* cookie/fetch erişilemedi (test ortamı vb.) */
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
    /* Sıra artık SUNUCUDA yaşar (Shell.BoardTabs → taskdetail scope'u,
       cihazlar arası taşınır); localStorage yalnız geri-uyum/çevrimdışı
       yedeği. Sunucu kaydı varsa o kazanır. */
    const [preference, setPreference] = useState(() => readServerOrder() ?? readStoredOrder());
    const [draggingCode, setDraggingCode] = useState(null);

    /* Tek seferlik taşıma: eski sürüm sırayı yalnız localStorage'da tutuyordu.
       Sunucuda henüz kayıt yoksa yereldeki tercih sunucuya yazılır ki kullanıcı
       başka cihazda da aynı sırayı görsün. */
    useEffect(() => {
        if (readServerOrder() === null) {
            const local = readStoredOrder();
            if (local.length) { persistServerOrder(local); }
        }
    }, []);

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
            persistServerOrder(next);
            return next;
        });
    }, [orderedTabs]);

    return { orderedTabs, draggingCode, handleDragStart, handleDragEnd, reorderTo };
}
