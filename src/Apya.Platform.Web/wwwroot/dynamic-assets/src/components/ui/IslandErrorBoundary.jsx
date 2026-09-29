import React, { useEffect, useId, useRef } from 'react';
import { t } from '../../lib/i18n';
import { clearPersistedQueryCache, PERSIST_THROTTLE_MS } from '../../lib/api/queryCacheStorage';
import { EmptyState, RetryButton } from './EmptyState';

/**
 * IslandErrorBoundary — React adası hata sınırı (RES-11, CAL-24). lib/mountIsland.jsx her
 * adanın kökünü EN DIŞTA bununla sarar (sağlayıcıların da dışında).
 *
 * Render ya da efekt istisnasında ada bembeyaz kalmaz: yerinde "Bu bölüm gösterilemedi" kartı
 * (EmptyState error varyantı) + kanonik "Tekrar dene" (alt ağacı sıfırdan bağlar: yeni
 * QueryClient, yeni geri yükleme) + "Sayfayı yenile". Sayfanın geri kalanı ve diğer adalar
 * çalışmaya devam eder. Olay işleyicisi ve async hataları sınıra ulaşmaz (React kökü de
 * sökmez); onları apya-telemetry.js'in window.onerror / unhandledrejection kanalı raporlar.
 *
 * ÖNBELLEK (CAL-24): çöken adanın bozuk verisi sessionStorage önbelleğine yazılmış olabilir;
 * açılışta ilk kare ondan çizildiği için ada her yüklemede yeniden çöküyordu. Çökmede önbellek
 * HEMEN silinir ve kısıt süresi dolunca BİR KEZ DAHA: kalıcılaştırıcının bekleyen (kısıtlı)
 * yazması sökülmede iptal edilmez, son (bozuk) durumu en geç PERSIST_THROTTLE_MS sonra yazar.
 * "Tekrar dene" ve "Sayfayı yenile" de siler.
 *
 * TELEMETRİ: React yakaladığı hatayı window.onerror'a iletmez (üretimde yalnız console.error);
 * ApyaTelemetry.reportIslandError bildirir (arka plan isteği, aynı hata sayfa başına bir kez).
 *
 * BAĞIMLILIK: yalnız react, lib/i18n, lib/api/queryCacheStorage ve bağımlılıksız EmptyState
 * (karar 11). Button / cn / 'components/ui' barrel'i (ui-vendor) ve queryPersister
 * (query-vendor) içe aktarılmaz: sınır TÜM adalara girer, herkese açık form dahil hafif adalar
 * bu parçaları yüklemesin. Kilit: islandMount.wiring.test.js.
 * Herkese açık formda (/f/{slug}, Layout=null) abp ve Font Awesome yok: metinler t()'nin Türkçe
 * yedeğine düşer, kartın ikonu satır içi SVG; "Tekrar dene"nin boş FA ikonunu sayfanın satır içi
 * stili gizler (Pages/F/Index.cshtml).
 */

/* Button variant="outline" size="sm" ile aynı nötr ikincil düğme; Button'a dayanmaz (ui-vendor). */
const SECONDARY_BUTTON_CLASS = [
    'inline-flex items-center justify-center gap-2 h-8 px-3 rounded-md text-sm font-medium',
    'select-none whitespace-nowrap bg-transparent text-text-primary border border-strong',
    'transition-colors duration-fast hover:bg-surface-raised',
    'focus-visible:outline-none focus-visible:shadow-focus',
].join(' ');

/* Uyarı ikonu Font Awesome'sız: herkese açık formda FA yüklü değil (ikon şekli serbest — karar 5, PD3). */
const WARNING_ICON = (
    <svg width="1.25em" height="1.25em" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.5 2.5 20h19L12 3.5z" />
        <path d="M12 10v4" />
        <path d="M12 17h.01" />
    </svg>
);

/* Falsy fırlatma (throw undefined/null/0/'') da yakalansın: sınır durumu hatanın doğruluğuyla
   ölçülür; ham falsy değerle çocuklar yeniden çizilir, ikinci fırlatma köke gider ve ada yine
   bembeyaz kalır. Sınır durumu da telemetri de bu normalleştirmeden geçer (Error aynen döner). */
const toError = (error) => error || new Error(String(error));

/**
 * Çökme kartı. retry/reload sınırdan gelir; onClose verilirse "Kapat" de çizilir (görev modalı).
 * refocus: kart "Tekrar dene"nin de düşmesiyle geldi — eski düğme söküldüğü için odak sayfaya
 * düştüyse yeni kartın "Tekrar dene"sine döner (EmptyState sözleşmesi madde 7). Odak başka
 * bir yerdeyse çalınmaz.
 */
export function IslandErrorFallback({ name, retry, reload, onClose, refocus = false }) {
    const titleId = useId();
    const cardRef = useRef(null);

    useEffect(() => {
        const active = document.activeElement;
        if (refocus && (!active || active === document.body)) cardRef.current?.querySelector('button')?.focus();
    }, [refocus]);

    return (
        <div ref={cardRef} data-island-error={name}>
            <EmptyState
                variant="error"
                icon={WARNING_ICON}
                title={<span id={titleId}>{t('Common:SectionError:Title', 'Bu bölüm gösterilemedi')}</span>}
                description={t('Common:SectionError:Description', 'Beklenmeyen bir hata oluştu. Tekrar deneyin; sorun sürerse sayfayı yenileyin.')}
                action={(
                    <div className="flex flex-wrap justify-center gap-2">
                        <RetryButton onRetry={retry} aria-describedby={titleId} />
                        <button type="button" className={SECONDARY_BUTTON_CLASS} onClick={() => reload()}>
                            {t('Common:ReloadPage', 'Sayfayı yenile')}
                        </button>
                        {onClose && (
                            <button type="button" className={SECONDARY_BUTTON_CLASS} onClick={() => onClose()}>
                                {t('Common:Close', 'Kapat')}
                            </button>
                        )}
                    </div>
                )}
            />
        </div>
    );
}

/**
 * props: name (telemetri/test etiketi: '[ada:<name>]', data-island-error),
 *        fallback? ((actions) => ReactNode; actions = { name, retry, reload, refocus }),
 *        children. Hata yokken çocuklar sarmalayıcısız döner (DOM eklenmez).
 */
export class IslandErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
        /* "Tekrar dene"den sonraki ilk çökme kartı odağı geri alsın diye (bkz. IslandErrorFallback). */
        this.retried = false;
    }

    static getDerivedStateFromError(error) {
        return { error: toError(error) };
    }

    componentDidCatch(error, info) {
        this.retried = false;
        clearPersistedQueryCache();
        setTimeout(clearPersistedQueryCache, PERSIST_THROTTLE_MS + 100);
        try {
            window.ApyaTelemetry?.reportIslandError?.(this.props.name, toError(error), info?.componentStack);
        } catch {
            /* telemetri isteğe bağlı: raporlama hatası kartı engellemez */
        }
    }

    retry = () => {
        clearPersistedQueryCache();
        this.retried = true;
        this.setState({ error: null });
    };

    reload = () => {
        clearPersistedQueryCache();
        window.location.reload();
    };

    render() {
        if (!this.state.error) return this.props.children;
        const actions = { name: this.props.name, retry: this.retry, reload: this.reload, refocus: this.retried };
        return this.props.fallback ? this.props.fallback(actions) : <IslandErrorFallback {...actions} />;
    }
}
