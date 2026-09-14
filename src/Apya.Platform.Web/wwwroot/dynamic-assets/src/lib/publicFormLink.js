/**
 * Formun herkese açık adresi. Slug yalnız kiracı içinde tekildir ve anonim ziyaretçinin kiracısı
 * yoktur; bu yüzden kiracı formunun bağlantısı formun kiracısını taşır (`?tenant=`). Host formunun
 * bağlantısı kiracı taşımaz: oturum açmış kiracı kullanıcısı onu kendi kiracısında doldurur.
 */
export function publicFormPath(slug, tenantId = window.abp?.currentTenant?.id) {
    const path = `/f/${encodeURIComponent(slug)}`;
    return tenantId ? `${path}?tenant=${encodeURIComponent(tenantId)}` : path;
}

const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Adresteki form kiracısı (`?tenant=`). Kimlik biçiminde değilse yok sayılır. */
export function formTenantFromSearch(search) {
    const value = new URLSearchParams(search).get('tenant');
    return value && GUID_RE.test(value) ? value : null;
}
