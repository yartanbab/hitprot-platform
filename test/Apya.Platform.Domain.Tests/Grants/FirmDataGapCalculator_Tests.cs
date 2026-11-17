using System;
using System.Collections.Generic;
using System.Linq;
using Shouldly;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// Eksik veri önceliklendirmesi: kullanıcıdan her şey istenmez; en çok açık çağrıyı
/// ölçülebilir yapacak bilgi başa gelir ve sayı tahmin değil sayımdır.
/// </summary>
public class FirmDataGapCalculator_Tests
{
    private static readonly DateTime Today = new(2026, 11, 14);
    private static readonly Guid Tenant = Guid.NewGuid();

    private readonly FirmDataGapCalculator _calculator = new(new GrantMatchManager());
    private readonly IReadOnlyList<FirmParameterDefinition> _catalog = FirmParameterCatalog.Build();

    private static FirmDataOpenCall Call(Action<Grant>? configure = null, params (GrantCriteriaKind Kind, string Value)[] tags)
    {
        var grant = new Grant(Guid.NewGuid(), "Program", "Kurum", 0m, 0);
        configure?.Invoke(grant);
        return new FirmDataOpenCall(grant, tags.Select(t => new GrantCriteriaTag(Guid.NewGuid(), grant.Id, t.Kind, t.Value)).ToList());
    }

    private IReadOnlyList<FirmDataGap> Gaps(
        FirmProfile? profile,
        FirmSignals signals,
        IReadOnlyList<FirmDataOpenCall> calls,
        params FirmParameterValue[] values)
        => _calculator.Calculate(_catalog, values.ToDictionary(v => v.DefinitionId), profile, signals, calls, Today);

    private FirmParameterDefinition Definition(string code) => _catalog.Single(d => d.Code == code);

    private FirmParameterValue Cofinancing(decimal amount, DateTime at)
        => new(Guid.NewGuid(), Tenant, Definition("cofinancing_capacity"),
            new FirmParameterInput(Number: amount), FirmParameterOrigin.UserEntry, at);

    [Fact]
    public void Es_finansman_isteyen_her_cagri_kapasite_eksikken_sayilir()
    {
        var calls = new[]
        {
            Call(g => g.SupportRatePercent = 75),
            Call(g => g.SupportRatePercent = 50),
            Call(g => g.SupportRatePercent = 100), // tamamı destek: kurumdan pay beklenmez
            Call()                                 // oranı bilinmiyor: sayılmaz
        };

        var gap = Gaps(null, new FirmSignals(), calls).Single(g => g.Definition.Code == "cofinancing_capacity");

        gap.UnlockCount.ShouldBe(2);
        gap.IsStale.ShouldBeFalse();
    }

    [Fact]
    public void Sifir_girilmis_kapasite_eksik_degildir()
    {
        var calls = new[] { Call(g => g.SupportRatePercent = 75) };

        Gaps(null, new FirmSignals(), calls, Cofinancing(0m, Today))
            .ShouldNotContain(g => g.Definition.Code == "cofinancing_capacity", "sıfır bir cevaptır, bilinmeyen değil");
    }

    [Fact]
    public void Suresi_dolan_deger_guncel_degil_diye_yeniden_istenir()
    {
        var calls = new[] { Call(g => g.SupportRatePercent = 75) };

        // Eş finansman kapasitesi 6 ay geçerli.
        var gap = Gaps(null, new FirmSignals(), calls, Cofinancing(100_000m, Today.AddMonths(-7)))
            .Single(g => g.Definition.Code == "cofinancing_capacity");

        gap.IsStale.ShouldBeTrue();
        gap.UnlockCount.ShouldBe(1);
    }

    [Fact]
    public void Uygunluk_sarti_olculemeyen_cagrilar_ilgili_bilgiye_sayilir()
    {
        var profile = new FirmProfile(Guid.NewGuid(), Tenant);
        var calls = new[]
        {
            Call(g => g.EligibleCompanySizes = (int)CompanySize.Kucuk),
            Call(g => g.EligibleCompanySizes = (int)CompanySize.Orta),
            Call(g => g.MaxCompanyAgeYears = 5),
            Call()
        };

        var gaps = Gaps(profile, new FirmSignals(), calls);

        gaps.Single(g => g.Definition.Code == "company_size").UnlockCount.ShouldBe(2);
        gaps.Single(g => g.Definition.Code == "founded_on").UnlockCount.ShouldBe(1);
        gaps.Single(g => g.Definition.Code == "trl").UnlockCount.ShouldBe(0, "hiçbir açık çağrı TRL şartı koymuyor");
    }

    [Fact]
    public void Girilmis_bilgi_listede_yer_almaz()
    {
        var profile = new FirmProfile(Guid.NewGuid(), Tenant) { Size = CompanySize.Kucuk };
        var signals = new FirmSignals { Size = CompanySize.Kucuk };
        var calls = new[] { Call(g => g.EligibleCompanySizes = (int)CompanySize.Kucuk) };

        Gaps(profile, signals, calls).ShouldNotContain(g => g.Definition.Code == "company_size");
    }

