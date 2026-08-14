using System;
using Apya.Platform.Dashboard;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.Dashboard;

/// <summary>
/// Teslim gruplaması ve dönem penceresi saf fonksiyondur — GroupKey sunucuda hesaplanır,
/// UI yalnız çizer. Sınırların kayması tüm teslim listesini bozar.
/// </summary>
public class DashboardPeriod_Tests
{
    // 2026-08-14 bir cuma; o haftanın pazartesisi 2026-08-10.
    private static readonly DateTime Today = new(2026, 8, 14);

    [Fact]
    public void StartOfWeek_pazartesiyi_dondurur()
    {
        DashboardPeriod.StartOfWeek(Today).ShouldBe(new DateTime(2026, 8, 10));
        DashboardPeriod.StartOfWeek(new DateTime(2026, 8, 10)).ShouldBe(new DateTime(2026, 8, 10));
        // Pazar haftanın SON günüdür, sonrakinin ilki değil.
        DashboardPeriod.StartOfWeek(new DateTime(2026, 8, 16)).ShouldBe(new DateTime(2026, 8, 10));
    }

    [Theory]
    // Bu hafta: pazartesi 10 → pazar 16
    [InlineData("2026-08-10", DeliveryGroup.ThisWeek)]
    [InlineData("2026-08-14", DeliveryGroup.ThisWeek)]
    [InlineData("2026-08-16", DeliveryGroup.ThisWeek)]
    // Gelecek hafta: 17 → 23
    [InlineData("2026-08-17", DeliveryGroup.NextWeek)]
    [InlineData("2026-08-23", DeliveryGroup.NextWeek)]
    // Ay sonuna kadar kalanlar
    [InlineData("2026-08-24", DeliveryGroup.EndOfMonth)]
    [InlineData("2026-08-31", DeliveryGroup.EndOfMonth)]
    // Ay taşınca
    [InlineData("2026-09-01", DeliveryGroup.Later)]
    public void GroupFor_hafta_sinirlarini_dogru_ayirir(string due, DeliveryGroup expected)
    {
        DashboardPeriod.GroupFor(DateTime.Parse(due), Today).ShouldBe(expected);
    }

    [Fact]
    public void Resolve_Month_ayin_ilk_gununden_sonraki_ayin_ilk_gunune_kadar()
    {
        var period = DashboardPeriod.Resolve(DashboardDateRange.Month, Today);

        period.Start.ShouldBe(new DateTime(2026, 8, 1));
        period.EndExclusive.ShouldBe(new DateTime(2026, 9, 1));
        period.DayCount.ShouldBe(31);
    }

    [Fact]
    public void Resolve_Quarter_ceyrek_basindan_baslar()
    {
        var period = DashboardPeriod.Resolve(DashboardDateRange.Quarter, Today);

        period.Start.ShouldBe(new DateTime(2026, 7, 1));
        period.EndExclusive.ShouldBe(new DateTime(2026, 10, 1));
    }

    [Fact]
    public void Resolve_Week_pazartesi_pazartesi_araligi_verir()
    {
        var period = DashboardPeriod.Resolve(DashboardDateRange.Week, Today);

        period.Start.ShouldBe(new DateTime(2026, 8, 10));
        period.EndExclusive.ShouldBe(new DateTime(2026, 8, 17));
        period.DayCount.ShouldBe(7);
    }

    [Fact]
    public void Previous_ayni_uzunlukta_bitisik_pencere_verir()
    {
        var period = DashboardPeriod.Resolve(DashboardDateRange.Week, Today);
        var previous = period.Previous();

        previous.EndExclusive.ShouldBe(period.Start);
        previous.DayCount.ShouldBe(period.DayCount);
        previous.Start.ShouldBe(new DateTime(2026, 8, 3));
    }
}
