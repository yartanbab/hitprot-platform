import React from 'react';
import { Badge, Button } from '../ui';
import { cn } from '../../lib/utils';
import { ConfidenceMeter } from './ConfidenceMeter';
import { t } from '../../lib/i18n';

/**
 * SuggestionCard — AI önerisinin standart sunum kontratı.
 *
 * UX kontratı (strategy doc § 4):
 *   1) AI rozeti — "bu bir AI önerisi" sinyali kafa karıştırmadan görünmeli
 *   2) Confidence — sayı yerine 5-dot meter
 *   3) Headline — kararsal cümle, max ~80 karakter
 *   4) Why — açıklama (hidden default; "Neden?" toggle ile açılır)
 *   5) Aksiyonlar daima aynı sırada: [Uygula] [Sonra] [İlgisiz]
 *
 * "İlgisiz" feedback'i geri besleme sinyalidir — caller server'a iletmeli.
 *
 * Optimistic UI: caller mutation'ında onMutate ile listeden çıkarsın; bu
 * component'in iç pending state'i yalnızca UI feedback (button spinner) içindir.
 */

const TONE_VARIANTS = {
    /* Neutral default — AI'ın sakin, ısrarsız tonu */
    neutral: { border: 'border-default',     ribbon: null },
    /* Pozitif — fırsat, gelişim önerisi */
    opportunity: { border: 'border-positive-100', ribbon: 'bg-positive-50' },
    /* Uyarı — bütçe aşımı, anomali */
    warning: { border: 'border-warning-100', ribbon: 'bg-warning-50' },
    /* Kritik — derhal aksiyon */
    critical: { border: 'border-critical-50 ring-1 ring-critical-50', ribbon: 'bg-critical-50' },
};

function SuggestionCard({
    headline,
    why = [],                /* string[] — bullet'lara dönüşür */
    confidence,              /* 0-1 ya da 0-100 */
    confidenceLabel,         /* opsiyonel custom label; yoksa otomatik band */
    tone = 'neutral',
    badge,                   /* opsiyonel custom badge; yoksa "AI" rozetı */
    primaryActionLabel = t('Common:Apply', 'Uygula'),
    onApply,
    onSnooze,
    onDismiss,
    pending,                 /* 'apply' | 'snooze' | 'dismiss' | null */
    className,
    children,                /* ekstra içerik — örn. before/after diff snippet */
}) {
    const [whyOpen, setWhyOpen] = React.useState(false);
    const variant = TONE_VARIANTS[tone] ?? TONE_VARIANTS.neutral;
    const hasWhy = Array.isArray(why) && why.length > 0;
    const isAnyPending = Boolean(pending);

    return (
        <article
            className={cn(
                'rounded-md border bg-surface-base',
                'transition-opacity duration-fast',
                variant.border,
                isAnyPending && 'opacity-60',
                className,
            )}
            data-suggestion-tone={tone}
        >
            {variant.ribbon && (
                /* Tone ribbon — sade renk şeridi; arka planı ezmeden tonu işaret eder */
                <div className={cn('h-1 rounded-t-md', variant.ribbon)} aria-hidden="true" />
            )}

            <div className="p-3 flex flex-col gap-2">
                {/* Üst satır: rozet + confidence meter */}
                <div className="flex items-center justify-between gap-2">
                    {badge ?? <Badge variant="ai" size="sm" withDot>AI</Badge>}
                    <ConfidenceMeter score={confidence} label={confidenceLabel} size="md" />
                </div>

                {/* Headline — kararsal cümle */}
                <p className="text-sm font-medium text-text-primary leading-snug text-balance">
                    {headline}
                </p>

                {/* Ekstra içerik (diff, mini-chart vb.) */}
                {children}

                {/* Why — progressive disclosure */}
                {hasWhy && (
                    <>
                        <button
                            type="button"
                            onClick={() => setWhyOpen((v) => !v)}
                            aria-expanded={whyOpen}
                            className={cn(
                                'self-start text-xs text-text-link hover:underline',
                                'focus-visible:outline-none focus-visible:shadow-focus rounded-sm',
                            )}
                        >
                            {whyOpen
                                ? t('Risk:HideExplanation', 'Açıklamayı gizle')
                                : t('Risk:WhyThisSuggestion', 'Neden bu öneri?')}
                        </button>
                        {whyOpen && (
                            <ul className="text-xs text-text-secondary list-disc pl-5 space-y-1">
                                {why.map((reason, i) => (
                                    <li key={i}>{reason}</li>
                                ))}
                            </ul>
                        )}
                    </>
                )}

                {/* Aksiyonlar — sıra: ghost (İlgisiz) / ghost (Sonra) / primary (Uygula).
                    "İlgisiz" en sola — yıkıcı değil ama feedback sinyali; primary action sağda. */}
                <div className="flex items-center justify-end gap-1 mt-1">
                    {onDismiss && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onDismiss}
                            isLoading={pending === 'dismiss'}
                            disabled={isAnyPending && pending !== 'dismiss'}
                        >
                            {t('Ai:Irrelevant', 'İlgisiz')}
                        </Button>
                    )}
                    {onSnooze && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onSnooze}
                            isLoading={pending === 'snooze'}
                            disabled={isAnyPending && pending !== 'snooze'}
                        >
                            {t('Common:Later', 'Sonra')}
                        </Button>
                    )}
                    {onApply && (
                        <Button
                            size="sm"
                            variant={tone === 'critical' ? 'destructive' : 'primary'}
                            onClick={onApply}
                            isLoading={pending === 'apply'}
                            disabled={isAnyPending && pending !== 'apply'}
                        >
                            {primaryActionLabel}
                        </Button>
                    )}
                </div>
            </div>
        </article>
    );
}

export { SuggestionCard, TONE_VARIANTS };
