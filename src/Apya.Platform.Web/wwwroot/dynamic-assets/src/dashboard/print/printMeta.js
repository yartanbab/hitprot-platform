/**
 * Baskı künyesi — çıktının "hangi kurum, kim, hangi pencere" bağlamı.
 *
 * Ekranda bağlam zaten görünür (kabuk kurumu, sekme görünümü, seçici aralığı
 * gösterir); KAĞITTA hiçbiri yoktur. Bu yüzden künye baskıya özel üretilir.
 */

/**
 * Razor'ın sayfaya gömdüğü kurum/kullanıcı künyesi (Pages/Dashboard/Index.cshtml).
 * Bir kez okunur; düğüm yoksa ya da bozuksa null döner — künye satırı o alanı
 * atlar, baskı yine de çıkar.
 */
export function readPrintContext() {
    try {
        const node = document.getElementById('apya-dashboard-print-context');
        if (!node) return null;
        const parsed = JSON.parse(node.textContent);
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
        return null;
    }
}

/**
 * Seçili aralığın GERÇEK tarih penceresi — künyede "Bu ay" yazmak yetmez,
 * hangi ay olduğu kağıtta durmalı (çıktı bir ay sonra da okunabilir olmalı).
 *
 * ⚠️ Sunucudaki `DashboardPeriod.Resolve` ile AYNI kuralları uygular: hafta
 * pazartesi başlar, çeyrek takvim çeyreğidir. Sunucu bu pencereyi yanıtlarında
 * GÖNDERMİYOR; oradaki kural değişirse burası da güncellenmeli.
 *
 * Sunucudaki pencere yarı açıktır (EndExclusive); burada KAPALI aralık dönülür
 * — insan okuyacak, "1 – 30 Eylül" doğru, "1 Eylül – 1 Ekim" yanıltıcı.
 */
export function resolvePeriod(range, today = new Date()) {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (range === 'Week') {
        const start = startOfWeek(day);
        return { start, end: addDays(start, 6) };
    }

    if (range === 'Quarter') {
        const firstMonth = Math.floor(day.getMonth() / 3) * 3;
        return {
            start: new Date(day.getFullYear(), firstMonth, 1),
            end: addDays(new Date(day.getFullYear(), firstMonth + 3, 1), -1),
        };
    }

    return {
        start: new Date(day.getFullYear(), day.getMonth(), 1),
        end: addDays(new Date(day.getFullYear(), day.getMonth() + 1, 1), -1),
    };
}

/** "1 – 30 Eylül 2026" / "28 Aralık 2026 – 3 Ocak 2027". */
export function formatPeriod(period, locale) {
    const sameMonth = period.start.getMonth() === period.end.getMonth()
        && period.start.getFullYear() === period.end.getFullYear();
    const sameYear = period.start.getFullYear() === period.end.getFullYear();

    const startOptions = sameMonth ? { day: 'numeric' }
        : sameYear ? { day: 'numeric', month: 'long' }
        : { day: 'numeric', month: 'long', year: 'numeric' };

    return `${period.start.toLocaleDateString(locale, startOptions)} – `
        + period.end.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Künyedeki oluşturulma damgası: "5 Eylül 2026 14:32". */
export function formatStamp(date, locale) {
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
        + ' ' + date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}

/** Haftanın başı — pazartesi (TR takvimi), sunucudaki StartOfWeek ile aynı. */
function startOfWeek(date) {
    return addDays(date, -((date.getDay() + 6) % 7));
}

function addDays(date, days) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
}
