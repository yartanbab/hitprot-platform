/**
 * Enum köprüsü — sunucu enum'ları SAYI olarak serileştiriyor.
 *
 * Bu projede `JsonStringEnumConverter` yapılandırılmamış; ASP.NET Core
 * varsayılanı gereği `DeliveryGroup.ThisWeek` tel üzerinde `0` olarak gider
 * (mevcut kod da öyle varsayıyor, bkz `forms.jsx` → `f.status === 1`).
 *
 * Bileşenlerin sayı karşılaştırmasıyla kirlenmemesi için normalizasyon TEK
 * yerde, veri katmanında yapılır: hook'lar `select` ile ham yanıtı buradan
 * geçirir, bileşenler yalnız isim görür.
 *
 * ⚠️ Diziler sunucudaki enum SIRASIYLA birebir aynı olmalı
 * (`Domain.Shared/Dashboard/DashboardEnums.cs`).
 */

const DELIVERY_STATE = ['Upcoming', 'OnTrack', 'InReview', 'Overdue'];
const DELIVERY_GROUP = ['ThisWeek', 'NextWeek', 'EndOfMonth', 'Later'];
const HEALTH_STATE   = ['Healthy', 'Attention', 'Risky'];
const BLOCK_REASON   = ['WaitingReview', 'Dependency', 'Unassigned'];
const TREND          = ['Flat', 'Up', 'Down'];
const STAT_GROUP     = ['Work', 'Finance', 'Grants', 'Communication', 'System'];

/** Sayıyı isme çevirir. Zaten isimse dokunmaz (ileride converter eklenirse kırılmasın). */
function name(table, value, fallback) {
    if (typeof value === 'string') return value;
    return table[value] ?? fallback;
}

export function normalizeDeliveries(items) {
    return (items ?? []).map((item) => ({
        ...item,
        state: name(DELIVERY_STATE, item.state, 'Upcoming'),
        groupKey: name(DELIVERY_GROUP, item.groupKey, 'Later'),
    }));
}

export function normalizeProjectHealth(items) {
    return (items ?? []).map((item) => ({
        ...item,
        state: name(HEALTH_STATE, item.state, 'Healthy'),
    }));
}

export function normalizeBlockedTasks(items) {
    return (items ?? []).map((item) => ({
        ...item,
        blockReason: name(BLOCK_REASON, item.blockReason, 'Dependency'),
    }));
}

export function normalizeStatistics(items) {
    return (items ?? []).map((item) => ({
        ...item,
        group: name(STAT_GROUP, item.group, 'Work'),
        trend: name(TREND, item.trend, 'Flat'),
    }));
}

/**
 * Kart düzeni: `chartType` SAYI olarak gidip gelmeli. String göndermek
 * deserialization hatası verir (converter yok) → düzen kaydedilemez.
 */
export const CHART_TYPE_NUMBER_TREND = 0;
