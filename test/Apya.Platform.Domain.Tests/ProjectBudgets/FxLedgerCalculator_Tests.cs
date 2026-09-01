using System;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp;
using Xunit;

namespace Apya.Platform.Tests.Domain.ProjectBudgets;

public class FxLedgerCalculator_Tests
{
    [Fact]
    public void Ayni_para_biriminde_kur_aranmaz()
    {
        FxLedgerCalculator.Convert(1000m, "TRY", "TRY", null).ShouldBe(1000m);
        FxLedgerCalculator.EffectiveRate("TRY", "TRY", null).ShouldBe(1m);
    }

    [Fact]
    public void Buyuk_kucuk_harf_farki_ayni_para_birimi_sayilir()
    {
        FxLedgerCalculator.Convert(500m, "eur", "EUR", null).ShouldBe(500m);
    }

    [Fact]
    public void Farkli_para_biriminde_kur_zorunlu()
    {
        Should.Throw<BusinessException>(() => FxLedgerCalculator.Convert(100m, "EUR", "TRY", null))
            .Code.ShouldBe(PlatformDomainErrorCodes.FxRateMissing);

        Should.Throw<BusinessException>(() => FxLedgerCalculator.Convert(100m, "EUR", "TRY", 0m))
            .Code.ShouldBe(PlatformDomainErrorCodes.FxRateMissing);
    }

    [Fact]
    public void Donusum_iki_haneye_yuvarlanir()
    {
        // 1000 EUR, 1 EUR = 39,1234 TRY
        FxLedgerCalculator.Convert(1000m, "EUR", "TRY", 39.1234m).ShouldBe(39_123.40m);
    }
}

/// <summary>
/// Kur köprüsü ayarının kuralları. Yarım yapılandırma (donör yok ama politika
/// "sabit kur") sonradan sessizce yanlış hesap üretirdi.
/// </summary>
public class ProjectFxBridge_Tests
{
    private static Project NewProject(string currency = "TRY")
        => new(Guid.NewGuid(), null, null, "Proje", "PRJ-1", "açıklama", 1000m, 0m, currency);

    [Fact]
    public void Varsayilan_proje_tek_defterlidir()
    {
        var p = NewProject();

        p.DonorCurrency.ShouldBeNull();
        p.FxPolicy.ShouldBe(FxPolicy.SpendDate);
        p.FixedDonorRate.ShouldBeNull();
    }

    [Fact]
    public void Donor_para_birimi_bosaltilinca_politika_da_temizlenir()
    {
        var p = NewProject();
        p.SetFxBridge("EUR", FxPolicy.FixedContract, 0.03m);

        p.SetFxBridge(null, FxPolicy.MonthlyDonor, 5m);

        p.DonorCurrency.ShouldBeNull();
        p.FxPolicy.ShouldBe(FxPolicy.SpendDate);
        p.FixedDonorRate.ShouldBeNull();
    }

    [Fact]
    public void Donor_para_birimi_projeninkiyle_ayni_olamaz()
    {
        var p = NewProject("TRY");

        Should.Throw<BusinessException>(() => p.SetFxBridge("TRY", FxPolicy.SpendDate, null))
            .Code.ShouldBe(PlatformDomainErrorCodes.FxDonorCurrencySameAsProject);
    }

    [Fact]
    public void Sabit_politika_kursuz_kabul_edilmez()
    {
        var p = NewProject();

        Should.Throw<BusinessException>(() => p.SetFxBridge("EUR", FxPolicy.FixedContract, null))
            .Code.ShouldBe(PlatformDomainErrorCodes.FxFixedRateRequired);

        Should.Throw<BusinessException>(() => p.SetFxBridge("EUR", FxPolicy.FixedContract, 0m))
            .Code.ShouldBe(PlatformDomainErrorCodes.FxFixedRateRequired);
    }

    /// <summary>
    /// Sabit kur BAŞKA politikada saklanmaz: iki değer birden dururken "hangisi
    /// geçerli" belirsizliği doğar.
    /// </summary>
    [Fact]
    public void Sabit_kur_yalniz_kendi_politikasinda_saklanir()
    {
        var p = NewProject();

        p.SetFxBridge("EUR", FxPolicy.SpendDate, 0.03m);

        p.DonorCurrency.ShouldBe("EUR");
        p.FxPolicy.ShouldBe(FxPolicy.SpendDate);
        p.FixedDonorRate.ShouldBeNull();
    }

    [Fact]
    public void Donor_para_birimi_buyuk_harfe_normalize_edilir()
    {
        var p = NewProject();

        p.SetFxBridge(" eur ", FxPolicy.SpendDate, null);

        p.DonorCurrency.ShouldBe("EUR");
    }
}
