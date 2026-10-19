import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * QA-47 · Bir öğenin ölçülen genişliği (px). Takvimdeki useContainerWidth ile aynı gerekçe
 * (kırılım viewport'a değil KABA bakar), ama geri çağırmalı ref kullanır: görev detayındaki
 * ızgara veri yüklendikten sonra ve yalnız Genel sekmesinde bağlanır, ilk render'da düğüm yoktur.
 * İlk ölçümden önce 0 döner; karar verirken `width > 0` bekleyin.
 */
export function useElementWidth() {
    const [width, setWidth] = useState(0);
    const observer = useRef(null);

    const ref = useCallback((node) => {
        observer.current?.disconnect();
        observer.current = null;
        if (!node) return;

        setWidth(node.getBoundingClientRect().width);
        if (typeof ResizeObserver === 'undefined') return;
        observer.current = new ResizeObserver((entries) => {
            for (const entry of entries) setWidth(entry.contentRect.width);
        });
        observer.current.observe(node);
    }, []);

    useEffect(() => () => observer.current?.disconnect(), []);

    return [ref, width];
}

/**
 * Genel sekmesi iki sütun mu (açıklama/yorumlar + 330px Detaylar) tek sütun mu? Sol sütuna en az
 * ~430px kalmıyorsa tek sütun. Ölçümden önce (0) viewport kırılımlarına bırakılır.
 */
export const GENERAL_STACK_BELOW = 780;

export function isGeneralStacked(width) {
    return width > 0 && width < GENERAL_STACK_BELOW;
}
