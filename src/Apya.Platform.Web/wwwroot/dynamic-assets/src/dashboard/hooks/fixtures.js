/**
 * Mock fixtures — backend endpoint'leri tamamlanana kadar.
 *
 * Bu dosya APYA-97'nin sınır işaretidir: gerçek API'ye geçişte
 * fetcher'lar `api.get('/api/dashboard/...')` ile değiştirilir,
 * fixture'lar silinir.
 *
 * Yapay gecikme — TanStack Query loading state'i ve skeleton'ı
 * realistik göstermek için (250-450ms aralığı; UX strategy doc § 5).
 */

const DELAY_MIN = 250;
const DELAY_MAX = 450;

function delay(ms = DELAY_MIN + Math.random() * (DELAY_MAX - DELAY_MIN)) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const fixtures = {
    async budgetSummary() {
        await delay();
        return {
            spent:    1_847_500,
            budget:   2_400_000,
            currency: 'TRY',
            deltaPct: -8.4,
            breakdown: [
                { project: 'KOSGEB Ar-Ge',        spent: 720_000, budget: 900_000, ratio: 0.80 },
                { project: 'TÜBİTAK 1501',         spent: 540_000, budget: 800_000, ratio: 0.68 },
                { project: 'Dijitalleşme Hibesi', spent: 387_500, budget: 450_000, ratio: 0.86 },
                { project: 'İhracat Geliştirme',  spent: 200_000, budget: 250_000, ratio: 0.80 },
            ],
        };
    },

    async cashFlow() {
        await delay();
        return {
            currency:   'TRY',
            netCurrent: 487_300,
            deltaPct:   12.4,
            series: [
                320, 312, 305, 318, 332, 340, 355, 348, 360, 372,
                380, 365, 390, 410, 405, 420, 435, 425, 440, 455,
                448, 462, 470, 458, 472, 480, 475, 482, 487, 487,
            ],
        };
    },

    async pendingApprovals() {
        await delay();
        return [
            { id: 'inv-001', type: 'invoice', title: 'TÜBİTAK 1501 — Eylül faturası',          requester: 'Ahmet Yıldız',  amount: 12_450, currency: 'TRY', ageHours:  4 },
            { id: 'exp-002', type: 'expense', title: 'Yazılım lisansı — JetBrains All',        requester: 'Mehmet Kaya',   amount:  8_240, currency: 'TRY', ageHours: 18 },
            { id: 'po-003',  type: 'po',      title: 'Bulut hosting (Q3 yenileme)',            requester: 'Zeynep Aksoy',  amount: 24_900, currency: 'TRY', ageHours: 36 },
            { id: 'inv-004', type: 'invoice', title: 'KOSGEB danışmanlık — Ağustos',           requester: 'Selin Aydın',   amount:  6_800, currency: 'TRY', ageHours: 52 },
        ];
    },

    /* Tek bir onay kaydı + zenginleştirilmiş context (push notification deep-link
       senaryosu — APYA-108). Liste API'sinden bağımsız endpoint. */
    async fetchApproval(id) {
        await delay(280);
        const list = await this.pendingApprovals();
        const item = list.find((i) => i.id === id);
        if (!item) {
            const e = new Error('Onay bulunamadı veya başka kullanıcıca işlendi.');
            e.status = 404;
            throw e;
        }
        return {
            ...item,
            ai: {
                confidence: 0.92,
                anomaly: false,
                /* Reasons — neden anomaly değil/değil. Şeffaf AI: kullanıcı
                   güvenmek için "neden"i görmek ister. */
                reasons: [
                    'Tutar son 90 günlük ortalamanın %12 altında',
                    'Tedarikçi son 6 ayda 4 fatura (sürekli)',
                    'KDV oranı kategori için tipik (%20)',
                ],
            },
            context: {
                budget: { remaining: 78_400, total: 250_000, currency: 'TRY' },
                category: { spentMonth: 14_200, label: item.type === 'expense' ? 'Yazılım' : 'Operasyon' },
                project: { name: 'KOSGEB Ar-Ge', code: 'PRJ-2026-014' },
            },
        };
    },

    async approveItem(item) {
        await delay(600);
        /* Simülatif: %5 ihtimalle 409 (concurrency çakışması) — rollback testi */
        if (Math.random() < 0.05) {
            const e = new Error('Bu kayıt başka bir kullanıcı tarafından onaylanmış.');
            e.status = 409;
            throw e;
        }
        return { id: item.id, status: 'approved' };
    },

    async rejectItem(item) {
        await delay(400);
        return { id: item.id, status: 'rejected' };
    },

    async riskAlerts() {
        await delay();
        return [
            {
                id: 'r-001', severity: 'critical', confidence: 92, confidenceLabel: 'Yüksek',
                title: 'KOSGEB Ar-Ge projesi 14 gün içinde teslim — kritik yol kaymış',
                reasons: [
                    'Görev T-142 son 5 gündür hareketsiz',
                    'Bağımlı 3 görev gecikmeli',
                    'Geçmiş projelerde benzer örüntü %78 gecikme ile sonuçlandı',
                ],
                suggestedAction: 'Kritik yolu yeniden planla',
            },
            {
                id: 'r-002', severity: 'actionable', confidence: 74, confidenceLabel: 'Orta',
                title: 'Dijitalleşme bütçesi %86 — kalan 2 ay yetmeyebilir',
                reasons: [
                    'Aylık ortalama harcama hızı 187K ₺',
                    'Kalan bütçe 63K ₺',
                    'Önceki dönemde benzer hızda %22 aşım yaşanmış',
                ],
                suggestedAction: 'Bütçe revizyonu öner',
            },
            {
                id: 'r-003', severity: 'info', confidence: 88, confidenceLabel: 'Yüksek',
                title: 'Yeni hibe çağrısı: TÜBİTAK 1505 firma profilinizle %88 uyumlu',
                reasons: [
                    'NACE sektörü uyumlu',
                    'Çalışan sayısı eşleşiyor',
                    'Önceki başarılı projeniz 1501 → 1505 kombinasyonu yaygın',
                ],
                suggestedAction: 'Çağrıyı incele',
            },
        ];
    },

    async dismissRisk(risk) {
        await delay(300);
        return { id: risk.id, dismissed: true };
    },

    async acceptRisk(risk) {
        await delay(500);
        return { id: risk.id, accepted: true };
    },

    /* AI suggestion inbox — dashboard widget'ı için top-N öneri.
       Risk alerts'ten ayrı: risk = "neye dikkat", suggestion = "ne yap".
       Tone: opportunity | warning | critical | neutral */
    async aiSuggestions() {
        await delay();
        return [
            {
                id: 's-001',
                tone: 'opportunity',
                confidence: 0.91,
                headline: 'Reklam bütçesini Q3\'te %15 düşür — ROAS son 2 çeyrekte 1.8 → 1.2',
                why: [
                    'Q1 ROAS 1.8 → Q2 ROAS 1.2 (%33 düşüş)',
                    'Aynı kategoride sektör medyanı 1.4',
                    'Geçen sezon benzer kararı veren 4 müşteride %12 net marj kazanımı',
                ],
                primaryActionLabel: 'Bütçeyi düşür',
                affects: { module: 'budgets', resource: 'campaign-q3' },
            },
            {
                id: 's-002',
                tone: 'warning',
                confidence: 0.74,
                headline: 'Dijitalleşme kategorisi son 30 günde %22 hızlandı, eşik 2 ay önce aşılır',
                why: [
                    'Aylık ortalama harcama hızı 187K ₺',
                    'Kalan bütçe 63K ₺',
                    'Trend devam ederse 28 Haziran\'da limit aşılır',
                ],
                primaryActionLabel: 'Bütçe revizyonu öner',
                affects: { module: 'budgets', resource: 'cat-digital' },
            },
            {
                id: 's-003',
                tone: 'opportunity',
                confidence: 0.88,
                headline: 'TÜBİTAK 1505 çağrısı firma profilinizle %88 uyumlu — son başvuru 18 gün',
                why: [
                    'NACE sektör kodu uyumlu',
                    'Çalışan sayısı eşik aralığında',
                    'Önceki başarılı 1501 projeniz 1505\'e geçişte sık görülen örüntü',
                ],
                primaryActionLabel: 'Çağrıyı incele',
                affects: { module: 'grants', resource: 'tubitak-1505' },
            },
            {
                id: 's-004',
                tone: 'neutral',
                confidence: 0.42,
                headline: 'Yazılım abonelik gideri 3 ay üst üste yükseldi — kontrol etmek isteyebilirsin',
                why: [
                    'Mart: 4.2K — Nisan: 5.1K — Mayıs: 6.3K ₺',
                    'Yeni eklenen 3 lisans tespit edildi',
                ],
                primaryActionLabel: 'Faturaları gör',
                affects: { module: 'expenses', resource: 'subs' },
            },
        ];
    },

    async applySuggestion(suggestion) {
        await delay(500);
        /* Simülatif: %3 ihtimalle çakışma — undo ile geri alınır */
        if (Math.random() < 0.03) {
            const e = new Error('Bu öneri başka bir kullanıcı tarafından uygulanmış.');
            e.status = 409;
            throw e;
        }
        return { id: suggestion.id, applied: true };
    },

    async snoozeSuggestion(suggestion) {
        await delay(250);
        return { id: suggestion.id, snoozed: true, until: new Date(Date.now() + 7 * 86400_000).toISOString() };
    },

    async dismissSuggestion(suggestion, reason = 'irrelevant') {
        /* `reason` model retraining sinyali — server bunu öğrenme katmanına iletir. */
        await delay(250);
        return { id: suggestion.id, dismissed: true, reason };
    },
};
