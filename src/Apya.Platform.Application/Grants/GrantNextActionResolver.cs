using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

/// <summary>
/// "Sıradaki iş kimde" kuralı — Başvurularım (6a) ve Bugün (11a) aynı cevabı vermeli.
/// İki ekranda iki ayrı kural olsaydı firma aynı başvuru için iki farklı cümle görürdü.
/// </summary>
internal static class GrantNextActionResolver
{
    /// <summary>Proje özeti (3 alan) + açık harcama kalemleri üzerinden boş alan sayısı.</summary>
    public static int CountEmptyFields(
        GrantApplication application,
        List<GrantApplicationBudgetLine> lines,
        List<GrantEligibleCostItem> costItems)
    {
        var empty = 0;
        if (application.ProjectTitle.IsNullOrWhiteSpace()) { empty++; }
        if (application.ProjectSummary.IsNullOrWhiteSpace()) { empty++; }
        if (application.ProjectDurationMonths == null) { empty++; }

        var filled = lines.Count(l => l.Amount > 0);
        empty += System.Math.Max(0, costItems.Count - filled);
        return empty;
    }

    /// <summary>
    /// Sıradaki iş: önce kapanmış/proje durumları, sonra firmadan bekleneni,
    /// en sonda karşı tarafı söyler. Firma kendi işini en üstte görmeli.
    /// </summary>
    public static (GrantNextAction Action, int Value) Resolve(
        GrantApplication application, int missingDocuments, int emptyFields)
    {
        if (application.ProjectId.HasValue) { return (GrantNextAction.InProject, 0); }
        if (application.Stage == GrantApplicationStage.Odeme) { return (GrantNextAction.Done, 0); }

        if (application.SubmittedAt.HasValue)
        {
            // Gönderildikten sonra top kurumdadır; firmanın yapacağı bir şey yok.
            return (GrantNextAction.WaitingOnInstitution, 0);
        }

        if (application.PendingParty == GrantPartyRole.Danisman)
        {
            return (GrantNextAction.WaitingOnConsultant, missingDocuments);
        }

        if (missingDocuments > 0) { return (GrantNextAction.UploadDocuments, missingDocuments); }
        if (emptyFields > 0) { return (GrantNextAction.CompleteForm, emptyFields); }

        return (GrantNextAction.WaitingOnConsultant, 0);
    }
}
