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
/// Kilometre taşı KAPALI kalıyor: karşılığı olan bir varlık yok. Uydurma veri
/// üretmektense bölümü kapalı tutmak doğru.
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
    };

    public static bool IsAvailable(ReportSectionKey key) => Available.Contains(key);
}
