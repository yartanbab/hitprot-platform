import { RECIPIENT_LABEL } from './api';

/**
 * Rapor derleyicinin şablon listesi: kuruma göre gruplama ve arama.
 *
 * Sistemde kırktan fazla şablon var (kurum kapanış ve ara raporları); düz liste
 * taranamıyordu. Kullanıcının kendi şablonları başta, sistem şablonları veren
 * kuruma (issuer) göre gruplanır. Kurumu olmayan sistem şablonları (banka,
 * müşteri, denetçi, iç yönetim) tek grupta toplanır.
 */

export const OWN_GROUP_KEY = 'own';
export const GENERAL_GROUP_KEY = 'general';

const TR_FOLD = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' };

/** Türkçe büyük/küçük harf ve aksan duyarsız arama anahtarı: "TÜBİTAK" → "tubitak", "IŞIK" → "isik". */
export function searchKey(text) {
  return String(text ?? '')
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıöşü]/g, (c) => TR_FOLD[c])
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** Şablonun hangi gruba düştüğü. */
export function groupOf(template) {
  if (!template.isSystem) return { key: OWN_GROUP_KEY, title: 'Kendi şablonlarım' };
  if (template.issuer) return { key: `issuer:${template.issuer}`, title: template.issuer };
  return { key: GENERAL_GROUP_KEY, title: 'Genel şablonlar' };
}

/** Sorgunun her kelimesi şablonun adında, kurumunda ya da alıcı türünde geçmeli. */
export function matchesQuery(template, query) {
  const words = searchKey(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = searchKey([template.name, template.issuer, RECIPIENT_LABEL[template.recipient]].join(' '));
  return words.every((w) => haystack.includes(w));
}

/**
 * Şablonları gruplar ve sorguya göre süzer. Sunucunun sırası (Order, ad) korunur:
 * gruplar ilk şablonlarının göründüğü sırayla gelir, kendi şablonlar her zaman başta.
 * Boş kalan grup dönmez.
 */
export function groupTemplates(templates, query = '') {
  const groups = new Map();
  for (const template of templates) {
    if (!matchesQuery(template, query)) continue;
    const { key, title } = groupOf(template);
    if (!groups.has(key)) groups.set(key, { key, title, items: [] });
    groups.get(key).items.push(template);
  }

  const list = [...groups.values()];
  const own = list.filter((g) => g.key === OWN_GROUP_KEY);
  return [...own, ...list.filter((g) => g.key !== OWN_GROUP_KEY)];
}
