using System;
using System.Linq;
using Apya.Platform.Calendars;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.Calendars;

/// <summary>
/// Dışarıdan gelen .ics okumasının sözleşmesi. Kütüphane (Ical.Net) tam olarak
/// bunlar için eklendi: tekrar kuralı, istisna tarihi ve tüm gün ayrımı elle
/// yazılan bir ayrıştırıcıda eksik kalıyordu.
/// </summary>
public class IcalReader_Tests
{
    private readonly IcalReader _reader = new();

    private static string Wrap(string body) =>
        "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Test//TR\r\n" + body + "END:VCALENDAR\r\n";

    [Fact]
    public void Tek_seferlik_saatli_etkinligi_okur()
    {
        var ics = Wrap(
            "BEGIN:VEVENT\r\nUID:tek-1\r\nSUMMARY:Sağlayıcı görüşmesi\r\n" +
            "DTSTART:20260814T110000Z\r\nDTEND:20260814T122000Z\r\nEND:VEVENT\r\n");

        var events = _reader.Read(ics, new DateTime(2026, 8, 1), new DateTime(2026, 9, 1));

        var ev = events.ShouldHaveSingleItem();
        ev.Title.ShouldBe("Sağlayıcı görüşmesi");
        ev.IsAllDay.ShouldBeFalse();
        ev.StartTime.Hour.ShouldBe(11);
    }

    [Fact]
    public void Tum_gun_etkinligini_saatliden_ayirir()
    {
        var ics = Wrap(
            "BEGIN:VEVENT\r\nUID:tatil-1\r\nSUMMARY:Zafer Bayramı\r\n" +
            "DTSTART;VALUE=DATE:20260830\r\nDTEND;VALUE=DATE:20260831\r\nEND:VEVENT\r\n");

        var ev = _reader.Read(ics, new DateTime(2026, 8, 1), new DateTime(2026, 9, 1)).ShouldHaveSingleItem();

        ev.IsAllDay.ShouldBeTrue();
        ev.StartTime.Date.ShouldBe(new DateTime(2026, 8, 30));
    }

    [Fact]
    public void Tekrarlayan_etkinligi_tek_tek_orneklere_acar()
    {
        // Haftalık toplantı — elle yazılan ayrıştırıcıda YALNIZ ilk tarih görünürdü.
        var ics = Wrap(
            "BEGIN:VEVENT\r\nUID:haftalik-1\r\nSUMMARY:Haftalık finans\r\n" +
            "DTSTART:20260803T100000Z\r\nDTEND:20260803T110000Z\r\n" +
            "RRULE:FREQ=WEEKLY;COUNT=4\r\nEND:VEVENT\r\n");

        var events = _reader.Read(ics, new DateTime(2026, 8, 1), new DateTime(2026, 9, 1));

        events.Count.ShouldBe(4);
        events.Select(e => e.StartTime.Day).ShouldBe(new[] { 3, 10, 17, 24 });
        // Her örnek ayrı anahtar taşır; aynı UID'li örnekler birbirini ezmez.
        events.Select(e => e.ExternalId).Distinct().Count().ShouldBe(4);
    }

    [Fact]
    public void Istisna_tarihini_atlar()
    {
        var ics = Wrap(
            "BEGIN:VEVENT\r\nUID:haftalik-2\r\nSUMMARY:Sprint planlama\r\n" +
            "DTSTART:20260803T090000Z\r\nDTEND:20260803T100000Z\r\n" +
            "RRULE:FREQ=WEEKLY;COUNT=3\r\nEXDATE:20260810T090000Z\r\nEND:VEVENT\r\n");

        var events = _reader.Read(ics, new DateTime(2026, 8, 1), new DateTime(2026, 9, 1));

        events.Select(e => e.StartTime.Day).ShouldNotContain(10);
        events.Count.ShouldBe(2);
    }

    [Fact]
    public void Aralik_disindaki_tekrarlar_getirilmez()
    {
        var ics = Wrap(
            "BEGIN:VEVENT\r\nUID:gunluk-1\r\nSUMMARY:Günlük ayak üstü\r\n" +
            "DTSTART:20260803T090000Z\r\nDTEND:20260803T091500Z\r\n" +
            "RRULE:FREQ=DAILY\r\nEND:VEVENT\r\n");

        // Sonu olmayan kural: aralık sınırı olmasa döngü hiç bitmezdi.
        var events = _reader.Read(ics, new DateTime(2026, 8, 3), new DateTime(2026, 8, 10));

        events.Count.ShouldBe(7);
        events.ShouldAllBe(e => e.StartTime < new DateTime(2026, 8, 10));
    }

    [Fact]
    public void Basliksiz_etkinlik_bos_metinle_dusurulmez()
    {
        var ics = Wrap(
            "BEGIN:VEVENT\r\nUID:bos-1\r\nDTSTART;VALUE=DATE:20260814\r\n" +
            "DTEND;VALUE=DATE:20260815\r\nEND:VEVENT\r\n");

        var ev = _reader.Read(ics, new DateTime(2026, 8, 1), new DateTime(2026, 9, 1)).ShouldHaveSingleItem();

        ev.Title.ShouldBe("(başlıksız)");
    }
}
