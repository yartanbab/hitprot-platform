using System;
using Apya.Platform.ProjectBudgets;
using Shouldly;
using Volo.Abp;
using Xunit;

namespace Apya.Platform.Tests.Domain.ProjectBudgets;

public class ProjectBudgetLine_Tests
{
    private static ProjectBudgetLine NewLine(decimal planned = 100_000m, decimal approved = 100_000m)
        => new(Guid.NewGuid(), null, Guid.NewGuid(), "1", "Personel", planned, approved);

    [Fact]
    public void Adsiz_kalem_reddedilir()
    {
        Should.Throw<BusinessException>(() =>
                new ProjectBudgetLine(Guid.NewGuid(), null, Guid.NewGuid(), "1", "  ", 1000m, 1000m))
            .Code.ShouldBe(PlatformDomainErrorCodes.BudgetLineNameRequired);
    }

    [Fact]
    public void Negatif_tutar_reddedilir()
    {
        var line = NewLine();

        Should.Throw<BusinessException>(() => line.SetAmounts(-1m, 100m))
            .Code.ShouldBe(PlatformDomainErrorCodes.BudgetLineAmountInvalid);
    }

    [Theory]
    [InlineData(-0.01)]
    [InlineData(100.01)]
    public void Aralik_disi_aktarim_payi_reddedilir(decimal percent)
    {
        var line = NewLine();

        Should.Throw<BusinessException>(() => line.SetTransferLimit(percent))
            .Code.ShouldBe(PlatformDomainErrorCodes.BudgetTransferLimitInvalid);
    }

    [Fact]
    public void Aktarim_payi_bos_birakilabilir()
    {
        var line = NewLine();

        line.SetTransferLimit(null);

        line.TransferLimitPercent.ShouldBeNull();
    }

    [Fact]
    public void Uzun_ad_kirpilir_hata_vermez()
    {
        var uzunAd = new string('a', ProjectBudgetConsts.MaxNameLength + 50);
        var line = NewLine();

        line.SetName(uzunAd);

        line.Name.Length.ShouldBe(ProjectBudgetConsts.MaxNameLength);
    }

    [Fact]
    public void Uzun_kod_kirpilir()
    {
        var line = NewLine();

        line.SetCode(new string('9', ProjectBudgetConsts.MaxCodeLength + 10));

        line.Code.Length.ShouldBe(ProjectBudgetConsts.MaxCodeLength);
    }

    /// <summary>
    /// Sözleşme ve onaylanan tutar AYRI alanlardır: biri kıyas noktası, diğeri
    /// yürürlükteki değer. Revizyonun yalnız ikincisine dokunduğu
    /// <c>ProjectBudgetManager_Tests</c>'te uçtan uca doğrulanır.
    /// </summary>
    [Fact]
    public void Sozlesme_ve_onaylanan_tutar_bagimsiz_tutulur()
    {
        var line = NewLine(planned: 100_000m, approved: 80_000m);

        line.PlannedAmount.ShouldBe(100_000m);
        line.ApprovedAmount.ShouldBe(80_000m);
    }
}
