using System;
using Apya.Platform.ProjectBudgets;
using Shouldly;
using Volo.Abp;
using Xunit;

namespace Apya.Platform.Tests.Domain.ProjectBudgets;

/// <summary>
/// Dilimin durum kuralı: üç durum TUTARDAN türer, itiraz ELLE konur.
/// Bu ayrım karışırsa ya itiraz sessizce silinir ya da tahsil edilen dilim
/// "bekliyor" görünür.
/// </summary>
public class FundingTranche_Tests
{
    private static FundingTranche NewTranche(decimal plannedAmount = 100_000m)
        => new(Guid.NewGuid(), null, Guid.NewGuid(), 1, plannedAmount);

    [Fact]
    public void Yeni_dilim_bekliyor_durumunda_baslar()
    {
        var tranche = NewTranche();

        tranche.Status.ShouldBe(FundingTrancheStatus.Pending);
        tranche.ReceivedAmount.ShouldBe(0m);
        tranche.ExpectedAmount.ShouldBe(100_000m);
    }

    [Fact]
    public void Kismi_tahsilat_kismi_durumuna_gecirir()
    {
        var tranche = NewTranche();

        tranche.RegisterCollection(40_000m, DateTime.Today, null);

        tranche.Status.ShouldBe(FundingTrancheStatus.PartiallyCollected);
    }

    [Fact]
    public void Tam_tahsilat_tahsil_edildi_yapar()
    {
        var tranche = NewTranche();

        tranche.RegisterCollection(100_000m, DateTime.Today, null);

        tranche.Status.ShouldBe(FundingTrancheStatus.Collected);
    }

    /// <summary>
    /// Kesinti yapılmış dilim, planlanandan AZ geldiği hâlde tam tahsil sayılır —
    /// beklenen tutar kesinti düşülmüş tutardır.
    /// </summary>
    [Fact]
    public void Kesintili_dilim_beklenen_tutara_ulasinca_tahsil_edildi_olur()
    {
        var tranche = NewTranche();
        tranche.AddDeduction(Guid.NewGuid(), 20_000m, "Belgesiz gider", DateTime.Today);

        tranche.ExpectedAmount.ShouldBe(80_000m);

        tranche.RegisterCollection(80_000m, DateTime.Today, null);

        tranche.Status.ShouldBe(FundingTrancheStatus.Collected);
    }

    [Fact]
    public void Kesinti_eklenince_tam_tahsil_edilmis_dilim_tahsil_edilmis_kalir()
    {
        var tranche = NewTranche();
        tranche.RegisterCollection(100_000m, DateTime.Today, null);

        tranche.AddDeduction(Guid.NewGuid(), 20_000m, "Sonradan kesildi", DateTime.Today);

        tranche.Status.ShouldBe(FundingTrancheStatus.Collected);
    }

    [Fact]
    public void Itiraz_isareti_tutar_degisince_SILINMEZ()
    {
        var tranche = NewTranche();
        tranche.SetDisputed(true);

        tranche.RegisterCollection(50_000m, DateTime.Today, null);

        tranche.Status.ShouldBe(FundingTrancheStatus.Disputed);
    }

    [Fact]
    public void Itiraz_kaldirilinca_durum_tutardan_yeniden_turetilir()
    {
        var tranche = NewTranche();
        tranche.RegisterCollection(50_000m, DateTime.Today, null);
        tranche.SetDisputed(true);

        tranche.SetDisputed(false);

        tranche.Status.ShouldBe(FundingTrancheStatus.PartiallyCollected);
    }

    [Fact]
    public void Sifir_tahsilat_gelir_kaydi_bagini_da_kaldirir()
    {
        var tranche = NewTranche();
        tranche.RegisterCollection(50_000m, DateTime.Today, Guid.NewGuid());

        tranche.RegisterCollection(0m, DateTime.Today, Guid.NewGuid());

        tranche.Status.ShouldBe(FundingTrancheStatus.Pending);
        tranche.IncomeEntryId.ShouldBeNull();
        tranche.ReceivedDate.ShouldBeNull();
    }

    [Fact]
    public void Planlanani_asan_kesinti_reddedilir()
    {
        var tranche = NewTranche(100_000m);
        tranche.AddDeduction(Guid.NewGuid(), 60_000m, "Birinci", DateTime.Today);

        var ex = Should.Throw<BusinessException>(() =>
            tranche.AddDeduction(Guid.NewGuid(), 50_000m, "İkinci", DateTime.Today));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.DeductionExceedsTranche);
        tranche.DeductionTotal.ShouldBe(60_000m);
    }

    [Fact]
    public void Gerekcesiz_kesinti_reddedilir()
    {
        var tranche = NewTranche();

        Should.Throw<BusinessException>(() =>
                tranche.AddDeduction(Guid.NewGuid(), 1_000m, "   ", DateTime.Today))
            .Code.ShouldBe(PlatformDomainErrorCodes.DeductionReasonRequired);
    }

    [Fact]
    public void Sifir_veya_negatif_kesinti_reddedilir()
    {
        var tranche = NewTranche();

        Should.Throw<BusinessException>(() =>
                tranche.AddDeduction(Guid.NewGuid(), 0m, "Gerekçe", DateTime.Today))
            .Code.ShouldBe(PlatformDomainErrorCodes.DeductionAmountInvalid);
    }

    [Fact]
    public void Kesinti_kaldirilinca_beklenen_tutar_ve_durum_geri_doner()
    {
        var tranche = NewTranche();
        var deductionId = Guid.NewGuid();
        tranche.AddDeduction(deductionId, 20_000m, "Yanlış kesinti", DateTime.Today);
        tranche.RegisterCollection(80_000m, DateTime.Today, null);
        tranche.Status.ShouldBe(FundingTrancheStatus.Collected);

        tranche.RemoveDeduction(deductionId);

        tranche.ExpectedAmount.ShouldBe(100_000m);
        tranche.Status.ShouldBe(FundingTrancheStatus.PartiallyCollected);
    }

    [Fact]
    public void Sifir_planlanan_tutar_reddedilir()
    {
        Should.Throw<BusinessException>(() => NewTranche(0m))
            .Code.ShouldBe(PlatformDomainErrorCodes.TrancheAmountInvalid);
    }
}
