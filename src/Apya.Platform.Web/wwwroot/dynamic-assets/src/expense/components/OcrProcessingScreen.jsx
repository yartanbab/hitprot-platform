import React from 'react';
import { Skeleton } from '../../components/ui';

/**
 * OCR çalışırken gösterilen ekran. UX strategy doc § 5:
 * 150-1000ms aralığı için skeleton + ilerleme metni.
 * AI'ın "düşündüğü" hissi için 3 aşamalı checklist'le okunabilir.
 */
const STAGES = [
    'Görüntü temizleniyor...',
    'Metin tanınıyor (OCR)...',
    'Alanlar çıkartılıyor...',
];

export function OcrProcessingScreen({ previewUrl }) {
    const [stage, setStage] = React.useState(0);

    React.useEffect(() => {
        const t1 = setTimeout(() => setStage(1), 350);
        const t2 = setTimeout(() => setStage(2), 800);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <div className="flex flex-col items-center gap-4 p-6">
            {previewUrl && (
                <img
                    src={previewUrl}
                    alt="Çekilen fatura"
                    className="max-h-48 rounded-md border border-default object-contain"
                />
            )}
            <div className="w-full max-w-xs flex flex-col gap-2">
                {STAGES.map((label, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                        {idx < stage && <CheckIcon />}
                        {idx === stage && <SpinnerIcon />}
                        {idx > stage && <DotIcon />}
                        <span className={idx <= stage ? 'text-text-primary' : 'text-text-tertiary'}>
                            {label}
                        </span>
                    </div>
                ))}
            </div>
            <div className="w-full max-w-xs flex flex-col gap-2 mt-2">
                <Skeleton height={12} />
                <Skeleton height={12} className="w-3/4" />
                <Skeleton height={12} className="w-1/2" />
            </div>
        </div>
    );
}

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
         className="text-positive-500 flex-none">
        <path d="M20 6 9 17l-5-5"/>
    </svg>
);

const SpinnerIcon = () => (
    <svg className="animate-spin text-brand-500 flex-none" width="16" height="16"
         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/>
    </svg>
);

const DotIcon = () => (
    <span className="inline-block h-1.5 w-1.5 rounded-full bg-neutral-300 mx-[2px] flex-none" aria-hidden="true" />
);
