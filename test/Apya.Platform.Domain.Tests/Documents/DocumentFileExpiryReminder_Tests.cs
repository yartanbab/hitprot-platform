using System;
using Shouldly;
using Xunit;

namespace Apya.Platform.Documents;

/// <summary>
/// 🔴 DOC-05 / NTF-07 · Belge geçerlilik hatırlatmasının eşik kuralı (30 gün / 7 gün / doldu).
///
/// <para>Bir belge aynı anda yalnız TEK eşiğin içindedir ve çoktan dolmuş belge duyurulmaz.
/// İkisi birlikte, özelliğin ilk çalıştığı gün geriye dönük bir yığın üretmesini engeller.</para>
/// </summary>
public class DocumentFileExpiryReminder_Tests
{
    [Theory]
    [InlineData(31, null)]   // henüz erken
    [InlineData(30, 30)]     // eşiğe girildiği gün
    [InlineData(8, 30)]
    [InlineData(7, 7)]
    [InlineData(5, 7)]       // 🔴 30'u DEĞİL yalnız 7'yi alır
    [InlineData(1, 7)]
    [InlineData(0, 0)]       // bugün doluyor
    [InlineData(-1, 0)]      // dün doldu
    [InlineData(-7, 0)]      // pencerenin son günü
    [InlineData(-8, null)]   // 🔴 çoktan dolmuş: geriye dönük duyurulmaz
    [InlineData(-400, null)]
    public void Kalan_gune_gore_tek_esik_secilir(int daysRemaining, int? expected)
    {
        DocumentFileExpiryReminder.PickThreshold(daysRemaining).ShouldBe(expected);
    }

    /// <summary>
    /// Tarih saat taşısa da gün farkı tam gündür — sabah ve akşam koşan turlar aynı günü
    /// aynı sayıyla görmeli, yoksa eşik gün içinde değişirdi.
    /// </summary>
    [Fact]
    public void Kalan_gun_saat_bilesenini_yok_sayar()
    {
        var expiry = new DateTime(2026, 10, 13, 17, 0, 0);

        DocumentFileExpiryReminder.DaysRemaining(expiry, new DateTime(2026, 10, 6, 0, 5, 0)).ShouldBe(7);
        DocumentFileExpiryReminder.DaysRemaining(expiry, new DateTime(2026, 10, 6, 23, 55, 0)).ShouldBe(7);
        DocumentFileExpiryReminder.DaysRemaining(expiry, new DateTime(2026, 10, 13, 9, 0, 0)).ShouldBe(0);
        DocumentFileExpiryReminder.DaysRemaining(expiry, new DateTime(2026, 10, 14, 9, 0, 0)).ShouldBe(-1);
    }

    [Fact]
    public void Esikler_buyukten_kucuge_siralidir()
    {
        DocumentFileExpiryReminder.Thresholds.ShouldBe(new[] { 30, 7 });
        DocumentFileExpiryReminder.MaxThreshold.ShouldBe(30);
    }
}
