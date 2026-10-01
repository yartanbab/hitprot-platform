/**
 * Tarayıcı deposundaki KİŞİSEL veriyi (çevrimdışı kuyruk, taslak) kiracı + kullanıcıya
 * bağlayan anahtar. Sabit anahtarla aynı tarayıcıyı kullanan bir sonraki kullanıcı — başka
 * kiracıdan bile — öncekinin kuyruğunu kendi adına gönderiyor ya da taslağını görüyordu.
 * Önbellek kalıcılığındaki buster ile aynı biçim (bkz. api/queryPersister.js).
 */
export function scopedStorageKey(base) {
    const user = typeof window !== 'undefined' ? window.abp?.currentUser : null;
    return `${base}:${user?.tenantId ?? 'host'}:${user?.id ?? 'anon'}`;
}
