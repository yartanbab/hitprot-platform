import React from 'react';

export function TaskBreadcrumb({ trail = [], current, onNavigate }) {
    if (trail.length === 0) return null;
    return (
        <nav aria-label="Görev gezinme yolu" className="flex items-center gap-1.5 text-sm text-text-secondary">
            {trail.map((crumb) => (
                <React.Fragment key={crumb.id}>
                    <button
                        type="button"
                        onClick={() => onNavigate?.(crumb.id)}
                        className="hover:underline hover:text-text-primary"
                    >
                        {crumb.title}
                    </button>
                    <span aria-hidden="true">/</span>
                </React.Fragment>
            ))}
            <span className="font-medium text-text-primary">{current.title}</span>
        </nav>
    );
}
