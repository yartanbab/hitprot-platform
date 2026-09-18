using System;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// Ters aralık (en az &gt; en fazla) hata vermeden kaydediliyordu; eşleştirme o şartı her firma için
/// "karşılamıyor" sayıp programı SESSİZCE herkese kapatıyordu (denetim H-09).
/// </summary>
public class GrantRange_Tests
{
    private static Grant NewGrant() => new(Guid.NewGuid(), "Program", "Kurum", 0m, 0);

    [Fact]
    public void Tutarli_ve_bos_araliklar_gecer()
    {
        var grant = NewGrant();
        grant.MinCompanyAgeYears = 2; grant.MaxCompanyAgeYears = 2;
        grant.MinTrl = 4;
        grant.MaxRevenue = 1_000_000m;

        Should.NotThrow(() => grant.EnsureRangesValid());
    }

    [Fact]
    public void Ust_limit_sifirsa_limitsiz_sayilir()
    {
        // MaxAmount 0 = "üst limit yok" (katalog sözleşmesi); en az tutarla çelişmez.
        var grant = NewGrant();
        grant.MinAmount = 500_000m;
        grant.MaxAmount = 0m;

        Should.NotThrow(() => grant.EnsureRangesValid());
    }

    [Theory]
    [InlineData("age", PlatformDomainErrorCodes.GrantRangeCompanyAgeInverted)]
    [InlineData("trl", PlatformDomainErrorCodes.GrantRangeTrlInverted)]
    [InlineData("revenue", PlatformDomainErrorCodes.GrantRangeRevenueInverted)]
    [InlineData("amount", PlatformDomainErrorCodes.GrantRangeAmountInverted)]
    public void Ters_aralik_reddedilir(string field, string code)
    {
        var grant = NewGrant();
        switch (field)
        {
            case "age": grant.MinCompanyAgeYears = 5; grant.MaxCompanyAgeYears = 3; break;
            case "trl": grant.MinTrl = 7; grant.MaxTrl = 4; break;
            case "revenue": grant.MinRevenue = 10_000_000m; grant.MaxRevenue = 1_000_000m; break;
            case "amount": grant.MinAmount = 2_000_000m; grant.MaxAmount = 1_000_000m; break;
        }

        Should.Throw<BusinessException>(() => grant.EnsureRangesValid()).Code.ShouldBe(code);
    }
}
