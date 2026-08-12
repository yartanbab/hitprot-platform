import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui';
import { useTaskTimeTracking } from '../../hooks/useTaskTimeTracking';
import { TAB_CARD, TabCardHeader, TabEmptyState, Avatar, fmtDuration, fmtClock } from '../tabPrimitives';

// 1. Riskler Tab
export function RisksTabV3() {
    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-subtle pb-4">
                <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-triangle-exclamation text-warning text-base" />
                    <h3 className="text-[15px] font-bold text-text-primary">Risk Yönetimi</h3>
                </div>
                <Button size="sm" variant="outline" icon="fa-plus">Yeni Risk Bildir</Button>
            </div>
            <div className="p-4 rounded-xl bg-surface-sunken/40 border border-subtle flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <span className="text-[13px] font-bold text-text-primary">Otel Kontenjan Doluluk Riski</span>
                    <span className="text-xs text-text-secondary">Yüksek sezonda ekstra oda ihtiyacı doğabilir.</span>
                </div>
                <span className="text-xs font-bold text-warning bg-warning-subtle px-2.5 py-1 rounded-md">Orta Risk</span>
            </div>
        </div>
    );
}

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

// 5. Özel Alanlar Tab
export function CustomFieldsTabV3() {
    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-subtle pb-4">
                <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-square-plus text-success text-base" />
                    <h3 className="text-[15px] font-bold text-text-primary">Özel Alanlar (Custom Fields)</h3>
                </div>
                <Button size="sm" variant="outline" icon="fa-plus">Alan Ekle</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-subtle bg-surface-sunken/40 flex flex-col gap-1">
                    <span className="text-xs font-bold text-text-tertiary">Vize Kontenjanı</span>
                    <span className="text-sm font-semibold text-text-primary">60 Kişi</span>
                </div>
                <div className="p-3.5 rounded-xl border border-subtle bg-surface-sunken/40 flex flex-col gap-1">
                    <span className="text-xs font-bold text-text-tertiary">Uçuş Kodu</span>
                    <span className="text-sm font-semibold text-text-primary">TK-1492</span>
                </div>
            </div>
        </div>
    );
}

// FAZ 10-B: AutomationsTabV3 kaldırıldı — "Aktif" rozetli sabit uydurma bir kural
// basıyordu ("Görev 'Tamamlandı' olunca ilgili faturayı otomatik oluştur"), oysa
// böyle bir kural motoru YOK. Sekme artık TaskUnbuiltTabV3 boş durumunu gösteriyor.

// 7. E-postalar Tab
export function EmailsTabV3() {
    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-subtle pb-4">
                <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-envelope text-primary text-base" />
                    <h3 className="text-[15px] font-bold text-text-primary">Bağlantılı E-postalar</h3>
                </div>
                <Button size="sm" variant="outline" icon="fa-plus">E-posta Bağla</Button>
            </div>
            <div className="p-3.5 rounded-xl border border-subtle bg-surface-sunken/40 flex flex-col gap-1">
                <span className="text-[13px] font-bold text-text-primary">Otel Rezervasyon Teyidi ve Sözleşme Eki</span>
                <span className="text-xs text-text-tertiary">Gönderen: info@hilton.com • 10.07.2026 09:15</span>
            </div>
        </div>
    );
}

// 8. Dosya Galerisi Tab
export function GalleryTabV3() {
    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-subtle pb-4">
                <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-image text-indigo-600 text-base" />
                    <h3 className="text-[15px] font-bold text-text-primary">Görsel Dosya Galerisi</h3>
                </div>
                <Button size="sm" variant="outline" icon="fa-upload">Görsel Yükle</Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
                {['Otel_Lobi.jpg', 'Oda_Tasarim.jpg', 'Sozlesme_Imza.jpg'].map((img, i) => (
                    <div key={i} className="flex flex-col gap-1 p-2 rounded-xl border border-subtle bg-surface-sunken/40 items-center text-center">
                        <div className="h-20 w-full bg-surface-base rounded-lg flex items-center justify-center text-text-tertiary">
                            <i className="fa-regular fa-image text-2xl" />
                        </div>
                        <span className="text-xs font-medium text-text-primary truncate w-full mt-1">{img}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 9. Gösterge Paneli Tab
export function DashboardTabV3() {
    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-subtle pb-4">
                <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-chart-pie text-primary text-base" />
                    <h3 className="text-[15px] font-bold text-text-primary">Gösterge Paneli (KPI & Metrikler)</h3>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-surface-sunken/40 border border-subtle text-center">
                    <span className="text-xs font-bold text-text-tertiary">Tamamlanma Oranı</span>
                    <div className="text-2xl font-bold text-success mt-1">%100</div>
                </div>
                <div className="p-4 rounded-xl bg-surface-sunken/40 border border-subtle text-center">
                    <span className="text-xs font-bold text-text-tertiary">Verimlilik Skoru</span>
                    <div className="text-2xl font-bold text-primary mt-1">9.8 / 10</div>
                </div>
                <div className="p-4 rounded-xl bg-surface-sunken/40 border border-subtle text-center">
                    <span className="text-xs font-bold text-text-tertiary">Gecikme</span>
                    <div className="text-2xl font-bold text-text-secondary mt-1">0 Gün</div>
                </div>
            </div>
        </div>
    );
}
