import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

/**
 * HoldButton — basılı tutarak onaylama. Yanlış-tap koruması.
 *
 * UX kontratı (strategy doc § 8 — Mobile critical flows):
 *   "Hold 200ms (yanlış tap koruması) → optimistic + undo toast 10s"
 *
 * Mobile dokunmatikte parmak kaymasıyla gelen kazara onaylar tehlike.
 * Hold + progress halkası: kullanıcı niyetini "ölçülü" hisseder, kazara
 * dokunuş 200ms tamamlanmadan kalkınca iptal olur.
 *
 * holdMs=0 → normal click davranışı (desktop/tablet'te kullan; hold gereksiz).
 * Caller useDeviceMode ile karar verir: `holdMs={mode === 'decision' ? 200 : 0}`.
 *
 * Kontratlar:
 *   - Pointer events: mouse + touch + pen tek olay setiyle yakalanır
 *   - leave / cancel / blur → progress sıfırlanır, fire ETMEZ
 *   - Klavye: Enter/Space anlık tetik (klavye kullanıcıları zaten kasten basıyor)
 *   - aria-busy hold sırasında — screen reader "yükleniyor" iletmesin diye
 *     manuel role/aria yok; Button native semantics korunur.
 */

function HoldButton({
    holdMs = 200,
    onConfirm,
    children,
    className,
    disabled,
    isLoading,
    ...buttonProps
}) {
    const [progress, setProgress] = useState(0);
    const rafRef = useRef(0);
    const startedRef = useRef(0);

    /* HoldMs=0 → normal click — extra event handling YOK, native button */
    const isInstant = holdMs <= 0;

    const cancel = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
        startedRef.current = 0;
        setProgress(0);
    }, []);

    const tick = useCallback(() => {
        if (!startedRef.current) return;
        const elapsed = performance.now() - startedRef.current;
        const next = Math.min(elapsed / holdMs, 1);
        setProgress(next);
        if (next >= 1) {
            cancel();
            onConfirm?.();
        } else {
            rafRef.current = requestAnimationFrame(tick);
        }
    }, [holdMs, onConfirm, cancel]);

    const start = useCallback((e) => {
        if (disabled || isLoading || isInstant) return;
        /* Sağ-click / orta-click yok say — accidental olarak hold başlatmasın */
        if (e.button !== undefined && e.button !== 0) return;
        startedRef.current = performance.now();
        rafRef.current = requestAnimationFrame(tick);
    }, [disabled, isLoading, isInstant, tick]);

    /* Cleanup — unmount esnasında hold devam ediyor olabilir */
    useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

    if (isInstant) {
        return (
            <Button
                onClick={onConfirm}
                disabled={disabled}
                isLoading={isLoading}
                className={className}
                {...buttonProps}
            >
                {children}
            </Button>
        );
    }

    return (
        <Button
            disabled={disabled}
            isLoading={isLoading}
            onPointerDown={start}
            onPointerUp={cancel}
            onPointerLeave={cancel}
            onPointerCancel={cancel}
            onBlur={cancel}
            /* Click event'ini ZORLA susturma — pointer-down tabanlı tetikleme bizde,
               click bubbling'i caller'a karışmasın diye preventDefault yapıyoruz
               yalnızca progress ilerliyorsa. */
            onClick={(e) => {
                /* Kazara click event'i (örn. çok hızlı tap) → swallow.
                   Klavye Enter/Space ile gelen click'i ayırt etmek için
                   detail===0 (klavye) check'i; klavye için onConfirm çalışsın. */
                if (e.detail === 0) onConfirm?.();
                else e.preventDefault();
            }}
            className={cn('relative overflow-hidden', className)}
            {...buttonProps}
        >
            {/* Progress overlay — hold sırasında soldan sağa dolar */}
            <span
                className={cn(
                    'absolute inset-y-0 left-0 bg-white/25 pointer-events-none',
                    'transition-[width] duration-[40ms] ease-linear',
                )}
                style={{ width: `${progress * 100}%` }}
                aria-hidden="true"
            />
            <span className="relative">{children}</span>
        </Button>
    );
}

export { HoldButton };
