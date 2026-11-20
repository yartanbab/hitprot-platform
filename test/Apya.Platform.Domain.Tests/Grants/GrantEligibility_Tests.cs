using System;
using System.Collections.Generic;
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
    private static readonly IReadOnlyList<GrantCriteriaTag> NoTags = Array.Empty<GrantCriteriaTag>();

    private static Grant Program() => new Grant(Guid.NewGuid(), "P", "K", 1_000_000m, 0);

    private static List<GrantCriteriaTag> Regions(Grant grant, params string[] provinces)
        => provinces.Select(p => new GrantCriteriaTag(Guid.NewGuid(), grant.Id, GrantCriteriaKind.Bolge, p)).ToList();

    private static FirmSignals FirmIn(params string[] provinces) => new()
    {
        Tags = provinces.Select(p => new FirmSignalTag(GrantCriteriaKind.Bolge, p)).ToList()
    };

    private static GrantRuleOutcome Outcome(GrantEligibilityResult r, GrantEligibilityRule rule)
        => r.Rules.Single(x => x.Rule == rule).Outcome;

    [Fact]
    public void Sart_Tanimlanmamissa_Kural_Hic_Uretilmez()
    {
        var result = _m.Evaluate(new FirmSignals { StaffCount = 3 }, Program(), NoTags, Today);

        result.Rules.ShouldBeEmpty();
        result.IsEligible.ShouldBeTrue();
        result.IsConfirmed.ShouldBeTrue();
    }

    [Fact]
    public void Firmada_Veri_Yoksa_Unknown_Doner_Ve_Elemez()
    {
        var grant = Program();
        grant.MinRdStaffCount = 2;

        var result = _m.Evaluate(new FirmSignals(), grant, NoTags, Today);

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

        var result = _m.Evaluate(new FirmSignals { RdStaffCount = 1 }, grant, NoTags, Today);

        Outcome(result, GrantEligibilityRule.RdStaffCount).ShouldBe(GrantRuleOutcome.Failed);
        result.IsEligible.ShouldBeFalse();
        result.IsConfirmed.ShouldBeFalse();
    }

    [Fact]
    public void Olcek_Bit_Maskesiyle_Degerlendirilir()
    {
        var grant = Program();
        grant.EligibleCompanySizes = (int)(CompanySize.Kucuk | CompanySize.Orta);

        Outcome(_m.Evaluate(new FirmSignals { Size = CompanySize.Orta }, grant, NoTags, Today),
            GrantEligibilityRule.CompanySize).ShouldBe(GrantRuleOutcome.Passed);
        Outcome(_m.Evaluate(new FirmSignals { Size = CompanySize.Buyuk }, grant, NoTags, Today),
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

        Outcome(_m.Evaluate(new FirmSignals { Trl = firmTrl }, grant, NoTags, Today), GrantEligibilityRule.Trl)
            .ShouldBe(beklenen);
    }

    [Fact]
    public void Sirket_Yasi_Tam_Yil_Uzerinden_Hesaplanir()
    {
        var grant = Program();
        grant.MinCompanyAgeYears = 2;

        // 2024-09-02 → 2026-09-01 arası 1 yıl 364 gün: HENÜZ 2 yıl değil.
        Outcome(_m.Evaluate(new FirmSignals { FoundedOn = new DateTime(2024, 9, 2) }, grant, NoTags, Today),
            GrantEligibilityRule.CompanyAge).ShouldBe(GrantRuleOutcome.Failed);

        // 2024-09-01 → tam 2 yıl.
        Outcome(_m.Evaluate(new FirmSignals { FoundedOn = new DateTime(2024, 9, 1) }, grant, NoTags, Today),
            GrantEligibilityRule.CompanyAge).ShouldBe(GrantRuleOutcome.Passed);
    }

    [Fact]
    public void Ciro_Araligi_Alt_Ve_Ust_Siniri_Uygular()
    {
        var grant = Program();
        grant.MinRevenue = 5_000_000m;
        grant.MaxRevenue = 250_000_000m;

        Outcome(_m.Evaluate(new FirmSignals { AnnualRevenue = 4_999_999m }, grant, NoTags, Today),
            GrantEligibilityRule.Revenue).ShouldBe(GrantRuleOutcome.Failed);
        Outcome(_m.Evaluate(new FirmSignals { AnnualRevenue = 5_000_000m }, grant, NoTags, Today),
            GrantEligibilityRule.Revenue).ShouldBe(GrantRuleOutcome.Passed);
        Outcome(_m.Evaluate(new FirmSignals { AnnualRevenue = 250_000_001m }, grant, NoTags, Today),
            GrantEligibilityRule.Revenue).ShouldBe(GrantRuleOutcome.Failed);
    }

    [Fact]
    public void Konsorsiyum_Sarti_Yalnizca_Zorunluysa_Degerlendirilir()
    {
        var grant = Program();
        _m.Evaluate(new FirmSignals { HasConsortiumPartner = false }, grant, NoTags, Today)
            .Rules.ShouldBeEmpty();

        grant.RequiresConsortium = true;
        Outcome(_m.Evaluate(new FirmSignals { HasConsortiumPartner = false }, grant, NoTags, Today),
            GrantEligibilityRule.Consortium).ShouldBe(GrantRuleOutcome.Failed);
        Outcome(_m.Evaluate(new FirmSignals { HasConsortiumPartner = true }, grant, NoTags, Today),
            GrantEligibilityRule.Consortium).ShouldBe(GrantRuleOutcome.Passed);
    }

    [Fact]
    public void Oncelik_Bayraklari_Eleme_Kurali_Uretmez()
    {
        var grant = Program();
        grant.PrefersFemaleEntrepreneur = true;
        grant.PrefersYoungEntrepreneur = true;

        _m.Evaluate(new FirmSignals(), grant, NoTags, Today).Rules.ShouldBeEmpty();
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
    [InlineData(OrganizationType.Kooperatif)]
    public void Stkda_Sirkete_Ozgu_Sartlar_Uretilmez(OrganizationType type)
    {
        var grant = Program();
        grant.EligibleCompanySizes = (int)CompanySize.Kucuk;
        grant.MinTrl = 4;
        grant.MinRdStaffCount = 2;
        grant.MinRevenue = 5_000_000m;
        grant.RequiresConsortium = true;

        var result = _m.Evaluate(new FirmSignals { Type = type }, grant, NoTags, Today);

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

        var result = _m.Evaluate(new FirmSignals(), grant, NoTags, Today);

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
            grant, NoTags, Today);

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
        var result = _m.Evaluate(firm, grant, NoTags, Today);

        result.Rules.Count.ShouldBe(3);
        result.IsEligible.ShouldBeFalse();
        result.Rules.Count(r => r.Outcome == GrantRuleOutcome.Passed).ShouldBe(2);
    }

    [Fact]
    public void Bolge_Disindaki_Kurum_Elenir()
    {
        var grant = Program();
        var tags = Regions(grant, "Samsun", "Tokat", "Çorum", "Amasya");

        var result = _m.Evaluate(FirmIn("Ankara"), grant, tags, Today);

        Outcome(result, GrantEligibilityRule.Region).ShouldBe(GrantRuleOutcome.Failed);
        result.Bucket.ShouldBe(GrantEligibilityBucket.UygunDegil);
        result.IsFixable.ShouldBeFalse(); // kurumun yeri kısa vadede değişmez
    }

    [Fact]
    public void Sube_Ili_Bolgedeyse_Kurum_Gecer()
    {
        var grant = Program();
        var tags = Regions(grant, "Samsun", "Tokat");

        // Merkez Ankara, şube Tokat: ajans projenin uygulama yerine bakar.
        var result = _m.Evaluate(FirmIn("Ankara", "Tokat"), grant, tags, Today);

        Outcome(result, GrantEligibilityRule.Region).ShouldBe(GrantRuleOutcome.Passed);
    }

    [Fact]
    public void Il_Yazimi_Eslesmeyi_Bozmaz()
    {
        var grant = Program();
        var tags = Regions(grant, "İstanbul");

        // ToLowerInvariant "İ"yi noktalı "i̇"ye çevirdiği için eskiden eşleşmiyordu.
        foreach (var spelling in new[] { "istanbul", "ISTANBUL", "Istanbul", "İSTANBUL" })
        {
            Outcome(_m.Evaluate(FirmIn(spelling), grant, tags, Today), GrantEligibilityRule.Region)
                .ShouldBe(GrantRuleOutcome.Passed, spelling);
        }
    }

    [Fact]
    public void Ili_Olmayan_Kurum_Elenmez_Kosullu_Kalir()
    {
        var grant = Program();

        var result = _m.Evaluate(new FirmSignals(), grant, Regions(grant, "Tokat"), Today);

        Outcome(result, GrantEligibilityRule.Region).ShouldBe(GrantRuleOutcome.Unknown);
        result.Bucket.ShouldBe(GrantEligibilityBucket.Kosullu);
    }

    [Fact]
    public void Il_Olmayan_Eski_Bolge_Metni_Sart_Koydurmaz()
    {
        var grant = Program();

        var result = _m.Evaluate(FirmIn("Ankara"), grant, Regions(grant, "Türkiye geneli"), Today);

        result.Rules.ShouldNotContain(r => r.Rule == GrantEligibilityRule.Region);
        result.IsEligible.ShouldBeTrue();
    }

    [Fact]
    public void Bolge_Sarti_Dernege_De_Uygulanir()
    {
        var grant = Program();
        var firm = FirmIn("Van");
        firm.Type = OrganizationType.Dernek;

        var result = _m.Evaluate(firm, grant, Regions(grant, "Tokat"), Today);

        Outcome(result, GrantEligibilityRule.Region).ShouldBe(GrantRuleOutcome.Failed);
    }

    // ---------- Kurum türü (başvurabilecek türler) ----------

    private static Grant OnlyFor(params OrganizationType[] types)
    {
        var grant = Program();
        grant.EligibleApplicantTypes = types.Aggregate(0, (mask, t) => mask | t.ToMaskBit());
        return grant;
    }

    /// <summary>Kullanıcının örneği: yalnız şirkete açık program (KOSGEB gibi) derneği eler.</summary>
    [Fact]
    public void Yalniz_Sirkete_Acik_Program_Dernegi_Eler()
    {
        var grant = OnlyFor(OrganizationType.Sirket);

        var dernek = _m.Evaluate(new FirmSignals { Type = OrganizationType.Dernek }, grant, NoTags, Today);
        var sirket = _m.Evaluate(new FirmSignals { Type = OrganizationType.Sirket }, grant, NoTags, Today);

        Outcome(dernek, GrantEligibilityRule.OrganizationType).ShouldBe(GrantRuleOutcome.Failed);
        dernek.Bucket.ShouldBe(GrantEligibilityBucket.UygunDegil);
        dernek.IsExcludedByApplicantType.ShouldBeTrue();
        Outcome(sirket, GrantEligibilityRule.OrganizationType).ShouldBe(GrantRuleOutcome.Passed);
        sirket.IsExcludedByApplicantType.ShouldBeFalse();
    }

    /// <summary>
    /// Eski açık: şirkete özgü şartlar STK'da atlandığı için yalnız şirkete açık bir program
    /// derneğe "Şartları karşılıyor" görünüyordu. Tür şartı artık bunu kapatır.
    /// </summary>
    [Fact]
    public void Sirket_Sartlari_Atlanan_Dernek_Artik_Uygun_Gorunmez()
    {
        var grant = OnlyFor(OrganizationType.Sirket);
        grant.EligibleCompanySizes = (int)CompanySize.Kucuk;
        grant.MinRevenue = 1_000_000m;

        var result = _m.Evaluate(new FirmSignals { Type = OrganizationType.Dernek }, grant, NoTags, Today);

        result.Rules.Select(r => r.Rule).ShouldBe(new[] { GrantEligibilityRule.OrganizationType });
        result.Bucket.ShouldBe(GrantEligibilityBucket.UygunDegil);
    }

    [Fact]
    public void Turu_Listede_Olan_Stk_Gecer()
    {
        var grant = OnlyFor(OrganizationType.Dernek, OrganizationType.Vakif, OrganizationType.Kooperatif);

        Outcome(_m.Evaluate(new FirmSignals { Type = OrganizationType.Kooperatif }, grant, NoTags, Today),
            GrantEligibilityRule.OrganizationType).ShouldBe(GrantRuleOutcome.Passed);
        Outcome(_m.Evaluate(new FirmSignals { Type = OrganizationType.Kulup }, grant, NoTags, Today),
            GrantEligibilityRule.OrganizationType).ShouldBe(GrantRuleOutcome.Failed);
    }

    /// <summary>Türü bilinmeyen kurum (hibe profili yok, kurum türünün karşılığı yok) elenmez, Koşullu kalır.</summary>
    [Fact]
    public void Turu_Bilinmeyen_Kurum_Elenmez_Kosullu_Kalir()
    {
        var grant = OnlyFor(OrganizationType.Sirket);

        var result = _m.Evaluate(new FirmSignals { IsTypeKnown = false }, grant, NoTags, Today);

        Outcome(result, GrantEligibilityRule.OrganizationType).ShouldBe(GrantRuleOutcome.Unknown);
        result.Bucket.ShouldBe(GrantEligibilityBucket.Kosullu);
        result.IsExcludedByApplicantType.ShouldBeFalse();
    }

    /// <summary>Platforma kapalı program (yalnız birey/okul/kamu başvurur) türü bilinmese de herkesi eler.</summary>
    [Theory]
    [InlineData(OrganizationType.Sirket, true)]
    [InlineData(OrganizationType.Dernek, true)]
    [InlineData(OrganizationType.Sirket, false)]
    public void Platforma_Kapali_Program_Her_Kurumu_Eler(OrganizationType type, bool typeKnown)
    {
        var grant = Program();
        grant.ClosedToPlatformApplicants = true;

        var result = _m.Evaluate(new FirmSignals { Type = type, IsTypeKnown = typeKnown }, grant, NoTags, Today);

        Outcome(result, GrantEligibilityRule.OrganizationType).ShouldBe(GrantRuleOutcome.Failed);
        result.IsExcludedByApplicantType.ShouldBeTrue();
    }

    [Fact]
    public void Tur_Sarti_Yoksa_Kural_Uretilmez()
    {
        var result = _m.Evaluate(new FirmSignals { Type = OrganizationType.Dernek }, Program(), NoTags, Today);

        result.Rules.ShouldBeEmpty();
    }

    [Fact]
    public void Tur_Maskesi_Enum_Degerinden_Bit_Kaydirir()
    {
        OrganizationType.Sirket.ToMaskBit().ShouldBe(1);
        OrganizationType.Kooperatif.ToMaskBit().ShouldBe(32);
        OrganizationTypeExtensions.TypesIn(2 | 8).ShouldBe(new[] { OrganizationType.Dernek, OrganizationType.Vakif });
        OrganizationType.Kulup.IsAllowedBy(0).ShouldBeTrue();
    }
}
