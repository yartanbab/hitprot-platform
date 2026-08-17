import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';

/**
 * Görev detayının ÜSTÜNE açılan katmanlar (özellik seçici, transfer diyaloğu,
 * alt görev paneli) için ortak kabuk.
 *
 * Neden var: bu katmanlar eskiden `createPortal(..., document.body)` ile
 * basılıyordu. Görev detayı modal olarak açıldığında Radix Dialog üç ayrı
 * mekanizmayla body'yi kilitliyor ve katman ölü kalıyordu:
 *   1. `body { pointer-events: none }` → kartlar tıklanamıyor
 *   2. react-remove-scroll → içerik kaydırılamıyor
 *   3. FocusScope (trapped) → odak anında geri çekiliyor, input'a yazılamıyor
 * `presentation === 'page'` modunda modal olmadığı için sorun görünmüyordu.
 *
 * Çözüm: katmanı Radix'in kendi yığınına iç içe dialog olarak sok. Radix en
 * üstteki katmana pointer-events/scroll/odak hakkını verir, Esc'i yalnız ona
 * yollar ve alttaki modalı "dışarı tıklama" ile kapatmaz.
 */
export function OverlayLayerV3({ open, onClose, label, children }) {
    return (
        <RadixDialog.Root
            open={open}
            onOpenChange={(next) => { if (!next) onClose?.(); }}
        >
            <RadixDialog.Portal>
                {/* Overlay GÖRSEL İÇİN DEĞİL, scroll kilidi için: Radix'te
                    react-remove-scroll `Content`'te değil `Overlay`'de yaşar
                    ("shards: [contentRef]"). Overlay basılmazsa en üstteki aktif
                    kilit alttaki görev detayı modalınınki olarak kalır; onun
                    shard'ı yalnız kendi Content'ini kapsadığı için bu katmanın
                    içindeki her tekerlek olayı "dışarısı" sayılıp iptal edilir
                    → özellik seçici / transfer / alt görev panelleri fare
                    tekerleğiyle kaydırılamıyordu (kaydırma çubuğu çalışıyordu).
                    Arka planı çocuk katman kendi çiziyor: bu yüzden saydam ve
                    tıklamaya kapalı (pointer-events Radix tarafından satır içi
                    'auto' veriliyor, sınıfla ezilemez). */}
                <RadixDialog.Overlay className="fixed inset-0" style={{ pointerEvents: 'none' }} />
                <RadixDialog.Content asChild aria-describedby={undefined}>
                    <div className="fixed inset-0 z-modal">
                        <RadixDialog.Title className="sr-only">{label}</RadixDialog.Title>
                        {children}
                    </div>
                </RadixDialog.Content>
            </RadixDialog.Portal>
        </RadixDialog.Root>
    );
}
