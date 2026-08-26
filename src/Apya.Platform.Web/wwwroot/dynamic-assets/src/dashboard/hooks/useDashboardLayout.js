import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/httpClient';
import { QK } from '../../lib/api/queryClient';

/**
 * Kart düzeni — kullanıcı bazlı, SUNUCUDA saklanır (AppDashboardLayouts).
 * Kayıt yoksa sunucu görünümün yerleşik varsayılanını `isDefault: true` ile döner.
 *
 * localStorage KULLANILMAZ: düzen cihazlar arası taşınmalı. Yalnız aktif görünüm
 * sekmesi lokalde tutulur (bkz viewPresets).
 */

/**
 * Razor'ın sayfaya gömdüğü VARSAYILAN görünüm düzeni (Pages/Dashboard/Index.cshtml).
 * Bir kez okunur; yoksa ya da bozuksa sessizce null döner — gömme bir
 * optimizasyondur, yokluğunda normal istek atılır.
 */
const embeddedLayout = (() => {
    try {
        const node = document.getElementById('apya-dashboard-layout');
        return node ? JSON.parse(node.textContent) : null;
    } catch {
        return null;
    }
})();

export function useDashboardLayout(viewKey) {
    /* Gömülü kayıt YALNIZ kendi görünümüne tohum olur. Kullanıcı başka bir görünüm
       seçtiyse (tercih localStorage'da, sunucu bilemez) anahtarlar tutmaz ve
       istemci normal isteğini atar — yanlış düzen gösterme riski yok. */
    const initialData = embeddedLayout?.viewKey === viewKey ? embeddedLayout : undefined;

    return useQuery({
        queryKey: QK.dashboard.layout(viewKey),
        queryFn: () => api.get(`/api/dashboard/layout?viewKey=${encodeURIComponent(viewKey)}`),
        /* Düzen kullanıcıdan başkası değiştiremez → uzun taze kalır. */
        staleTime: 5 * 60_000,
        enabled: Boolean(viewKey),
        initialData,
    });
}

export function useSaveLayout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ viewKey, cards }) =>
            api.put('/api/dashboard/layout', { viewKey, cards }),
        onSuccess: (_data, { viewKey }) => {
            queryClient.invalidateQueries({ queryKey: QK.dashboard.layout(viewKey) });
        },
    });
}

export function useResetLayout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (viewKey) =>
            api.delete(`/api/dashboard/layout?viewKey=${encodeURIComponent(viewKey)}`),
        onSuccess: (_data, viewKey) => {
            queryClient.invalidateQueries({ queryKey: QK.dashboard.layout(viewKey) });
        },
    });
}
