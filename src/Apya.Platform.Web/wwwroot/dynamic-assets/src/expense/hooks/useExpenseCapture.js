import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { expenseFixtures } from './fixtures';
import { createExpense, fetchBudgetLines, fetchCaptureContext } from './expenseApi';
import { flushQueue, offlineQueue } from './offlineQueue';

/**
 * OCR HÂLÂ FIXTURE. Sunucuda gider için OCR ucu yok; sahte "okundu" değerleri
 * üretmek yerine kaldırmak da bir seçenekti, ama akış fotoğraf çekip formu
 * ön-doldurma üzerine kurulu. Ekran bunu kullanıcıya söylüyor ("otomatik okuma
 * denemedir"), kayıt her hâlükârda kullanıcının onayladığı değerlerle gider.
 */
export function useOcrParse() {
    return useMutation({
        mutationFn: (file) => expenseFixtures.ocr(file),
    });
}

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
 */
export function useSubmitExpense() {
    return useMutation({
        retry: false, /* Finansal işlem — duplicate önlenir */
        mutationFn: async (payload) => {
            const online = typeof navigator === 'undefined' || navigator.onLine !== false;

            if (online) {
                return { queued: false, result: await createExpense(payload) };
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
