import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { attachReceipt, createExpense, fetchBudgetLines, fetchCaptureContext } from './expenseApi';
import { flushQueue, offlineQueue } from './offlineQueue';

/** Proje + kasa seçicileri. Bağlam olmadan gider oluşturulamaz (kasa zorunlu). */
export function useCaptureContext() {
    return useQuery({
        queryKey: ['expense-capture', 'context'],
        queryFn: fetchCaptureContext,
        staleTime: 5 * 60 * 1000,
    });
}

/** Seçilen projenin kalemleri; proje yoksa sorgu hiç koşmaz. */
export function useBudgetLines(projectId) {
    return useQuery({
        queryKey: ['expense-capture', 'lines', projectId],
        queryFn: () => fetchBudgetLines(projectId),
        enabled: !!projectId,
        staleTime: 60 * 1000,
    });
}

/** Tarayıcının çevrimiçi durumu + kuyruktaki kayıt sayısı. */
export function useOfflineState() {
    const [isOnline, setIsOnline] = useState(() =>
        typeof navigator === 'undefined' ? true : navigator.onLine !== false);
    const [queued, setQueued] = useState(() => offlineQueue.count());

    const refreshQueued = useCallback(() => setQueued(offlineQueue.count()), []);

    useEffect(() => {
        const up = () => setIsOnline(true);
        const down = () => setIsOnline(false);
        window.addEventListener('online', up);
        window.addEventListener('offline', down);
        return () => {
            window.removeEventListener('online', up);
            window.removeEventListener('offline', down);
        };
    }, []);

    return { isOnline, queued, refreshQueued };
}

/**
 * Gönderim. Çevrimiçiyse doğrudan sunucuya, değilse kuyruğa.
 *
 * KUYRUĞA ALINAMAZSA HATA FIRLATIR — "kaydedildi" demek, kaydın kaybolduğu
 * durumda kullanıcıya yalan söylemek olurdu (bu ekranın önceki hâlinde tam
 * olarak bu oluyordu: fixture her zaman başarı dönüyordu).
 *
 * Sonuç `{ queued: true }` taşıyorsa kayıt HENÜZ SUNUCUDA YOK; arayüz bunu
 * "kaydedildi" değil "kuyruğa alındı" diye göstermeli.
 *
 * `photo` verilirse gider kaydedildikten SONRA fiş olarak eklenir. Fiş eklenemezse
 * gider geri alınmaz (sahada kayıt kaybolmamalı): sonuç `receiptError` taşır, arayüz
 * "kaydedildi ama fiş eklenemedi" der. Kuyruğa giden kayıt fotoğrafı TAŞIMAZ (bkz.
 * offlineQueue).
 */
export function useSubmitExpense() {
    return useMutation({
        retry: false, /* Finansal işlem — duplicate önlenir */
        mutationFn: async ({ payload, photo = null }) => {
            const online = typeof navigator === 'undefined' || navigator.onLine !== false;

            if (online) {
                const result = await createExpense(payload);
                if (!photo || !result?.id) {
                    return { queued: false, result, receiptAttached: false, receiptError: null };
                }
                try {
                    await attachReceipt(result.id, photo, payload);
                    return { queued: false, result, receiptAttached: true, receiptError: null };
                } catch (err) {
                    return { queued: false, result, receiptAttached: false, receiptError: err?.message ?? 'Fiş eklenemedi.' };
                }
            }

            if (!offlineQueue.enqueue(payload)) {
                throw new Error('Cihazda yer kalmadı, kayıt saklanamadı. Bağlantı gelince tekrar deneyin.');
            }
            return { queued: true, result: null };
        },
    });
}

/**
 * Bağlantı geri gelince kuyruğu boşaltır. Yalnız GERÇEKTEN gönderilenleri
 * kuyruktan düşürür (bkz. flushQueue).
 */
export function useQueueFlush(onFlushed) {
    return useCallback(async () => {
        if (offlineQueue.count() === 0) { return null; }
        const summary = await flushQueue(createExpense);
        onFlushed?.(summary);
        return summary;
    }, [onFlushed]);
}
