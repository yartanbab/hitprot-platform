import React, { useCallback, useEffect, useState } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { OcrProcessingScreen } from './components/OcrProcessingScreen';
import { ExpenseFormSheet } from './components/ExpenseFormSheet';
import { SuccessConfirmation } from './components/SuccessConfirmation';
import {
    useBudgetLines, useCaptureContext, useOcrParse, useOfflineState, useQueueFlush, useSubmitExpense,
} from './hooks/useExpenseCapture';
import { ThemeToggle } from '../components/ui';
import { useToast } from '../lib/feedback';
import { formatMoney } from '../lib/utils';

/**
 * State machine — 4 phase:
 *   capture → ocr → form → success → (capture | exit)
 *
 * APYA-107 refinements:
 *   - submit başarılı → toast.success "Kaydedildi" + 800ms sonra capture'a
 *     otomatik dönüş (saha kullanıcısı ardışık masraf girer; success screen
 *     zaman kaybı). Kullanıcı önce close ederse success screen kalır.
 *   - submit hatası → toast.error + form açık kalır (kullanıcı düzeltsin).
 *   - OCR fail → ham form'la devam, kullanıcı manuel doldurur (sessiz fallback).
 */
const PHASES = { CAPTURE: 'capture', OCR: 'ocr', FORM: 'form', SUCCESS: 'success' };
const SUCCESS_AUTO_RESET_MS = 1500;        /* Success ekranı görünür kalsın ki
                                              kullanıcı "kaydedildi"yi okusun;
                                              sonra otomatik capture'a dön. */

export function ExpenseCaptureFlow() {
    const [phase, setPhase] = useState(PHASES.CAPTURE);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [submittedResult, setSubmittedResult] = useState(null);
    const [projectId, setProjectId] = useState(null);

    const context = useCaptureContext();
    const lines = useBudgetLines(projectId);
    const { isOnline, queued, refreshQueued } = useOfflineState();

    const ocr = useOcrParse();
    const submit = useSubmitExpense();
    const toast = useToast();

    const handleFile = useCallback(async (file) => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
        setPhase(PHASES.OCR);
        try {
            await ocr.mutateAsync(file);
            setPhase(PHASES.FORM);
        } catch (err) {
            /* OCR fail — form'u boş aç, kullanıcı manuel doldursun. */
            toast.warning('Otomatik okuma başarısız', {
                description: 'Alanları manuel girebilirsin.',
            });
            setPhase(PHASES.FORM);
        }
    }, [previewUrl, ocr, toast]);

    const resetForCapture = useCallback(() => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setSubmittedResult(null);
        ocr.reset();
        submit.reset();
        setPhase(PHASES.CAPTURE);
    }, [previewUrl, ocr, submit]);

    const handleSubmit = useCallback(async (payload) => {
        try {
            const outcome = await submit.mutateAsync(payload);
            setSubmittedResult(outcome.result);
            setPhase(PHASES.SUCCESS);
            refreshQueued();

            // "Kuyruğa alındı" ile "kaydedildi" AYNI ŞEY DEĞİL: kuyruktaki kayıt
            // henüz sunucuda yok. Ekranın ikisini aynı sözle anlatması, bu
            // ekranın eski hâlindeki yalanın tekrarı olurdu.
            if (outcome.queued) {
                toast.warning('Kuyruğa alındı', {
                    description: 'Bağlantı yok — bağlantı gelince otomatik gönderilecek.',
                });
            } else {
                toast.success('Masraf kaydedildi', {
                    description: `${formatMoney(payload.amount, payload.currency)} — ${payload.vendor || 'Kayıt'}`,
                });
            }
            /* Auto-reset: saha kullanıcısı seri kayıt için bekler. Kullanıcı
               success ekranındaki "Kapat"a basarsa zaten reset oluşur. */
            setTimeout(() => {
                /* Phase hâlâ SUCCESS ise reset (kullanıcı arada başka bir aksiyon
                   yapmadıysa). React state stale closure önleme: setState callback
                   içinde kontrol edemiyoruz çünkü resetForCapture stateful;
                   basitçe phase'i state ref ile kontrol etmiyoruz — SUCCESS'ten
                   capture'a dönüş idempotent. */
                resetForCapture();
            }, SUCCESS_AUTO_RESET_MS);
        } catch (err) {
            toast.error('Kayıt başarısız', {
                description: err?.message ?? 'Tekrar deneyebilirsin.',
            });
            /* Form açık kalsın — kullanıcı düzeltsin */
        }
    }, [submit, toast, resetForCapture, refreshQueued]);

    // Bağlantı gelince kuyruğu boşalt. Sonucu KULLANICIYA SÖYLER: sessizce
    // göndermek, gönderilemeyen kaydın fark edilmemesi demekti.
    const flush = useQueueFlush((summary) => {
        refreshQueued();
        if (summary.sent > 0) {
            toast.success(`${summary.sent} kayıt gönderildi`, {
                description: summary.remaining > 0
                    ? `${summary.remaining} kayıt hâlâ kuyrukta.`
                    : 'Kuyruk boşaldı.',
            });
        } else if (summary.failed > 0) {
            toast.error('Kuyruk gönderilemedi', {
                description: `${summary.remaining} kayıt cihazda bekliyor.`,
            });
        }
    });

    useEffect(() => {
        if (isOnline) { flush(); }
    }, [isOnline, flush]);

    const handleClose = useCallback(() => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        window.location.href = '/Dashboard';
    }, [previewUrl]);

    return (
        <div className="min-h-screen bg-surface-base text-text-primary">
            <header className="sticky top-0 z-sticky bg-surface-raised/95 backdrop-blur-sm border-b border-default px-4 py-3 flex items-center justify-between">
                <h1 className="text-base font-semibold">Masraf Yakala</h1>
                <div className="flex items-center gap-2">
                    {!isOnline && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-warning-subtle px-2.5 py-1 text-[11.5px] font-semibold text-warning">
                            <i className="fa-solid fa-wifi-slash" />Çevrimdışı
                        </span>
                    )}
                    {queued > 0 && (
                        <button
                            type="button"
                            onClick={flush}
                            className="inline-flex min-h-[44px] items-center gap-1 rounded-full bg-accent-subtle px-3 text-[11.5px] font-semibold text-accent"
                        >
                            <i className="fa-solid fa-cloud-arrow-up" />{queued} bekliyor
                        </button>
                    )}
                    <ThemeToggle />
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-4">
                {phase === PHASES.CAPTURE && <CameraCapture onFile={handleFile} />}
                {phase === PHASES.OCR && <OcrProcessingScreen previewUrl={previewUrl} />}
                {phase === PHASES.SUCCESS && (
                    <SuccessConfirmation
                        result={submittedResult}
                        onAddAnother={resetForCapture}
                        onClose={handleClose}
                    />
                )}
            </main>

            <ExpenseFormSheet
                open={phase === PHASES.FORM}
                onOpenChange={(open) => {
                    if (!open) setPhase(PHASES.CAPTURE);
                }}
                ocrResult={ocr.data}
                onSubmit={handleSubmit}
                isSubmitting={submit.isPending}
                context={context.data}
                lines={lines.data}
                onProjectChange={setProjectId}
                isOffline={!isOnline}
            />
        </div>
    );
}
