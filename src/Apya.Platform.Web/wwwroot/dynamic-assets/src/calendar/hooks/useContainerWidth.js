import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Kabın ölçülen genişliği (px).
 *
 * NEDEN VIEWPORT DEĞİL: island, kenar çubuğu açıkken ~280px daha dar bir kapta
 * yaşar. Kırılımı viewport'a bağlarsak 1300px ekranda "geniş" sanıp üç kolonu
 * 1020px'lik kaba sıkıştırırız — Dashboard'da tam olarak bu yaşandı
 * (RGL kabı ölçüyordu, Tailwind screens viewport'u). Tek ölçü kaynağı: kap.
 *
 * İlk render ölçümsüzdür (0); layout kararı verirken `width > 0` bekleyin, aksi
 * hâlde bir kare mobil düzen çakıp geri döner.
 */
export function useContainerWidth() {
    const ref = useRef(null);
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        const node = ref.current;
        if (!node) return undefined;

        setWidth(node.getBoundingClientRect().width);

        if (typeof ResizeObserver === 'undefined') return undefined;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setWidth(entry.contentRect.width);
            }
        });
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return [ref, width];
}

/**
 * Ölçülen kap genişliğinden yerleşim kararı.
 *   wide    ≥1180 : ray (256) + grid + gün paneli yan yana
 *   medium  ≥ 780 : ray ikonlara daralır, gün paneli takvimin ÜSTÜNE biner
 *   narrow  < 780 : tek kolon, ajanda varsayılan, gün detayı alttan sheet
 */
export function layoutOf(width) {
    if (width === 0) return 'wide'; /* ölçümden önce: masaüstü varsayımı (islandların birincil yüzeyi) */
    if (width >= 1180) return 'wide';
    if (width >= 780) return 'medium';
    return 'narrow';
}
