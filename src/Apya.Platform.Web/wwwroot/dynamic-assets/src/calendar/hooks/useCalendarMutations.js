import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/httpClient';
import { isoDay } from '../lib/model';

/**
 * Takvim mutasyonları — iyimser güncelleme + geri alma.
 *
 * Sözleşme (tasarım §8): öğe hedef güne ANINDA taşınır; yazma başarısız olursa
 * eski yerine döner ve hata SATIRDA kalır (toast'a kaçmaz) — kullanıcı hangi
 * öğenin kaydedilmediğini görmeden ekranı terk etmesin.
 *
 * Başarıda kalıcı bir "geri al" şeridi doğar; toast DEĞİL, çünkü kullanıcı
 * takvime bakarken kaybolan bir bildirim geri almayı imkânsız kılıyor.
 */

const FEED_KEY = ['calendar', 'feed'];

/** Cache'teki feed'lerde tek bir öğenin tarihini yerinde değiştirir. */
function patchItemDate(queryClient, key, newDateIso) {
    queryClient.setQueriesData({ queryKey: FEED_KEY }, (feed) => {
        if (!feed?.items) return feed;
        return {
            ...feed,
            items: feed.items.map((item) =>
                item.key === key ? { ...item, date: `${newDateIso}T00:00:00` } : item),
        };
    });
}

function patchItemDone(queryClient, key) {
    queryClient.setQueriesData({ queryKey: FEED_KEY }, (feed) => {
        if (!feed?.items) return feed;
        return {
            ...feed,
            items: feed.items.map((item) =>
                item.key === key ? { ...item, isDone: true, risk: 0, loadHours: null } : item),
        };
    });
}

export function useCalendarMutations({ onOfflineFailure } = {}) {
    const queryClient = useQueryClient();
    /** { key, message, undo } — kalıcı şerit. */
    const [lastAction, setLastAction] = useState(null);
    /** { [itemKey]: mesaj } — satırda kalan hata. */
    const [errors, setErrors] = useState({});
    /** Kaydedilmeyi bekleyen öğeler — satırda "kaydediliyor" göstergesi. */
    const [pending, setPending] = useState({});

    const clearError = useCallback((key) => {
        setErrors((prev) => {
            if (!prev[key]) return prev;
            const next = { ...prev };
            delete next[key];
            return next;
        });
    }, []);

    const reschedule = useMutation({
        mutationFn: ({ item, newDate }) => api.post('/api/app/calendar/reschedule-item', {
            source: item.source,
            sourceId: item.sourceId,
            newDate: isoDay(newDate),
        }),
        onMutate: async ({ item, newDate }) => {
            await queryClient.cancelQueries({ queryKey: FEED_KEY });
            const snapshot = queryClient.getQueriesData({ queryKey: FEED_KEY });
            clearError(item.key);
            setPending((p) => ({ ...p, [item.key]: true }));
            patchItemDate(queryClient, item.key, isoDay(newDate));
            return { snapshot, previousDate: item.date.slice(0, 10) };
        },
        onError: (error, { item, newDate }, context) => {
            /* ÇEVRİMDIŞI: bu bir hata değil, ertelenmiş yazmadır. Öğe yeni gününde
               KALIR ve kuyruğa alınır — kullanıcı bağlantısı yokken işini kaybetmesin. */
            if (typeof navigator !== 'undefined' && !navigator.onLine) {
                onOfflineFailure?.({
                    key: item.key,
                    payload: { source: item.source, sourceId: item.sourceId, newDate: isoDay(newDate) },
                });
                return;
            }

            /* Geri sarma: sunucu reddettiyse öğe eski gününde kalmalı. */
            context?.snapshot?.forEach(([key, data]) => queryClient.setQueryData(key, data));
            setErrors((prev) => ({
                ...prev,
                [item.key]: error?.message || 'Kaydedilemedi — tarih değişmedi.',
            }));
        },
        onSuccess: (_data, { item, newDate }, context) => {
            setLastAction({
                key: item.key,
                message: `“${item.title}” ${isoDay(newDate)} tarihine taşındı.`,
                undo: () => reschedule.mutate({
                    item: { ...item, date: `${isoDay(newDate)}T00:00:00` },
                    newDate: new Date(`${context.previousDate}T00:00:00`),
                }),
            });
        },
        onSettled: (_d, _e, { item }) => {
            setPending((p) => {
                const next = { ...p };
                delete next[item.key];
                return next;
            });
            queryClient.invalidateQueries({ queryKey: FEED_KEY });
        },
    });

    const complete = useMutation({
        mutationFn: ({ item }) => api.post('/api/app/calendar/complete-item', {
            source: item.source,
            sourceId: item.sourceId,
        }),
        onMutate: async ({ item }) => {
            await queryClient.cancelQueries({ queryKey: FEED_KEY });
            const snapshot = queryClient.getQueriesData({ queryKey: FEED_KEY });
            clearError(item.key);
            setPending((p) => ({ ...p, [item.key]: true }));
            patchItemDone(queryClient, item.key);
            return { snapshot };
        },
        onError: (error, { item }, context) => {
            context?.snapshot?.forEach(([key, data]) => queryClient.setQueryData(key, data));
            setErrors((prev) => ({
                ...prev,
                [item.key]: error?.message || 'Tamamlanamadı.',
            }));
        },
        onSuccess: (_d, { item }) => {
            /* Tamamlamanın geri alması yok: görev durumu takvimin işi değil,
               kullanıcı görev ekranından geri açar. Şerit yalnız bilgilendirir. */
            setLastAction({ key: item.key, message: `“${item.title}” tamamlandı.`, undo: null });
        },
        onSettled: (_d, _e, { item }) => {
            setPending((p) => {
                const next = { ...p };
                delete next[item.key];
                return next;
            });
            queryClient.invalidateQueries({ queryKey: FEED_KEY });
        },
    });

    return {
        reschedule: (item, newDate) => reschedule.mutate({ item, newDate }),
        complete: (item) => complete.mutate({ item }),
        retry: (item, newDate) => (newDate
            ? reschedule.mutate({ item, newDate })
            : complete.mutate({ item })),
        lastAction,
        dismissAction: () => setLastAction(null),
        errors,
        clearError,
        pending,
    };
}
