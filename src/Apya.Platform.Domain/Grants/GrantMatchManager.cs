using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Projects;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// Kural-bazlı firma↔program uyum skoru (0-100). B2: bütçe-uyumu + kategori-uyumu
/// boyutları proje geçmişinden eklendi (veri yoksa atlanır). 4b: boyutlar artık
/// AĞIRLIKLI — ağırlık verilmezse <see cref="GrantMatchWeightSet.Default"/> kullanılır ve
/// sonuç ağırlıksız dönemle birebir aynı kalır. Saf hesap, kalıcılık yok.
/// </summary>
public class GrantMatchManager : DomainService
{
    public int Score(
        FirmSignals firm,
        Grant grant,
        IReadOnlyList<GrantCriteriaTag> grantTags,
        GrantMatchWeightSet? weights = null)
        => Explain(firm, grant, grantTags, weights).Total;

    /// <summary>
    /// Skoru VE boyut kırılımını döner. <see cref="Score"/> bunun yalnız toplamıdır —
    /// tek hesap, iki yüzey: kiracı detayındaki (1e) uyum barları ve host önizlemeleri
    /// aynı sayıyı görsün diye ayrı bir formül YOK.
    /// </summary>
    public GrantScoreBreakdown Explain(
        FirmSignals firm,
        Grant grant,
        IReadOnlyList<GrantCriteriaTag> grantTags,
        GrantMatchWeightSet? weights = null)
    {
        var w = weights ?? GrantMatchWeightSet.Default;
        var byKind = grantTags.GroupBy(t => t.Kind).ToList();
        var dims = new List<(GrantMatchDimension Dimension, double Value, double Weight)>();

        double baseScore;
        if (byKind.Count == 0)
        {
            baseScore = 0; // hedeflenmemiş program eşleşmez (host etiketlemeli)
        }
        else
        {
            var firmByKind = firm.Tags
                .GroupBy(t => t.Kind)
                .ToDictionary(g => g.Key, g => g.Select(x => Norm(x.Value)).ToHashSet());

            // (boyut, değer, ağırlık) üçlüleri; skor bunların ağırlıklı ortalamasıdır.
            // Boyut etiketi kırılım için taşınır — bir boyut birden çok kez katkı verebilir
            // (örn. sektör + NACE etiket grupları ikisi de Sector'a düşer).
            void Add(GrantMatchDimension dimension, bool grantRequires, bool firmHasData, Func<double> value)
            {
                if (!w.IsEnabled(dimension))
                {
                    return; // çarpanı 0 olan boyut ("kapalı") skora hiç girmez
                }
                if (firmHasData)
                {
                    dims.Add((dimension, value(), w[dimension]));
                }
                else if (grantRequires && !w.SkipMissingDimensions)
                {
                    // "Veri yoksa boyutu atla" kapalıysa eksik veri CEZA olur.
                    dims.Add((dimension, 0, w[dimension]));
                }
            }

            foreach (var g in byKind)
            {
                var dimension = DimensionOf(g.Key);
                if (!w.IsEnabled(dimension))
                {
                    continue;
                }
                var grantValues = g.Select(x => Norm(x.Value)).ToHashSet();
                var firmValues = firmByKind.TryGetValue(g.Key, out var fv) ? fv : new HashSet<string>();
                var matched = grantValues.Count(v => firmValues.Contains(v));
                dims.Add((dimension, grantValues.Count == 0 ? 0 : (double)matched / grantValues.Count, w[dimension]));
            }

            // --- Proje geçmişi (B2) ---
            Add(GrantMatchDimension.ProjectHistory,
                grantRequires: grant.MaxAmount > 0,
                firmHasData: firm.TypicalProjectBudget is > 0 && grant.MaxAmount > 0,
                value: () => firm.TypicalProjectBudget!.Value <= grant.MaxAmount!.Value
                    ? 1.0
                    : Math.Min(1.0, (double)(grant.MaxAmount!.Value / firm.TypicalProjectBudget.Value)));

            // Kategori uyumu programın bir ŞARTI değil; verisi yoksa daima atlanır.
            Add(GrantMatchDimension.ProjectHistory,
                grantRequires: false,
                firmHasData: firm.DominantCategory.HasValue,
                value: () => firm.DominantCategory!.Value == ProjectCategory.GrantProject ? 1.0 : 0.5);

            // --- 4b ile gelen iki yeni boyut ---
            // İkisi de yalnız program şart koyuyorsa ve firma veriyi girdiyse devreye girer;
            // bu yüzden mevcut kataloğun skorlarını değiştirmezler.
            var trlRequired = grant.MinTrl.HasValue || grant.MaxTrl.HasValue;
            Add(GrantMatchDimension.TechnicalMaturity,
                grantRequires: trlRequired,
                firmHasData: trlRequired && firm.Trl.HasValue,
                value: () => InRange(firm.Trl!.Value, grant.MinTrl, grant.MaxTrl) == GrantRuleOutcome.Passed ? 1.0 : 0.0);

            Add(GrantMatchDimension.RdStaff,
                grantRequires: grant.MinRdStaffCount.HasValue,
                firmHasData: grant.MinRdStaffCount.HasValue && firm.RdStaffCount.HasValue,
                value: () => firm.RdStaffCount!.Value >= grant.MinRdStaffCount!.Value ? 1.0 : 0.0);

            var totalWeight = dims.Sum(d => d.Weight);
            baseScore = totalWeight <= 0 ? 0 : dims.Sum(d => d.Value * d.Weight) / totalWeight * 100.0;
        }

        var sizeOk = grant.EligibleCompanySizes == 0
                     || firm.Size == null
                     || ((int)firm.Size.Value & grant.EligibleCompanySizes) != 0;

        var penaltyApplied = !sizeOk && w.SizePenaltyEnabled;
        var score = penaltyApplied ? baseScore * 0.3 : baseScore;

        // Aynı boyuta birden çok katkı düşebilir; kırılımda kendi içlerinde ağırlıklı
        // ortalamaları alınır ki bar 0-100 aralığında tek bir değer göstersin.
        var breakdown = dims
            .GroupBy(d => d.Dimension)
            .Select(g => new GrantScoreDimension(
                g.Key,
                (int)Math.Round(g.Sum(x => x.Value * x.Weight) / g.Sum(x => x.Weight) * 100.0),
                g.First().Weight))
            .OrderBy(d => d.Dimension)
            .ToList();

        return new GrantScoreBreakdown(
            (int)Math.Round(Math.Clamp(score, 0, 100)),
            breakdown,
            penaltyApplied);
    }

