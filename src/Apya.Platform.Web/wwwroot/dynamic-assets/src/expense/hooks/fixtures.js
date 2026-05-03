/**
 * Expense capture mock fixtures.
 * Backend hazır olunca: api.post('/api/expenses/ocr', file) ve
 *                       api.post('/api/expenses', payload) ile değiştirilir.
 */

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const VENDOR_POOL = [
    { vendor: 'Migros A.Ş.', category: 'Ofis Sarfiyat' },
    { vendor: 'BSH Ev Aletleri', category: 'Donanım' },
    { vendor: 'Türk Telekom', category: 'Internet/Telekom' },
    { vendor: 'JetBrains s.r.o.', category: 'Yazılım Lisansı' },
    { vendor: 'Lufthansa', category: 'Seyahat' },
];

export const expenseFixtures = {
    /* OCR — gerçek hayatta Azure Form Recognizer veya Google Vision çağrılır.
       Burada deterministik mock: file size'a göre vendor seçer (test için
       reproducible). */
    async ocr(file) {
        await delay(900 + Math.random() * 600); /* OCR yavaştır — 0.9-1.5s */

        const idx = (file.size + (file.name?.length || 0)) % VENDOR_POOL.length;
        const sample = VENDOR_POOL[idx];

        return {
            confidence: 0.78 + Math.random() * 0.18,
            amount:   Math.round((50 + Math.random() * 5000) * 100) / 100,
            currency: 'TRY',
            date:     new Date().toISOString().slice(0, 10),
            vendor:   sample.vendor,
            category: sample.category,
            taxRate:  20,
            rawText:  `${sample.vendor}\nTutar: ${(50 + Math.random() * 5000).toFixed(2)} TL\nKDV %20`,
        };
    },

    async submit(payload) {
        await delay(600);
        if (!payload?.amount || payload.amount <= 0) {
            const e = new Error('Tutar geçersiz.');
            e.status = 400;
            throw e;
        }
        return {
            id: 'exp-' + Math.random().toString(36).slice(2, 9),
            ...payload,
            status: 'submitted',
            createdAt: new Date().toISOString(),
        };
    },
};
