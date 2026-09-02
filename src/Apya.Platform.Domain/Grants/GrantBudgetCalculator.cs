using System;
using System.Collections.Generic;
using System.Linq;

namespace Apya.Platform.Grants;

/// <summary>
/// 2a · Başvuru bütçesinden destek tutarını hesaplar. Kural sırası:
/// 1) kalem tutarı × programın destek oranı,
/// 2) kalemin kendi üst limiti (toplam proje bütçesinin %N'i) aşılırsa destek o limite kırpılır,
/// 3) toplam destek programın üst limitini aşarsa toplam da kırpılır.
///
/// DI YOK — <see cref="GrantDifficultyCalculator"/> ile aynı idiom: sınıf saf hesaptır,
/// çağıran veriyi taşır. Böylece test host'u olmadan doğrudan test edilir.
/// </summary>
public static class GrantBudgetCalculator
{
    public sealed record LineInput(GrantCostItemKind Kind, decimal Amount, int? LimitPercent);

    public sealed record LineResult(
        GrantCostItemKind Kind,
        decimal Amount,
        int? LimitPercent,
        decimal SupportAmount,
        bool LimitApplied);

    public sealed record BudgetResult(
        IReadOnlyList<LineResult> Lines,
        decimal TotalProject,
        decimal TotalSupport,
        decimal OwnContribution,
        bool CapApplied,
        decimal? MaxAmount)
    {
        /// <summary>Talebin program üst limitine oranı (%) — üst limit yoksa null.</summary>
        public int? SupportShareOfCapPercent =>
            MaxAmount is > 0 ? (int)Math.Round(TotalSupport / MaxAmount.Value * 100m) : null;
    }

    /// <param name="supportRatePercent">Programın destek oranı; null ise destek hesaplanmaz (0).</param>
    /// <param name="maxAmount">Programın destek üst limiti; null ise tavan uygulanmaz.</param>
    public static BudgetResult Calculate(
        IEnumerable<LineInput> lines,
        int? supportRatePercent,
        decimal? maxAmount)
    {
        var list = lines.ToList();
        var totalProject = list.Sum(l => l.Amount);
        var rate = (supportRatePercent ?? 0) / 100m;

        var results = new List<LineResult>(list.Count);
        foreach (var line in list)
        {
            var support = Math.Round(line.Amount * rate, 2);
            var limitApplied = false;

            // Kalem limiti TOPLAM PROJE bütçesine göre okunur (çağrı metinlerindeki
            // "makine gideri toplam bütçenin %40'ını geçemez" ifadesinin karşılığı).
            if (line.LimitPercent is > 0 && totalProject > 0)
            {
                var lineCap = Math.Round(totalProject * line.LimitPercent.Value / 100m * rate, 2);
                if (support > lineCap)
                {
                    support = lineCap;
                    limitApplied = true;
                }
            }

            results.Add(new LineResult(line.Kind, line.Amount, line.LimitPercent, support, limitApplied));
        }

        var totalSupport = results.Sum(r => r.SupportAmount);
        var capApplied = false;

        if (maxAmount is > 0 && totalSupport > maxAmount.Value)
        {
            // Tavan toplamda uygulanır; kalem satırları oransal olarak kırpılır ki
            // satırların toplamı ekranda gösterilen toplamı tutsun.
            var factor = maxAmount.Value / totalSupport;
            results = results
                .Select(r => r with { SupportAmount = Math.Round(r.SupportAmount * factor, 2) })
                .ToList();
            totalSupport = maxAmount.Value;
            capApplied = true;
        }

        return new BudgetResult(
            results,
            totalProject,
            totalSupport,
            totalProject - totalSupport,
            capApplied,
            maxAmount);
    }
}
