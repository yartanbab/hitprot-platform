using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Calendars;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.Calendars;

/// <summary>
/// .ics üretiminin sözleşmesi. Takvim istemcileri hataya çok az tolerans gösterir:
/// kaçırılmamış bir noktalı virgül ya da katlanmamış uzun satır etkinliği sessizce
/// düşürür, bozuk UID her yenilemede kopya doğurur.
/// </summary>
public class IcalWriter_Tests
{
    private readonly IcalWriter _writer = new();
    private static readonly DateTime Now = new(2026, 8, 14, 10, 0, 0, DateTimeKind.Utc);

    private static CalendarItemDto Item(string title, DateTime date, bool done = false) => new()
    {
        Key      = $"1:{Guid.NewGuid()}",
        Source   = CalendarSourceType.Task,
        SourceId = Guid.NewGuid(),
        Title    = title,
        Date     = date,
        IsDone   = done
    };

    [Fact]
    public void Gecerli_bir_VCALENDAR_iskeleti_uretir()
    {
        var ics = _writer.Build(new[] { Item("Görev", new DateTime(2026, 8, 14)) }, "APYA Takvim", Now);

        ics.ShouldStartWith("BEGIN:VCALENDAR\r\n");
        ics.ShouldEndWith("END:VCALENDAR\r\n");
        ics.ShouldContain("VERSION:2.0");
        ics.ShouldContain("BEGIN:VEVENT");
        ics.ShouldContain("END:VEVENT");
        // Satır sonları CRLF olmalı — çıplak LF bazı istemcilerde dosyayı bozar.
        ics.Split("\r\n").Length.ShouldBeGreaterThan(5);
    }

    [Fact]
    public void Gun_bazli_etkinlik_VALUE_DATE_ile_yazilir()
    {
        var ics = _writer.Build(new[] { Item("Son tarih", new DateTime(2026, 8, 14)) }, "APYA", Now);

        ics.ShouldContain("DTSTART;VALUE=DATE:20260814");
        // Bitiş DIŞLAYICIDIR: tek günlük etkinlik ertesi günde biter.
        ics.ShouldContain("DTEND;VALUE=DATE:20260815");
    }

    [Fact]
    public void UID_ogenin_anahtarindan_turer_boylece_yenilemede_kopya_dogmaz()
    {
        var item = Item("Görev", new DateTime(2026, 8, 14));

        var first = _writer.Build(new[] { item }, "APYA", Now);
        var second = _writer.Build(new[] { item }, "APYA", Now.AddHours(3));

        var uid = first.Split("\r\n").Single(l => l.StartsWith("UID:"));
        second.ShouldContain(uid);
    }

    [Fact]
    public void Ayrilmis_karakterler_kacirilir()
    {
        var ics = _writer.Build(
            new[] { Item("Toplantı; notlar, ekler", new DateTime(2026, 8, 14)) }, "APYA", Now);

        ics.ShouldContain(@"Toplantı\; notlar\, ekler");
    }

    [Fact]
    public void Uzun_satirlar_RFC_5545_kuralina_gore_katlanir()
    {
        var uzun = new string('A', 300);
        var ics = _writer.Build(new[] { Item(uzun, new DateTime(2026, 8, 14)) }, "APYA", Now);

        // Katlama: hiçbir satır 75 oktetten uzun olmamalı.
        foreach (var line in ics.Split("\r\n"))
        {
            line.Length.ShouldBeLessThanOrEqualTo(75);
        }
        // Devam satırları BOŞLUKLA başlar.
        ics.ShouldContain("\r\n A");
    }

    [Fact]
    public void Tamamlanmis_oge_isaretle_yazilir()
    {
        var ics = _writer.Build(
            new[] { Item("Biten iş", new DateTime(2026, 8, 14), done: true) }, "APYA", Now);

        ics.ShouldContain("SUMMARY:✓ Biten iş");
    }

    [Fact]
    public void Ogesiz_takvim_de_gecerli_kalir()
    {
        var ics = _writer.Build(new List<CalendarItemDto>(), "APYA", Now);

        ics.ShouldContain("BEGIN:VCALENDAR");
        ics.ShouldContain("END:VCALENDAR");
        ics.ShouldNotContain("BEGIN:VEVENT");
    }
}
