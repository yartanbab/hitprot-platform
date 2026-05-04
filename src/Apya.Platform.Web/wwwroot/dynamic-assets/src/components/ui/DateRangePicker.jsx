import React, { useCallback, useMemo, useState } from 'react';
import { Input } from './Input';
import { cn } from '../../lib/utils';

/**
 * DateRangePicker — from/to native date input'ları + preset chip'leri.
 *
 * Karar (UX strategy doc § Design System):
 *   Custom calendar widget yerine native `<input type="date">` — bundle'a
 *   ek kütüphane (date-fns/dayjs/react-day-picker) sokmaktan kaçınıyoruz.
 *   Native picker tüm modern browser/OS'larda lokalizedir, mobile'da
 *   touch-optimize, accessibility built-in. Compromise: tarih formatı
 *   tarayıcı locale'i; UI'da gösterirken bizim format'a (Intl) çevrilir.
 *
 * Preset'ler — finans/PMO için 6 standart aralık:
 *   - Bu ay / Geçen ay
 *   - Bu çeyrek / Geçen çeyrek
 *   - Bu mali yıl / Son 30 gün
 *
 * Controlled API:
 *   <DateRangePicker
 *     value={{ from: Date, to: Date }}      // null'lı alan kabul
 *     onChange={({ from, to }) => ...}
 *     presets={['this-month', 'last-30d']} // veya 'all' default
 *   />
 *
 * Caller invalid range (from > to) durumunu kendisi yakalar; primitive
 * yalnızca aria-invalid sinyali verir.
 */

const PRESET_DEFS = {
    'this-month':    { label: 'Bu ay',         build: () => monthRange(0) },
    'last-month':    { label: 'Geçen ay',       build: () => monthRange(-1) },
    'this-quarter':  { label: 'Bu çeyrek',     build: () => quarterRange(0) },
    'last-quarter':  { label: 'Geçen çeyrek',  build: () => quarterRange(-1) },
    'this-fy':       { label: 'Bu mali yıl',   build: () => fiscalYearRange(0) },
    'last-30d':      { label: 'Son 30 gün',    build: () => rollingDays(30) },
    'last-90d':      { label: 'Son 90 gün',    build: () => rollingDays(90) },
};

const DEFAULT_PRESETS = ['this-month', 'last-month', 'this-quarter', 'last-quarter', 'this-fy', 'last-30d'];

function startOfDay(d)  { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function endOfDay(d)    { const x = new Date(d); x.setHours(23,59,59,999); return x; }

function monthRange(offset) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const end   = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
    return { from: startOfDay(start), to: endOfDay(end) };
}
function quarterRange(offset) {
    const now = new Date();
    const q = Math.floor(now.getMonth() / 3) + offset;
    const start = new Date(now.getFullYear(), q * 3, 1);
    const end   = new Date(now.getFullYear(), q * 3 + 3, 0);
    return { from: startOfDay(start), to: endOfDay(end) };
}
/* TR mali yıl varsayılan: takvim yılı (1 Ocak – 31 Aralık).
   Farklı mali yıl başlangıcı gerekirse caller kendi preset'ini geçebilir. */
function fiscalYearRange(offset) {
    const now = new Date();
    const y = now.getFullYear() + offset;
    return { from: startOfDay(new Date(y, 0, 1)), to: endOfDay(new Date(y, 11, 31)) };
}
function rollingDays(n) {
    const to = endOfDay(new Date());
    const from = startOfDay(new Date(Date.now() - (n - 1) * 86400_000));
    return { from, to };
}

function toInputDate(d) {
    if (!d) return '';
    const dt = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(dt.getTime())) return '';
    /* yyyy-mm-dd local — input[type=date] istediği format */
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}
function fromInputDate(str, isEnd = false) {
    if (!str) return null;
    const [y, m, d] = str.split('-').map(Number);
    if (!y || !m || !d) return null;
    return isEnd ? endOfDay(new Date(y, m - 1, d)) : startOfDay(new Date(y, m - 1, d));
}

function DateRangePicker({
    value,
    onChange,
    presets = DEFAULT_PRESETS,
    minDate,
    maxDate,
    size,
    className,
}) {
    const from = value?.from ?? null;
    const to   = value?.to   ?? null;

    const invalid = from && to && from > to;

    const setFrom = useCallback((str) => onChange?.({ from: fromInputDate(str, false), to }), [onChange, to]);
    const setTo   = useCallback((str) => onChange?.({ from, to: fromInputDate(str, true) }), [onChange, from]);

    const applyPreset = useCallback((presetKey) => {
        const def = PRESET_DEFS[presetKey];
        if (!def) return;
        onChange?.(def.build());
    }, [onChange]);

    const activePreset = useMemo(() => detectActivePreset(value, presets), [value, presets]);

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            {/* Preset chip'ler — yatay sıra, dar viewport'ta wrap */}
            <div role="radiogroup" aria-label="Tarih aralığı önayarları" className="flex flex-wrap gap-1">
                {presets.map((key) => {
                    const def = PRESET_DEFS[key];
                    if (!def) return null;
                    const active = key === activePreset;
                    return (
                        <button
                            key={key}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => applyPreset(key)}
                            className={cn(
                                'h-7 px-2.5 text-xs rounded-full border transition-colors duration-fast',
                                active
                                    ? 'bg-brand-50 border-brand-100 text-brand-700'
                                    : 'bg-surface-base border-default text-text-secondary hover:border-strong',
                                'focus-visible:outline-none focus-visible:shadow-focus',
                            )}
                        >
                            {def.label}
                        </button>
                    );
                })}
            </div>

            {/* From / To input pair */}
            <div className="flex items-center gap-2">
                <Input
                    type="date"
                    aria-label="Başlangıç tarihi"
                    value={toInputDate(from)}
                    min={toInputDate(minDate)}
                    max={toInputDate(to ?? maxDate)}
                    invalid={invalid}
                    size={size}
                    onChange={(e) => setFrom(e.target.value)}
                />
                <span className="text-text-tertiary text-sm" aria-hidden="true">—</span>
                <Input
                    type="date"
                    aria-label="Bitiş tarihi"
                    value={toInputDate(to)}
                    min={toInputDate(from ?? minDate)}
                    max={toInputDate(maxDate)}
                    invalid={invalid}
                    size={size}
                    onChange={(e) => setTo(e.target.value)}
                />
            </div>

            {invalid && (
                <p role="alert" className="text-xs text-text-negative">
                    Başlangıç tarihi bitiş tarihinden sonra olamaz.
                </p>
            )}
        </div>
    );
}

/* Seçili range bir preset'e tam denk geliyor mu? Chip aktif görünümü için.
   ms karşılaştırması; saniye-altı eşitlik istemiyoruz, gün başı/sonu yeterli. */
function detectActivePreset(value, presetKeys) {
    if (!value?.from || !value?.to) return null;
    for (const key of presetKeys) {
        const def = PRESET_DEFS[key];
        if (!def) continue;
        const r = def.build();
        if (sameDay(r.from, value.from) && sameDay(r.to, value.to)) return key;
    }
    return null;
}
function sameDay(a, b) {
    if (!a || !b) return false;
    const da = a instanceof Date ? a : new Date(a);
    const db = b instanceof Date ? b : new Date(b);
    return da.getFullYear() === db.getFullYear()
        && da.getMonth()    === db.getMonth()
        && da.getDate()     === db.getDate();
}

export { DateRangePicker, PRESET_DEFS };
