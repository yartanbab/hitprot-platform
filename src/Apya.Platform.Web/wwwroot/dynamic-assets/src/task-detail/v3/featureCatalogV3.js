import { TASK_FEATURE_REGISTRY } from '../TaskFeatureRegistry';

/**
 * Özellik kataloğu — BAŞLIK ve İKON kaynağı TaskFeatureRegistry'dir (tek doğruluk
 * kaynağı, handoff gereği "başlıklar birebir oradaki title değerleri"). Burada
 * yalnız katalogda gösterilen ek sunum bilgisi tutulur: grup, açıklama, renk.
 */

const REGISTRY = Object.fromEntries(TASK_FEATURE_REGISTRY.map((f) => [f.code, f]));

const PRESENTATION = {
    'subtask-table': { desc: 'Alt görevlerin sıralanabilir tablosu',      bg: 'bg-neutral-subtle',  fg: 'text-text-secondary' },
    'subtask-board': { desc: 'Alt görevleri duruma göre sütunlarda taşı', bg: 'bg-primary-subtle',  fg: 'text-primary' },
    calendar:        { desc: 'Görev ve alt görev tarihleri aylık ızgarada', bg: 'bg-primary-subtle', fg: 'text-primary' },
    documents:       { desc: 'Göreve bağlı yazılı belgeler',                bg: 'bg-primary-subtle',  fg: 'text-primary' },
    checklist:       { desc: 'Alt görev ve onay kontrol listeleri',        bg: 'bg-success-subtle',  fg: 'text-success' },
    gantt:           { desc: 'İnteraktif zaman çizelgesi ve aşamalar',     bg: 'bg-primary-subtle',  fg: 'text-primary' },
    'time-tracking': { desc: 'Canlı süre takibi, sayaç ve raporlama',      bg: 'bg-warning-subtle',  fg: 'text-warning' },
    dependencies:    { desc: 'Öncül ve ardıl görev bağlantıları',          bg: 'bg-neutral-subtle',  fg: 'text-text-secondary' },
    risks:           { desc: 'Risk matrisi ve önleyici aksiyonlar',        bg: 'bg-warning-subtle',  fg: 'text-warning' },
    approvals:       { desc: 'Çok adımlı yönetici onay akışları',          bg: 'bg-primary-subtle',  fg: 'text-primary' },
    dashboard:       { desc: 'Özel KPI ve performans widget panelleri',    bg: 'bg-primary-subtle',  fg: 'text-primary' },
    comments:        { desc: 'Görev yorumları ve @bahsetmeler',            bg: 'bg-primary-subtle',  fg: 'text-primary' },
    emails:          { desc: 'Görevle bağlantılı e-posta entegrasyonu',    bg: 'bg-primary-subtle',  fg: 'text-primary' },
    activity:        { desc: 'Tüm sistem olayları ve zaman akışı',         bg: 'bg-primary-subtle',  fg: 'text-primary' },
    history:         { desc: 'Kayıt bilgileri ve durum geçişleri',          bg: 'bg-neutral-subtle',  fg: 'text-text-secondary' },
    finance:         { desc: 'Maliyet merkezleri, bütçe ve harcamalar',    bg: 'bg-success-subtle',  fg: 'text-success' },
    gallery:         { desc: 'Göreve eklenen görsellerin ızgarası',         bg: 'bg-neutral-subtle',  fg: 'text-text-secondary' },
    ai:              { desc: 'Akıllı görev analizi, özet ve öneriler',     bg: 'bg-ai-subtle',       fg: 'text-ai-500' },
    automations:     { desc: 'Durum ve eylem tetikleyici kurallar',        bg: 'bg-ai-subtle',       fg: 'text-ai-500' },
    'custom-fields': { desc: 'Göreve özel form alanları tanımlayın',       bg: 'bg-success-subtle',  fg: 'text-success' },
};

const GROUPS = [
    { title: 'GÖREV & PLANLAMA',               codes: ['subtask-table', 'subtask-board', 'calendar', 'documents', 'checklist', 'gantt', 'time-tracking', 'dependencies', 'risks', 'approvals', 'dashboard'] },
    { title: 'İLETİŞİM',                       codes: ['comments', 'emails'] },
    { title: 'GEÇMİŞ & FİNANS',                codes: ['activity', 'history', 'finance', 'gallery'] },
    { title: 'İLERİ ÖZELLİKLER & YAPAY ZEKA',  codes: ['ai', 'automations', 'custom-fields'] },
];

