import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { cn } from '../utils';

/**
 * Toast — kuyruk-tabanlı bildirim primitif'i.
 *
 * UX kontrat (strategy doc § Microinteractions):
 *   - Sağ-alt yerleşim, max 3 görünür eş zamanlı toast (fazlası FIFO sıraya)
 *   - Default 4s, action varsa 10s (kullanıcının okuyup karar verme süresi)
 *   - 4 tip: info (default) / success / warning / error
 *   - Action: opsiyonel "Geri al" / "Yenile" button — handler tetikleyince toast kapanır
 *   - Hover pause yok (B2B'de gereksiz karmaşıklık; user dilerse manual close)
 *
 * Radix bağımlılığı yok — hafif (queue + context + auto-dismiss timer).
 *
 * Kullanım:
 *   const toast = useToast();
 *   toast.show({ type: 'success', message: 'Onaylandı', action: { label: 'Geri al', onClick: undo } });
 *   toast.error('Bağlantı koptu');
 */

const ToastContext = createContext(null);

const TYPE_STYLES = {
    info:    { ring: 'border-default',     icon: 'text-text-secondary', accent: 'bg-brand-500' },
    success: { ring: 'border-positive-100', icon: 'text-text-positive',  accent: 'bg-positive-500' },
    warning: { ring: 'border-warning-100',  icon: 'text-text-warning',   accent: 'bg-warning-500' },
    error:   { ring: 'border-negative-100', icon: 'text-text-negative',  accent: 'bg-negative-500' },
};

const DEFAULT_DURATION = 4000;
const ACTION_DURATION  = 10_000;
const MAX_VISIBLE      = 3;

let idSeq = 0;

function ToastProvider({ children }) {
    const [items, setItems] = useState([]);
    const timersRef = useRef(new Map());

    const dismiss = useCallback((id) => {
        const timer = timersRef.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(id);
        }
        setItems((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const show = useCallback((opts) => {
        const id = ++idSeq;
        const item = {
            id,
            type: opts.type ?? 'info',
            message: opts.message ?? '',
            description: opts.description,
            action: opts.action,            /* { label, onClick } */
            duration: opts.duration ?? (opts.action ? ACTION_DURATION : DEFAULT_DURATION),
        };
        setItems((prev) => [...prev, item]);

        if (item.duration > 0) {
            const timer = setTimeout(() => dismiss(id), item.duration);
            timersRef.current.set(id, timer);
        }
        return id;
    }, [dismiss]);

    /* Cleanup all timers on unmount — leak guard */
    useEffect(() => () => {
        timersRef.current.forEach(clearTimeout);
        timersRef.current.clear();
    }, []);

    /* Convenience helpers — caller `toast.error('...')` yapsın diye */
    const api = React.useMemo(() => ({
        show,
        dismiss,
        info:    (message, opts = {}) => show({ ...opts, type: 'info', message }),
        success: (message, opts = {}) => show({ ...opts, type: 'success', message }),
        warning: (message, opts = {}) => show({ ...opts, type: 'warning', message }),
        error:   (message, opts = {}) => show({ ...opts, type: 'error', message }),
    }), [show, dismiss]);

    return (
        <ToastContext.Provider value={api}>
            {children}
            <ToastViewport items={items.slice(-MAX_VISIBLE)} onDismiss={dismiss} />
        </ToastContext.Provider>
    );
}

function ToastViewport({ items, onDismiss }) {
    if (items.length === 0) return null;
    return (
        <div
            role="region"
            aria-label="Bildirimler"
            className={cn(
                'fixed bottom-4 right-4 z-toast',
                'flex flex-col-reverse gap-2',
                'pointer-events-none',           /* viewport tıklamaları geçirir; tek tek toast'lar pointer-auto */
                'max-w-[calc(100vw-2rem)]',
            )}
        >
            {items.map((item) => (
                <ToastItem key={item.id} item={item} onDismiss={onDismiss} />
            ))}
        </div>
    );
}

function ToastItem({ item, onDismiss }) {
    const styles = TYPE_STYLES[item.type] ?? TYPE_STYLES.info;
    const liveAttr = item.type === 'error' ? 'assertive' : 'polite';

    const handleAction = () => {
        try { item.action?.onClick?.(); } finally { onDismiss(item.id); }
    };

    return (
        <div
            role={item.type === 'error' ? 'alert' : 'status'}
            aria-live={liveAttr}
            className={cn(
                'pointer-events-auto',
                'flex items-stretch gap-0',
                'min-w-[280px] max-w-[420px]',
                'bg-surface-raised border rounded-md shadow-lg',
                'animate-sheet-bottom',
                styles.ring,
            )}
        >
            {/* Sol accent şerit — tip göstergesi (renk + ek görsel sinyal a11y) */}
            <span className={cn('w-1 flex-none rounded-l-md', styles.accent)} aria-hidden="true" />

            <div className="flex-1 min-w-0 px-3 py-2.5 flex items-start gap-2">
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <p className="text-sm font-medium text-text-primary truncate">{item.message}</p>
                    {item.description && (
                        <p className="text-xs text-text-tertiary line-clamp-2">{item.description}</p>
                    )}
                </div>
                {item.action && (
                    <button
                        type="button"
                        onClick={handleAction}
                        className={cn(
                            'flex-none text-sm font-medium text-text-link',
                            'hover:underline underline-offset-2',
                            'focus-visible:outline-none focus-visible:shadow-focus rounded-sm',
                        )}
                    >
                        {item.action.label}
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => onDismiss(item.id)}
                    aria-label="Bildirimi kapat"
                    className={cn(
                        'flex-none text-text-tertiary hover:text-text-primary',
                        'focus-visible:outline-none focus-visible:shadow-focus rounded-sm',
                        'h-5 w-5 inline-flex items-center justify-center',
                    )}
                >
                    <span aria-hidden="true">×</span>
                </button>
            </div>
        </div>
    );
}

function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast must be used within <ToastProvider>.');
    }
    return ctx;
}

export { ToastProvider, useToast };
