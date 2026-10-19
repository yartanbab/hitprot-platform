using System;
using System.Globalization;

namespace Apya.Platform.Notifications;

/// <summary>
/// Sessiz saatler penceresi ("22:00-08:00"; başlangıç bitişten büyükse gece yarısını geçer). Kullanıcı kararı
/// 2026-10-19: pencere içinde Normal ve daha düşük önemdeki tarayıcı bildirimi pencere bitince gönderilir;
/// Yüksek/Kritik her zaman anında. Saatler sunucunun yerel saatidir (<c>Clock.Now</c> ile aynı).
/// </summary>
public readonly record struct QuietHoursWindow(TimeSpan Start, TimeSpan End)
{
    private const string Format = @"hh\:mm";

    /// <summary>Başlangıç ile bitiş aynıysa ya da biçim bozuksa <c>false</c>.</summary>
    public static bool TryParse(string? value, out QuietHoursWindow window)
    {
        window = default;
        var parts = value?.Split('-');
        if (parts is not { Length: 2 }
            || !TimeSpan.TryParseExact(parts[0].Trim(), Format, CultureInfo.InvariantCulture, out var start)
            || !TimeSpan.TryParseExact(parts[1].Trim(), Format, CultureInfo.InvariantCulture, out var end)
            || start == end)
        {
            return false;
        }

        window = new QuietHoursWindow(start, end);
        return true;
    }

    public override string ToString()
        => Start.ToString(Format, CultureInfo.InvariantCulture) + "-" + End.ToString(Format, CultureInfo.InvariantCulture);

    /// <summary>An pencerenin içindeyse bitişe kalan süre; dışındaysa <c>null</c>.</summary>
    public TimeSpan? DelayUntilEnd(DateTime now)
    {
        var time = now.TimeOfDay;
        var inside = Start > End
            ? time >= Start || time < End
            : time >= Start && time < End;
        if (!inside)
        {
            return null;
        }

        var end = now.Date + End;
        if (end <= now)
        {
            end = end.AddDays(1);
        }

        return end - now;
    }
}
