using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Projects;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// Kural-bazlı firma↔program uyum skoru (0-100). B2: bütçe-uyumu + kategori-uyumu
/// boyutları proje geçmişinden eklendi (veri yoksa atlanır). Saf hesap, kalıcılık yok.
/// </summary>
public class GrantMatchManager : DomainService
{
    public int Score(FirmSignals firm, Grant grant, IReadOnlyList<GrantCriteriaTag> grantTags)
    {
        var byKind = grantTags.GroupBy(t => t.Kind).ToList();

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

            var dims = new List<double>();
            foreach (var g in byKind)
            {
                var grantValues = g.Select(x => Norm(x.Value)).ToHashSet();
                var firmValues = firmByKind.TryGetValue(g.Key, out var fv) ? fv : new HashSet<string>();
                var matched = grantValues.Count(v => firmValues.Contains(v));
                dims.Add(grantValues.Count == 0 ? 0 : (double)matched / grantValues.Count);
            }

            // B2: proje geçmişinden ek boyutlar — veri yoksa boyut tamamen atlanır (ceza yok).
            if (firm.TypicalProjectBudget is > 0 && grant.MaxAmount > 0)
            {
                dims.Add(firm.TypicalProjectBudget.Value <= grant.MaxAmount
                    ? 1.0
                    : Math.Min(1.0, (double)(grant.MaxAmount / firm.TypicalProjectBudget.Value)));
            }
            if (firm.DominantCategory.HasValue)
            {
                dims.Add(firm.DominantCategory.Value == ProjectCategory.GrantProject ? 1.0 : 0.5);
            }

            baseScore = dims.Average() * 100.0;
        }

        var sizeOk = grant.EligibleCompanySizes == 0
                     || firm.Size == null
                     || ((int)firm.Size.Value & grant.EligibleCompanySizes) != 0;

        var score = sizeOk ? baseScore : baseScore * 0.3;
        return (int)Math.Round(Math.Clamp(score, 0, 100));
    }

    public bool IsRecommended(FirmSignals firm, Grant grant, IReadOnlyList<GrantCriteriaTag> grantTags)
        => Score(firm, grant, grantTags) >= grant.MinMatchScore;

    private static string Norm(string s) => (s ?? string.Empty).Trim().ToLowerInvariant();
}
