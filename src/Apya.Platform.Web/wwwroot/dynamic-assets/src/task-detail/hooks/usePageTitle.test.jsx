import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePageTitle } from './usePageTitle';

// QA-25 · Sayfa kipinde sekme başlığı görevi izler; marka eki korunur.
describe('usePageTitle', () => {
    beforeEach(() => { document.title = 'Eski görev adı | Apya'; });

    it('başlık değişince sekme başlığı güncellenir, marka eki korunur', () => {
        const { rerender } = renderHook(({ title }) => usePageTitle(title), { initialProps: { title: 'Eski görev adı' } });
        rerender({ title: 'Yeni görev adı' });
        expect(document.title).toBe('Yeni görev adı | Apya');
    });

    it('başlık yoksa (modal kipi) dokunmaz', () => {
        renderHook(() => usePageTitle(null));
        expect(document.title).toBe('Eski görev adı | Apya');
    });
});
