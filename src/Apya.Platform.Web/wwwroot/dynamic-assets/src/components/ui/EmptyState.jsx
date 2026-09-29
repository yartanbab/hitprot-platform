import React from 'react';
import { cn } from '../../lib/utils';
import { t } from '../../lib/i18n';
import { errorMessage } from '../../lib/api/abpErrors';
import { Button } from './Button';

/**
 * EmptyState — "veri yok" yerine ikon + 1 satır + 1 CTA.
 *
 * UX strategy doc § Widget kontratı: "Veri yok" yasak.
 * Kullanıcıya ne anlama geldiğini ve hangi aksiyonu alabileceğini söyle:
 *
 *   ✗ "Bekleyen onay yok."
 *   ✓ icon + "Hepsi tamam" + "Bugün karar bekleyen kalmadı."
 *
 * Variant'lar:
 *   - default : nötr (ikon+başlık ai-500/neutral)
 *   - success : pozitif (yeşil) — "tüm işler bitti" durumu
 *   - info    : nötr bilgilendirici
 *   - error   : YÜKLEME hatası — "kayıt yok" DEĞİL. Varsayılan ikon fa-triangle-exclamation,
 *               role=alert. Açıklama verilmezse `error` nesnesinden G1 hata kanalıyla
 *               (lib/api/abpErrors errorMessage) üretilir, o da yoksa Common:FetchError.
 *               Kanal null döndürürse (merkezi oturum penceresi açık) açıklama basılmaz.
 *   - locked  : yetkisiz — "kayıt yok" DEĞİL (G6). Varsayılan ikon fa-lock, role=status;
 *               varsayılan açıklama/eylem yok: başlık "… görme yetkiniz yok", açıklama
 *               hangi izin gerektiği ve kimin verebileceği.
 *   error/locked tonu Razor .apya-console-state-icon.is-muted ile aynı (sessiz halka, alarm
 *   kırmızısı yok); jQuery karşılığı wwwroot/js/apya-load-state.js errorHtml.
 *
 * onRetry: verilirse "Tekrar dene" (Common:Retry) düğmesi çizilir ve ARGÜMANSIZ çağrılır
 * (react-query refetch'ine MouseEvent sızmaz). Açık `action` her zaman onu ezer.
 * description: undefined → varsayılan (yukarıda), null → açıklama yok.
 *
 * YÜKLEME DURUMU SÖZLEŞMESİ (React adaları)
 *   1) Boş durum yalnız BAŞARILI ve boş sonuçta; oluşturma CTA'sı hata anında görünmez.
 *   2) Yükleniyor = react-query isPending (isLoading DEĞİL: PersistQueryClientProvider
 *      geri yüklerken fetchStatus 'idle' olduğu için isLoading false ama data undefined).
 *   3) Gösterilecek veri yoksa ya da eldeki veri başka bağlama aitse → error varyantı;
 *      aynı bağlamın verisi varsa veri kalır, üstte ince uyarı.
 *   4) Sayaç/özet sayıları yüklenirken ve hatada "—", asla 0.
 *   5) Yükleme hatasının tek kanalı bu kart: toast/pencere yok (isteğe
 *      { abpHandleError: false }); toast/pencere İŞLEM hatalarına. 401 yine merkezi pencerede.
 *   6) Hata/veri bayrakları "son istek kazanır" bekçisinin arkasında yazılır.
 *
 * Standalone kullanılabilir; WidgetShell tarafından da inline gösterilir.
 */

const VARIANTS = {
    default: { ring: 'bg-neutral-100 text-neutral-500',  text: 'text-text-tertiary' },
    success: { ring: 'bg-positive-50 text-positive-600', text: 'text-text-secondary' },
    info:    { ring: 'bg-brand-50 text-brand-600',       text: 'text-text-secondary' },
    error:   { ring: 'bg-surface-sunken text-text-secondary', text: 'text-text-secondary', icon: 'fa-triangle-exclamation' },
    locked:  { ring: 'bg-surface-sunken text-text-secondary', text: 'text-text-secondary', icon: 'fa-lock' },
};

const fetchErrorText = () => t('Common:FetchError', 'Veri alınırken bir hata oluştu.');

function EmptyState({
    icon,
    title,
    description,
    action,            /* ReactNode — Button, link vs. */
    variant = 'default',
    compact = false,   /* compact: ikonu küçült, padding düşür — Bento widget için */
    onRetry,           /* () => void — "Tekrar dene" düğmesi (argümansız çağrılır) */
    error,             /* yalnız variant="error": yükleme hatası nesnesi (açıklama kaynağı) */
    className,
}) {
    const v = VARIANTS[variant] ?? VARIANTS.default;
    const isError = variant === 'error';
    const shownIcon = icon ?? (v.icon ? <i className={`fa ${v.icon}`} /> : null);
    const shownDescription = description !== undefined || !isError
        ? description
        : error !== undefined ? errorMessage(error, fetchErrorText()) : fetchErrorText();
    const shownAction = action ?? (onRetry ? (
        <Button
            size="sm"
            variant="outline"
            leadingIcon={<i className="fa fa-rotate-right" aria-hidden="true" />}
            onClick={() => onRetry()}
        >
            {t('Common:Retry', 'Tekrar dene')}
        </Button>
    ) : null);
    return (
        <div
            /* Hata hemen duyurulur (alert zaten assertive); diğerleri nazik. */
            role={isError ? 'alert' : 'status'}
            aria-live={isError ? undefined : 'polite'}
            className={cn(
                'flex flex-col items-center justify-center text-center',
                compact ? 'gap-2 py-3' : 'gap-3 py-6',
                className,
            )}
        >
            {shownIcon && (
                <span
                    className={cn(
                        'inline-flex items-center justify-center rounded-full',
                        v.ring,
                        compact ? 'h-8 w-8' : 'h-12 w-12',
                    )}
                    aria-hidden="true"
                >
                    {shownIcon}
                </span>
            )}
            {title && (
                <p className={cn(
                    'font-medium text-text-primary',
                    compact ? 'text-sm' : 'text-base',
                )}>
                    {title}
                </p>
            )}
            {shownDescription && (
                <p className={cn('max-w-sm', v.text, compact ? 'text-xs' : 'text-sm')}>
                    {shownDescription}
                </p>
            )}
            {shownAction && <div className="mt-1">{shownAction}</div>}
        </div>
    );
}

export { EmptyState };
