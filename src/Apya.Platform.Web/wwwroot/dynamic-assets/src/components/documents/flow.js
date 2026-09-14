/**
 * Doküman süreci — dört adımlı şeridin saf mantığı.
 *
 *   1 Belgeler → 2 Uygunluk → 3 Derle → 4 Teslim
 *
 * Şerit modülün süreç ekranlarında başlığın altında durur. Hangi adımın etkin
 * olduğunu ekran söyler; adımların bağlantıları, Uygunluk adımının alt etiketi
 * ve sağdaki "Sırada" ipucu burada türetilir. React'e dokunmaz — ekranlar
 * arasında sapmasın ve test edilebilsin diye.
 */

export const FLOW_STEPS = [
  { key: 'docs', no: 1, label: 'Belgeler', sub: 'Yükle · sınıflandır', path: 'Documents' },
  { key: 'compliance', no: 2, label: 'Uygunluk', sub: 'Kontrol listesi', path: 'Documents', query: { tab: 'compliance' } },
  { key: 'report', no: 3, label: 'Derle', sub: 'Bölüm seç · önizle', path: 'Documents/ReportBuilder' },
  { key: 'deliver', no: 4, label: 'Teslim', sub: 'Son kontrol + paket', path: 'Documents/Deliveries' },
];

/** ComplianceItemStatus.Missing — sunucu enum'u JSON'a sayı olarak düşer. */
const STATUS_MISSING = 2;

/** Adımın ekran adresi. Proje bağlamı taşınır ki ekran değişince bağlam kaybolmasın. */
export function stepHref(stepKey, projectId, appPath = '/') {
  const step = FLOW_STEPS.find((s) => s.key === stepKey);
  if (!step) return null;

  const query = new URLSearchParams(step.query ?? {});
  if (projectId) query.set('projectId', projectId);

  const qs = query.toString();
  return `${appPath}${step.path}${qs ? `?${qs}` : ''}`;
}

/**
 * Sunucudaki ComplianceCalculator.Percent'in birebir karşılığı: feragat edilen
 * kalemler paydadan düşer, yarım yukarı yuvarlanır (MidpointRounding.AwayFromZero —
 * pozitif sayılarda Math.round ile aynı).
 */
export function compliancePercent(satisfied, total, waived) {
  const denominator = total - waived;
  if (denominator <= 0) return 100;
  return Math.round((satisfied * 100) / denominator);
}

/** Bir kalem daha karşılanırsa uygunluğun ulaşacağı yüzde. */
export function projectedPercent(summary) {
  const denominator = summary.totalCount - summary.waivedCount;
  const satisfied = Math.min(summary.satisfiedCount + 1, Math.max(denominator, 0));
  return compliancePercent(satisfied, summary.totalCount, summary.waivedCount);
}

/** İlk yüklenmesi gereken eksik kalem — teslimi bloke edenler önce. */
export function firstMissingItem(overview) {
  const items = (overview?.checklists ?? [])
    .flatMap((checklist) => checklist.items ?? [])
    .filter((item) => item.status === STATUS_MISSING);

  return items.find((item) => item.isBlocking) ?? items[0] ?? null;
}

/** İki özet aynı durumu mu anlatıyor? Gereksiz yeniden yüklemeyi önler. */
export function sameSummary(a, b) {
  if (!a || !b) return a === b;
  return a.totalCount === b.totalCount
    && a.satisfiedCount === b.satisfiedCount
    && a.waivedCount === b.waivedCount
    && a.missingCount === b.missingCount
    && a.blockingMissingCount === b.blockingMissingCount
    && a.percent === b.percent;
}

/**
 * Uygunluk adımının alt etiketi.
 * @param {{ hasProject: boolean, loading: boolean, overview: object|null }} state
 */
export function complianceSub({ hasProject, loading, overview }) {
  if (!hasProject) return 'Proje seçin';
  if (loading || !overview) return 'Kontrol listesi';
  if (!overview.checklists?.length) return 'Paket uygulanmadı';

  const { percent, missingCount } = overview.summary;
  return missingCount > 0 ? `%${percent} · ${missingCount} eksik` : `%${percent} · tamam`;
}

/**
 * "Sırada" ipucu: bu ekranda sürecin bir sonraki işi. Metin yoksa null döner
 * (veri okunamadıysa uydurma bir öneri basmıyoruz).
 *
 * @param {'docs'|'compliance'|'report'|'deliver'|null} active
 * @param {{ hasProject: boolean, loading: boolean, overview: object|null }} state
 * @returns {{ text: string, tone: 'neutral'|'accent'|'warning', pending?: boolean } | null}
 */
export function nextHint(active, { hasProject, loading, overview }) {
  if (!hasProject) return { text: 'Proje bağlamı seçin', tone: 'neutral' };
  if (loading) return { text: '…', tone: 'neutral', pending: true };
  if (!overview) return null;

  const summary = overview.summary ?? {};
  const hasChecklist = (overview.checklists?.length ?? 0) > 0;

  if (active === 'report') {
    return { text: 'Önizle ve teslime geç', tone: 'accent' };
  }

  if (active === 'deliver') {
    return summary.blockingMissingCount > 0
      ? { text: `${summary.blockingMissingCount} bloke kalemi çöz, paketi üret`, tone: 'warning' }
      : { text: 'Paketi üret', tone: 'accent' };
  }

  if (!hasChecklist) return { text: 'Kurum paketi uygula', tone: 'accent' };

  if (active === 'compliance') {
    return summary.missingCount > 0
      ? { text: `${summary.missingCount} eksik belgeyi yükle`, tone: 'warning' }
      : { text: 'Raporu derle', tone: 'accent' };
  }

  // Belgeler adımı ve adımı olmayan ekranlar (zaman çizelgesi): en kritik eksik.
  const item = firstMissingItem(overview);
  if (!item) return { text: 'Raporu derle', tone: 'accent' };

  // "X'i yükle" demek ada göre ek ister (Yazısı'nı, Raporu'nu); ekleri tahmin
  // etmek yerine eylemi başa alıyoruz.
  return { text: `Yükle: ${item.title} → uygunluk %${projectedPercent(summary)}`, tone: 'warning' };
}
