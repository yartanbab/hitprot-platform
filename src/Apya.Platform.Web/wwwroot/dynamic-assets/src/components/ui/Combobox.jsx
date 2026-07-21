import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Input } from './Input';
import { cn } from '../../lib/utils';
import { t } from '../../lib/i18n';

/**
 * Combobox — input + filtrelenebilir dropdown.
 *
 * Karar (UX strategy doc § Design System):
 *   - Native `<select>` 30+ option'da kullanılamaz (search yok).
 *   - Radix Combobox proje'de yok; @radix-ui/react-popover de install değil.
 *     El yazımı, sade — popover positioning absolute (parent relative).
 *   - Tek seçim. Multi-select için ayrı primitive (kapsamı bu commit'te değil).
 *   - Klavye davranışı: ↓/↑ navigate, Enter seç, Esc kapat, Tab seçmeden kapat.
 *
 * Controlled API:
 *   <Combobox
 *     options={[{ value: 'p1', label: 'KOSGEB Ar-Ge' }, ...]}
 *     value="p1"
 *     onChange={(value) => ...}
 *     placeholder="Proje seç"
 *   />
 *
 * Async/uzak veri:
 *   onSearch(query) caller'a delege; caller filtered options'ı yenisiyle döndürür.
 *   onSearch yoksa primitive client-side label substring filter yapar.
 */

function defaultFilter(options, query) {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => String(o.label).toLowerCase().includes(q));
}

function Combobox({
    options = [],
    value,
    onChange,
    placeholder = t('Common:MakeSelection', 'Seçim yap'),
    onSearch,                  /* opsiyonel — async/server-side filter caller'a */
    size,
    invalid,
    disabled,
    emptyMessage = t('Common:NoMatch', 'Eşleşme bulunamadı'),
    className,
    listMaxHeight = 240,
    ...inputProps
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIdx, setActiveIdx] = useState(0);
    const wrapperRef = useRef(null);
    const inputRef   = useRef(null);
    const listId = useId();

    const selectedOption = useMemo(
        () => options.find((o) => o.value === value),
        [options, value],
    );

    /* Filter: caller onSearch verirse o yetkili (server filtering) — primitive
       sadece options'ı olduğu gibi gösterir. Yoksa client-side substring filter. */
    const visible = useMemo(() => {
        if (onSearch) return options;
        return defaultFilter(options, query);
    }, [options, query, onSearch]);

    /* Display value: input boşken seçili etiket; query yazılınca query'i göster */
    const displayValue = open ? query : (selectedOption?.label ?? '');

    const handleInputChange = useCallback((e) => {
        const next = e.target.value;
        setQuery(next);
        setOpen(true);
        setActiveIdx(0);
        onSearch?.(next);
    }, [onSearch]);

    const commit = useCallback((opt) => {
        if (!opt || opt.disabled) return;
        onChange?.(opt.value);
        setQuery('');
        setOpen(false);
        inputRef.current?.blur();
    }, [onChange]);

    const handleKeyDown = useCallback((e) => {
        if (disabled) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
            setActiveIdx((i) => Math.min(i + 1, visible.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIdx((i) => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            if (open && visible[activeIdx]) {
                e.preventDefault();
                commit(visible[activeIdx]);
            }
        } else if (e.key === 'Escape') {
            if (open) {
                e.preventDefault();
                setOpen(false);
                setQuery('');
            }
        }
    }, [open, activeIdx, visible, commit, disabled]);

    /* Outside click → kapat. mousedown kullanıyoruz; click event'i'nden önce
       gelir, böylece dropdown'daki seçim henüz kapanmadan tetiklenir. */
    useEffect(() => {
        if (!open) return undefined;
        const onDown = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
                setQuery('');
            }
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [open]);

    return (
        <div
            ref={wrapperRef}
            className={cn('relative', className)}
        >
            <Input
                ref={inputRef}
                role="combobox"
                aria-controls={listId}
                aria-expanded={open}
                aria-autocomplete="list"
                aria-activedescendant={open && visible[activeIdx] ? `${listId}-opt-${activeIdx}` : undefined}
                value={displayValue}
                placeholder={placeholder}
                disabled={disabled}
                invalid={invalid}
                size={size}
                onFocus={() => setOpen(true)}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                trailing={(
                    <span className="text-text-tertiary text-xs" aria-hidden="true">
                        {open ? '▲' : '▼'}
                    </span>
                )}
                {...inputProps}
            />

            {open && (
                <ul
                    id={listId}
                    role="listbox"
                    style={{ maxHeight: listMaxHeight }}
                    className={cn(
                        'absolute z-popover left-0 right-0 mt-1',
                        'bg-surface-raised border border-default rounded-md shadow-lg',
                        'overflow-y-auto',
                        'py-1',
                    )}
                >
                    {visible.length === 0 ? (
                        <li className="px-3 py-2 text-sm text-text-tertiary">{emptyMessage}</li>
                    ) : (
                        visible.map((opt, i) => {
                            const selected = opt.value === value;
                            const active   = i === activeIdx;
                            return (
                                <li
                                    key={opt.value ?? i}
                                    id={`${listId}-opt-${i}`}
                                    role="option"
                                    aria-selected={selected}
                                    aria-disabled={opt.disabled || undefined}
                                    onMouseDown={(e) => { e.preventDefault(); commit(opt); }}
                                    onMouseEnter={() => setActiveIdx(i)}
                                    className={cn(
                                        'px-3 py-1.5 text-sm cursor-pointer flex items-center gap-2',
                                        opt.disabled && 'text-text-disabled cursor-not-allowed',
                                        active && !opt.disabled && 'bg-surface-elevated',
                                        selected && 'font-medium text-brand-700',
                                    )}
                                >
                                    {opt.leading && <span className="flex-none">{opt.leading}</span>}
                                    <span className="flex-1 min-w-0 truncate">{opt.label}</span>
                                    {selected && (
                                        <span className="flex-none text-brand-600 text-xs" aria-hidden="true">✓</span>
                                    )}
                                </li>
                            );
                        })
                    )}
                </ul>
            )}
        </div>
    );
}

export { Combobox };
