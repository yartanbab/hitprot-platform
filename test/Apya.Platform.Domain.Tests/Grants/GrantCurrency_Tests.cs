using System;
using System.Collections.Generic;
using Apya.Platform.Grants;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// Programın tutarları kendi para biriminde tutulur. Döviz tavanı firmanın TL verisiyle
/// karşılaştırılmaz ve TL bütçeyi kırpmaz: <see cref="Grant.TryMaxAmount"/> null döner.
/// </summary>
public class GrantCurrency_Tests
{
    private static Grant NewGrant(decimal max = 100_000m) => new(Guid.NewGuid(), "Program", "Kurum", max, 0);

    [Fact]
    public void Varsayilan_TRY_ve_bilinmeyen_kod_TRYye_duser()
    {
        var grant = NewGrant();
        grant.Currency.ShouldBe(GrantCurrencies.Try);

        grant.Currency = "eur";
        grant.Currency.ShouldBe(GrantCurrencies.Eur);

        grant.Currency = "CHF";
        grant.Currency.ShouldBe(GrantCurrencies.Try);

        grant.Currency = null!;
        grant.Currency.ShouldBe(GrantCurrencies.Try);
    }

    [Fact]
    public void Doviz_tavaninda_TL_karsilastirma_tutarlari_bos()
    {
        var grant = NewGrant(50_000m);
        grant.MinAmount = 10_000m;
        grant.TryMaxAmount.ShouldBe(50_000m);
        grant.TryMinAmount.ShouldBe(10_000m);

        grant.Currency = GrantCurrencies.Gbp;
        grant.HasTryAmounts.ShouldBeFalse();
        grant.TryMaxAmount.ShouldBeNull();
        grant.TryMinAmount.ShouldBeNull();
        grant.MaxAmount.ShouldBe(50_000m, "tutarın kendisi korunur");
    }

    [Fact]
    public void Doviz_tavani_TL_butceyi_kirpmaz()
    {
        var grant = NewGrant(10_000m);
        grant.Currency = GrantCurrencies.Eur;
        var lines = new List<GrantBudgetCalculator.LineInput> { new(GrantCostItemKind.Personel, 1_000_000m, null) };

        var result = GrantBudgetCalculator.Calculate(lines, 50, grant.TryMaxAmount);

        result.CapApplied.ShouldBeFalse();
        result.TotalSupport.ShouldBe(500_000m);
        result.SupportShareOfCapPercent.ShouldBeNull();
    }
}
