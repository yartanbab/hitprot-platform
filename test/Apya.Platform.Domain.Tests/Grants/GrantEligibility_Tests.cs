using System;
using System.Linq;
using Shouldly;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// 1b · uygunluk şartlarının sert eleme davranışı. Skorlamadan (bkz.
/// <see cref="GrantMatchManager_Tests"/>) ayrıdır: burada "kim eleniyor" sorusu var.
/// </summary>
public class GrantEligibility_Tests
{
    private readonly GrantMatchManager _m = new();
    private static readonly DateTime Today = new(2026, 9, 1);

    private static Grant Program() => new Grant(Guid.NewGuid(), "P", "K", 1_000_000m, 0);

    private static GrantRuleOutcome Outcome(GrantEligibilityResult r, GrantEligibilityRule rule)
        => r.Rules.Single(x => x.Rule == rule).Outcome;

    [Fact]
    public void Sart_Tanimlanmamissa_Kural_Hic_Uretilmez()
    {
        var result = _m.Evaluate(new FirmSignals { StaffCount = 3 }, Program(), Today);

        result.Rules.ShouldBeEmpty();
        result.IsEligible.ShouldBeTrue();
        result.IsConfirmed.ShouldBeTrue();
    }

    [Fact]
    public void Firmada_Veri_Yoksa_Unknown_Doner_Ve_Elemez()
    {
        var grant = Program();
        grant.MinRdStaffCount = 2;

        var result = _m.Evaluate(new FirmSignals(), grant, Today);

        Outcome(result, GrantEligibilityRule.RdStaffCount).ShouldBe(GrantRuleOutcome.Unknown);
        result.IsEligible.ShouldBeTrue();   // eleyici değil
        result.IsConfirmed.ShouldBeFalse(); // ama "karşılıyor" da sayılmaz
        result.UnknownCount.ShouldBe(1);
    }

    [Fact]
    public void Sarti_Karsilamayan_Firma_Elenir()
    {
        var grant = Program();
        grant.MinRdStaffCount = 2;

        var result = _m.Evaluate(new FirmSignals { RdStaffCount = 1 }, grant, Today);

        Outcome(result, GrantEligibilityRule.RdStaffCount).ShouldBe(GrantRuleOutcome.Failed);
        result.IsEligible.ShouldBeFalse();
        result.IsConfirmed.ShouldBeFalse();
    }

    [Fact]
    public void Olcek_Bit_Maskesiyle_Degerlendirilir()
    {
        var grant = Program();
        grant.EligibleCompanySizes = (int)(CompanySize.Kucuk | CompanySize.Orta);

        Outcome(_m.Evaluate(new FirmSignals { Size = CompanySize.Orta }, grant, Today),
            GrantEligibilityRule.CompanySize).ShouldBe(GrantRuleOutcome.Passed);
        Outcome(_m.Evaluate(new FirmSignals { Size = CompanySize.Buyuk }, grant, Today),
            GrantEligibilityRule.CompanySize).ShouldBe(GrantRuleOutcome.Failed);
    }

    [Theory]
    [InlineData(3, 7, 5, GrantRuleOutcome.Passed)]
    [InlineData(3, 7, 2, GrantRuleOutcome.Failed)]
    [InlineData(3, 7, 8, GrantRuleOutcome.Failed)]
    [InlineData(3, null, 9, GrantRuleOutcome.Passed)] // üst sınır yok
    public void Trl_Araligi_Iki_Uctan_Da_Kontrol_Edilir(int min, int? max, int firmTrl, GrantRuleOutcome beklenen)
    {
        var grant = Program();
        grant.MinTrl = min;
        grant.MaxTrl = max;

        Outcome(_m.Evaluate(new FirmSignals { Trl = firmTrl }, grant, Today), GrantEligibilityRule.Trl)
            .ShouldBe(beklenen);
    }

    [Fact]
    public void Sirket_Yasi_Tam_Yil_Uzerinden_Hesaplanir()
    {
        var grant = Program();
        grant.MinCompanyAgeYears = 2;

        // 2024-09-02 → 2026-09-01 arası 1 yıl 364 gün: HENÜZ 2 yıl değil.
        Outcome(_m.Evaluate(new FirmSignals { FoundedOn = new DateTime(2024, 9, 2) }, grant, Today),
            GrantEligibilityRule.CompanyAge).ShouldBe(GrantRuleOutcome.Failed);

        // 2024-09-01 → tam 2 yıl.
        Outcome(_m.Evaluate(new FirmSignals { FoundedOn = new DateTime(2024, 9, 1) }, grant, Today),
            GrantEligibilityRule.CompanyAge).ShouldBe(GrantRuleOutcome.Passed);
    }

    [Fact]
    public void Ciro_Araligi_Alt_Ve_Ust_Siniri_Uygular()
    {
        var grant = Program();
        grant.MinRevenue = 5_000_000m;
        grant.MaxRevenue = 250_000_000m;

        Outcome(_m.Evaluate(new FirmSignals { AnnualRevenue = 4_999_999m }, grant, Today),
            GrantEligibilityRule.Revenue).ShouldBe(GrantRuleOutcome.Failed);
        Outcome(_m.Evaluate(new FirmSignals { AnnualRevenue = 5_000_000m }, grant, Today),
            GrantEligibilityRule.Revenue).ShouldBe(GrantRuleOutcome.Passed);
        Outcome(_m.Evaluate(new FirmSignals { AnnualRevenue = 250_000_001m }, grant, Today),
            GrantEligibilityRule.Revenue).ShouldBe(GrantRuleOutcome.Failed);
    }

