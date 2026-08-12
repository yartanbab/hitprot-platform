import React, { useState, useEffect } from 'react';
import { useTaskTimeTracking } from '../../hooks/useTaskTimeTracking';
import { TAB_CARD, TabCardHeader, TabEmptyState, Avatar, fmtDuration, fmtClock } from '../tabPrimitives';

// FAZ 10-B: RisksTabV3 kaldırıldı — uydurma bir risk kaydı basıyordu ("Otel
// Kontenjan Doluluk Riski / Orta Risk"). Kodu zaten UNBUILT_CODES'ta olduğu için
// ekranda hiç render edilmiyordu; ulaşılamaz ölü koddu.

// FAZ 10-B: ApprovalsTabV3 kaldırıldı — sabit uydurma bir onay kaydı basıyordu
// ("… tarafından 10.07.2026'da onaylandı"). Onay akışı backend'i yok; sekme artık
// TaskUnbuiltTabV3 boş durumunu gösteriyor (bkz. featureCatalogV3 UNBUILT_CODES).

// 3. Zaman Takibi Tab (gerçek backend: start/stop/getTimeLogs)
// fmtClock/fmtDuration artık tabPrimitives'ten geliyor (diğer sekmelerle ortak).
function fmtTime(iso) {
    if (!iso) return '—';
    return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}

/**
 * Zaman Takibi sekmesi (V4 tasarım dili) — 58px yuvarlak başlat/durdur,
 * mono HH:MM:SS sayaç, tahmin kullanım çubuğu ve kayıt listesi.
 *
 * Tahmin çubuğu yalnız görevde `estimatedHours` doluysa gösterilir; yoksa
 * uydurma bir tavan çizilmez.
 */
