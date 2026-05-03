import React, { useRef } from 'react';
import { Button } from '../../components/ui';
import { cn } from '../../lib/utils';

/**
 * CameraCapture — `<input type=file accept=image/* capture=environment>` ile
 * mobil cihazda direk arka kamerayı açar. Desktop'ta dosya seçici.
 *
 * Drop zone alternatifi (drag-drop) — desktop kullanıcısı için.
 */
export function CameraCapture({ onFile }) {
    const inputRef = useRef(null);
    const [dragActive, setDragActive] = React.useState(false);

    const handleFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            /* Toast oluşmadığı için inline alert; ileride Toast component eklenince swap */
            alert('Lütfen bir resim dosyası seçin.');
            return;
        }
        onFile(file);
    };

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-4',
                'border-2 border-dashed rounded-xl p-8',
                'min-h-[60vh] mobile:min-h-[50vh]',
                'transition-colors duration-fast',
                dragActive ? 'border-brand-500 bg-brand-50' : 'border-default bg-surface-raised',
            )}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFile(e.dataTransfer.files?.[0]);
            }}
        >
            <CameraIcon />
            <div className="text-center max-w-xs">
                <p className="text-base font-semibold text-text-primary">Faturayı çek</p>
                <p className="text-sm text-text-secondary mt-1">
                    Kamerayı aç veya bilgisayardan resim sürükle. AI tutarı, tarihi ve tedarikçiyi otomatik okur.
                </p>
            </div>

            <Button
                size="lg"
                variant="primary"
                onClick={() => inputRef.current?.click()}
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
