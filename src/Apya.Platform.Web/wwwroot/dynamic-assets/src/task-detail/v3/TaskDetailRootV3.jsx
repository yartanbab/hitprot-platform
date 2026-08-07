import React, { useState, Suspense } from 'react';
import { TaskDetailHeaderV3 } from './components/TaskDetailHeaderV3';
import { TaskMetadataGridV3 } from './components/TaskMetadataGridV3';
import { TaskFeatureNavbarV3 } from './components/TaskFeatureNavbarV3';
import { TaskSidePanelV3 } from './components/TaskSidePanelV3';
import { TaskGeneralTabV3 } from './components/TaskGeneralTabV3';
import { getVisibleTabs } from '../TaskFeatureRegistry';
import { Skeleton } from '../../components/ui';
import { useTaskDetail } from '../hooks/useTaskDetail';

export function TaskDetailRootV3({ 
    task, 
    presentation = 'modal',
    onClose, 
    isFullscreen, 
    onToggleFullscreen, 
    switchToTask 
}) {
    const { features, assignedFeatures, currentTaskId } = useTaskDetail();
    
    // Default to 'general' tab
    const [activeTabCode, setActiveTabCode] = useState('general');

    const visibleTabs = getVisibleTabs(assignedFeatures);
    const activeTabDef = visibleTabs.find(t => t.code === activeTabCode) || visibleTabs[0];

    return (
        <div className="flex h-full flex-col bg-surface-sunken">
            {/* Header */}
            <TaskDetailHeaderV3 
                task={task} 
                onClose={onClose} 
                isFullscreen={isFullscreen}
                onToggleFullscreen={onToggleFullscreen}
                presentation={presentation}
            />

            <div className="flex flex-1 overflow-hidden">
                <div className="flex flex-1 flex-col overflow-y-auto">
                    
                    {/* Top Metadata Grid */}
                    <TaskMetadataGridV3 task={task} />

                    {/* Navbar */}
                    <TaskFeatureNavbarV3 
                        activeTab={activeTabCode} 
                        onTabChange={setActiveTabCode}
                        visibleTabs={visibleTabs} 
                    />

                    {/* Main Content Area */}
                    <div className="flex-1 p-[var(--apya-space-6)]">
                        {activeTabCode === 'general' ? (
                            <div className="flex flex-col lg:flex-row gap-[var(--apya-space-6)]">
                                {/* Left Column: General Tab Body */}
                                <div className="flex-1 min-w-0">
                                    <TaskGeneralTabV3 task={task} />
                                </div>
                                
                                {/* Right Column: Details & Actions */}
                                <div className="w-full lg:w-[320px] shrink-0">
                                    <TaskSidePanelV3 task={task} />
                                </div>
                            </div>
                        ) : (
                            /* Other Feature Tabs (Subtasks, Files, etc.) */
                            <Suspense fallback={<Skeleton className="h-48 w-full" />}>
                                {activeTabDef?.component ? (
                                    <activeTabDef.component 
                                        taskId={currentTaskId} 
                                        task={task} 
                                        onOpenSubtask={switchToTask} 
                                    />
                                ) : (
                                    <div className="text-center py-12 text-text-tertiary border border-dashed border-subtle rounded-xl">
                                        <i className="fa-solid fa-person-digging text-4xl mb-4 opacity-50" />
                                        <p>Bu sekme yapım aşamasında.</p>
                                    </div>
                                )}
                            </Suspense>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
