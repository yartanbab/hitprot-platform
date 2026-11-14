using System;
using System.Collections.Generic;
using System.Linq;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// Kurum parametrelerine bağlı uygunluk şartları: eş finansman ve host'un programa eklediği
/// ölçütler. Bilinmeyen değer SIFIR sayılmaz — kurum elenmez, "Koşullu" olur.
/// </summary>
public class GrantParameterRule_Tests
{
    private static readonly DateTime Today = new(2026, 11, 14);
    private static readonly IReadOnlyList<GrantCriteriaTag> NoTags = Array.Empty<GrantCriteriaTag>();
    private static readonly IReadOnlyList<GrantParameterCriterion> NoCriteria = Array.Empty<GrantParameterCriterion>();

    private readonly GrantMatchManager _matcher = new();

    private static Grant Program(int? supportRate = null)
        => new(Guid.NewGuid(), "Program", "Kurum", 0m, 0) { SupportRatePercent = supportRate };

    private static FirmSignals Firm(params (Guid Id, FirmSignalParameter Value)[] parameters)
        => new() { Parameters = parameters.ToDictionary(p => p.Id, p => p.Value) };

    private static FirmSignalParameter Number(decimal value, bool stale = false) => new(value, null, null, Array.Empty<string>(), stale);
    private static FirmSignalParameter Flag(bool value) => new(null, null, value, Array.Empty<string>(), false);
    private static FirmSignalParameter Choices(params string[] values) => new(null, null, null, values, false);

    private static FirmParameterDefinition Definition(FirmParameterDataType type, params string[] options)
    {
        var definition = new FirmParameterDefinition(Guid.NewGuid(), "test_param", "Deneme", type, FirmParameterGroup.Finans);
        if (options.Length > 0)
        {
            definition.SetOptions(options);
        }
        return definition;
    }

    private static GrantParameterCriterion Criterion(
        FirmParameterDefinition definition, GrantParameterOperator op,
        decimal? number = null, string? text = null, bool? flag = null, bool eliminating = true)
        => new(Guid.NewGuid(), Guid.NewGuid(), definition, op, number, text, flag, eliminating);

    private static (Guid, FirmSignalParameter) Cofinancing(FirmSignalParameter value) => (FirmParameterCatalog.CofinancingCapacityId, value);

    // ---------- Eş finansman ----------

    [Fact]
    public void Es_finansman_isteyen_programda_kapasite_bilinmiyorsa_kurum_elenmez_kosullu_olur()
    {
        var result = _matcher.Evaluate(Firm(), Program(75), NoTags, Today, NoCriteria);

        result.ParameterRules.Single().Outcome.ShouldBe(GrantRuleOutcome.Unknown);
        result.Bucket.ShouldBe(GrantEligibilityBucket.Kosullu, "bilinmeyen kapasite sıfır sayılmaz");
        result.IsEligible.ShouldBeTrue();
        result.IsConfirmed.ShouldBeFalse();
        result.UnknownCount.ShouldBe(1);
    }

    [Fact]
    public void Es_finansman_ayiramayacagini_bildiren_kurum_elenir()
    {
        var result = _matcher.Evaluate(Firm(Cofinancing(Number(0))), Program(75), NoTags, Today, NoCriteria);

        result.Bucket.ShouldBe(GrantEligibilityBucket.UygunDegil);
        result.IsFixable.ShouldBeFalse();
    }

    [Fact]
    public void Kapasitesi_olan_kurum_gecer_suresi_dolan_kapasite_olculemez()
    {
        _matcher.Evaluate(Firm(Cofinancing(Number(50_000))), Program(75), NoTags, Today, NoCriteria)
            .Bucket.ShouldBe(GrantEligibilityBucket.Uygun);

        _matcher.Evaluate(Firm(Cofinancing(Number(50_000, stale: true))), Program(75), NoTags, Today, NoCriteria)
            .Bucket.ShouldBe(GrantEligibilityBucket.Kosullu, "güncel olmayan kapasiteye dayanılmaz");
    }

    [Theory]
    [InlineData(100)]
    [InlineData(null)]
    public void Tamami_destek_olan_ya_da_orani_bilinmeyen_programda_es_finansman_sarti_yoktur(int? rate)
    {
        _matcher.Evaluate(Firm(), Program(rate), NoTags, Today, NoCriteria).ParameterRules.ShouldBeEmpty();
    }

    [Fact]
    public void Olcut_listesi_verilmeyen_cagrida_parametre_sarti_hic_degerlendirilmez()
    {
        // Ziyaretçi testi, aday kaydı ve form önizlemesi kurumun parametrelerini taşımaz:
        // kapasite hiç sorulmadığı için her eş finansmanlı program "ölçülemez" görünmemeli.
        var result = _matcher.Evaluate(Firm(), Program(75), NoTags, Today);

        result.ParameterRules.ShouldBeEmpty();
        result.Bucket.ShouldBe(GrantEligibilityBucket.Uygun);
    }

    // ---------- Host'un eklediği ölçütler ----------

