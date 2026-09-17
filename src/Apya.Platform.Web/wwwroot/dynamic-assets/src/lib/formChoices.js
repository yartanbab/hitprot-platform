/**
 * Canlı listeye bağlı açılır liste (Formlar tur 15). Alan ayarında `source` kaynağı, `urlPrefill` adres
 * parametresiyle ön seçimi açar. Cevap `{ value, label }` biçiminde saklanır: değer kaydı gösterir,
 * etiket gönderim anındaki adı korur. Sunucudaki karşılığı FormChoiceSources / FormChoiceProvider.
 */
export const OPEN_GRANT_CALLS = 'open-grant-calls';
export const TENANT_PROJECTS = 'tenant-projects';
export const TENANT_PROJECT_TASKS = 'tenant-project-tasks';
export const FIRMS = 'firms';
export const GRANT_PREFILL_PARAM = 'grant';

/* 16a · Kaynağın okunur adı ve tek cümlelik anlatımı. Anahtarlar sunucudaki FormChoiceSources ile birebir;
   sunucu tanımadığımız bir kaynak döndürürse anahtarın kendisi gösterilir, liste yine de çalışır. */
export const CHOICE_SOURCES = {
    [OPEN_GRANT_CALLS]: {
        label: 'Yayındaki hibe çağrıları',
        hint: 'Başvuruya açık çağrılar. Çağrı kapanınca listeden kendiliğinden düşer, yeni yayınlanan eklenir.',
        empty: 'Şu an başvuruya açık çağrı yok',
    },
    [TENANT_PROJECTS]: {
        label: 'Firmanın projeleri',
        hint: 'Formu dolduran firmanın süren projeleri. Her firma yalnız kendi projelerini görür.',
        empty: 'Süren proje yok',
    },
    [TENANT_PROJECT_TASKS]: {
        label: 'Seçilen projenin görevleri',
        hint: 'Yukarıdaki proje alanında seçilen projenin görevleri; proje seçilmeden liste boş kalır.',
        empty: 'Önce proje seçin',
    },
    [FIRMS]: {
        label: 'Firmalar',
        hint: 'Platformdaki firma kayıtları. Yalnız host formlarında listelenir.',
        empty: 'Firma yok',
    },
};

/** Kaynağın kapsamı — sunucudaki FormChoiceSourceScope ile aynı sırada. */
export const CHOICE_SCOPES = [
    'Ortak katalog — her firmada aynı liste',
    'Formu dolduran firmanın kayıtları',
    'Yalnız host formlarında',
];

export const sourceLabel = (key) => CHOICE_SOURCES[key]?.label || key;

/** Listesi boş kalan açılır listede gösterilecek metin. */
export const sourceEmptyLabel = (key) => CHOICE_SOURCES[key]?.empty || 'Listede kayıt yok';

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
