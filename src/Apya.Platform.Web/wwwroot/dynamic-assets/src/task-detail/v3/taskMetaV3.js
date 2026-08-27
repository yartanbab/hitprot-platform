/**
 * Görev detayı V4 — durum/öncelik rozet meta'sı.
 *
 * Tasarım kaynağı: "Görev Detayı.dc.html" prototipi. Sınıflar tokens.css'e köprülenmiş
 * Tailwind semantik renkleridir (bkz. tailwind.config.js). Opaklık kısayolu (/20, /40)
 * KULLANILMAZ: var() tabanlı renklerde Tailwind v3 alfa enjekte edemiyor, o sınıflar
 * sessizce hiçbir kural üretmiyor — bunun yerine ayrı "-subtle" token'ları kullanılır.
 */

/** Backend TaskStatus: Cancelled=0, Todo=1, InProgress=2, InReview=3, Done=4 */
export const STATUS_META = {
    0: { label: 'İptal',       icon: 'fa-ban',          bg: 'bg-neutral-subtle', fg: 'text-text-secondary', dot: 'bg-neutral-400' },
    1: { label: 'Yapılacak',   icon: 'fa-clock',        bg: 'bg-neutral-subtle', fg: 'text-text-secondary', dot: 'bg-neutral-400' },
    2: { label: 'Sürüyor',     icon: 'fa-spinner',      bg: 'bg-warning-subtle', fg: 'text-warning',        dot: 'bg-warning' },
    3: { label: 'Testte',      icon: 'fa-flask',        bg: 'bg-primary-subtle', fg: 'text-primary',        dot: 'bg-primary' },
    4: { label: 'Tamamlandı',  icon: 'fa-circle-check', bg: 'bg-success-subtle', fg: 'text-success',        dot: 'bg-success' },
};

/** Backend TaskPriority: Low=1, Medium=2, High=3, Critical=4 */
export const PRIORITY_META = {
    1: { label: 'Düşük',  icon: 'fa-arrow-down', bg: 'bg-neutral-subtle',  fg: 'text-text-secondary' },
    2: { label: 'Orta',   icon: 'fa-minus',      bg: 'bg-warning-subtle',  fg: 'text-warning' },
    3: { label: 'Yüksek', icon: 'fa-arrow-up',   bg: 'bg-negative-subtle', fg: 'text-negative' },
    4: { label: 'Kritik', icon: 'fa-flag',       bg: 'bg-negative-subtle', fg: 'text-negative' },
};

/** Kullanıcı seçebilir durumlar (İptal=0 rozet menüsünde gösterilmez — arşivleme
 *  ⋯ menüsünden yapılır). */
export const SELECTABLE_STATUSES = [1, 2, 3, 4];
export const SELECTABLE_PRIORITIES = [1, 2, 3, 4];

export const statusOf = (id) => STATUS_META[id] ?? STATUS_META[1];
export const priorityOf = (id) => PRIORITY_META[id] ?? PRIORITY_META[2];

/** Baş harf rozeti — ui-avatars.com'a dış istek atmamak için (prototipteki desen). */
export function initialsOf(name) {
    if (!name) return '—';
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '—';
    return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2)).toUpperCase();
}

/** Avatar rengi kişiye göre DEĞİŞMEZ — profil avatarının marka tonu her yerde aynı
 *  (apya-task-render.js ve ProjectDetails.cshtml ile aynı kural). Önceden ada göre
 *  hash'lenen ayrı bir palet vardı; aynı kişi listede mavi, detayda turuncu çıkıyordu. */
export function avatarColorOf(name) {
    return name ? 'var(--apya-brand-500)' : 'var(--apya-neutral-500)';
}

/** Son tarih aciliyeti: gecikmiş → negatif, ≤3 gün → uyarı, aksi → nötr. */
export function dueUrgency(dueDate, today = new Date()) {
    if (!dueDate) return { tone: 'text-text-tertiary', hint: '' };
    const due = new Date(dueDate);
    if (Number.isNaN(due.getTime())) return { tone: 'text-text-tertiary', hint: '' };

    const days = Math.ceil((due.setHours(0, 0, 0, 0) - new Date(today).setHours(0, 0, 0, 0)) / 86400000);
    if (days < 0) return { tone: 'text-negative', hint: `${Math.abs(days)} gün gecikti` };
    if (days === 0) return { tone: 'text-warning', hint: 'Bugün' };
    if (days <= 3) return { tone: 'text-warning', hint: `${days} gün kaldı` };
    return { tone: 'text-text-tertiary', hint: `${days} gün kaldı` };
}
