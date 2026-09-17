import { describe, it, expect } from 'vitest';
import { hiddenBlockIds, withoutHidden, answerValues, OPS, VISIBLE_WHEN, REQUIRES_CONSORTIUM } from './formConditions';

/**
 * 17 · Koşullu alan. Kural hep YUKARIDAKİ bir alanı gösterir; bu testler sunucudaki
 * FormConditionEvaluator ile aynı davranışı bekler.
 */
const block = (id, rule, extra = {}) => ({
    id, type: 0, content: id, settings: rule ? { [VISIBLE_WHEN]: rule, ...extra } : { ...extra },
});

const CALL_CHOICES = [
    { value: 'call-ortakli', label: 'TÜBİTAK · 1707 (2026/1)', flags: { [REQUIRES_CONSORTIUM]: true } },
    { value: 'call-tekil', label: 'KOSGEB · KOBİGEL (2026/1)', flags: { [REQUIRES_CONSORTIUM]: false } },
];

describe('answerValues', () => {
    it('canli liste cevabinda kimligi, coklu secimde her ogeyi verir', () => {
        expect(answerValues({ value: 'c1', label: 'Çağrı' })).toEqual(['c1']);
        expect(answerValues(['a', 'b'])).toEqual(['a', 'b']);
        expect(answerValues(5)).toEqual(['5']);
    });

    it('bos ve yok cevap deger SAYILMAZ', () => {
        expect(answerValues('')).toEqual([]);
        expect(answerValues('   ')).toEqual([]);
        expect(answerValues(undefined)).toEqual([]);
        expect(answerValues({ value: '' })).toEqual([]);
    });
});

describe('hiddenBlockIds', () => {
    const blocks = [
        block('p'),
        block('c', { blockId: 'p', op: OPS.EQ, value: 'Evet' }),
    ];

    it('kosul tutmazsa alan gizlenir, tutunca gorunur', () => {
        expect([...hiddenBlockIds(blocks, {})]).toEqual(['c']);
        expect([...hiddenBlockIds(blocks, { p: 'Hayır' })]).toEqual(['c']);
        expect([...hiddenBlockIds(blocks, { p: 'Evet' })]).toEqual([]);
    });

    it('vermezse kosulu cevapsiz alanda da gorunur birakir', () => {
        const neq = [block('p'), block('c', { blockId: 'p', op: OPS.NEQ, value: 'Evet' })];
        expect([...hiddenBlockIds(neq, {})]).toEqual([]);
        expect([...hiddenBlockIds(neq, { p: 'Evet' })]).toEqual(['c']);
    });

    it('yanitlanirsa kosulu bos metni cevap saymaz', () => {
        const answered = [block('p'), block('c', { blockId: 'p', op: OPS.ANSWERED })];
        expect([...hiddenBlockIds(answered, { p: '  ' })]).toEqual(['c']);
        expect([...hiddenBlockIds(answered, { p: 'x' })]).toEqual([]);
    });

    it('ust alan gizliyse ona bagli alan da gizlenir', () => {
        const chain = [
            block('a'),
            block('b', { blockId: 'a', op: OPS.EQ, value: 'Evet' }),
            block('c', { blockId: 'b', op: OPS.ANSWERED }),
        ];
        expect([...hiddenBlockIds(chain, { b: 'dolu' })].sort()).toEqual(['b', 'c']);
    });

    it('secilen cagri ortaklik istiyorsa gorunur', () => {
        const flagBlocks = [
            block('call', null, { source: 'open-grant-calls' }),
            block('partner', { blockId: 'call', op: OPS.FLAG, value: REQUIRES_CONSORTIUM }),
        ];
        const choicesOf = () => CALL_CHOICES;
        expect([...hiddenBlockIds(flagBlocks, { call: { value: 'call-ortakli' } }, choicesOf)]).toEqual([]);
        expect([...hiddenBlockIds(flagBlocks, { call: { value: 'call-tekil' } }, choicesOf)]).toEqual(['partner']);
        expect([...hiddenBlockIds(flagBlocks, {}, choicesOf)]).toEqual(['partner']);
    });

    it('taninmayan karsilastirma GIZLEMEZ, bozuk kural yok sayilir', () => {
        expect([...hiddenBlockIds([block('p'), block('c', { blockId: 'p', op: 'bilinmeyen' })], {})]).toEqual([]);
        expect([...hiddenBlockIds([block('p'), block('c', { op: OPS.ANSWERED })], {})]).toEqual([]);
    });

    it('ayar JSON metni olarak gelse de okunur (herkese acik form)', () => {
        const raw = [
            { id: 'p', type: 0, content: 'p', settings: '{}' },
            { id: 'c', type: 0, content: 'c', settings: JSON.stringify({ visibleWhen: { blockId: 'p', op: 'eq', value: 'Evet' } }) },
        ];
        expect([...hiddenBlockIds(raw, { p: 'Hayır' })]).toEqual(['c']);
    });
});

describe('withoutHidden', () => {
    it('gizli alanin cevabini duser, degisiklik yoksa AYNI nesneyi verir', () => {
        const answers = { a: '1', b: '2' };
        expect(withoutHidden(answers, new Set(['b']))).toEqual({ a: '1' });
        expect(withoutHidden(answers, new Set(['yok']))).toBe(answers);
    });
});
