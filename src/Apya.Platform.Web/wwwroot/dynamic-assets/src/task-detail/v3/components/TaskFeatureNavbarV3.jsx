import React from 'react';
import { FeaturePickerV3 } from './FeaturePickerV3';

export function TaskFeatureNavbarV3({
    activeTab = 'general',
    onTabChange = () => {},
    visibleTabs = [],
    assignedCodes = [],
    onAddFeature = () => {}
}) {
    // Dynamic counts based on mockup
    const getCountForTab = (code) => {
        if (code === 'subtasks') return 4;
        if (code === 'files') return 8;
        if (code === 'dependencies') return 2;
        return null;
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
