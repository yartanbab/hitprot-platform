/**
 * Expense capture mock fixtures.
 * Backend hazır olunca: api.post('/api/expenses/ocr', file) ve
 *                       api.post('/api/expenses', payload) ile değiştirilir.
 *
 * OCR response shape (PER-FIELD confidence — APYA-107):
 *   { confidence: 0.78,                                  // global
 *     fields: {
 *       amount:   { value: 234.50, confidence: 0.91 },
 *       currency: { value: 'TRY',  confidence: 0.99 },
 *       date:     { value: '2026-05-04', confidence: 0.85 },
 *       vendor:   { value: 'Migros A.Ş.', confidence: 0.62 },  // low → form sarı
 *       category: { value: 'Ofis Sarfiyat', confidence: 0.55 },
 *       taxRate:  { value: 20, confidence: 0.95 },
 *     },
 *     rawText: '...',
 *   }
 *
 * Per-field confidence düşükse form alanı warning border + ipucu ile vurgulanır.
 * Eşik: 0.70 altı low. Caller global `confidence` ile kullanıcıya genel
 * güven sinyali verir, alan-bazlı kararı `fields[X].confidence` ile.
 */

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const VENDOR_POOL = [
    { vendor: 'Migros A.Ş.',     category: 'Ofis Sarfiyat' },
    { vendor: 'BSH Ev Aletleri', category: 'Donanım' },
    { vendor: 'Türk Telekom',    category: 'Internet/Telekom' },
    { vendor: 'JetBrains s.r.o.', category: 'Yazılım Lisansı' },
    { vendor: 'Lufthansa',       category: 'Seyahat' },
];

/* Reproducible jitter — file size'tan deterministik. Test'lerde aynı dosya
   aynı confidence'ı verir, snapshot kararlı kalır. */
function jitterConfidence(base, seed) {
    const wobble = ((seed * 9301 + 49297) % 233280) / 233280;     /* LCG 0..1 */
    return Math.min(0.99, Math.max(0.40, base + (wobble - 0.5) * 0.20));
}

export const expenseFixtures = {
    async ocr(file) {
        await delay(900 + Math.random() * 600);                    /* OCR yavaştır — 0.9-1.5s */

        const seed = (file.size + (file.name?.length || 0));
        const sample = VENDOR_POOL[seed % VENDOR_POOL.length];
        const amount = Math.round((50 + ((seed % 500_000) / 100)) * 100) / 100;

        /* Vendor & category örneği DAİMA biraz düşük güvenle simüle (gerçek hayatta
           OCR için en zor alanlar; kullanıcı düzeltir). */
        return {
            confidence: jitterConfidence(0.80, seed),
            fields: {
                amount:   { value: amount,        confidence: jitterConfidence(0.92, seed + 1) },
                currency: { value: 'TRY',         confidence: 0.99 },
                date:     { value: new Date().toISOString().slice(0, 10), confidence: jitterConfidence(0.86, seed + 2) },
                vendor:   { value: sample.vendor,  confidence: jitterConfidence(0.65, seed + 3) },
                category: { value: sample.category, confidence: jitterConfidence(0.58, seed + 4) },
                taxRate:  { value: 20,             confidence: 0.95 },
            },
            rawText: `${sample.vendor}\nTutar: ${amount.toFixed(2)} TL\nKDV %20`,
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

/* Düşük güven eşiği — UX strategy doc § 4 ile uyumlu (0.70 altı kullanıcı
   onayı gerektirir). Form'da bu eşik altı alanlar warning border alır. */
export const LOW_CONFIDENCE_THRESHOLD = 0.70;
