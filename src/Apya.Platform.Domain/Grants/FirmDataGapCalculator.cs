using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.Grants;

/// <summary>Kurumun eksik ya da bayatlamış bir bilgisi ve tamamlanınca kaç açık çağrının ölçülebilir olacağı.</summary>
public sealed record FirmDataGap(FirmParameterDefinition Definition, bool IsStale, int UnlockCount);

/// <summary>Bir açık çağrının programı ve etiketleri.</summary>
public sealed record FirmDataOpenCall(Grant Grant, IReadOnlyList<GrantCriteriaTag> Tags);

/// <summary>
/// Kurumun hangi bilgisinin eksik olduğunu ve hangisini tamamlamanın en çok çağrıyı
/// değerlendirilebilir yapacağını hesaplar. Kullanıcıdan her şeyi doldurması istenmez:
/// liste faydaya göre sıralıdır.
///
/// <para>"Fayda" tahmin değil sayımdır: bir bilgi eksikken programın şartı ÖLÇÜLEMİYORSA
/// (uygunluk kuralı Unknown dönüyorsa ya da program o türde etiket taşıyorsa) o çağrı sayılır.
/// Saf hesap; kalıcılık yok.</para>
/// </summary>
public class FirmDataGapCalculator : DomainService
{
    private readonly GrantMatchManager _matcher;

    public FirmDataGapCalculator(GrantMatchManager matcher)
    {
        _matcher = matcher;
    }

    public IReadOnlyList<FirmDataGap> Calculate(
        IEnumerable<FirmParameterDefinition> definitions,
        IReadOnlyDictionary<Guid, FirmParameterValue> values,
        FirmProfile? profile,
        FirmSignals signals,
        IReadOnlyList<FirmDataOpenCall> openCalls,
        DateTime today)
    {
        // Her çağrı bir kez değerlendirilir; parametreler aynı sonucu okur.
        var unknownRulesByCall = openCalls
            .Select(c => _matcher.Evaluate(signals, c.Grant, c.Tags, today).Rules
                .Where(r => r.Outcome == GrantRuleOutcome.Unknown)
                .Select(r => r.Rule)
                .ToHashSet())
            .ToList();

        var gaps = new List<FirmDataGap>();
        foreach (var definition in definitions)
        {
            // Yalnız kurumun KENDİSİNİN girebileceği bilgi "eksik" sayılır; hesaplanan
            // sinyaller (tipik bütçe vb.) kullanıcıdan istenemez.
            if (!definition.IsActive
                || !definition.AllowedSources.HasFlag(FirmParameterSource.Kullanici)
                || (profile != null && !definition.AppliesTo(profile.Type)))
            {
                continue;
            }

            var stale = false;
            bool present;
            if (definition.SystemKey is { } key)
            {
                present = HasSystemValue(key, profile, signals);
            }
            else if (values.TryGetValue(definition.Id, out var value))
            {
                stale = value.IsStale(definition, today);
                present = !stale;
            }
            else
            {
                present = false;
            }

            if (!present)
            {
                gaps.Add(new FirmDataGap(definition, stale, CountUnlocked(definition, openCalls, unknownRulesByCall)));
            }
        }

        return gaps
            .OrderByDescending(g => g.UnlockCount)
            .ThenByDescending(g => g.Definition.Requirement)
            .ThenBy(g => g.Definition.Order)
            .ToList();
    }

    private static int CountUnlocked(
        FirmParameterDefinition definition,
        IReadOnlyList<FirmDataOpenCall> openCalls,
        IReadOnlyList<HashSet<GrantEligibilityRule>> unknownRulesByCall)
    {
        if (definition.Code == FirmParameterCatalog.CofinancingCapacityCode)
        {
            // Destek oranı %100'ün altındaysa kalan pay kurumdan beklenir.
            return openCalls.Count(c => c.Grant.SupportRatePercent is < 100);
        }

        if (definition.SystemKey is not { } key)
        {
            return 0;
        }

        if (RuleOf(key) is { } rule)
        {
            return unknownRulesByCall.Count(rules => rules.Contains(rule));
        }

        if (TagKindOf(key) is { } kind)
        {
            return openCalls.Count(c => c.Tags.Any(t => t.Kind == kind));
        }

        return 0;
    }

    private static bool HasSystemValue(FirmParameterSystemKey key, FirmProfile? profile, FirmSignals signals)
    {
        if (TagKindOf(key) is { } kind)
        {
            return signals.Tags.Any(t => t.Kind == kind);
        }
        if (key == FirmParameterSystemKey.Bolge)
        {
            return signals.Tags.Any(t => t.Kind == GrantCriteriaKind.Bolge);
        }

        return key switch
        {
            FirmParameterSystemKey.KurumTuru => profile != null,
            FirmParameterSystemKey.Olcek => profile?.Size != null,
            FirmParameterSystemKey.KurulusTarihi => profile?.FoundedOn != null,
            FirmParameterSystemKey.PersonelSayisi => profile?.StaffCount != null,
            FirmParameterSystemKey.ArgePersoneli => profile?.RdStaffCount != null,
            FirmParameterSystemKey.YillikCiro => profile?.AnnualRevenue != null,
            FirmParameterSystemKey.Trl => profile?.Trl != null,
            FirmParameterSystemKey.KonsorsiyumOrtagi => profile?.HasConsortiumPartner != null,
            FirmParameterSystemKey.StkEkipBandi => profile?.ProfessionalStaffBand != null,
            FirmParameterSystemKey.StkProjeDeneyimi => profile?.ProjectExperience != null,
            _ => true
        };
    }

    /// <summary>Bilgi eksikken "ölçülemiyor" dönen uygunluk kuralı.</summary>
    private static GrantEligibilityRule? RuleOf(FirmParameterSystemKey key) => key switch
    {
        FirmParameterSystemKey.Olcek => GrantEligibilityRule.CompanySize,
        FirmParameterSystemKey.KurulusTarihi => GrantEligibilityRule.CompanyAge,
        FirmParameterSystemKey.PersonelSayisi or FirmParameterSystemKey.StkEkipBandi => GrantEligibilityRule.StaffCount,
        FirmParameterSystemKey.ArgePersoneli => GrantEligibilityRule.RdStaffCount,
        FirmParameterSystemKey.YillikCiro => GrantEligibilityRule.Revenue,
        FirmParameterSystemKey.Trl => GrantEligibilityRule.Trl,
        FirmParameterSystemKey.KonsorsiyumOrtagi => GrantEligibilityRule.Consortium,
        FirmParameterSystemKey.Bolge => GrantEligibilityRule.Region,
        _ => null
    };

    /// <summary>Uyum puanına etiket örtüşmesiyle giren parametrelerin etiket türü.</summary>
    private static GrantCriteriaKind? TagKindOf(FirmParameterSystemKey key) => key switch
    {
        FirmParameterSystemKey.NaceKodu => GrantCriteriaKind.NaceKodu,
        FirmParameterSystemKey.Sektor => GrantCriteriaKind.Sektor,
        FirmParameterSystemKey.TematikAlan => GrantCriteriaKind.TematikAlan,
        FirmParameterSystemKey.AnahtarKelime => GrantCriteriaKind.AnahtarKelime,
        _ => null
    };
}
