import React, { useState } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { OcrProcessingScreen } from './components/OcrProcessingScreen';
import { ExpenseFormSheet } from './components/ExpenseFormSheet';
import { SuccessConfirmation } from './components/SuccessConfirmation';
import { useOcrParse, useSubmitExpense } from './hooks/useExpenseCapture';
import { ThemeToggle } from '../components/ui';

/**
 * State machine — 4 phase:
 *   capture → ocr → form → success → (capture | exit)
 * Geri navigasyon basit: her phase'in onCancel'ı bir önceki phase'e döner
 * ya da capture'a sıfırlar.
 */
const PHASES = { CAPTURE: 'capture', OCR: 'ocr', FORM: 'form', SUCCESS: 'success' };

export function ExpenseCaptureFlow() {
    const [phase, setPhase] = useState(PHASES.CAPTURE);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [submittedResult, setSubmittedResult] = useState(null);

    const ocr = useOcrParse();
    const submit = useSubmitExpense();

    const handleFile = async (file) => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
        setPhase(PHASES.OCR);
        try {
            await ocr.mutateAsync(file);
            setPhase(PHASES.FORM);
        } catch (_err) {
            /* OCR fail — kullanıcı boş form'la devam edebilsin */
            setPhase(PHASES.FORM);
        }
    };

    const handleSubmit = async (payload) => {
        const result = await submit.mutateAsync(payload);
        setSubmittedResult(result);
        setPhase(PHASES.SUCCESS);
    };

    const handleAddAnother = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setSubmittedResult(null);
        ocr.reset();
        submit.reset();
        setPhase(PHASES.CAPTURE);
    };

    const handleClose = () => {
        /* Saha kullanıcısı için "geri dashboard'a" — basit redirect */
        window.location.href = '/Dashboard';
    };

    return (
        <div className="min-h-screen bg-surface-base text-text-primary">
            <header className="sticky top-0 z-sticky bg-surface-raised/95 backdrop-blur-sm border-b border-default px-4 py-3 flex items-center justify-between">
                <h1 className="text-base font-semibold">Masraf Yakala</h1>
                <ThemeToggle />
            </header>

            <main className="max-w-2xl mx-auto p-4">
                {phase === PHASES.CAPTURE && <CameraCapture onFile={handleFile} />}
                {phase === PHASES.OCR && <OcrProcessingScreen previewUrl={previewUrl} />}
                {phase === PHASES.SUCCESS && (
                    <SuccessConfirmation
                        result={submittedResult}
                        onAddAnother={handleAddAnother}
                        onClose={handleClose}
                    />
                )}
            </main>

            {/* Form sheet — phase=form iken open=true; cancel kapatınca capture'a döner */}
            <ExpenseFormSheet
                open={phase === PHASES.FORM}
                onOpenChange={(open) => {
                    if (!open) setPhase(PHASES.CAPTURE);
                }}
                ocrResult={ocr.data}
                onSubmit={handleSubmit}
                isSubmitting={submit.isPending}
            />
        </div>
    );
}
