using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.Grants;

/// <summary>Kurumun eksik ya da bayatlamış bir bilgisi ve tamamlanınca kaç açık çağrının ölçülebilir olacağı.</summary>
public sealed record FirmDataGap(FirmParameterDefinition Definition, bool IsStale, int UnlockCount);

/// <summary>
/// Hibe profilinin doluluğu: açık çağrıların ölçtüğü profil bilgilerinden kaçının girildiği.
/// Hiçbir açık çağrı profil bilgisi ölçmüyorsa kurum türüne uyan bütün profil bilgileri sayılır
/// (boş profil "%100" görünmesin).
/// </summary>
public sealed record FirmProfileCompleteness(int MeasuredCount, int FilledCount)
{
    public int MissingCount => MeasuredCount - FilledCount;

    public int Percent => MeasuredCount == 0 ? 100 : (int)Math.Round(FilledCount * 100.0 / MeasuredCount);
}

/// <summary>Bir açık çağrının programı ve etiketleri.</summary>
public sealed record FirmDataOpenCall(
    Grant Grant,
    IReadOnlyList<GrantCriteriaTag> Tags,
    IReadOnlyList<GrantParameterCriterion>? ParameterCriteria = null);

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
        DateTime today,
        OrganizationType? organizationType = null)
    {
        // Hibe profili kaydedilmemişse tür, kurum profilinden gelen öneridir (çağıran verir).
        // Hiç bilinmiyorsa hiçbir parametre gizlenmez.
        var type = profile?.Type ?? organizationType;
        // Her çağrı bir kez değerlendirilir; parametreler aynı sonucu okur.
        var evaluations = openCalls
            .Select(c => _matcher.Evaluate(signals, c.Grant, c.Tags, today, c.ParameterCriteria ?? Array.Empty<GrantParameterCriterion>()))
            .ToList();
        var unknownRulesByCall = evaluations
            .Select(e => e.Rules.Where(r => r.Outcome == GrantRuleOutcome.Unknown).Select(r => r.Rule).ToHashSet())
            .ToList();
        // Parametreye bağlı şartı (eş finansman ya da host'un eklediği ölçüt) ölçülemeyen çağrılar.
        var unknownParametersByCall = evaluations
            .Select(e => e.ParameterRules.Where(r => r.Outcome == GrantRuleOutcome.Unknown).Select(r => r.DefinitionId).ToHashSet())
            .ToList();

        var gaps = new List<FirmDataGap>();
        foreach (var definition in definitions)
        {
            // Yalnız kurumun KENDİSİNİN girebileceği bilgi "eksik" sayılır; hesaplanan
            // sinyaller (tipik bütçe vb.) kullanıcıdan istenemez.
            if (!definition.IsActive
                || !definition.AllowedSources.HasFlag(FirmParameterSource.Kullanici)
                || (type.HasValue && !definition.AppliesTo(type.Value)))
            {
                continue;
            }

            var stale = false;
            bool present;
            if (definition.SystemKey is { } key)
            {
                present = HasSystemValue(key, profile, kind => signals.Tags.Any(t => t.Kind == kind));
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
                gaps.Add(new FirmDataGap(definition, stale,
                    CountUnlocked(definition, openCalls, unknownRulesByCall, unknownParametersByCall)));
            }
        }

        return gaps
            .OrderByDescending(g => g.UnlockCount)
            .ThenByDescending(g => g.Definition.Requirement)
            .ThenBy(g => g.Definition.Order)
            .ToList();
    }

    /// <summary>
    /// Hibe profili yüzdesi — "Hangi bilgiyi girmeliyim?" paneliyle AYNI kaynaktan: bir profil
    /// bilgisi ancak en az bir açık çağrı onu ölçüyorsa (uygunluk şartı ya da etiket) sayılır.
    /// Hiçbir programın istemediği bilgi yüzdeyi düşürmez; 56 programı eleyen il gibi bilgi düşürür.
    ///
    /// <para>Kurumun kayıtlı değerleri değil verilen profil ve etiket türleri okunur: profil
    /// kaydedilirken etiketler henüz veritabanına yazılmamış olabilir.</para>
    /// </summary>
    public FirmProfileCompleteness CalculateProfileCompleteness(
        IEnumerable<FirmParameterDefinition> definitions,
        FirmProfile? profile,
        IReadOnlyCollection<GrantCriteriaKind> tagKinds,
        OrganizationType organizationType,
        IReadOnlyList<FirmDataOpenCall> openCalls,
        DateTime today)
    {
        // Profil bilgisi: değeri profilde ya da profil etiketlerinde yaşayan, kurumun girdiği,
        // eşleştirmeye giren (şart ya da etiket) tanımlar. Kurum türü her profilde vardır, sayılmaz.
        var fields = definitions
            .Where(d => d.IsActive
                        && d.SystemKey is { } key
                        && (RuleOf(key) != null || TagKindOf(key) != null)
                        && d.AllowedSources.HasFlag(FirmParameterSource.Kullanici)
                        && d.AppliesTo(organizationType))
            .ToList();

        // Programın ölçtüğü şartlar: kurum hiçbir şey girmemiş gibi değerlendirilir; programın
        // koyduğu her şart o zaman "ölçülemiyor" döner, koymadığı şart dönmez.
        var empty = new FirmSignals { Type = organizationType };
        var measuredRulesByCall = openCalls
            .Select(c => _matcher.Evaluate(empty, c.Grant, c.Tags, today, Array.Empty<GrantParameterCriterion>())
                .Rules.Where(r => r.Outcome == GrantRuleOutcome.Unknown).Select(r => r.Rule).ToHashSet())
            .ToList();
        var noParameters = openCalls.Select(_ => new HashSet<Guid>()).ToList();

        var measured = fields
            .Where(d => CountUnlocked(d, openCalls, measuredRulesByCall, noParameters) > 0)
            .ToList();
        if (measured.Count == 0)
        {
            measured = fields;
        }

        var filled = measured.Count(d => HasSystemValue(d.SystemKey!.Value, profile, kind => tagKinds.Contains(kind)));
        return new FirmProfileCompleteness(measured.Count, filled);
    }

    private static int CountUnlocked(
        FirmParameterDefinition definition,
        IReadOnlyList<FirmDataOpenCall> openCalls,
        IReadOnlyList<HashSet<GrantEligibilityRule>> unknownRulesByCall,
        IReadOnlyList<HashSet<Guid>> unknownParametersByCall)
    {
        if (definition.SystemKey is not { } key)
        {
            return unknownParametersByCall.Count(ids => ids.Contains(definition.Id));
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

    private static bool HasSystemValue(FirmParameterSystemKey key, FirmProfile? profile, Func<GrantCriteriaKind, bool> hasTag)
    {
        if (TagKindOf(key) is { } kind)
        {
            return hasTag(kind);
        }
        if (key == FirmParameterSystemKey.Bolge)
        {
            return hasTag(GrantCriteriaKind.Bolge);
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
