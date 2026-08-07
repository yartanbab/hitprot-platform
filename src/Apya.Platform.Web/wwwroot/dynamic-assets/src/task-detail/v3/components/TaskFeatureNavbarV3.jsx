import React from 'react';
import { FeaturePickerV3 } from './FeaturePickerV3';

export function TaskFeatureNavbarV3({ activeTab, onTabChange, visibleTabs }) {
    // Mock counts for tabs
    const getCount = (code) => {
        if (code === 'subtasks') return 4;
        if (code === 'files') return 8;
        if (code === 'dependencies') return 2;
        if (code === 'comments') return 4;
        return null;
    };

    return (
        <div className="flex items-center justify-between border-b border-subtle bg-surface-base px-[var(--apya-space-6)]">
            <nav className="flex items-center gap-6" aria-label="Görev sekmeleri">
                {visibleTabs.map((tab) => {
                    const isActive = activeTab === tab.code;
                    const count = getCount(tab.code);
                    
                    return (
                        <button
                            key={tab.code}
                            type="button"
                            onClick={() => onTabChange(tab.code)}
                            className={`
                                relative flex items-center gap-2 py-3.5 text-[13px] font-medium transition-colors
                                ${isActive 
                                    ? 'text-primary' 
                                    : 'text-text-secondary hover:text-text-primary'
                                }
                            `}
                        >
                            {tab.title}
                            {count !== null && (
                                <span className={`
                                    flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold
                                    ${isActive 
                                        ? 'bg-primary-subtle text-primary' 
                                        : 'bg-surface-sunken text-text-tertiary border border-subtle'
                                    }
                                `}>
                                    {count}
                                </span>
                            )}
                            
                            {/* Active Indicator Line */}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                            )}
                        </button>
                    );
                })}
            </nav>
            
            {/* Feature Picker Dropdown */}
            <div className="py-2">
                <FeaturePickerV3 assignedCodes={visibleTabs.map(t => t.code)} />
            </div>
        </div>
    );
}
