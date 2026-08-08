import React, { useState } from 'react';
import { Button } from '../../../components/ui';

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

// 2. Onaylar Tab
export function ApprovalsTabV3() {
    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-subtle pb-4">
                <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-stamp text-primary text-base" />
                    <h3 className="text-[15px] font-bold text-text-primary">Onay Süreçleri & İmza Akışı</h3>
                </div>
                <Button size="sm" variant="primary" icon="fa-check">Onay İste</Button>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-success-subtle/30 border border-success/30">
                <div className="flex items-center gap-3">
                    <i className="fa-solid fa-circle-check text-success text-lg" />
                    <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-text-primary">Operasyon Direktörlüğü Onayı</span>
                        <span className="text-xs text-text-tertiary">Yakup B. tarafından 10.07.2026'da onaylandı.</span>
                    </div>
                </div>
                <span className="text-xs font-bold text-success">Onaylandı</span>
            </div>
        </div>
    );
}

// 3. Zaman Takibi Tab
export function TimeTrackingTabV3() {
    const [running, setRunning] = useState(false);
    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-subtle pb-4">
                <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-stopwatch text-primary text-base" />
                    <h3 className="text-[15px] font-bold text-text-primary">Zaman Takibi & Sayaç</h3>
                </div>
                <Button 
                    size="sm" 
                    variant={running ? 'destructive' : 'primary'} 
                    icon={running ? 'fa-stop' : 'fa-play'}
                    onClick={() => setRunning(!running)}
                >
                    {running ? 'Sayacı Durdur' : 'Süre Başlat'}
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-sunken/40 border border-subtle flex flex-col gap-1">
                    <span className="text-xs font-bold text-text-tertiary uppercase">Toplam Harcanan Süre</span>
                    <span className="text-2xl font-bold text-primary">12 Saat 40 Dk</span>
                </div>
                <div className="p-4 rounded-xl bg-surface-sunken/40 border border-subtle flex flex-col gap-1">
                    <span className="text-xs font-bold text-text-tertiary uppercase">Tahmini Kalan</span>
                    <span className="text-2xl font-bold text-text-secondary">3 Gün</span>
                </div>
            </div>
        </div>
    );
}

// 4. Yapay Zeka Tab
export function AiTabV3() {
    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-subtle pb-4">
                <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-sparkles text-indigo-600 text-base" />
                    <h3 className="text-[15px] font-bold text-text-primary">Apya AI Asistan & Analiz</h3>
                </div>
                <Button size="sm" variant="primary" icon="fa-wand-magic-sparkles">Görevi Analiz Et</Button>
            </div>
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 flex flex-col gap-2">
                <span className="text-[13px] font-bold text-indigo-900 dark:text-indigo-200">AI Önerisi:</span>
                <p className="text-[13px] text-indigo-700 dark:text-indigo-300 leading-relaxed">
                    Sözleşme taslağı incelendiğinde ödeme takviminin 15 gün vadeli olduğu tespit edildi. Finans ekibine bildirim gönderilmesi tavsiye edilir.
                </p>
            </div>
        </div>
    );
}

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

// 6. Otomasyonlar Tab
export function AutomationsTabV3() {
    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-subtle pb-4">
                <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-wand-magic-sparkles text-indigo-600 text-base" />
                    <h3 className="text-[15px] font-bold text-text-primary">Görev Otomasyonları</h3>
                </div>
                <Button size="sm" variant="outline" icon="fa-plus">Kural Ekle</Button>
            </div>
            <div className="p-3.5 rounded-xl border border-subtle bg-surface-sunken/40 flex items-center justify-between">
                <span className="text-[13px] font-medium text-text-primary">Görev 'Tamamlandı' olunca ilgili faturayı otomatik oluştur.</span>
                <span className="text-xs font-bold text-success bg-success-subtle px-2 py-0.5 rounded">Aktif</span>
            </div>
        </div>
    );
}

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
