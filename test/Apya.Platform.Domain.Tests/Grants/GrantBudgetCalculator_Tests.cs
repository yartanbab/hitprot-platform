using System.Linq;
using Apya.Platform.Grants;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// 2a · Bütçe hesabı. Sınıf DI'sız olduğu için test host'u kurulmadan doğrudan çağrılır.
/// </summary>
public class GrantBudgetCalculator_Tests
{
    private static GrantBudgetCalculator.LineInput Line(GrantCostItemKind kind, decimal amount, int? limit = null)
        => new(kind, amount, limit);

    [Fact]
    public void Destek_Oranla_Hesaplanir()
    {
        var result = GrantBudgetCalculator.Calculate(
            new[] { Line(GrantCostItemKind.Personel, 1_000_000m) },
            supportRatePercent: 60,
            maxAmount: null);

        result.TotalProject.ShouldBe(1_000_000m);
        result.TotalSupport.ShouldBe(600_000m);
        result.OwnContribution.ShouldBe(400_000m);
        result.CapApplied.ShouldBeFalse();
    }

    [Fact]
    public void Oran_Tanimsizsa_Destek_Sifirdir()
    {
        // Program destek oranını girmemişse uydurma bir rakam göstermek yerine 0 döner;
        // ekranda "oran tanımlı değil" görünür.
        var result = GrantBudgetCalculator.Calculate(
            new[] { Line(GrantCostItemKind.Personel, 500_000m) },
            supportRatePercent: null,
            maxAmount: null);

        result.TotalSupport.ShouldBe(0m);
        result.OwnContribution.ShouldBe(500_000m);
    }

    [Fact]
    public void Kalem_Limiti_Toplam_Butceye_Gore_Kirpar()
    {
        // Toplam 10M; makine kalemi 5M ama limiti %40 → destek 10M*%40*%50 = 2M'a kırpılır.
        var result = GrantBudgetCalculator.Calculate(
            new[]
            {
                Line(GrantCostItemKind.Personel, 5_000_000m),
                Line(GrantCostItemKind.MakineTechizat, 5_000_000m, limit: 40)
            },
            supportRatePercent: 50,
            maxAmount: null);

        var machine = result.Lines.Single(l => l.Kind == GrantCostItemKind.MakineTechizat);
        machine.SupportAmount.ShouldBe(2_000_000m);
        machine.LimitApplied.ShouldBeTrue("kalem limiti devreye girdi, ekranda uyarı çıkmalı");

        var staff = result.Lines.Single(l => l.Kind == GrantCostItemKind.Personel);
        staff.SupportAmount.ShouldBe(2_500_000m);
        staff.LimitApplied.ShouldBeFalse();
    }

    [Fact]
    public void Limit_Icinde_Kalan_Kalem_Kirpilmaz()
    {
        var result = GrantBudgetCalculator.Calculate(
            new[]
            {
                Line(GrantCostItemKind.Personel, 8_000_000m),
                Line(GrantCostItemKind.MakineTechizat, 2_000_000m, limit: 40)
            },
            supportRatePercent: 50,
            maxAmount: null);

        result.Lines.Single(l => l.Kind == GrantCostItemKind.MakineTechizat)
            .LimitApplied.ShouldBeFalse();
    }

    [Fact]
    public void Program_Tavani_Toplami_Kirpar_Ve_Satirlar_Toplami_Tutar()
    {
        var result = GrantBudgetCalculator.Calculate(
            new[]
            {
                Line(GrantCostItemKind.Personel, 10_000_000m),
                Line(GrantCostItemKind.Danismanlik, 10_000_000m)
            },
            supportRatePercent: 100,
            maxAmount: 5_000_000m);

        result.CapApplied.ShouldBeTrue();
        result.TotalSupport.ShouldBe(5_000_000m);
        // 🔴 Satır toplamı gösterilen toplamı tutmalı; aksi halde ekranda iki farklı
        // rakam görünür ve kullanıcı hangisine güveneceğini bilemez.
        result.Lines.Sum(l => l.SupportAmount).ShouldBe(5_000_000m);
    }

    [Fact]
    public void Tavan_Orani_Yuzde_Olarak_Doner()
    {
        var result = GrantBudgetCalculator.Calculate(
            new[] { Line(GrantCostItemKind.Personel, 10_000_000m) },
            supportRatePercent: 50,
            maxAmount: 10_000_000m);

        result.SupportShareOfCapPercent.ShouldBe(50);
    }

    [Fact]
    public void Bos_Butce_Sifir_Doner_Bolme_Hatasi_Vermez()
    {
        var result = GrantBudgetCalculator.Calculate(
            new[] { Line(GrantCostItemKind.Personel, 0m, limit: 40) },
            supportRatePercent: 50,
            maxAmount: 10_000_000m);

        result.TotalProject.ShouldBe(0m);
        result.TotalSupport.ShouldBe(0m);
        result.SupportShareOfCapPercent.ShouldBe(0);
    }
}
