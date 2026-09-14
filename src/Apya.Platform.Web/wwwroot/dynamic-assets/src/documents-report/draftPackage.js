import { createPackage, getPackages } from '../deliveries/api';

/**
 * Rapor derleyicinin "Taslak kaydet" ve "Üret ve teslime geç" düğmelerinin ortak işi.
 *
 * Bu üründe taslak = TASLAK durumundaki teslim paketi (DeliveryPackageStatus.Draft).
 * Derleyicide seçilen şablon pakete bağlanır; asıl üretim Teslim adımında,
 * üretim öncesi kontrolden geçerek yapılır.
 *
 * İdempotent: aynı proje + şablon için taslak zaten varsa YENİSİ açılmaz, var
 * olan döner. Kullanıcı düğmeye iki kez bastığında ya da derleyiciye geri dönüp
 * yeniden "Üret ve teslime geç" dediğinde Teslimler listesi taslakla dolmasın.
 */

const DRAFT = 1;
/** PDF + ZIP + Excel — Teslimler ekranının yeni paket varsayılanıyla aynı. */
const ALL_FORMATS = 1 | 2 | 4;
/** ReportingConsts.MaxPackageNameLength */
const MAX_NAME = 160;

const sameId = (a, b) => String(a ?? '').toLowerCase() === String(b ?? '').toLowerCase();

export function findDraft(packages, templateId) {
  return (packages ?? []).find((p) => p.status === DRAFT && sameId(p.reportTemplateId, templateId)) ?? null;
}

export function draftName(templateName, now = new Date()) {
  const date = new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(now);
  const suffix = ` · ${date}`;
  return `${templateName.slice(0, MAX_NAME - suffix.length)}${suffix}`;
}

/**
 * @param {{ projectId: string, template: { id: string, name: string } }} input
 * @returns {Promise<{ pkg: object, created: boolean }>}
 */
export async function ensureDraftPackage({ projectId, template }) {
  const existing = findDraft(await getPackages(projectId), template.id);
  if (existing) return { pkg: existing, created: false };

  const pkg = await createPackage({
    projectId,
    name: draftName(template.name),
    reportTemplateId: template.id,
    formats: ALL_FORMATS,
  });

  return { pkg, created: true };
}
