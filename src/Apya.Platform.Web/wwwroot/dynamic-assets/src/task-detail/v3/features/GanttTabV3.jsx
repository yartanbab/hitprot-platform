import React, { useState } from 'react';
import { Button } from '../../../components/ui';

export function GanttTabV3({ taskId, task }) {
    const [viewMode, setViewMode] = useState('Month');

    const tasks = [
        { id: 1, name: '1. Otel Konaklama Anlaşması (Ana)', start: '25.06', end: '10.07', progress: 100, color: 'bg-primary' },
        { id: 2, name: '2. Fiyat Tekliflerinin Alınması', start: '25.06', end: '30.06', progress: 100, color: 'bg-success' },
        { id: 3, name: '3. Sözleşme Taslağının Hazırlanması', start: '01.07', end: '05.07', progress: 100, color: 'bg-indigo-600' },
        { id: 4, name: '4. İmzaların Tamamlanması', start: '06.07', end: '10.07', progress: 80, color: 'bg-warning' },
        { id: 5, name: '5. Rezervasyonların Sisteme İşlenmesi', start: '11.07', end: '15.07', progress: 20, color: 'bg-amber-500' }
    ];

    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-subtle pb-4">
                <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-bars-staggered text-primary text-base" />
                    <h3 className="text-[15px] font-bold text-text-primary">Gantt Zaman Çizelgesi</h3>
                </div>

                <div className="flex items-center gap-1 bg-surface-sunken p-1 rounded-lg border border-subtle">
                    {['Day', 'Week', 'Month'].map(m => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => setViewMode(m)}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                                viewMode === m ? 'bg-surface-base text-primary shadow-xs' : 'text-text-tertiary hover:text-text-primary'
                            }`}
                        >
                            {m === 'Day' ? 'Gün' : m === 'Week' ? 'Hafta' : 'Ay'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gantt Bar Rows */}
            <div className="flex flex-col gap-3">
                {tasks.map(t => (
                    <div key={t.id} className="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-sunken/40 border border-subtle/50 hover:bg-surface-hover/60 transition-all">
                        <div className="flex items-center justify-between text-[13px]">
                            <span className="font-semibold text-text-primary">{t.name}</span>
                            <span className="text-xs text-text-tertiary font-mono">{t.start} - {t.end} (%{t.progress})</span>
                        </div>
                        <div className="w-full h-3 bg-surface-base rounded-full overflow-hidden border border-subtle">
                            <div 
                                className={`h-full ${t.color} rounded-full transition-all duration-500`}
                                style={{ width: `${t.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
