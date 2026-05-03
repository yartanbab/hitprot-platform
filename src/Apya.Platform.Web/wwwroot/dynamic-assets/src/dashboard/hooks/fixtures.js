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
};
