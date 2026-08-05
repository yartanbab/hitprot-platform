import { describe, it, expect } from 'vitest';
import { cn, formatMoney } from './utils';

describe('cn', () => {
    it('çakışan Tailwind sınıflarında sonuncuyu tutar', () => {
        expect(cn('p-2', 'p-4')).toBe('p-4');
    });

    it('falsy değerleri atar', () => {
        expect(cn('a', false && 'b', null, 'c')).toBe('a c');
    });
});

describe('formatMoney', () => {
    it('sayı olmayan girdide em-dash döner', () => {
        expect(formatMoney(undefined, 'TRY')).toBe('—');
    });
});
