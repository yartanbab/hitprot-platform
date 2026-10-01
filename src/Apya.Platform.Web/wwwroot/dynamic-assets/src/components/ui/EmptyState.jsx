import React, { useEffect, useId, useRef } from 'react';
import { t } from '../../lib/i18n';
import { errorMessage } from '../../lib/api/abpErrors';

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
 * onRetry: verilirse kanonik "Tekrar dene" (RetryButton, aşağıda) çizilir ve ARGÜMANSIZ
 * çağrılır (react-query refetch'ine MouseEvent sızmaz). Açık `action` her zaman onu ezer.
 * retrying: yeniden deneme sürüyor — kart yerinde kalır, düğme meşgul (bkz. madde 7).
 * description: undefined → varsayılan (yukarıda), null → açıklama yok.
 *
 * BAĞIMLILIKSIZ (Faz 4 karar 11): yalnız react, lib/i18n ve lib/api/abpErrors içe aktarılır.
 * `cn` (clsx + tailwind-merge) ve `Button` (radix Slot + cva) ui-vendor parçasını (~55 KB gz)
 * getirir; Formlar/Yanıtlar gibi hafif adalar bu bileşen yüzünden onu yüklemesin diye sınıflar
 * düz birleştirilir (className sona eklenir), düğme sabit sınıflıdır. Kilit: EmptyState.test.
 *
 * KANONİK "TEKRAR DENE" (Faz 4 karar 10 — React ve Razor ortak): outline + accent.
 *   Razor: <button type="button" class="btn btn-sm btn-outline-primary …">
 *            <i class="fa fa-rotate-right me-1" aria-hidden="true"></i>Tekrar dene</button>
 *   React: RetryButton — AYNI Bootstrap sınıfları. Uygulama sayfalarında Bootstrap ve
 *          apya-theme-bridge.css zaten yüklü: görünüm iki temada da Razor'la yapısal olarak
 *          özdeş (renk, köşe, yazı). Tailwind'le taklit EDİLMEZ: Bootstrap'ın
 *          `.border { … !important }` yardımcısı Tailwind `border border-accent`'i eziyor,
 *          çerçeve griye dönüyordu. Bootstrap'ın yüklenmediği tek yüzey herkese açık form
 *          (/f/{slug}, Layout=null): karşılık kuralları o sayfanın satır içi stilinde
 *          (Pages/F/Index.cshtml). Metin HER YERDE Common:Retry ("Yeniden dene" yok).
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
 *      Yardımcı yüklemeler (KPI, süreç şeridi özeti, öneri şeridi, kurulum durumu) kart
 *      çizmez: "—" / "Yüklenemedi" ya da sessiz, nötr düşüş — sahte boş/sıfır iddiası yok.
 *   6) Hata/veri bayrakları "son istek kazanır" bekçisinin arkasında yazılır.
 *   7) Odak: "Tekrar dene" kendini sökmez. Yeniden deneme sürerken (hata varken yükleniyor)
 *      kart iskelete DÖNMEZ; çağıran `retrying` verir → düğme aria-disabled + aria-busy +
 *      dönen ikon, tıklama yutulur. `disabled` DEĞİL: Chromium odaklı düğme disabled olunca
 *      odağı body'ye atar (ölçüldü). Düğme aria-describedby ile kartın başlığına bağlı:
 *      aynı ekrandaki birden çok "Tekrar dene" kendi başlığıyla okunur. Yeniden deneme
 *      BAŞARILI olunca kart içerikle yer değiştirir ve düğme sökülür: odak <body>'ye
 *      düşmesin diye çağıran useRetryFocus (aşağıda) ile içerik kabına taşır.
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

/* cn yerine: tailwind-merge'e gerek yok (çakışan sınıf üretilmiyor), ui-vendor gelmesin. */
const classes = (...list) => list.filter(Boolean).join(' ');

const fetchErrorText = () => t('Common:FetchError', 'Veri alınırken bir hata oluştu.');

/* Razor'daki kanonik düğmeyle (apya-load-state.js errorHtml) AYNI sınıflar; kilit: EmptyState.test
   "Razor errorHtml ile aynı". Sabit dize: Button'a dayanmaz. aria-disabled:* yalnız meşgul
   durumun soluklaşması — Bootstrap'ta karşılığı yok, sınıf adı da Bootstrap'la çakışmaz. */
const RETRY_BUTTON_CLASS = 'btn btn-sm btn-outline-primary aria-disabled:opacity-50 aria-disabled:pointer-events-none';
const RETRY_ICON_CLASS = 'fa fa-rotate-right me-1';

/**
 * RetryButton — kanonik "Tekrar dene" (kart dışı yerler için: şerit, satır içi uyarı).
 * onRetry ARGÜMANSIZ çağrılır. retrying: aria-disabled + aria-busy + dönen ikon; tıklama
 * yutulur, odak düğmede kalır. Diğer özellikler (aria-describedby…) düğmeye geçer.
 */