    [Fact]
    public void Sayi_olcutu_en_az_ve_en_fazla_karsilastirir()
    {
        var definition = Definition(FirmParameterDataType.Number);
        var atLeast = Criterion(definition, GrantParameterOperator.EnAz, number: 5);
        var atMost = Criterion(definition, GrantParameterOperator.EnFazla, number: 5);

        atLeast.Evaluate(Number(5)).ShouldBe(GrantRuleOutcome.Passed);
        atLeast.Evaluate(Number(4)).ShouldBe(GrantRuleOutcome.Failed);
        atLeast.Evaluate(Number(0)).ShouldBe(GrantRuleOutcome.Failed, "sıfır bir değerdir ve ölçülür");
        atMost.Evaluate(Number(6)).ShouldBe(GrantRuleOutcome.Failed);
        atLeast.Evaluate(null).ShouldBe(GrantRuleOutcome.Unknown);
        atLeast.Evaluate(Number(9, stale: true)).ShouldBe(GrantRuleOutcome.Unknown);
    }

    [Fact]
    public void Evet_hayir_ve_secim_olcutleri_karsilastirir()
    {
        var noDebt = Criterion(Definition(FirmParameterDataType.Boolean), GrantParameterOperator.Esit, flag: false);
        noDebt.Evaluate(Flag(false)).ShouldBe(GrantRuleOutcome.Passed);
        noDebt.Evaluate(Flag(true)).ShouldBe(GrantRuleOutcome.Failed);

        var contains = Criterion(Definition(FirmParameterDataType.MultiSelect, "Eğitim", "Çevre"), GrantParameterOperator.Icerir, text: "Çevre");
        contains.Evaluate(Choices("Eğitim", "Çevre")).ShouldBe(GrantRuleOutcome.Passed);
        contains.Evaluate(Choices("Eğitim")).ShouldBe(GrantRuleOutcome.Failed);
    }

    [Fact]
    public void Eleyici_olcut_tutmayinca_eler_uyari_olcutu_kovayi_degistirmez()
    {
        var definition = Definition(FirmParameterDataType.Number);
        var firm = Firm((definition.Id, Number(2)));

        var eliminating = _matcher.Evaluate(firm, Program(), NoTags, Today, new[] { Criterion(definition, GrantParameterOperator.EnAz, number: 5) });
        eliminating.Bucket.ShouldBe(GrantEligibilityBucket.UygunDegil);

        var advisory = _matcher.Evaluate(firm, Program(), NoTags, Today,
            new[] { Criterion(definition, GrantParameterOperator.EnAz, number: 5, eliminating: false) });
        advisory.Bucket.ShouldBe(GrantEligibilityBucket.Uygun);
        advisory.ParameterRules.Single().Outcome.ShouldBe(GrantRuleOutcome.Failed, "sonuç yine de görünür");
    }

    [Fact]
    public void Degeri_girilmemis_olcut_kurumu_kosullu_yapar()
    {
        var definition = Definition(FirmParameterDataType.Number);

        _matcher.Evaluate(Firm(), Program(), NoTags, Today, new[] { Criterion(definition, GrantParameterOperator.EnAz, number: 5) })
            .Bucket.ShouldBe(GrantEligibilityBucket.Kosullu);
    }

    // ---------- Ölçüt kuralları ----------

    [Fact]
    public void Olcut_yalniz_karsilastirilabilir_kullanici_parametresine_konur()
    {
        string CodeOf(Action action) => Should.Throw<BusinessException>(action).Code!;

        CodeOf(() => Criterion(Definition(FirmParameterDataType.LongText), GrantParameterOperator.Esit, text: "x"))
            .ShouldBe(PlatformDomainErrorCodes.GrantCriterionNotSupported);

        var system = new FirmParameterDefinition(Guid.NewGuid(), "trl", "TRL", FirmParameterDataType.Number, FirmParameterGroup.Kapasite, FirmParameterSystemKey.Trl);
        CodeOf(() => Criterion(system, GrantParameterOperator.EnAz, number: 4))
            .ShouldBe(PlatformDomainErrorCodes.GrantCriterionNotSupported, "TRL şartı programın kendi alanında durur");

        CodeOf(() => Criterion(Definition(FirmParameterDataType.Number), GrantParameterOperator.Icerir, number: 1))
            .ShouldBe(PlatformDomainErrorCodes.GrantCriterionOperatorInvalid);
        CodeOf(() => Criterion(Definition(FirmParameterDataType.Boolean), GrantParameterOperator.EnAz, flag: true))
            .ShouldBe(PlatformDomainErrorCodes.GrantCriterionOperatorInvalid);
        CodeOf(() => Criterion(Definition(FirmParameterDataType.Number), GrantParameterOperator.EnAz))
            .ShouldBe(PlatformDomainErrorCodes.GrantCriterionValueRequired);
        CodeOf(() => Criterion(Definition(FirmParameterDataType.Select, "A", "B"), GrantParameterOperator.Esit, text: "C"))
            .ShouldBe(PlatformDomainErrorCodes.GrantCriterionValueRequired);
    }
}
