import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/httpClient';

/**
 * Dış takvim hesabı: bağla / kaldır / şimdi senkronize et.
 *
 * 🔑 Yetkilendirme adresi İSTEMCİDE SABİT YAZILMAZ. Sunucu, sağlayıcının OAuth
 * istemcisi tanımlıysa gerçek Google/Microsoft adresini, tanımlı değilse simülasyon
 * sayfasını döndürür. Adres sabit yazıldığı sürece gerçek OAuth hiç çalışmıyordu:
 * istemci her koşulda simülasyona gidiyor, sahte token'lı hesap oluşuyor ve her
 * okuma sessizce hataya düşüyordu.
 */
const SYNC_KEY = ['calendar', 'sync-settings'];
const EXTERNAL_KEY = ['calendar', 'external'];

export function useConnectAccount() {
    return useMutation({
        mutationFn: (provider) => api.get(`/api/app/calendar/auth-url?provider=${provider}`),
        /* Sağlayıcının kendi ekranına gidiliyor: SPA yönlendirmesi değil, tam sayfa. */
        onSuccess: (url) => {
            if (typeof url === 'string' && url) window.location.href = url;
        },
    });
}

/**
 * ABP konvansiyonu: bilinen bir fiil önekiyle başlamayan metot POST'a düşer ve
 * "id" parametresi eylem adından ÖNCE yol segmenti olur (emsal: form/{id}/publish).
 */
export function useDisconnectAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => api.post(`/api/app/calendar/${id}/disconnect-account`, {}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SYNC_KEY });
            /* Hesap gidince onun etkinlikleri de ekrandan kalkmalı. */
            queryClient.invalidateQueries({ queryKey: EXTERNAL_KEY });
        },
    });
}

export function useForceSync() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => api.post(`/api/app/calendar/${id}/force-sync`, {}),
        /* "Son senkron" damgası ve senkron günlüğü bu çağrıyla değişir. */
        onSuccess: () => queryClient.invalidateQueries({ queryKey: SYNC_KEY }),
    });
}