    public bool IsRecommended(
        FirmSignals firm,
        Grant grant,
        IReadOnlyList<GrantCriteriaTag> grantTags,
        GrantMatchWeightSet? weights = null)
        => Score(firm, grant, grantTags, weights) >= grant.MinMatchScore;

    /// <summary>Etiket türünün hangi ağırlık boyutuna düştüğü (4b listesi).</summary>
    private static GrantMatchDimension DimensionOf(GrantCriteriaKind kind) => kind switch
    {
        GrantCriteriaKind.Bolge => GrantMatchDimension.Region,
        GrantCriteriaKind.AnahtarKelime => GrantMatchDimension.Keyword,
        _ => GrantMatchDimension.Sector // Sektor + NaceKodu aynı boyutta
    };

    /// <summary>
    /// Programın uygunluk şartlarını firma sinyalleriyle tek tek karşılaştırır (1b · Canlı Eşleşme).
    /// <see cref="Score"/>'dan BAĞIMSIZDIR: skor benzerlik ölçer, bu metot sert elemeyi ölçer.
    /// Program bir şart tanımlamamışsa o kural sonuca hiç girmez; firmada karşılığı yoksa
    /// <see cref="GrantRuleOutcome.Unknown"/> döner ve firmayı ELEMEZ.
    /// </summary>
    /// <param name="today">
    /// Şirket yaşı hesabının referans günü. ARCH-049 gereği IClock burada okunmaz —
    /// çağıran <c>Clock.Now.Date</c> geçirir; metot saf kalır ve DI'sız test edilebilir.
    /// </param>
    public GrantEligibilityResult Evaluate(FirmSignals firm, Grant grant, DateTime today)
    {
        var rules = new List<GrantRuleResult>();

        if (grant.EligibleCompanySizes != 0)
        {
            rules.Add(new GrantRuleResult(GrantEligibilityRule.CompanySize,
                firm.Size == null
                    ? GrantRuleOutcome.Unknown
                    : ((int)firm.Size.Value & grant.EligibleCompanySizes) != 0
                        ? GrantRuleOutcome.Passed
                        : GrantRuleOutcome.Failed));
        }

        if (grant.MinCompanyAgeYears.HasValue || grant.MaxCompanyAgeYears.HasValue)
        {
            rules.Add(new GrantRuleResult(GrantEligibilityRule.CompanyAge,
                firm.FoundedOn == null
                    ? GrantRuleOutcome.Unknown
                    : InRange(CompanyAgeInYears(firm.FoundedOn.Value, today), grant.MinCompanyAgeYears, grant.MaxCompanyAgeYears)));
        }

        if (grant.MinTrl.HasValue || grant.MaxTrl.HasValue)
        {
            rules.Add(new GrantRuleResult(GrantEligibilityRule.Trl,
                firm.Trl == null
                    ? GrantRuleOutcome.Unknown
                    : InRange(firm.Trl.Value, grant.MinTrl, grant.MaxTrl)));
        }

        if (grant.MinStaffCount.HasValue)
        {
            rules.Add(new GrantRuleResult(GrantEligibilityRule.StaffCount,
                firm.StaffCount == null
                    ? GrantRuleOutcome.Unknown
                    : InRange(firm.StaffCount.Value, grant.MinStaffCount, null)));
        }

        if (grant.MinRdStaffCount.HasValue)
        {
            rules.Add(new GrantRuleResult(GrantEligibilityRule.RdStaffCount,
                firm.RdStaffCount == null
                    ? GrantRuleOutcome.Unknown
                    : InRange(firm.RdStaffCount.Value, grant.MinRdStaffCount, null)));
        }

        if (grant.MinRevenue.HasValue || grant.MaxRevenue.HasValue)
        {
            rules.Add(new GrantRuleResult(GrantEligibilityRule.Revenue,
                firm.AnnualRevenue == null
                    ? GrantRuleOutcome.Unknown
                    : ((grant.MinRevenue.HasValue && firm.AnnualRevenue.Value < grant.MinRevenue.Value)
                       || (grant.MaxRevenue.HasValue && firm.AnnualRevenue.Value > grant.MaxRevenue.Value))
                        ? GrantRuleOutcome.Failed
                        : GrantRuleOutcome.Passed));
        }

        if (grant.RequiresConsortium)
        {
            rules.Add(new GrantRuleResult(GrantEligibilityRule.Consortium,
                firm.HasConsortiumPartner == null
                    ? GrantRuleOutcome.Unknown
                    : firm.HasConsortiumPartner.Value
                        ? GrantRuleOutcome.Passed
                        : GrantRuleOutcome.Failed));
        }

        return new GrantEligibilityResult(rules);
    }

    /// <summary>Kuruluş tarihinden bugüne TAM yıl. Doğum günü hesabı — 364 gün 0 yıl sayılır.</summary>
    private static int CompanyAgeInYears(DateTime foundedOn, DateTime today)
    {
        today = today.Date;
        var years = today.Year - foundedOn.Year;
        if (foundedOn.Date > today.AddYears(-years))
        {
            years--;
        }
        return years < 0 ? 0 : years;
    }

    private static GrantRuleOutcome InRange(int value, int? min, int? max)
        => (min.HasValue && value < min.Value) || (max.HasValue && value > max.Value)
            ? GrantRuleOutcome.Failed
            : GrantRuleOutcome.Passed;

    private static string Norm(string s) => (s ?? string.Empty).Trim().ToLowerInvariant();
}
