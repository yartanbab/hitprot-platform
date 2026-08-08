import React from 'react';

/**
 * PageShell — Embedded (Jira-benzeri) tam sayfa kabuğu.
 * Dialog portal/backdrop içermez, doğrudan sayfa akışında render eder.
 * ModalShell ile aynı header, footer ve children arayüzüne (props) sahiptir.
 */
export function PageShell({ title, header, footer, children }) {
    return (
        <div
            className="flex h-full min-h-[calc(100vh-120px)] flex-col rounded-xl border border-default bg-surface-elevated shadow-sm"
            aria-label={title}
        >
            <div className="grid h-full min-h-0 grid-rows-[auto_1fr_auto]">
                {header}
                <div className="min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]">
                    {children}
                </div>
                {footer}
            </div>
        </div>
    );
}
