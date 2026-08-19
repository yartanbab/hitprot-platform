using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Calendars;

/// <summary>
/// Takvim öğelerini RFC 5545 (.ics) metnine çevirir.
/// <para>
/// Elle yazıldı, kütüphane eklenmedi: ÜRETİM tarafı dar ve iyi tanımlı —
/// gün bazlı VEVENT'ler, tekrar kuralı yok, saat dilimi yok (tüm öğeler
/// <c>VALUE=DATE</c>). Okuma tarafı (rastgele .ics ayrıştırma) bambaşka bir iş
/// ve ayrı değerlendirilir.
/// </para>
/// </summary>
public class IcalWriter : ITransientDependency
{
    private const string ProductId = "-//APYA//Takvim//TR";

    /// <summary>
    /// Öğeleri .ics gövdesine çevirir. Tamamlanmış öğeler de yazılır (üstü çizili
    /// kavramı iCal'da yok); ekranla tutarlı kalması için başlığa "✓" eklenir.
    /// </summary>
    public string Build(IEnumerable<CalendarItemDto> items, string calendarName, DateTime now)
    {
        var sb = new StringBuilder();
        sb.Append("BEGIN:VCALENDAR\r\n");
        sb.Append("VERSION:2.0\r\n");
        sb.Append($"PRODID:{ProductId}\r\n");
        sb.Append("CALSCALE:GREGORIAN\r\n");
        sb.Append("METHOD:PUBLISH\r\n");
        AppendLine(sb, "X-WR-CALNAME", calendarName);
        // Takvim istemcilerine tavsiye edilen yenileme sıklığı (Apple + Google okur).
        sb.Append("X-PUBLISHED-TTL:PT1H\r\n");
        sb.Append("REFRESH-INTERVAL;VALUE=DURATION:PT1H\r\n");

        var stamp = now.ToUniversalTime().ToString("yyyyMMdd'T'HHmmss'Z'");

        foreach (var item in items)
        {
            var day = item.Date.Date;
            sb.Append("BEGIN:VEVENT\r\n");
            // UID kalıcı olmalı: aynı öğe her çekimde aynı etkinlik olarak tanınsın,
            // istemcide her yenilemede kopya doğmasın.
            sb.Append($"UID:{Escape(item.Key)}@apya\r\n");
            sb.Append($"DTSTAMP:{stamp}\r\n");
            sb.Append($"DTSTART;VALUE=DATE:{day:yyyyMMdd}\r\n");
            sb.Append($"DTEND;VALUE=DATE:{day.AddDays(1):yyyyMMdd}\r\n");
            AppendLine(sb, "SUMMARY", item.IsDone ? $"✓ {item.Title}" : item.Title);

            var description = BuildDescription(item);
            if (!string.IsNullOrWhiteSpace(description))
            {
                AppendLine(sb, "DESCRIPTION", description);
            }

            // Salt-okunur ayna: istemcide düzenlenmesi anlamsız.
            sb.Append("TRANSP:TRANSPARENT\r\n");
            sb.Append("END:VEVENT\r\n");
        }

        sb.Append("END:VCALENDAR\r\n");
        return sb.ToString();
    }

    private static string BuildDescription(CalendarItemDto item)
    {
        var parts = new List<string>();
        if (!string.IsNullOrWhiteSpace(item.Subtitle)) parts.Add(item.Subtitle!);
        if (!string.IsNullOrWhiteSpace(item.AssigneeName)) parts.Add(item.AssigneeName!);
        if (item.Amount != null) parts.Add($"{item.Amount:N0} {item.Currency}");
        return string.Join(" · ", parts);
    }

    /// <summary>
    /// RFC 5545 satır katlama: 75 oktet üstü satırlar CRLF + BOŞLUK ile devam eder.
    /// Katlanmayan uzun satırlar bazı istemcilerde etkinliği düşürür.
    /// </summary>
    private static void AppendLine(StringBuilder sb, string name, string value)
    {
        var line = $"{name}:{Escape(value)}";
        const int limit = 73;

        while (line.Length > limit)
        {
            sb.Append(line[..limit]).Append("\r\n ");
            line = line[limit..];
        }
        sb.Append(line).Append("\r\n");
    }

    /// <summary>Ayrılmış karakterler kaçırılır; aksi hâlde dosya bozulur.</summary>
    private static string Escape(string value) => (value ?? string.Empty)
        .Replace("\\", "\\\\")
        .Replace(";", "\\;")
        .Replace(",", "\\,")
        .Replace("\r\n", "\\n")
        .Replace("\n", "\\n");
}
