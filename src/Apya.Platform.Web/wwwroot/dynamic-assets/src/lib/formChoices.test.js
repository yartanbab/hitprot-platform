import { describe, it, expect } from 'vitest';
import { choiceLabel, prefillChoice, withChoiceParam, withoutStaleChoice } from './formChoices';

const CALLS = [
    { value: '3f2b8c1e-9d4a-4c7e-8b21-5a6f0e9d1c34', label: 'TÜBİTAK · Sanayi Ar-Ge Projeleri (2026/1)' },
    { value: 'aaaaaaaa-0000-4000-8000-000000000002', label: 'KOSGEB · KOBİGEL Dijital Dönüşüm (2026/1)' },
];

describe('prefillChoice', () => {
    it('adresteki cagri listede varsa on secer', () => {
        expect(prefillChoice(CALLS, '?tenant=x&grant=3F2B8C1E-9D4A-4C7E-8B21-5A6F0E9D1C34')).toEqual(CALLS[0]);
    });

    it('kapanmis ya da yabanci cagride on secim yapmaz', () => {
        expect(prefillChoice(CALLS, '?grant=bbbbbbbb-0000-4000-8000-000000000009')).toBeNull();
        expect(prefillChoice(CALLS, '')).toBeNull();
    });
});

describe('choiceLabel', () => {
    it('secim nesnesinde adi, digerlerinde null doner', () => {
        expect(choiceLabel(CALLS[1])).toBe(CALLS[1].label);
        expect(choiceLabel('Sabit seçenek')).toBeNull();
        expect(choiceLabel(['a'])).toBeNull();
    });
});

describe('withoutStaleChoice', () => {
    const A_LIST = [{ value: 'a1', label: 'A-1' }, { value: 'a2', label: 'A-2' }];

    it('yeni listede olmayan eski secimi dusurur, digerlerine dokunmaz (STA-09)', () => {
        const answers = { parent: { value: 'A', label: 'A' }, child: { value: 'b1', label: 'B-1' } };
        expect(withoutStaleChoice(answers, 'child', A_LIST)).toEqual({ parent: { value: 'A', label: 'A' } });
        expect(withoutStaleChoice(answers, 'child', [])).toEqual({ parent: { value: 'A', label: 'A' } });
    });

    it('listede olan ya da bos cevapta ayni nesneyi dondurur', () => {
        const valid = { child: { value: 'a2', label: 'A-2' } };
        expect(withoutStaleChoice(valid, 'child', A_LIST)).toBe(valid);
        const empty = { child: '' };
        expect(withoutStaleChoice(empty, 'child', A_LIST)).toBe(empty);
        const none = {};
        expect(withoutStaleChoice(none, 'child', A_LIST)).toBe(none);
    });
});

describe('withChoiceParam', () => {
    it('var olan sorguyu koruyarak cagri ekler', () => {
        expect(withChoiceParam('/f/fikir?tenant=t1', 'c1')).toBe('/f/fikir?tenant=t1&grant=c1');
        expect(withChoiceParam('/f/fikir', 'c1')).toBe('/f/fikir?grant=c1');
    });
});
