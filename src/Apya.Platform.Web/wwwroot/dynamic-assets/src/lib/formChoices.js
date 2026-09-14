/**
 * Canlı listeye bağlı açılır liste (Formlar tur 15). Alan ayarında `source` kaynağı, `urlPrefill` adres
 * parametresiyle ön seçimi açar. Cevap `{ value, label }` biçiminde saklanır: değer kaydı gösterir,
 * etiket gönderim anındaki adı korur. Sunucudaki karşılığı FormChoiceSources / FormChoiceProvider.
 */
export const OPEN_GRANT_CALLS = 'open-grant-calls';
export const GRANT_PREFILL_PARAM = 'grant';

/** Seçim nesnesinin okunur adı; seçim nesnesi değilse null. */
export function choiceLabel(answer) {
    return answer && typeof answer === 'object' && !Array.isArray(answer) && typeof answer.label === 'string'
        ? answer.label
        : null;
}

/** Adresteki `?grant=` listede varsa ön seçilecek cevap; kapanmış ya da yabancı değerde null. */
export function prefillChoice(choices, search, param = GRANT_PREFILL_PARAM) {
    const wanted = new URLSearchParams(search).get(param);
    if (!wanted) return null;
    const hit = (choices || []).find((c) => c.value.toLowerCase() === wanted.toLowerCase());
    return hit ? { value: hit.value, label: hit.label } : null;
}

/** Seçeneğe özel form bağlantısı; adreste zaten sorgu (`?tenant=`) varsa korunur. */
export function withChoiceParam(path, value, param = GRANT_PREFILL_PARAM) {
    return `${path}${path.includes('?') ? '&' : '?'}${param}=${encodeURIComponent(value)}`;
}
