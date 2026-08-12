import React from 'react';

export function AdvancedTab({ task }) {
    const predecessors = task?.predecessorIds || [];

    return (
        <div className="space-y-4">
            <div className="rounded-lg border border-default p-3 bg-surface-elevated space-y-2">
                <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-2">
                    <i className="fa fa-diagram-project text-text-tertiary" aria-hidden="true" />
                    Öncül Görev Bağımlılıkları ({predecessors.length})
                </h4>
                {predecessors.length === 0 ? (
                    <p className="text-xs text-text-tertiary">Bu görevin başlamasını engelleyen öncül bir görev tanımlanmamış.</p>
                ) : (
                    <p className="text-xs text-text-secondary">{predecessors.length} adet bağlı öncül görev tanımlı.</p>
                )}
            </div>

            <div className="rounded-lg border border-default p-3 bg-surface-elevated space-y-2">
                <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-2">
                    <i className="fa fa-stopwatch text-text-tertiary" aria-hidden="true" />
                    Zaman Takibi (Time Logs)
                </h4>
                <p className="text-xs text-text-tertiary">Zaman sayacı ve iş yükü logları aktiftir.</p>
            </div>
        </div>
    );
}
