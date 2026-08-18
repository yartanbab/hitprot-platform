using System;
using System.Collections.Generic;
using System.Linq;

namespace Apya.Platform.Documents;

/// <summary>Hesap için gereken minimum belge alanları (AppService projeksiyonu doldurur).</summary>
public sealed record ComplianceDocument(
    Guid Id,
    string DisplayName,
    Guid? DocumentTypeId,
    Guid? WorkStepId,
    string? PeriodCode);

/// <summary>Bir kalemin kapsam tekrarı — iş adımı veya dönem örneği.</summary>
public sealed record ComplianceScopeInstance(
    Guid? WorkStepId,
    string? WorkStepName,
    int? WorkStepOrder,
    string? PeriodCode);

/// <summary>Tek bir kontrol listesi satırının hesaplanmış sonucu.</summary>
public sealed record ComplianceEvaluation(
    ComplianceRequirement Requirement,
    ComplianceScopeInstance Instance,
    ComplianceItemStatus Status,
    Guid? DocumentFileId,
    string? DocumentFileName,
    string? WaiveReason);

public sealed record ComplianceSummary(
    int TotalCount,
    int SatisfiedCount,
    int WaivedCount,
    int MissingCount,
    int BlockingMissingCount,
    int Percent);

/// <summary>
/// Uygunluk kontrol listesinin İŞ KURALI: bir kalemin kaç satır ürettiği, hangi
/// belgenin onu karşıladığı ve yüzdenin nasıl hesaplandığı.
///
/// Saf fonksiyonlar — veritabanı/servis bağımlılığı yok, doğrudan test edilebilir.
/// Durumlar SAKLANMAZ; her okumada buradan yeniden üretilir.
/// </summary>
public static class ComplianceCalculator
{
    /// <summary>
    /// Kalemin kapsamına göre kaç satır üreteceğini belirler.
    /// İş adımı kapsamlı bir kalem, projede hiç iş adımı yoksa TEK satır üretir —
    /// aksi halde zorunlu bir belge listeden sessizce kaybolurdu.
    /// </summary>
    public static IEnumerable<ComplianceScopeInstance> ExpandScope(
        ComplianceRequirement requirement,
        IReadOnlyList<(Guid Id, string Name, int Order)> workSteps,
        string? effectivePeriod)
    {
        switch (requirement.Scope)
        {
            case ComplianceScope.WorkStep when workSteps.Count > 0:
                foreach (var step in workSteps.OrderBy(s => s.Order))
                {
                    yield return new ComplianceScopeInstance(step.Id, step.Name, step.Order, null);
                }
                break;

            case ComplianceScope.Period:
                yield return new ComplianceScopeInstance(null, null, null, effectivePeriod);
                break;

            default:
                yield return new ComplianceScopeInstance(null, null, null, null);
                break;
        }
    }

    /// <summary>
    /// Kapsamı tutan ve doğru tipte olan ilk belgeyi bulur.
    /// Tipi olmayan kalem otomatik karşılanamaz: hangi belgenin onu karşıladığı
    /// ancak kullanıcı beyanıyla bilinebilir.
    /// </summary>
    public static ComplianceDocument? FindAutoMatch(
        ComplianceRequirement requirement,
        ComplianceScopeInstance instance,
        IReadOnlyList<ComplianceDocument> documents)
    {
        if (!requirement.DocumentTypeId.HasValue)
        {
            return null;
        }

        return documents.FirstOrDefault(d =>
            d.DocumentTypeId == requirement.DocumentTypeId
            && (instance.WorkStepId == null || d.WorkStepId == instance.WorkStepId)
            && (instance.PeriodCode == null || d.PeriodCode == instance.PeriodCode));
    }

    /// <summary>
    /// Kalemleri kapsamlarına açar ve her satırın durumunu belirler.
    /// Öncelik sırası: feragat &gt; elle bağlama &gt; otomatik eşleşme &gt; eksik.
    /// Elle bağlamanın otomatik eşleşmeye üstün gelmesi bilinçli — kullanıcı beyanı esastır.
    /// </summary>
    public static List<ComplianceEvaluation> Evaluate(
        IReadOnlyList<ComplianceRequirement> requirements,
        IReadOnlyList<(Guid Id, string Name, int Order)> workSteps,
        IReadOnlyList<ComplianceDocument> documents,
        IReadOnlyList<ComplianceItemState> states,
        string? effectivePeriod)
    {
        var result = new List<ComplianceEvaluation>();

        foreach (var requirement in requirements.OrderBy(r => r.Order))
        {
            foreach (var instance in ExpandScope(requirement, workSteps, effectivePeriod))
            {
                var state = states.FirstOrDefault(s =>
                    s.RequirementId == requirement.Id &&
                    s.WorkStepId == instance.WorkStepId &&
                    s.PeriodCode == instance.PeriodCode);

                if (state?.IsWaived == true)
                {
                    result.Add(new ComplianceEvaluation(
                        requirement, instance, ComplianceItemStatus.Waived, null, null, state.WaiveReason));
                    continue;
                }

                var match = state?.DocumentFileId != null
                    ? documents.FirstOrDefault(d => d.Id == state.DocumentFileId.Value)
                    : FindAutoMatch(requirement, instance, documents);

                result.Add(match != null
                    ? new ComplianceEvaluation(
                        requirement, instance, ComplianceItemStatus.Satisfied, match.Id, match.DisplayName, null)
                    : new ComplianceEvaluation(
                        requirement, instance, ComplianceItemStatus.Missing, null, null, null));
            }
        }

        return result;
    }

    /// <summary>
    /// Yüzde = karşılanan / (toplam − feragat).
    /// Feragat edilen kalem paydadan DÜŞER; yoksa "bu proje için aranmayacak" denen
    /// bir kalem uygunluğu kalıcı olarak %100'ün altında tutardı.
    /// Payda sıfırsa (her şey feragat ya da hiç kalem yok) sonuç %100'dür.
    /// </summary>
    public static ComplianceSummary Summarize(IReadOnlyList<ComplianceEvaluation> evaluations)
    {
        var total = evaluations.Count;
        var waived = evaluations.Count(e => e.Status == ComplianceItemStatus.Waived);
        var satisfied = evaluations.Count(e => e.Status == ComplianceItemStatus.Satisfied);
        var missing = evaluations.Count(e => e.Status == ComplianceItemStatus.Missing);
        var blocking = evaluations.Count(e => e.Status == ComplianceItemStatus.Missing && e.Requirement.IsBlocking);

        return new ComplianceSummary(total, satisfied, waived, missing, blocking, Percent(satisfied, total, waived));
    }

    /// <summary>Birden çok paketin özetini tek KPI'ya indirger (payda yine feragat düşülerek).</summary>
    public static ComplianceSummary Combine(IReadOnlyList<ComplianceSummary> summaries)
    {
        var total = summaries.Sum(s => s.TotalCount);
        var waived = summaries.Sum(s => s.WaivedCount);
        var satisfied = summaries.Sum(s => s.SatisfiedCount);

        return new ComplianceSummary(
            total,
            satisfied,
            waived,
            summaries.Sum(s => s.MissingCount),
            summaries.Sum(s => s.BlockingMissingCount),
            Percent(satisfied, total, waived));
    }

    private static int Percent(int satisfied, int total, int waived)
    {
        var denominator = total - waived;
        return denominator <= 0
            ? 100
            : (int)Math.Round(satisfied * 100.0 / denominator, MidpointRounding.AwayFromZero);
    }
}
