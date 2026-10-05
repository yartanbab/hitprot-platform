using System.Collections.Generic;

namespace Apya.Platform.Documents;

/// <summary>
/// Hangi rapor bölümünün verisi BUGÜN üretilebiliyor.
///
/// Boş bölümü sessizce basmak, kuruma giden raporda eksik sayfa demek olurdu;
/// bu yüzden verisi olmayan bölüm şablonda görünür ama KAPALI gelir ve UI'da
/// "veri henüz yok" olarak işaretlenir.
///
/// Bu liste Faz C'de yazıldığında zaman çizelgesi / eşleştirme / risk verisi henüz
/// yoktu. Faz E üçünü de üretti (ProjectTimelineAppService, DocumentExpenseMatch,
/// ProjectRisk); ekip katkısı da TaskTimeLog.UserId üzerinden kişi bazında
/// çıkarılabiliyor — dördü birden açıldı.
///
/// Kilometre taşı uzun süre KAPALIYDI: proje tarafında karşılığı olan bir varlık yok.
/// Hâlâ yok ve bilerek açılmadı — ama hibeden doğan projenin kilometre taşları
/// BAŞVURUDA duruyor (<c>GrantMilestone</c>) ve proje→başvuru köprüsü kurulduğu için
/// rapor onları oradan okuyabiliyor. Hibeden doğmamış projede bölüm "tanımlı kilometre
/// taşı yok" satırı basar; uydurma veri üretmez.
/// </summary>
public static class ReportSectionAvailability
{
    private static readonly HashSet<ReportSectionKey> Available = new()
    {
        ReportSectionKey.CoverPage,
        ReportSectionKey.ProjectSummary,
        ReportSectionKey.WorkStepProgress,
        ReportSectionKey.ComplianceStatus,
        ReportSectionKey.MissingDocuments,
        ReportSectionKey.AnnexIndex,
        ReportSectionKey.AuditTrail,

        // --- Faz E ile gelen veriler ---
        ReportSectionKey.Timeline,
        ReportSectionKey.ExpenseDocumentMatch,
        ReportSectionKey.Risks,
        ReportSectionKey.TeamContribution,

        // --- Hibe köprüsüyle gelen veri ---
        ReportSectionKey.Milestones,
    };

    public static bool IsAvailable(ReportSectionKey key) => Available.Contains(key);
}
