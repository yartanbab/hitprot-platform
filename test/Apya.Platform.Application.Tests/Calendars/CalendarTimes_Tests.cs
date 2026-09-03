using System;
using Apya.Platform.Calendars;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.Calendars;

/// <summary>
/// Dış takvim zaman biçimleri. İki gerçek kusurun testi:
/// <list type="bullet">
/// <item>Google <c>timeMin/timeMax</c> için ofset ZORUNLU — ofsetsiz damgada API 400
/// döner ve dış etkinlikler hiç okunamaz.</item>
/// <item>Yerel saat "UTC" etiketiyle gönderilirse etkinlik saat farkı kadar kayar.</item>
/// </list>
/// Uygulamanın saatleri <see cref="DateTimeKind.Unspecified"/> ile taşınır
/// (<c>Clock.Now</c> = <c>DateTime.Now</c>, model binding de kind atamaz) — testler
/// bu yüzden asıl olarak o kind'ı ölçer.
/// </summary>
public class CalendarTimes_Tests
{
    [Fact]
    public void Rfc3339_bicimi_ofset_tasir()
    {
        var text = CalendarTimes.ToRfc3339Utc(new DateTime(2026, 9, 3, 12, 0, 0, DateTimeKind.Utc));

        text.ShouldBe("2026-09-03T12:00:00Z");
    }

    [Fact]
    public void Belirsiz_kind_YEREL_sayilir_ve_UTCye_cevrilir()
    {
        var local = new DateTime(2026, 9, 3, 12, 0, 0, DateTimeKind.Unspecified);
        var expected = DateTime.SpecifyKind(local, DateTimeKind.Local).ToUniversalTime();

        CalendarTimes.ToUtc(local).ShouldBe(expected);
        CalendarTimes.ToRfc3339Utc(local).ShouldBe(expected.ToString("yyyy-MM-dd'T'HH:mm:ss'Z'"));
    }

    [Fact]
    public void Zaten_UTC_olan_deger_IKINCI_kez_cevrilmez()
    {
        var utc = new DateTime(2026, 9, 3, 9, 0, 0, DateTimeKind.Utc);

        CalendarTimes.ToUtc(utc).ShouldBe(utc);
    }

    [Fact]
    public void Yerel_kind_UTCye_cevrilir()
    {
        var local = new DateTime(2026, 9, 3, 12, 0, 0, DateTimeKind.Local);

        CalendarTimes.ToUtc(local).ShouldBe(local.ToUniversalTime());
    }

    [Fact]
    public void Graph_bicimi_ofset_TASIMAZ()
    {
        // Graph'ın dateTimeTimeZone tipinde dateTime alanı ofset kabul etmez;
        // saat dilimi ayrı timeZone alanından okunur.
        var text = CalendarTimes.ToGraphUtc(new DateTime(2026, 9, 3, 12, 0, 0, DateTimeKind.Utc));

        text.ShouldBe("2026-09-03T12:00:00");
        text.ShouldNotContain("Z");
        text.ShouldNotContain("+");
    }

    [Fact]
    public void Gun_baslangici_gun_ortasina_kaymaz()
    {
        // Takvim penceresi "2026-09-01" olarak bağlanır (saat 00:00, kind belirsiz).
        // Çevrim yalnız saat dilimi farkı kadar oynatmalı, tarihi bozmamalı.
        var windowStart = new DateTime(2026, 9, 1, 0, 0, 0, DateTimeKind.Unspecified);

        var utc = CalendarTimes.ToUtc(windowStart);
        var offset = TimeZoneInfo.Local.GetUtcOffset(windowStart);

        utc.ShouldBe(windowStart - offset);
    }
}
