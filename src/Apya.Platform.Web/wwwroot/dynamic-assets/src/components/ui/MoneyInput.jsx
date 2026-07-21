import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Input } from './Input';
import { cn } from '../../lib/utils';
import { t } from '../../lib/i18n';

/**
 * MoneyInput — locale-aware para girişi.
 *
 * Davranış kararları (UX strategy doc § Design System):
 *   - tabular-nums her zaman açık (rakamlar hizalı)
 *   - Yazarken serbest input (number formatting kullanıcıyı yorar);
 *     blur'da locale formatına çevrilir (1234.5 → 1.234,50 ₺ tr-TR'de)
 *   - Yapıştır → temizle: TR (1.234,56) ve US (1,234.56) iki format da kabul
 *   - Currency suffix dropdown opsiyonel; tek currency ise statik affix
 *   - Min/max kısıtı uygulanır ama yazarken engellenmez (UX akışını bozar);
 *     blur'da clamp yapılmaz (caller validate eder); aria-invalid sinyal verir.
 *
 * Controlled API:
 *   <MoneyInput
 *     value={amount}              // number | null
 *     onValueChange={setAmount}   // number | null
 *     currency="TRY"              // ISO 4217
 *     locale="tr-TR"
 *     min={0}
 *     onCurrencyChange={...}      // varsa currency dropdown
 *     currencies={['TRY', 'USD', 'EUR']}
 *   />
 */

const CURRENCY_SYMBOLS = {
    TRY: '₺', USD: '$', EUR: '€', GBP: '£', JPY: '¥', CHF: 'CHF',
};

/* String → number: hem tr (1.234,56) hem en (1,234.56) hem de "1234.56" kabul.
   Boş string → null. NaN → null. Negatif işareti ilk char ise korunur. */
function parseMoney(input) {
    if (input == null) return null;
    const raw = String(input).trim();
    if (raw === '' || raw === '-') return null;

    const lastComma = raw.lastIndexOf(',');
    const lastDot   = raw.lastIndexOf('.');
    let normalized;
    if (lastComma > lastDot) {
        /* TR formatı: ',' decimal — tüm '.' kaldır, ',' → '.' */
        normalized = raw.replace(/\./g, '').replace(',', '.');
    } else if (lastDot > lastComma) {
        /* US formatı: '.' decimal — tüm ',' kaldır */
        normalized = raw.replace(/,/g, '');
    } else {
        /* Tek tip ayırıcı yok ya da yalnızca tamsayı */
        normalized = raw;
    }
    /* Sadece ilk decimal'ı tut, garip karakterleri at */
    normalized = normalized.replace(/[^\d.\-]/g, '');
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
}

function formatForBlur(value, locale, fractionDigits) {
    if (value == null) return '';
    if (!Number.isFinite(value)) return '';
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
        useGrouping: true,
    }).format(value);
}

const MoneyInput = React.forwardRef(function MoneyInput(
    {
        value,
        onValueChange,
        currency = 'TRY',
        currencies,                /* opsiyonel array → dropdown */
        onCurrencyChange,
        locale = 'tr-TR',
        fractionDigits = 2,
        min,
        max,
        invalid,
        size,
        placeholder = '0,00',
        className,
        inputClassName,
        ...inputProps
    },
    ref,
) {
    const [draft, setDraft] = useState(() => formatForBlur(value, locale, fractionDigits));
    const isEditingRef = useRef(false);

    /* Dış value değişirse (parent reset, async data load) draft'ı güncelle —
       AMA kullanıcı yazıyor/odaklıyken DOKUNMA (input atlamasın). */
    React.useEffect(() => {
        if (!isEditingRef.current) {
            setDraft(formatForBlur(value, locale, fractionDigits));
        }
    }, [value, locale, fractionDigits]);

    const handleChange = useCallback((e) => {
        const next = e.target.value;
        setDraft(next);
        const parsed = parseMoney(next);
        onValueChange?.(parsed);
    }, [onValueChange]);

    const handleFocus = useCallback((e) => {
        isEditingRef.current = true;
        /* Edit'e girince ham number'ı göster — kullanıcı 1.234,56 → 1234.56 görüp
           kolay düzenler. Tüm metni seç ki yapıştırma kolay. */
        if (value != null) {
            setDraft(String(value).replace('.', locale.startsWith('tr') ? ',' : '.'));
            requestAnimationFrame(() => e.target?.select?.());
        }
    }, [value, locale]);

    const handleBlur = useCallback((e) => {
        isEditingRef.current = false;
        const parsed = parseMoney(draft);
        onValueChange?.(parsed);
        setDraft(formatForBlur(parsed, locale, fractionDigits));
        inputProps.onBlur?.(e);
    }, [draft, onValueChange, locale, fractionDigits, inputProps]);

    /* min/max kontrolü — yazarken engelleme yok, sadece aria-invalid sinyali.
       Caller validation/error UI gösterir. */
    const outOfBounds = useMemo(() => {
        if (value == null) return false;
        if (min != null && value < min) return true;
        if (max != null && value > max) return true;
        return false;
    }, [value, min, max]);

    const symbol = CURRENCY_SYMBOLS[currency] ?? currency;

    /* Trailing: tek currency → readonly affix; çoklu → mini select */
    const trailing = currencies && currencies.length > 1 && onCurrencyChange ? (
        <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            aria-label={t('Common:Currency', 'Para birimi')}
            /* select'in kendi focus halkası bastırılır — wrapper input zaten gösteriyor */
            className={cn(
                'bg-transparent border-0 outline-none text-sm text-text-secondary',
                'pr-1 -mr-1 cursor-pointer',
                'focus-visible:outline-none',
            )}
        >
            {currencies.map((c) => (
                <option key={c} value={c}>{CURRENCY_SYMBOLS[c] ?? c}</option>
            ))}
        </select>
    ) : (
        <span className="font-medium text-text-secondary">{symbol}</span>
    );

    return (
        <Input
            ref={ref}
            inputMode="decimal"
            type="text"                       /* number type'ı tr-TR ',' kabul etmez */
            value={draft}
            placeholder={placeholder}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            invalid={invalid || outOfBounds}
            size={size}
            trailing={trailing}
            className={cn('font-tabular text-right', className)}
            {...inputProps}
        />
    );
});

export { MoneyInput, parseMoney };
