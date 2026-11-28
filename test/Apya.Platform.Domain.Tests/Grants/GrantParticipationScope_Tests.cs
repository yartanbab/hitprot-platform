using System;
using System.Collections.Generic;
using System.Linq;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// 2026-11-28 eksik parametreler: Türkiye'den katılım, coğrafi kapsam, kayıtlı merkez ili ve çağrının
/// kapanış nedeni. Yeni alanlar boş (varsayılan) kaldığında eski davranış birebir korunmalı.
/// </summary>
public class GrantParticipationScope_Tests
{
    private readonly GrantMatchManager _m = new();
    private static readonly DateTime Today = new(2026, 11, 28);
    private static readonly IReadOnlyList<GrantCriteriaTag> NoTags = Array.Empty<GrantCriteriaTag>();

    private static Grant Program() => new(Guid.NewGuid(), "P", "K", 1_000_000m, 0);

    private static List<GrantCriteriaTag> Regions(Grant grant, params string[] provinces)
        => provinces.Select(p => new GrantCriteriaTag(Guid.NewGuid(), grant.Id, GrantCriteriaKind.Bolge, p)).ToList();

    private static FirmSignals Firm(string[]? provinces = null, string? headquarters = null, bool? partner = null)
    {
        var firm = new FirmSignals
        {
            HasConsortiumPartner = partner,
            Tags = (provinces ?? Array.Empty<string>()).Select(p => new FirmSignalTag(GrantCriteriaKind.Bolge, p)).ToList()
        };
        if (headquarters != null)
        {
            firm.Parameters = new Dictionary<Guid, FirmSignalParameter>
            {
                [FirmParameterCatalog.HeadquartersProvinceId] = new(null, headquarters, null, Array.Empty<string>(), false)
            };
        }
        return firm;
    }

    private static GrantRuleOutcome? Outcome(GrantEligibilityResult r, GrantEligibilityRule rule)
        => r.Rules.SingleOrDefault(x => x.Rule == rule)?.Outcome;

    [Fact]
    public void Yeni_Alanlar_Bosken_Kural_Uretilmez()
    {
        var result = _m.Evaluate(Firm(), Program(), NoTags, Today);

        result.Rules.ShouldBeEmpty();
    }

    [Theory]
    [InlineData(GrantTurkeyParticipation.UygunDegil)]
    [InlineData(GrantTurkeyParticipation.FonAlamaz)]
    public void Turkiye_Katilamiyorsa_Her_Kurum_Elenir(GrantTurkeyParticipation participation)
    {
        var grant = Program();
        grant.TurkeyParticipation = participation;

        var result = _m.Evaluate(Firm(), grant, NoTags, Today);

        Outcome(result, GrantEligibilityRule.CountryParticipation).ShouldBe(GrantRuleOutcome.Failed);
        result.IsEligible.ShouldBeFalse();
    }

    [Theory]
    [InlineData(GrantTurkeyParticipation.TamUygun)]
    [InlineData(GrantTurkeyParticipation.AsosiyeKosullu)]
    public void Turkiye_Uygunsa_Katilim_Kurali_Uretilmez(GrantTurkeyParticipation participation)
    {
        var grant = Program();
        grant.TurkeyParticipation = participation;

        Outcome(_m.Evaluate(Firm(), grant, NoTags, Today), GrantEligibilityRule.CountryParticipation).ShouldBeNull();
    }

    [Theory]
    [InlineData(true, GrantRuleOutcome.Passed)]
    [InlineData(false, GrantRuleOutcome.Failed)]
    [InlineData(null, GrantRuleOutcome.Unknown)]
    public void Yalniz_Ortak_Olarak_Katilim_Konsorsiyum_Sarti_Gibi_Olculur(bool? partner, GrantRuleOutcome expected)
    {
        var grant = Program();
        grant.TurkeyParticipation = GrantTurkeyParticipation.YalnizOrtak;

        Outcome(_m.Evaluate(Firm(partner: partner), grant, NoTags, Today), GrantEligibilityRule.Consortium).ShouldBe(expected);
    }

    [Fact]
    public void Il_Gerektiren_Kapsamda_Il_Girilmemisse_Bolge_Olculemez()
    {
        var grant = Program();
        grant.GeographicScope = GrantGeographicScope.IllerdeUygulama;

        var result = _m.Evaluate(Firm(new[] { "Ankara" }), grant, NoTags, Today);

        Outcome(result, GrantEligibilityRule.Region).ShouldBe(GrantRuleOutcome.Unknown);
        result.IsEligible.ShouldBeTrue();
        result.IsConfirmed.ShouldBeFalse();
    }