/**
 * İçeriği henüz yazılmamış sekmeler — boş pano yerine "yapım aşamasında" durumu
 * gösterirler. Liste tasarım handoff'undan birebir alındı.
 *
 * NOT: `comments` için repoda backend'e bağlı çalışan bir bileşen VAR; içeriği
 * Genel sekmesinde zaten sunulduğu için ayrı sekme olarak burada kapatıldı.
 * Yeniden açmak = bu diziden kodu çıkarmak.
 *
 * 2026-09-03: `checklist`, `history` ve `gallery` bu listeden ÇIKTI — üçü de
 * artık gerçek veriye bakan V3 bileşenlerine bağlı (ChecklistTabV3 backend'e
 * yazar; HistoryTabV3 ve GalleryTabV3 mevcut kayıtları okur). Aynı turda
 * `risks`, `comments`, `emails`, `activity`, `custom-fields`, `automations`,
 * `ai`, `approvals` ve `dashboard` registry'de `hidden: true` ile katalogdan
 * tamamen kaldırıldı; burada kalmaları yalnız ileride geri açılırlarsa doğru
 * boş durumu göstersinler diyedir.
 *
 * FAZ 10-B (2026-08-12): `approvals`, `ai` ve `automations` da buraya eklendi.
 * Bu üçü SABİT UYDURMA içerik basıyordu — sahte bir onay kaydı (gerçek isim +
 * tarih ile), sözleşmeye dair sahte bir AI önerisi ve "Aktif" işaretli sahte bir
 * otomasyon kuralı. Kullanıcı bunlara bakıp onay alındığını ya da bir otomasyonun
 * çalıştığını sanabilirdi. Arkalarında onay akışı / LLM / kural motoru OLMADIĞI
 * için doğru davranış, uydurmayı cilalamak değil dürüst boş durumu göstermek.
 * Gerçek backend geldiğinde: kodu bu diziden çıkar + registry'de component'i bağla.
 */
export const UNBUILT_CODES = new Set([
    'risks', 'dashboard', 'comments', 'emails', 'custom-fields',
    'approvals', 'ai', 'automations',
]);

export const isUnbuilt = (code) => UNBUILT_CODES.has(code);

/**
 * Bir özelliğin sunum tanımı (registry + PRESENTATION) — `hidden` bayrağına
 * BAKMAZ. Gizli bir özelliğin adını yine de yazması gereken yerler için
 * (örn. eski bir atama yüzünden açılmış boş durum ekranı).
 */
export function featureDisplay(code) {
    const reg = REGISTRY[code];
    const pres = PRESENTATION[code];
    if (!reg) return null;
    return {
        code,
        title: reg.title,
        icon: reg.icon,
        desc: pres?.desc ?? '',
        bg: pres?.bg ?? 'bg-neutral-subtle',
        fg: pres?.fg ?? 'text-text-secondary',
    };
}

/**
 * Katalogda gösterilecek bir özelliğin birleşik tanımı.
 *
 * GİZLİ ÖZELLİKLER (2026-09-03): registry'de `hidden: true` işaretli kayıtlar
 * burada `null` döner, böylece katalog gruplarından da düşerler. Grup listeleri
 * (`GROUPS`) bilerek DOKUNULMADI — geri açmak = registry'deki `hidden` satırını
 * silmek, tek yerden.
 */
export function featureInfo(code) {
    if (REGISTRY[code]?.hidden) return null;
    return featureDisplay(code);
}

/** Özellik ekleme modalının grupları; `query` ile süzülür, boş gruplar düşer. */
export function catalogGroups(query = '') {
    const q = query.trim().toLowerCase();
    return GROUPS
        .map((g) => ({
            title: g.title,
            items: g.codes
                .map(featureInfo)
                .filter(Boolean)
                .filter((f) => !q || f.title.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q)),
        }))
        .filter((g) => g.items.length > 0);
}

/** Katalogdaki toplam modül sayısı — `hidden` işaretliler sayılmaz. */
export const TOTAL_FEATURE_COUNT = TASK_FEATURE_REGISTRY.filter((f) => !f.hidden).length;
