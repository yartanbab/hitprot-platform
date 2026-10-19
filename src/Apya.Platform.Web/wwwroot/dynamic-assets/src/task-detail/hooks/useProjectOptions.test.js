import { describe, it, expect } from 'vitest';
import { projectOptionsOf } from './useProjectOptions';

describe('projectOptionsOf (QA-37)', () => {
    it('adı çakışan projelere kod eklenir, tekil ad olduğu gibi kalır', () => {
        const options = projectOptionsOf([
            { id: 'a', name: 'Yeşil Enerji Dönüşümü', code: 'PRJ-2026-005' },
            { id: 'b', name: 'Yeşil Enerji Dönüşümü', code: 'PRJ-2026-010' },
            { id: 'c', name: 'Veri Merkezi Taşıma', code: 'PRJ-2026-003' },
        ]);

        expect(options).toEqual([
            { value: 'a', label: 'Yeşil Enerji Dönüşümü · PRJ-2026-005' },
            { value: 'b', label: 'Yeşil Enerji Dönüşümü · PRJ-2026-010' },
            { value: 'c', label: 'Veri Merkezi Taşıma' },
        ]);
    });
});