    [Fact]
    public void Turkiye_Geneli_Kapsamda_Il_Yoksa_Bolge_Kurali_Uretilmez()
    {
        var grant = Program();
        grant.GeographicScope = GrantGeographicScope.TurkiyeGeneli;

        Outcome(_m.Evaluate(Firm(new[] { "Ankara" }), grant, NoTags, Today), GrantEligibilityRule.Region).ShouldBeNull();
    }

    [Fact]
    public void Illerde_Yerlesik_Kapsamda_Kayitli_Merkez_Ili_Belirleyicidir()
    {
        var grant = Program();
        grant.GeographicScope = GrantGeographicScope.IllerdeYerlesik;
        var tags = Regions(grant, "Samsun");

        // Faaliyet ili tutsa da merkez başka ildeyse elenir.
        Outcome(_m.Evaluate(Firm(new[] { "Samsun" }, headquarters: "İstanbul"), grant, tags, Today), GrantEligibilityRule.Region)
            .ShouldBe(GrantRuleOutcome.Failed);
        Outcome(_m.Evaluate(Firm(new[] { "Ankara" }, headquarters: "samsun"), grant, tags, Today), GrantEligibilityRule.Region)
            .ShouldBe(GrantRuleOutcome.Passed);
    }

    [Fact]
    public void Merkez_Ili_Girilmemisse_Faaliyet_Illerine_Bakilir()
    {
        var grant = Program();
        grant.GeographicScope = GrantGeographicScope.IllerdeYerlesik;

        Outcome(_m.Evaluate(Firm(new[] { "Samsun" }), grant, Regions(grant, "Samsun"), Today), GrantEligibilityRule.Region)
            .ShouldBe(GrantRuleOutcome.Passed);
    }

    [Fact]
    public void Uygulama_Ili_Kapsaminda_Merkez_Ili_Okunmaz()
    {
        var grant = Program();
        grant.GeographicScope = GrantGeographicScope.IllerdeUygulama;

        Outcome(_m.Evaluate(Firm(new[] { "Samsun" }, headquarters: "İstanbul"), grant, Regions(grant, "Samsun"), Today), GrantEligibilityRule.Region)
            .ShouldBe(GrantRuleOutcome.Passed);
    }

    [Fact]
    public void Kapanis_Nedeni_Yalniz_Kapali_Cagriya_Yazilir()
    {
        var call = new GrantCall(Guid.NewGuid(), Guid.NewGuid(), "2026", GrantCallStatus.Acik);

        Should.Throw<BusinessException>(() => call.SetClosureReason(GrantCallClosureReason.IptalEdildi))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantCallClosureReasonNeedsClosed);

        call.Close();
        call.SetClosureReason(GrantCallClosureReason.ButceTukendi);
        call.ClosureReason.ShouldBe(GrantCallClosureReason.ButceTukendi);
    }

    [Fact]
    public void Cagri_Yeniden_Acilinca_Kapanis_Nedeni_Bosalir()
    {
        var call = new GrantCall(Guid.NewGuid(), Guid.NewGuid(), "2026", GrantCallStatus.Kapandi);
        call.SetClosureReason(GrantCallClosureReason.AskiyaAlindi);

        call.Publish();

        call.ClosureReason.ShouldBe(GrantCallClosureReason.Belirtilmemis);
    }

    [Fact]
    public void Merkez_Ili_Parametresi_Il_Listesini_Tasir()
    {
        var definition = FirmParameterCatalog.Build().Single(d => d.Id == FirmParameterCatalog.HeadquartersProvinceId);

        definition.Code.ShouldBe("headquarters_province");
        definition.GetOptions().Count.ShouldBe(TurkeyProvinces.All.Count);
    }

    [Theory]
    [InlineData("JPY")]
    [InlineData("CZK")]
    public void Genisletilen_Para_Birimi_Korunur(string code)
    {
        var grant = Program();
        grant.Currency = code;

        grant.Currency.ShouldBe(code);
        grant.TryMaxAmount.ShouldBeNull(); // döviz tavanı TL bütçeyle karşılaştırılmaz
    }
}
