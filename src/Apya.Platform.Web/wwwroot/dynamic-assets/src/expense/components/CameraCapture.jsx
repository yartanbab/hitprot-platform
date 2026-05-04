import React, { useCallback, useRef } from 'react';
import { Button } from '../../components/ui';
import { useToast } from '../../lib/feedback';
import { cn } from '../../lib/utils';

/**
 * CameraCapture — `<input type=file accept=image/* capture=environment>` ile
 * mobil cihazda direkt arka kamerayı açar. Desktop'ta dosya seçici / drop zone.
 *
 * APYA-107 refinements:
 *   - Tüm dropzone tek tap-target. Strategy: T+0.3 → 1-tap to camera.
 *     (Modern browser'lar useEffect mount'tan file-input.click() çağrısını
 *     gesture-gate yapıyor; auto-open yapılamıyor. Onun yerine tap target'ı
 *     büyütüp algılanabilirliği artırıyoruz — fiilen tek dokunuş.)
 *   - alert() → toast.error (APYA-105 entegrasyonu)
 *   - file blob olduğu gibi onFile'a iletilir (multipart/form-data downstream).
 */

export function CameraCapture({ onFile }) {
    const inputRef = useRef(null);
    const [dragActive, setDragActive] = React.useState(false);
    const toast = useToast();

    const triggerPicker = useCallback(() => inputRef.current?.click(), []);

    const handleFile = useCallback((file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Resim dosyası gerekli', {
                description: 'Lütfen JPG/PNG/HEIC fatura görseli seç.',
            });
            return;
        }
        /* Maks 10MB — büyük dosyalar mobilde upload'ı yavaşlatır.
           Compress/resize ileri ticket'ta (canvas ile downscale). */
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Dosya çok büyük', {
                description: 'En fazla 10 MB. Lütfen daha düşük çözünürlükte çek.',
            });
            return;
        }
        onFile(file);
    }, [onFile, toast]);

    return (
        <div
            role="button"
            tabIndex={0}
            aria-label="Faturayı çek — kamerayı aç ya da görüntü sürükle"
            onClick={triggerPicker}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); triggerPicker(); } }}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFile(e.dataTransfer.files?.[0]);
            }}
            className={cn(
                'flex flex-col items-center justify-center gap-4',
                'border-2 border-dashed rounded-xl p-8',
                'min-h-[60vh] mobile:min-h-[50vh]',
                'cursor-pointer select-none',
                'transition-colors duration-fast',
                'focus-visible:outline-none focus-visible:shadow-focus',
                dragActive ? 'border-brand-500 bg-brand-50' : 'border-default bg-surface-raised hover:border-strong',
            )}
        >
            <CameraIcon />
            <div className="text-center max-w-xs pointer-events-none">
                <p className="text-base font-semibold text-text-primary">Faturayı çek</p>
                <p className="text-sm text-text-secondary mt-1">
                    Mobilde direkt kamera açılır. Masaüstünde dosya sürükle ya da tıkla.
                    AI tutarı, tarihi ve tedarikçiyi otomatik okur.
                </p>
            </div>

            <Button
                size="lg"
                variant="primary"
                /* Click bubbling parent'a gitmesin diye stopPropagation —
                   button da kendi başına çalışır, parent dropzone da. */
                onClick={(e) => { e.stopPropagation(); triggerPicker(); }}
                className="min-w-[220px]"
            >
                Kamerayı Aç
            </Button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(e) => handleFile(e.target.files?.[0])}
            />
        </div>
    );
}

function CameraIcon() {
    return (
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
             className="text-text-tertiary" aria-hidden="true">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="4"/>
        </svg>
    );
}