    [Fact]
    public void Etiket_bilgisi_o_turde_etiket_tasiyan_cagrilara_sayilir()
    {
        var calls = new[]
        {
            Call(null, (GrantCriteriaKind.Sektor, "Yazılım"), (GrantCriteriaKind.AnahtarKelime, "yapay zekâ")),
            Call(null, (GrantCriteriaKind.Sektor, "Tarım")),
            Call(null, (GrantCriteriaKind.Bolge, "Ankara"))
        };

        var gaps = Gaps(new FirmProfile(Guid.NewGuid(), Tenant), new FirmSignals(), calls);

        gaps.Single(g => g.Definition.Code == "sectors").UnlockCount.ShouldBe(2);
        gaps.Single(g => g.Definition.Code == "keywords").UnlockCount.ShouldBe(1);
        gaps.Single(g => g.Definition.Code == "regions").UnlockCount.ShouldBe(1, "il şartı olan çağrı, il bilinmeden ölçülemez");
    }

    [Fact]
    public void En_cok_cagriyi_olculebilir_yapan_bilgi_basa_gelir()
    {
        var calls = new[]
        {
            Call(g => g.SupportRatePercent = 75, (GrantCriteriaKind.Sektor, "Yazılım")),
            Call(g => g.SupportRatePercent = 75, (GrantCriteriaKind.Sektor, "Yazılım")),
            Call(g => { g.SupportRatePercent = 75; g.EligibleCompanySizes = (int)CompanySize.Kucuk; })
        };

        var gaps = Gaps(new FirmProfile(Guid.NewGuid(), Tenant), new FirmSignals(), calls);

        gaps[0].Definition.Code.ShouldBe("cofinancing_capacity"); // 3 çağrı
        gaps[1].Definition.Code.ShouldBe("sectors");              // 2 çağrı
        gaps.Select(g => g.UnlockCount).ShouldBe(gaps.Select(g => g.UnlockCount).OrderByDescending(c => c));
    }

    [Fact]
    public void Kurum_turune_uymayan_ve_kullanicinin_giremeyecegi_bilgi_istenmez()
    {
        var ngo = new FirmProfile(Guid.NewGuid(), Tenant) { Type = OrganizationType.Dernek };
        var signals = new FirmSignals { Type = OrganizationType.Dernek };

        var codes = Gaps(ngo, signals, Array.Empty<FirmDataOpenCall>()).Select(g => g.Definition.Code).ToList();

        codes.ShouldNotContain("company_size", "ölçek şirkete özgüdür");
        codes.ShouldNotContain("typical_project_budget", "hesaplanan sinyal kullanıcıdan istenemez");
        codes.ShouldContain("thematic_areas");
    }

    // --- Hibe profili yüzdesi: kataloğa göre ---

    private FirmProfileCompleteness Completeness(
        FirmProfile? profile, OrganizationType type, IReadOnlyList<FirmDataOpenCall> calls, params GrantCriteriaKind[] tagKinds)
        => _calculator.CalculateProfileCompleteness(_catalog, profile, tagKinds, type, calls, Today);

    [Fact]
    public void Hicbir_acik_programin_istemedigi_bilgi_yuzdeyi_dusurmez()
    {
        // Programlar yalnız ölçek ve il soruyor; TRL, ciro, personel hiç sorulmuyor.
        var calls = new[]
        {
            Call(g => g.EligibleCompanySizes = (int)CompanySize.Kucuk),
            Call(null, (GrantCriteriaKind.Bolge, "Ankara"))
        };
        var profile = new FirmProfile(Guid.NewGuid(), Tenant) { Size = CompanySize.Kucuk };

        var result = Completeness(profile, OrganizationType.Sirket, calls);

        result.MeasuredCount.ShouldBe(2, "ölçek ve il");
        result.FilledCount.ShouldBe(1);
        result.Percent.ShouldBe(50);
        result.MissingCount.ShouldBe(1);
    }

    [Fact]
    public void Programin_eledigi_il_yuzdeye_girer()
    {
        var calls = new[]
        {
            Call(g => g.EligibleCompanySizes = (int)CompanySize.Kucuk),
            Call(null, (GrantCriteriaKind.Bolge, "Ankara"))
        };
        var profile = new FirmProfile(Guid.NewGuid(), Tenant) { Size = CompanySize.Kucuk };

        Completeness(profile, OrganizationType.Sirket, calls, GrantCriteriaKind.Bolge).Percent.ShouldBe(100);
    }

    [Fact]
    public void Acik_cagri_yoksa_bos_profil_tamam_gorunmez()
    {
        var result = Completeness(null, OrganizationType.Sirket, Array.Empty<FirmDataOpenCall>());

        result.MeasuredCount.ShouldBeGreaterThan(0, "kurum türüne uyan bütün profil bilgileri sayılır");
        result.Percent.ShouldBe(0);
    }

    [Fact]
    public void Stk_da_sirket_sartlari_sayilmaz()
    {
        var calls = new[]
        {
            Call(g => g.EligibleCompanySizes = (int)CompanySize.Kucuk, (GrantCriteriaKind.TematikAlan, nameof(GrantThematicArea.Egitim)))
        };

        var result = Completeness(null, OrganizationType.Dernek, calls, GrantCriteriaKind.TematikAlan);

        result.MeasuredCount.ShouldBe(1, "ölçek şartı STK'ya uygulanmaz; yalnız tematik alan");
        result.Percent.ShouldBe(100);
    }
}
