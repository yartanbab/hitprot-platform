/**
 * 17 · Koşullu alan: bir alan yalnız başka bir alanın cevabına (ya da o cevapta SEÇİLEN KAYDIN
 * özelliğine) göre görünür. Kural alan ayarındaki `visibleWhen` nesnesidir:
 * `{ blockId, op, value }`.
 *
 * Aynı hesap sunucuda da yapılır (FormConditionEvaluator): ekranda gizlemek istemcinin,
 * "gizli alanın zorunluluğu aranmaz, cevabı yazılmaz" kararı sunucunun işidir.
 *
 * Kural HER ZAMAN yukarıdaki bir alanı gösterir (düzenleyici başkasını seçtirmez), bu yüzden
 * sıraya göre tek geçiş yeter: üst alan gizliyse ona bağlı alan da gizlenir.
 */

export const VISIBLE_WHEN = 'visibleWhen';

export const OPS = { EQ: 'eq', NEQ: 'neq', ANSWERED: 'answered', FLAG: 'flag' };

export const REQUIRES_CONSORTIUM = 'requiresConsortium';

/** Koşul kurarken gösterilen okunur adlar. */
export const OP_LABELS = {
    [OPS.EQ]: 'şu cevabı verirse',
    [OPS.NEQ]: 'şu cevabı vermezse',
    [OPS.ANSWERED]: 'yanıtlanırsa',
    [OPS.FLAG]: 'seçilen kayıt şu şartı taşıyorsa',
};

/** Kaynağın ürettiği bayrağın okunur adı; tanınmayan bayrakta anahtarın kendisi gösterilir. */
export const FLAG_LABELS = {
    [REQUIRES_CONSORTIUM]: 'ortaklık istiyorsa',
};

export const flagLabel = (flag) => FLAG_LABELS[flag] || flag;

const settingsOf = (block) => {
    const s = block?.settings;
    if (!s) return {};
    if (typeof s !== 'string') return s;
    try { return JSON.parse(s) || {}; } catch { return {}; }
};

/** Alanın görünürlük kuralı; kural yoksa (ya da bozuksa) null — alan hep görünür. */
export function visibilityRule(block) {
    const rule = settingsOf(block)[VISIBLE_WHEN];
    return rule && typeof rule === 'object' && rule.blockId && rule.op ? rule : null;
}

/**
 * Cevabın karşılaştırılabilir değerleri. Canlı listede cevap `{ value, label }`, çoklu seçimde
 * dizi, diğerlerinde düz değerdir; boş metin cevap SAYILMAZ.
 */
export function answerValues(answer) {
    if (answer === null || answer === undefined) return [];
    if (Array.isArray(answer)) return answer.flatMap(answerValues);
    if (typeof answer === 'object') return answerValues(answer.value);
    const text = String(answer);
    return text.trim() === '' ? [] : [text];
}

const matches = (values, expected) =>
    expected != null && values.some((v) => v.toLowerCase() === String(expected).toLowerCase());

/**
 * Gizli alanların kimlikleri.
 * @param blocks sıralı alanlar (`settings` nesne ya da JSON metni olabilir)
 * @param answers alan kimliği → cevap
 * @param choicesOf (blockId) → o alanın güncel seçenek listesi; bayrak koşulu bunu okur
 */
export function hiddenBlockIds(blocks, answers, choicesOf = () => []) {
    const hidden = new Set();
    for (const block of blocks) {
        const rule = visibilityRule(block);
        if (!rule) continue;
        if (hidden.has(rule.blockId)) { hidden.add(block.id); continue; }

        const values = answerValues(answers?.[rule.blockId]);
        let visible;
        switch (rule.op) {
            case OPS.ANSWERED: visible = values.length > 0; break;
            case OPS.EQ: visible = matches(values, rule.value); break;
            case OPS.NEQ: visible = !matches(values, rule.value); break;
            case OPS.FLAG: {
                const selected = values[0];
                const choice = selected
                    ? (choicesOf(rule.blockId) || []).find((c) => c.value?.toLowerCase() === selected.toLowerCase())
                    : null;
                visible = !!(choice?.flags && choice.flags[rule.value]);
                break;
            }
            // Tanınmayan karşılaştırma GİZLEMEZ: eski bir sürümün yazdığı kural formu yarıya indirmesin.
            default: visible = true;
        }
        if (!visible) hidden.add(block.id);
    }
    return hidden;
}

/** Gizli alanların cevaplarını düşürür; hiçbir şey değişmediyse AYNI nesneyi döndürür. */
export function withoutHidden(answers, hidden) {
    const keys = Object.keys(answers || {}).filter((id) => hidden.has(id));
    if (keys.length === 0) return answers;
    const next = { ...answers };
    for (const id of keys) delete next[id];
    return next;
}
