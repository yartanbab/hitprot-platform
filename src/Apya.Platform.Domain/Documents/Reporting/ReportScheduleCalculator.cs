using System;

namespace Apya.Platform.Documents;

/// <summary>
/// Bir sonraki üretim anını hesaplar.
///
/// Saf fonksiyon — saat bile dışarıdan verilir; "gece yarısı sınırında yanlış
/// güne atlıyor" türü hatalar doğrudan test edilebilsin diye.
///
/// Ayın 29-31'i KULLANILMAZ: şubat ayında sessizce atlanan bir zamanlama,
/// kullanıcının aylık raporunun bir ay hiç üretilmemesi demek olurdu. Girdi
/// 28'de kırpılır.
/// </summary>
public static class ReportScheduleCalculator
{
    /// <summary>Her ayda karşılığı olan en büyük gün.</summary>
    public const int MaxDayOfMonth = 28;

    public static int NormalizeDayOfMonth(int dayOfMonth)
        => Math.Clamp(dayOfMonth, 1, MaxDayOfMonth);

    public static int NormalizeHour(int hour)
        => Math.Clamp(hour, 0, 23);

    /// <summary>
    /// <paramref name="from"/> anından SONRAKİ ilk üretim anı. Tam o ana denk
    /// gelen zaman "geçmiş" sayılır ve bir sonraki döngüye atılır — aksi halde
    /// worker aynı anı iki kez yakalayıp çift üretim yapabilirdi.
    /// </summary>
    /// <param name="isFirstRun">
    /// Zamanlama YENİ kuruluyor (ya da yeniden açılıyor). O zaman sıradaki an, ayın
    /// o gününün EN YAKIN gelecekteki tekrarıdır. Üç aylıkta bu ayrım şart: aksi
    /// halde ağustosta kurulan zamanlama ilk raporunu kasımda üretir ve kullanıcı
    /// iki buçuk ay boyunca hiçbir şey olmadığını görürdü. Sonraki hesaplarda
    /// (bir üretimin ardından) ritim korunur ve üçer ay atlanır.
    /// </param>
    public static DateTime ComputeNextRun(
        ReportScheduleFrequency frequency,
        int dayOfMonth,
        DayOfWeek dayOfWeek,
        int hourOfDay,
        DateTime from,
        bool isFirstRun = false)
    {
        var hour = NormalizeHour(hourOfDay);
        var day = NormalizeDayOfMonth(dayOfMonth);

        return frequency switch
        {
            // Haftalıkta ayrım gerekmez: zaten en yakın tekrara gider.
            ReportScheduleFrequency.Weekly => NextWeekly(dayOfWeek, hour, from),
            ReportScheduleFrequency.Quarterly => NextMonthly(day, hour, from, monthStep: isFirstRun ? 1 : 3),
            _ => NextMonthly(day, hour, from, monthStep: 1),
        };
    }

    private static DateTime NextWeekly(DayOfWeek dayOfWeek, int hour, DateTime from)
    {
        var candidate = from.Date.AddHours(hour);

        // Hedef güne kaç gün var (bugün ise 0).
        var delta = ((int)dayOfWeek - (int)from.DayOfWeek + 7) % 7;
        candidate = candidate.AddDays(delta);

        return candidate > from ? candidate : candidate.AddDays(7);
    }

    private static DateTime NextMonthly(int dayOfMonth, int hour, DateTime from, int monthStep)
    {
        var candidate = new DateTime(from.Year, from.Month, dayOfMonth, hour, 0, 0, from.Kind);

        while (candidate <= from)
        {
            candidate = candidate.AddMonths(monthStep);
        }

        return candidate;
    }
}
