using System;
using Shouldly;
using Xunit;

namespace Apya.Platform.Projects;

/// <summary>
/// 🔴 NTF-05 · Proje bitiş hatırlatmasının eşik kuralı (30 / 14 / 3 gün).
///
/// <para>Bir proje aynı anda yalnız TEK eşiğin içindedir. Bu, özelliğin ilk çalıştığı gün
/// geriye dönük yığın üretmesini engelleyen kuraldır: bitişine 10 gün kalmış proje "30 gün"
/// ve "14 gün" uyarılarını birlikte almaz.</para>
/// </summary>
public class ProjectEndDateReminder_Tests
{
    [Theory]
    [InlineData(31, null)]  // pencerenin dışında
    [InlineData(30, 30)]    // eşiğe girildiği gün
    [InlineData(20, 30)]
    [InlineData(15, 30)]
    [InlineData(14, 14)]
    [InlineData(10, 14)]    // 🔴 30'u DEĞİL yalnız 14'ü alır
    [InlineData(4, 14)]
    [InlineData(3, 3)]
    [InlineData(1, 3)]
    [InlineData(0, 3)]      // bugün bitiyor
    [InlineData(-1, null)]  // bitişi geçmiş: kapsam dışı
    public void Kalan_gune_gore_tek_esik_secilir(int daysRemaining, int? expected)
    {
        ProjectEndDateReminder.PickThreshold(daysRemaining).ShouldBe(expected);
    }

    /// <summary>
    /// Bitiş tarihi saat taşısa da (ör. 17:00) gün farkı tam gündür — sabah ve akşam
    /// koşan turlar aynı günü aynı sayıyla görmeli, yoksa eşik gün içinde değişirdi.
    /// </summary>
    [Fact]
    public void Kalan_gun_saat_bilesenini_yok_sayar()
    {
        var end = new DateTime(2026, 10, 20, 17, 0, 0);

        ProjectEndDateReminder.DaysRemaining(end, new DateTime(2026, 10, 6, 0, 5, 0)).ShouldBe(14);
        ProjectEndDateReminder.DaysRemaining(end, new DateTime(2026, 10, 6, 23, 55, 0)).ShouldBe(14);
        ProjectEndDateReminder.DaysRemaining(end, new DateTime(2026, 10, 20, 9, 0, 0)).ShouldBe(0);
        ProjectEndDateReminder.DaysRemaining(end, new DateTime(2026, 10, 21, 9, 0, 0)).ShouldBe(-1);
    }

    [Fact]
    public void Esikler_buyukten_kucuge_siralidir()
    {
        ProjectEndDateReminder.Thresholds.ShouldBe(new[] { 30, 14, 3 });
        ProjectEndDateReminder.MaxThreshold.ShouldBe(30);
    }
}
