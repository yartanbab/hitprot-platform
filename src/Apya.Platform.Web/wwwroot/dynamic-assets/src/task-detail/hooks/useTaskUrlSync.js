import { useEffect, useRef } from 'react';

const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PARAM = 'task';

/**
 * Görev detayı URL senkronu — Razor Pages'te client router yok, bu yüzden
 * History API'yi elle sürüyoruz.
 *
 * Neden pushState (replaceState değil): geri tuşu modalı kapatmalı, sayfadan
 * çıkarmamalı (HIG back-behavior). Liste filtresi/scroll'u DOM'da durduğu için
 * bu yöntem bağlamı da korur — ayrı bir detay sayfasına gitmenin aksine.
 *
 * Kanonik paylaşılabilir URL (/Tasks/Detail/{id}) Faz 5'te gelir; bu parametre
 * "aynı sayfada bir görev açık" durumunu temsil eder, paylaşım linki değildir.
 */
export function readTaskIdFromUrl() {
    if (typeof window === 'undefined') return null;
    const value = new URLSearchParams(window.location.search).get(PARAM);
    return value && GUID_RE.test(value) ? value : null;
}

export function clearTaskUrl() {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.delete(PARAM);
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
}

export function useTaskUrlSync(taskId, onPopClose) {
    /* onPopClose her render'da değişebilir (inline closure); ref ile sabit tutup
       popstate dinleyicisini bir kez bağlıyoruz. */
    const onPopCloseRef = useRef(onPopClose);
    onPopCloseRef.current = onPopClose;

    useEffect(() => {
        if (!taskId) return;
        if (readTaskIdFromUrl() === taskId) return; /* derin bağlantıyla açıldı, tekrar push etme */

        const url = new URL(window.location.href);
        url.searchParams.set(PARAM, taskId);
        window.history.pushState({ apyaTask: taskId }, '', url.pathname + url.search + url.hash);
    }, [taskId]);

    useEffect(() => {
        const handler = () => { onPopCloseRef.current?.(); };
        window.addEventListener('popstate', handler);
        return () => window.removeEventListener('popstate', handler);
    }, []);
}