export function TimeTrackingTabV3({ taskId, task = {} }) {
    const tt = useTaskTimeTracking(taskId);
    const activeForThis = tt.activeLog && tt.activeLog.taskId === taskId ? tt.activeLog : null;
    const [now, setNow] = useState(() => Date.now());

    // Sayaç çalışırken saniyede bir tik
    useEffect(() => {
        if (!activeForThis) return undefined;
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, [activeForThis]);

    const liveSeconds = activeForThis
        ? Math.max(0, Math.floor((now - new Date(activeForThis.startTime).getTime()) / 1000))
        : 0;
    const completedSeconds = tt.logs.reduce((acc, l) => acc + (l.secondsSpent || 0), 0);
    const totalSeconds = completedSeconds + liveSeconds;

    const estimateHours = task?.estimatedHours ?? null;
    const estimateSeconds = estimateHours ? estimateHours * 3600 : 0;
    const usedPct = estimateSeconds ? Math.min(100, Math.round((totalSeconds / estimateSeconds) * 100)) : 0;
    const remainingSeconds = estimateSeconds ? Math.max(0, estimateSeconds - totalSeconds) : 0;

    const handleToggle = async () => {
        try {
            if (activeForThis) await tt.stop(); else await tt.start();
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Zaman takibi güncellenemedi.');
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-5 flex-wrap p-[22px] rounded-2xl border border-subtle bg-surface-base shadow-xs">
                <div className="flex items-center gap-[18px]">
                    <button
                        type="button"
                        onClick={handleToggle}
                        disabled={tt.isMutating}
                        aria-label={activeForThis ? 'Sayacı durdur' : 'Süre başlat'}
                        className={`flex shrink-0 items-center justify-center h-[58px] w-[58px] rounded-full text-white shadow-md cursor-pointer disabled:opacity-60 ${
                            activeForThis ? 'bg-negative' : 'bg-success'
                        }`}
                    >
                        <i className={`fa-solid ${tt.isMutating ? 'fa-circle-notch fa-spin' : activeForThis ? 'fa-pause' : 'fa-play'} text-[19px]`} />
                    </button>
                    <div className="flex flex-col gap-[3px]">
                        <span
                            className="font-mono text-[32px] font-bold tracking-[-.03em] text-text-primary"
                            style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                            {fmtClock(totalSeconds)}
                        </span>
                        <span className="text-[12px] font-medium text-text-tertiary">
                            {activeForThis ? 'Kayıt sürüyor' : 'Sayaç duraklatıldı'}
                        </span>
                    </div>
                </div>

                {estimateSeconds > 0 && (
                    <div className="flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]">
                        <div className="flex items-baseline justify-between">
                            <span className="text-[11.5px] font-bold text-text-secondary">Tahmin kullanımı</span>
                            <span className="font-mono text-[12.5px] font-bold text-text-primary">
                                {fmtDuration(totalSeconds)} / {estimateHours}s
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-neutral-subtle overflow-hidden">
                            <div className="h-full rounded-full bg-warning" style={{ width: `${usedPct}%` }} />
                        </div>
                        <span className="text-[11px] text-text-tertiary">
                            Kalan tahmini süre: {fmtDuration(remainingSeconds)}
                        </span>
                    </div>
                )}
            </div>

            <div className={TAB_CARD}>
                <TabCardHeader title="Zaman kayıtları" />
                {tt.isLoading ? (
                    <p className="m-0 px-4 py-5 text-[12.5px] text-text-tertiary">Yükleniyor…</p>
                ) : tt.logs.length === 0 ? (
                    <TabEmptyState
                        icon="fa-stopwatch"
                        title="Henüz zaman kaydı yok"
                        description="Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
                    />
                ) : (
                    tt.logs.map((log) => {
                        const running = !log.endTime;
                        return (
                            <div
                                key={log.id}
                                className="flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised"
                            >
                                <Avatar name={log.userName} size={26} />
                                <span className="flex-1 min-w-0 truncate text-[12.5px] text-text-primary">
                                    {log.note || log.userName || 'Kullanıcı'}
                                </span>
                                <span className="shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden">
                                    {fmtTime(log.startTime)} → {running ? 'sürüyor' : fmtTime(log.endTime)}
                                </span>
                                <span className="shrink-0 font-mono text-[12.5px] font-bold text-text-primary">
                                    {running ? 'Aktif' : fmtDuration(log.secondsSpent || 0)}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

// FAZ 10-B: AiTabV3 kaldırıldı — sabit uydurma bir "AI önerisi" basıyordu
// (sözleşme/ödeme takvimi metni). Bu görev için LLM çağrısı yok; sekme artık
// TaskUnbuiltTabV3 boş durumunu gösteriyor.

// FAZ 10-B: CustomFieldsTabV3 kaldırıldı — uydurma alanlar basıyordu ("Vize
// Kontenjanı: 60 Kişi", "Uçuş Kodu: TK-1492"). Ulaşılamaz ölü koddu (UNBUILT_CODES).

// FAZ 10-B: AutomationsTabV3 kaldırıldı — "Aktif" rozetli sabit uydurma bir kural
// basıyordu ("Görev 'Tamamlandı' olunca ilgili faturayı otomatik oluştur"), oysa
// böyle bir kural motoru YOK. Sekme artık TaskUnbuiltTabV3 boş durumunu gösteriyor.

// FAZ 10-B: EmailsTabV3 kaldırıldı — uydurma bir e-posta kaydı basıyordu
// ("Gönderen: info@hilton.com • 10.07.2026"). Ulaşılamaz ölü koddu.

// FAZ 10-B: GalleryTabV3 kaldırıldı — uydurma dosya adlarıyla sahte bir galeri
// basıyordu (Otel_Lobi.jpg vb.). Ulaşılamaz ölü koddu.

// FAZ 10-B: DashboardTabV3 kaldırıldı — uydurma KPI'lar basıyordu (%100
// tamamlanma, 9.8/10 verimlilik skoru, 0 gün gecikme). Ulaşılamaz ölü koddu.
