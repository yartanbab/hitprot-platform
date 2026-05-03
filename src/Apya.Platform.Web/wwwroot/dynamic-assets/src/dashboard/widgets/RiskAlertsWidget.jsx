import React from 'react';
import { WidgetShell } from './WidgetShell';
import { Badge, Button } from '../../components/ui';
import { cn } from '../../lib/utils';

/**
 * RiskAlertsWidget — "Neye dikkat etmem gerek?" — AI-powered.
 *
 * Bu widget AI suggestion UX'inin Bento'daki yansıması (UX strategy § 4).
 *
 * Kurallar:
 *   - Her öneri "neden" açıklaması taşır (explainable AI). Hover/click ile
 *     reasons listesi açılır.
 *   - Confidence görsel: ●●●○○ (Yüksek/Orta/Düşük). Ham yüzde tooltip'te.
 *   - One-click action: "Uygula" optimistic UI ile, "Reddet" suppress eder
 *     (24h dedup — server-side).
 *   - Severity tiering: critical/actionable/info. Critical en üstte sticky.
 */

const MOCK_RISKS = [
    {
        id: 'r-001',
        severity: 'critical',
        title: 'KOSGEB Ar-Ge projesi 14 gün içinde teslim — kritik yol kaymış',
        confidence: 92,
        confidenceLabel: 'Yüksek',
        reasons: [
            'Görev T-142 son 5 gündür hareketsiz',
            'Bağımlı 3 görev gecikmeli',
            'Geçmiş projelerde benzer örüntü %78 gecikme ile sonuçlandı',
        ],
        suggestedAction: 'Kritik yolu yeniden planla',
    },
    {
        id: 'r-002',
        severity: 'actionable',
        title: 'Dijitalleşme bütçesi %86 — kalan 2 ay yetmeyebilir',
        confidence: 74,
        confidenceLabel: 'Orta',
        reasons: [
            'Aylık ortalama harcama hızı 187K ₺',
            'Kalan bütçe 63K ₺',
            'Önceki dönemde benzer hızda %22 aşım yaşanmış',
        ],
        suggestedAction: 'Bütçe revizyonu öner',
    },
    {
        id: 'r-003',
        severity: 'info',
        title: 'Yeni hibe çağrısı: TÜBİTAK 1505 firma profilinizle %88 uyumlu',
        confidence: 88,
        confidenceLabel: 'Yüksek',
        reasons: [
            'NACE sektörü uyumlu',
            'Çalışan sayısı eşleşiyor',
            'Önceki başarılı projeniz 1501 → 1505 kombinasyonu yaygın',
        ],
        suggestedAction: 'Çağrıyı incele',
    },
];

const SEVERITY_META = {
    critical:   { label: 'Kritik',     variant: 'critical', priority: 0 },
    actionable: { label: 'Eyleme açık', variant: 'warning',  priority: 1 },
    info:       { label: 'Bilgi',       variant: 'ai',       priority: 2 },
};

function RiskAlertsWidget({
    risks = MOCK_RISKS,
    isLoading,
    isError,
    onRetry,
    onAccept,
    onDismiss,
}) {
    const sorted = React.useMemo(
        () => [...(risks ?? [])].sort(
            (a, b) => SEVERITY_META[a.severity].priority - SEVERITY_META[b.severity].priority,
        ),
        [risks],
    );

    return (
        <WidgetShell
            title="Risk Uyarıları"
            subtitle="AI öneri motoru"
            badge={<Badge variant="ai" size="sm" withDot>AI</Badge>}
            isLoading={isLoading}
            isError={isError}
            onRetry={onRetry}
            isEmpty={!isLoading && !isError && sorted.length === 0}
            emptyMessage="Şu an risk yok — AI motoru tarama tamamladı."
        >
            <ul className="flex flex-col gap-2 h-full overflow-y-auto">
                {sorted.map((risk) => (
                    <RiskCard
                        key={risk.id}
                        risk={risk}
                        onAccept={onAccept}
                        onDismiss={onDismiss}
                    />
                ))}
            </ul>
        </WidgetShell>
    );
}

function RiskCard({ risk, onAccept, onDismiss }) {
    const [expanded, setExpanded] = React.useState(false);
    const [pending, setPending]   = React.useState(null);
    const meta = SEVERITY_META[risk.severity];

    const handle = async (action, fn) => {
        if (pending) return;
        setPending(action);
        try {
            await fn?.(risk);
        } finally {
            setPending(null);
        }
    };

    return (
        <li className={cn(
            'rounded-md border bg-surface-base',
            'transition-opacity duration-fast',
            risk.severity === 'critical' && 'border-critical-50 bg-critical-50',
            risk.severity === 'actionable' && 'border-warning-100',
            risk.severity === 'info' && 'border-subtle',
            pending && 'opacity-60',
        )}>
            <div className="p-2.5 flex flex-col gap-2">
                {/* Üst satır: severity + confidence */}
                <div className="flex items-center justify-between gap-2">
                    <Badge variant={meta.variant} size="sm" withDot>
                        {meta.label}
                    </Badge>
                    <ConfidenceIndicator score={risk.confidence} label={risk.confidenceLabel} />
                </div>

                {/* Başlık */}
                <p className="text-sm font-medium text-text-primary leading-snug">
                    {risk.title}
                </p>

                {/* Disclosure: "Neden bu öneri?" — explainable AI */}
                <button
                    type="button"
                    onClick={() => setExpanded((e) => !e)}
                    aria-expanded={expanded}
                    className={cn(
                        'self-start text-xs text-text-link hover:underline',
                        'focus-visible:outline-none focus-visible:shadow-focus rounded-sm',
                    )}
                >
                    {expanded ? 'Açıklamayı gizle' : 'Neden bu öneri?'}
                </button>
                {expanded && (
                    <ul className="text-xs text-text-secondary list-disc pl-5 space-y-1">
                        {risk.reasons.map((reason, i) => (
                            <li key={i}>{reason}</li>
                        ))}
                    </ul>
                )}

                {/* Aksiyon — primary (suggested action) + dismiss */}
                <div className="flex items-center justify-end gap-1 mt-1">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handle('dismiss', onDismiss)}
                        isLoading={pending === 'dismiss'}
                    >
                        Şimdi değil
                    </Button>
                    <Button
                        size="sm"
                        variant={risk.severity === 'critical' ? 'destructive' : 'primary'}
                        onClick={() => handle('accept', onAccept)}
                        isLoading={pending === 'accept'}
                    >
                        {risk.suggestedAction}
                    </Button>
                </div>
            </div>
        </li>
    );
}

/* Confidence göstergesi: ●●●○○ — sayı yerine 5-dot scale.
   Ham yüzde tooltip'te (title attr — basit). */
function ConfidenceIndicator({ score, label }) {
    const filled = Math.max(0, Math.min(5, Math.round((score / 100) * 5)));
    return (
        <span
            className="inline-flex items-center gap-1 text-xs text-text-tertiary"
            title={`Güven: %${score}`}
        >
            <span className="font-tabular tracking-wider" aria-hidden="true">
                {'●'.repeat(filled)}
                <span className="text-text-disabled">{'○'.repeat(5 - filled)}</span>
            </span>
            <span className="sr-only">Güven düzeyi: {label} (%{score})</span>
            <span aria-hidden="true">{label}</span>
        </span>
    );
}

export { RiskAlertsWidget };
