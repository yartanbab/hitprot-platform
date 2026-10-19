using System;
using Shouldly;
using Xunit;

namespace Apya.Platform.Notifications;

/// <summary>Sessiz saatler penceresi (kullanıcı kararı 2026-10-19): biçim, gece yarısı geçişi, bitişe kalan süre.</summary>
public class QuietHoursWindow_Tests
{
    private static QuietHoursWindow Parse(string value)
    {
        QuietHoursWindow.TryParse(value, out var window).ShouldBeTrue(value);
        return window;
    }

    [Theory]
    [InlineData("2026-10-19 23:30", 8.5)]   // gece: sabah 08:00'e
    [InlineData("2026-10-20 02:00", 6)]     // gece yarısından sonra: aynı sabaha
    [InlineData("2026-10-19 22:00", 10)]    // başlangıç anı içeride
    public void Gece_yarisini_gecen_pencerede_bitise_kalan_sure(string now, double hours)
        => Parse("22:00-08:00").DelayUntilEnd(DateTime.Parse(now)).ShouldBe(TimeSpan.FromHours(hours));

    [Theory]
    [InlineData("2026-10-19 08:00")]   // bitiş anı dışarıda
    [InlineData("2026-10-19 12:00")]
    [InlineData("2026-10-19 21:59")]
    public void Pencere_disinda_erteleme_yok(string now)
        => Parse("22:00-08:00").DelayUntilEnd(DateTime.Parse(now)).ShouldBeNull();

    [Fact]
    public void Ayni_gun_icindeki_pencere()
    {
        var lunch = Parse("12:30-13:30");

        lunch.DelayUntilEnd(DateTime.Parse("2026-10-19 13:00")).ShouldBe(TimeSpan.FromMinutes(30));
        lunch.DelayUntilEnd(DateTime.Parse("2026-10-19 14:00")).ShouldBeNull();
        lunch.DelayUntilEnd(DateTime.Parse("2026-10-19 01:00")).ShouldBeNull();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("22:00")]
    [InlineData("22:00-22:00")]   // başlangıç = bitiş: anlamsız pencere
    [InlineData("25:00-08:00")]
    [InlineData("gece-sabah")]
    public void Bozuk_ya_da_bos_pencere_gecersiz(string? value)
        => QuietHoursWindow.TryParse(value, out _).ShouldBeFalse();

    [Fact]
    public void Metne_donusum_ayni_bicimi_verir()
        => Parse("07:05-23:45").ToString().ShouldBe("07:05-23:45");
}
