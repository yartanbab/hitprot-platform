import { describe, it, expect, beforeEach, vi } from 'vitest';
import { offlineQueue, flushQueue } from './offlineQueue';

/**
 * Saha kuyruğunun sözleşmesi (tasarım 1d).
 *
 * Buradaki kurallar paranın kaybolmasını ya da iki kez kaydedilmesini engelliyor:
 *   1) Gönderilemeyen kayıt kuyrukta KALIR — düşerse kullanıcının girdiği masraf
 *      sessizce yok olur.
 *   2) Gönderilen kayıt kuyruktan DÜŞER — kalırsa aynı gider ikinci kez oluşur.
 *   3) Depoya yazılamıyorsa enqueue false döner — çağıran "kaydedildi" DEMEMELİ.
 */
beforeEach(() => {
    window.localStorage.clear();
    offlineQueue.clear();
});

describe('offlineQueue', () => {
    it('kuyruga alir ve sayar', () => {
        expect(offlineQueue.enqueue({ title: 'Yakıt', amount: 100 })).toBe(true);
        expect(offlineQueue.enqueue({ title: 'Otopark', amount: 40 })).toBe(true);

        expect(offlineQueue.count()).toBe(2);
        expect(offlineQueue.list()[0].payload.title).toBe('Yakıt');
    });

    it('her girdiye BENZERSIZ clientId verir', () => {
        offlineQueue.enqueue({ title: 'A' });
        offlineQueue.enqueue({ title: 'A' });

        const [a, b] = offlineQueue.list();
        expect(a.clientId).not.toBe(b.clientId);
    });

    it('depo yazilamiyorsa FALSE doner — cagiran kaydedildi dememeli', () => {
        const spy = vi.spyOn(window.localStorage.__proto__, 'setItem')
            .mockImplementation(() => { throw new Error('QuotaExceededError'); });

        expect(offlineQueue.enqueue({ title: 'Yakıt' })).toBe(false);

        spy.mockRestore();
    });

    it('bozuk depo icerigi kuyrugu BOS sayar, patlamaz', () => {
        window.localStorage.setItem('apya.expenseQueue.v1', '{bozuk json');

        expect(offlineQueue.list()).toEqual([]);
        expect(offlineQueue.count()).toBe(0);
    });
});

describe('flushQueue', () => {
    it('gonderilen kaydi kuyruktan DUSURUR', async () => {
        offlineQueue.enqueue({ title: 'Yakıt' });
        offlineQueue.enqueue({ title: 'Otopark' });

        const send = vi.fn().mockResolvedValue({ id: 'x' });
        const summary = await flushQueue(send);

        expect(send).toHaveBeenCalledTimes(2);
        expect(summary).toMatchObject({ sent: 2, failed: 0, remaining: 0 });
        expect(offlineQueue.count()).toBe(0);
    });

    it('gonderilemeyen kaydi kuyrukta BIRAKIR ve durur', async () => {
        offlineQueue.enqueue({ title: 'Yakıt' });
        offlineQueue.enqueue({ title: 'Otopark' });

        // İlk kayıt geçer, ikincisi düşer → ikincisi ve sonrası kuyrukta kalır.
        const send = vi.fn()
            .mockResolvedValueOnce({ id: 'x' })
            .mockRejectedValueOnce(new Error('ağ yok'));

        const summary = await flushQueue(send);

        expect(summary).toMatchObject({ sent: 1, failed: 1, remaining: 1 });
        expect(offlineQueue.list()[0].payload.title).toBe('Otopark');
    });

    it('ilk hatada DURUR — kalan kayitlari tekrar tekrar denemez', async () => {
        offlineQueue.enqueue({ title: 'A' });
        offlineQueue.enqueue({ title: 'B' });
        offlineQueue.enqueue({ title: 'C' });

        const send = vi.fn().mockRejectedValue(new Error('oturum kapandı'));
        await flushQueue(send);

        expect(send).toHaveBeenCalledTimes(1);
        expect(offlineQueue.count()).toBe(3);
    });

    it('bos kuyrukta hicbir sey gondermez', async () => {
        const send = vi.fn();
        const summary = await flushQueue(send);

        expect(send).not.toHaveBeenCalled();
        expect(summary).toMatchObject({ sent: 0, remaining: 0 });
    });
});
