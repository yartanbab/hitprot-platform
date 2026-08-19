using System;
using System.Collections.Generic;
using System.Linq;
using Ical.Net;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Calendars;

/// <summary>
/// Dışarıdan gelen .ics metnini takvim etkinliklerine çevirir.
/// <para>
/// Ical.Net kullanılır (yazma tarafının aksine): rastgele bir takvim dosyası
/// tekrar kuralı (RRULE), istisna tarihi (EXDATE) ve saat dilimi (VTIMEZONE)
/// içerebilir. Bunları elle çözmek, tatil ve sprint takvimlerinin çoğunu eksik
/// göstermek demekti.
/// </para>
/// </summary>
public class IcalReader : ITransientDependency
{
    /// <summary>Tek abonelikten alınacak üst sınır — kötü niyetli/şişkin dosya belleği doldurmasın.</summary>
    public const int MaxOccurrences = 2000;

    /// <summary>
    /// Aralıktaki etkinlikleri döndürür. Tekrarlayan etkinlikler tek tek örneklere
    /// AÇILIR: takvim ızgarası RRULE yorumlamaz, hazır tarihler bekler.
    /// </summary>
    public List<CalendarEvent> Read(string icsContent, DateTime from, DateTime to)
    {
        var calendar = Calendar.Load(icsContent);
        var events = new List<CalendarEvent>();

        // GetOccurrences TEMBEL ve sınırsızdır (sonu olmayan RRULE sonsuz üretir):
        // aralığın sonunda durdurmak ve üst sınır koymak ZORUNLU — aksi hâlde döngü bitmez.
        var occurrences = calendar
            .GetOccurrences(new CalDateTime(from, true))
            .TakeWhile(o => o.Period.StartTime.Value < to)
            .Take(MaxOccurrences);

        foreach (var occurrence in occurrences)
        {
            if (occurrence.Source is not Ical.Net.CalendarComponents.CalendarEvent source) continue;

            var start = occurrence.Period.StartTime;
            var end = occurrence.Period.EffectiveEndTime ?? start;
            // Tüm gün etkinliğinde saat bileşeni yoktur (DTSTART;VALUE=DATE).
            var isAllDay = !start.HasTime;

            events.Add(new CalendarEvent
            {
                // Tekrar örnekleri aynı UID'yi paylaşır; anahtar başlangıçla ayrıştırılır.
                ExternalId  = $"{source.Uid}:{start.Value:yyyyMMddHHmm}",
                Title       = string.IsNullOrWhiteSpace(source.Summary) ? "(başlıksız)" : source.Summary,
                Description = source.Description,
                StartTime   = start.Value,
                EndTime     = end.Value,
                IsAllDay    = isAllDay
            });
        }

        return events;
    }
}