function RetryButton({ onRetry, retrying = false, ...rest }) {
    return (
        <button
            {...rest}
            type="button"
            className={RETRY_BUTTON_CLASS}
            aria-disabled={retrying || undefined}
            aria-busy={retrying || undefined}
            onClick={() => { if (!retrying) onRetry(); }}
        >
            <i className={retrying ? `${RETRY_ICON_CLASS} fa-spin` : RETRY_ICON_CLASS} aria-hidden="true" />
            <span>{t('Common:Retry', 'Tekrar dene')}</span>
        </button>
    );
}

/**
 * useRetryFocus — başarılı "Tekrar dene"den sonra odak kaybolmasın (sözleşme madde 7).
 * Kart içerikle yer değiştirince düğme sökülür ve odak <body>'ye düşer: klavye ve ekran
 * okuyucu kullanıcısı sayfanın başına döner. Düğme ODAKLIYKEN basıldıysa ve içerik
 * çizildiğinde odak gerçekten düşmüşse içerik kabına taşınır (jQuery karşılığı:
 * apya-load-state.js failTable → tablo). Kullanıcı arada başka yere geçtiyse odak çalınmaz;
 * yeniden deneme yine düşerse kart da odak da yerinde kalır.
 *
 *   const listFocus = useRetryFocus(!loading && !loadError);   // içerik çizildi mi
 *   <div ref={listFocus.contentRef} tabIndex={-1}>
 *     {loadError ? <EmptyState variant="error" onRetry={listFocus.retry(load)} … /> : …içerik…}
 *   </div>
 */
function useRetryFocus(contentShown) {
    const contentRef = useRef(null);
    const armed = useRef(false);

    useEffect(() => {
        if (!contentShown || !armed.current) return;
        armed.current = false;
        const active = document.activeElement;
        // preventScroll: içerik kartın yerinde, kullanıcı zaten orada — uzun liste sayfayı zıplatmasın.
        if (!active || active === document.body) contentRef.current?.focus({ preventScroll: true });
    }, [contentShown]);

    /* onRetry sarmalayıcısı: çağrı düğmenin tıklamasından gelir; o an odak sayfadaysa (fareyle
       tıklamada düğmeyi odaklamayan tarayıcı) taşınacak bir odak da yoktur. */
    const retry = (onRetry) => () => {
        const active = document.activeElement;
        armed.current = Boolean(active) && active !== document.body;
        onRetry();
    };

    return { contentRef, retry };
}

function EmptyState({
    icon,
    title,
    description,
    action,            /* ReactNode — Button, link vs. */
    variant = 'default',
    compact = false,   /* compact: ikonu küçült, padding düşür — Bento widget için */
    onRetry,           /* () => void — "Tekrar dene" düğmesi (argümansız çağrılır) */
    retrying = false,  /* yeniden deneme sürüyor: kart kalır, düğme meşgul */
    error,             /* yalnız variant="error": yükleme hatası nesnesi (açıklama kaynağı) */
    className,
}) {
    const titleId = useId();
    const v = VARIANTS[variant] ?? VARIANTS.default;
    const isError = variant === 'error';
    const shownIcon = icon ?? (v.icon ? <i className={`fa ${v.icon}`} /> : null);
    const shownDescription = description !== undefined || !isError
        ? description
        : error !== undefined ? errorMessage(error, fetchErrorText()) : fetchErrorText();
    // Başlık kimliği yalnız düğme ona bağlanırken basılır: diğer kullanımların çıktısı aynı kalır.
    const describedBy = !action && onRetry && title ? titleId : undefined;
    const shownAction = action ?? (onRetry ? (
        <RetryButton onRetry={onRetry} retrying={retrying} aria-describedby={describedBy} />
    ) : null);
    return (
        <div
            /* Hata hemen duyurulur (alert zaten assertive); diğerleri nazik. */
            role={isError ? 'alert' : 'status'}
            aria-live={isError ? undefined : 'polite'}
            className={classes(
                'flex flex-col items-center justify-center text-center',
                compact ? 'gap-2 py-3' : 'gap-3 py-6',
                className,
            )}
        >
            {shownIcon && (
                <span
                    className={classes(
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
                <p id={describedBy} className={classes(
                    'font-medium text-text-primary',
                    compact ? 'text-sm' : 'text-base',
                )}>
                    {title}
                </p>
            )}
            {shownDescription && (
                <p className={classes('max-w-sm', v.text, compact ? 'text-xs' : 'text-sm')}>
                    {shownDescription}
                </p>
            )}
            {shownAction && <div className="mt-1">{shownAction}</div>}
        </div>
    );
}

export { EmptyState, RetryButton, useRetryFocus };
