import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { DATA_CHANGED_EVENT, DATA_CHANGED_STAMP_KEY } from '../lib/api/dataChanged';

// wwwroot/js/apya-data-changed.js bir IIFE (global demet): jQuery sayfaları ve
// Yeni Görev modalı yayınlar, React adaları lib/api/dataChanged.js ile dinler.
// İki taraf aynı olay adını ve damga anahtarını AYRI dosyalarda sabit tutuyor;
// bu test onları birebir kilitler (kayma sessiz olurdu: ada hiç tazelenmezdi).
beforeAll(async () => {
    await import('../../../js/apya-data-changed.js');
});

beforeEach(() => window.sessionStorage.clear());

describe('apya.dataChanged (global yayıncı)', () => {
    it('emit, document üzerinde apya:data-changed olayını aynı detail ile yayınlar', () => {
        const seen = [];
        const onEvent = (e) => seen.push(e.detail);
        document.addEventListener('apya:data-changed', onEvent);

        window.apya.dataChanged.emit({ entity: 'task', ids: ['t1'] });

        document.removeEventListener('apya:data-changed', onEvent);
        expect(seen).toEqual([{ entity: 'task', ids: ['t1'] }]);
    });

    it('emit sessionStorage damgasını sayısal zamanla yazar', () => {
        const before = Date.now();
        window.apya.dataChanged.emit({ entity: 'task' });

        const stamp = Number(window.sessionStorage.getItem('apya-data-changed-at'));
        expect(Number.isFinite(stamp)).toBe(true);
        expect(stamp).toBeGreaterThanOrEqual(before);
    });

    it('damga yazılamasa da (gizli sekme) olay yine yayınlanır', () => {
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('QuotaExceeded'); });
        const onEvent = vi.fn();
        document.addEventListener('apya:data-changed', onEvent);

        expect(() => window.apya.dataChanged.emit({ entity: 'task' })).not.toThrow();

        document.removeEventListener('apya:data-changed', onEvent);
        expect(onEvent).toHaveBeenCalledTimes(1);
    });

    it('sözleşme kilidi: olay adı ve damga anahtarı lib/api/dataChanged.js ile BİREBİR aynı', () => {
        expect(window.apya.dataChanged.EVENT).toBe(DATA_CHANGED_EVENT);
        expect(window.apya.dataChanged.STAMP_KEY).toBe(DATA_CHANGED_STAMP_KEY);
    });
});
