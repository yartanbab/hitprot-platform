using System;
using System.Globalization;

namespace Apya.Platform.Calendars;

/// <summary>
/// Dış takvim API'lerine gidecek zaman biçimleri.
/// <para>
/// Uygulamanın saatleri yerel duvar saatidir ve <see cref="DateTimeKind.Unspecified"/>
/// ile taşınır (<c>AbpClockOptions</c> yapılandırılmadığı için <c>Clock.Now</c> =
/// <c>DateTime.Now</c>; model binding de "2026-09-01" bağlarken kind atamaz).
/// Bu değer doğrudan <c>ToString("o")</c> ile yazıldığında iki ayrı hata çıkıyordu:
/// </para>
/// <list type="bullet">
/// <item>Okuma: Google <c>timeMin/timeMax</c> için ofseti ZORUNLU tutar, ofsetsiz
/// damgada 400 döner — dış etkinlikler hiç okunamıyordu.</item>
/// <item>Yazma: gövdeye <c>timeZone = "UTC"</c> etiketi konuyordu ama değer yereldi,
/// etkinlik dış takvime saat farkı kadar (TR'de 3 saat) kaymış gidiyordu.</item>
/// </list>
/// </summary>
public static class CalendarTimes
{
    /// <summary>
    /// Belirsiz kind'ı YEREL sayar (uygulamanın saatleri yereldir) ve UTC'ye çevirir.
    /// Zaten UTC olan değere dokunmaz — iki kez çevirip saati kaydırmasın.
    /// </summary>
    public static DateTime ToUtc(DateTime value) => value.Kind switch
    {
        DateTimeKind.Utc   => value,
        DateTimeKind.Local => value.ToUniversalTime(),
        _                  => DateTime.SpecifyKind(value, DateTimeKind.Local).ToUniversalTime()
    };

    /// <summary>Ofsetli RFC3339 (sonda <c>Z</c>) — Google sorgu parametreleri bunu şart koşar.</summary>
    public static string ToRfc3339Utc(DateTime value)
        => ToUtc(value).ToString("yyyy-MM-dd'T'HH:mm:ss'Z'", CultureInfo.InvariantCulture);

    /// <summary>
    /// Ofsetsiz UTC. Microsoft Graph'ın <c>dateTimeTimeZone</c> tipinde <c>dateTime</c>
    /// alanı ofset taşımaz; saat dilimi ayrı <c>timeZone</c> alanından okunur.
    /// </summary>
    public static string ToGraphUtc(DateTime value)
        => ToUtc(value).ToString("yyyy-MM-dd'T'HH:mm:ss", CultureInfo.InvariantCulture);
}
