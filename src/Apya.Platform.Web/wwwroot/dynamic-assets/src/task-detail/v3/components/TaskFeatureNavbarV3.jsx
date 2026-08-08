import React from 'react';
import { FeaturePickerV3 } from './FeaturePickerV3';

export function TaskFeatureNavbarV3({
    activeTab = 'general',
    onTabChange = () => {},
    visibleTabs = [],
    assignedCodes = [],
    onAddFeature = () => {},
    task = {}
}) {
    // Gerçek sayaçlar (task DTO'sundan); 0 ise rozet gösterilmez
    const getCountForTab = (code) => {
        let n = 0;
        if (code === 'subtasks') n = task.subTasks?.length ?? 0;
        else if (code === 'files') n = task.attachments?.length ?? 0;
        else if (code === 'dependencies') n = task.predecessorIds?.length ?? 0;
        else if (code === 'comments') n = task.comments?.length ?? 0;
        return n > 0 ? n : null;
    };

    return (
        <div className="flex items-center justify-between gap-4 w-full py-1.5">
            <nav className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar" aria-label="Görev Sekmeleri">
                {visibleTabs.map((tab) => {
                    const isActive = activeTab === tab.code;
                    const count = getCountForTab(tab.code);

                    return (
                        <button
                            key={tab.code}
                            type="button"
                            onClick={() => onTabChange(tab.code)}
                            className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap select-none cursor-pointer ${
                                isActive
                                    ? 'text-primary bg-primary-subtle shadow-xs font-bold'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                            }`}
                        >
                            <span>{tab.title}</span>

                            {count !== null && (
                                <span className={`flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full text-[10px] font-bold ${
                                    isActive ? 'bg-primary text-white' : 'bg-surface-sunken text-text-tertiary'
                                }`}>
                                    {count}
                                </span>
                            )}

                            {isActive && (
                                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Feature Picker (+) Trigger */}
            <div className="shrink-0 flex items-center">
                <FeaturePickerV3 
                    assignedCodes={assignedCodes} 
                    onAddFeature={onAddFeature}
                />
            </div>
        </div>
    );
}