    [Fact]
    public void Konsorsiyum_Sarti_Yalnizca_Zorunluysa_Degerlendirilir()
    {
        var grant = Program();
        _m.Evaluate(new FirmSignals { HasConsortiumPartner = false }, grant, Today)
            .Rules.ShouldBeEmpty();

        grant.RequiresConsortium = true;
        Outcome(_m.Evaluate(new FirmSignals { HasConsortiumPartner = false }, grant, Today),
            GrantEligibilityRule.Consortium).ShouldBe(GrantRuleOutcome.Failed);
        Outcome(_m.Evaluate(new FirmSignals { HasConsortiumPartner = true }, grant, Today),
            GrantEligibilityRule.Consortium).ShouldBe(GrantRuleOutcome.Passed);
    }

    [Fact]
    public void Oncelik_Bayraklari_Eleme_Kurali_Uretmez()
    {
        var grant = Program();
        grant.PrefersFemaleEntrepreneur = true;
        grant.PrefersYoungEntrepreneur = true;

        _m.Evaluate(new FirmSignals(), grant, Today).Rules.ShouldBeEmpty();
    }

    /// <summary>
    /// STK profilinde ölçek, TRL, Ar-Ge personeli, ciro ve konsorsiyum alanı YOKTUR (form
    /// göstermez, sunucu null'lar). Bu şartlar "veri eksik" sayılsaydı dernek hiçbir zaman
    /// dolduramayacağı alanlar yüzünden kalıcı olarak "Koşullu" kalırdı; STK'da hiç üretilmezler.
    /// </summary>
    [Theory]
    [InlineData(OrganizationType.Dernek)]
    [InlineData(OrganizationType.Kulup)]
    [InlineData(OrganizationType.Vakif)]
    [InlineData(OrganizationType.Federasyon)]
    public void Stkda_Sirkete_Ozgu_Sartlar_Uretilmez(OrganizationType type)
    {
        var grant = Program();
        grant.EligibleCompanySizes = (int)CompanySize.Kucuk;
        grant.MinTrl = 4;
        grant.MinRdStaffCount = 2;
        grant.MinRevenue = 5_000_000m;
        grant.RequiresConsortium = true;

        var result = _m.Evaluate(new FirmSignals { Type = type }, grant, Today);

        result.Rules.ShouldBeEmpty();
        result.Bucket.ShouldBe(GrantEligibilityBucket.Uygun);
    }

    /// <summary>Aynı program şirkette beş şartı da üretir; verisi yoksa "Koşullu" kalır.</summary>
    [Fact]
    public void Sirkette_Ayni_Sartlar_Uretilmeye_Devam_Eder()
    {
        var grant = Program();
        grant.EligibleCompanySizes = (int)CompanySize.Kucuk;
        grant.MinTrl = 4;
        grant.MinRdStaffCount = 2;
        grant.MinRevenue = 5_000_000m;
        grant.RequiresConsortium = true;

        var result = _m.Evaluate(new FirmSignals(), grant, Today);

        result.Rules.Count.ShouldBe(5);
        result.Bucket.ShouldBe(GrantEligibilityBucket.Kosullu);
    }

    /// <summary>Kuruluş yaşı ve personel sayısı STK'da da ölçülür: eler de, eksikse sorar da.</summary>
    [Fact]
    public void Stkda_Yas_Ve_Personel_Sarti_Olculmeye_Devam_Eder()
    {
        var grant = Program();
        grant.MaxCompanyAgeYears = 5;
        grant.MinStaffCount = 10;

        var result = _m.Evaluate(
            new FirmSignals { Type = OrganizationType.Dernek, FoundedOn = new DateTime(2019, 1, 24) },
            grant, Today);

        Outcome(result, GrantEligibilityRule.CompanyAge).ShouldBe(GrantRuleOutcome.Failed);
        Outcome(result, GrantEligibilityRule.StaffCount).ShouldBe(GrantRuleOutcome.Unknown);
        result.Rules.Count.ShouldBe(2);
    }

    [Fact]
    public void Tek_Sart_Elerse_Firma_Uygun_Olmaz_Digerleri_Gecmis_Olsa_Bile()
    {
        var grant = Program();
        grant.EligibleCompanySizes = (int)CompanySize.Kucuk;
        grant.MinStaffCount = 10;
        grant.MinRdStaffCount = 2;

        var firm = new FirmSignals { Size = CompanySize.Kucuk, StaffCount = 40, RdStaffCount = 1 };
        var result = _m.Evaluate(firm, grant, Today);

        result.Rules.Count.ShouldBe(3);
        result.IsEligible.ShouldBeFalse();
        result.Rules.Count(r => r.Outcome == GrantRuleOutcome.Passed).ShouldBe(2);
    }
}
