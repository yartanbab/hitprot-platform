import React from 'react';
import { t } from '../../lib/i18n';

/**
 * Huni — aşama aşama daralan liste. Genişlik İLK aşamaya göre oransaldır,
 * böylece "kaçta kaçı kaldı" doğrudan okunur.
 */
function Funnel({ stages = [] }) {
    if (!stages.length) return null;
    const first = stages[0].value || 0;

    return (
        <ul className="flex flex-col gap-2">
            {stages.map((stage) => {
                const ratio = first > 0 ? stage.value / first : 0;
                return (
                    <li key={stage.label} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-text-secondary truncate">{stage.label}</span>
                            <span className="font-mono text-[11px] text-text-primary tabular-nums flex-none">
                                {stage.value}
                                <span className="text-text-tertiary ml-1">
                                    {t('Dashboard:Funnel:Share', '%{0}', Math.round(ratio * 100))}
                                </span>
                            </span>
                        </div>
                        <span
                            className="block h-2 rounded-full bg-brand-500"
                            style={{ width: `${Math.max(ratio * 100, 2)}%` }}
                        />
                    </li>
                );
            })}
        </ul>
    );
}

export { Funnel };
