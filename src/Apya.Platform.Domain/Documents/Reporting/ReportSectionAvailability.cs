using System.Collections.Generic;

namespace Apya.Platform.Documents;

/// <summary>
/// Hangi rapor bölümünün verisi BUGÜN üretilebiliyor.
///
/// Zaman çizelgesi, harcama↔belge eşleşmesi, ekip katkısı, riskler ve kilometre
/// taşları Faz E'nin verisine dayanıyor; şablonda görünürler ama varsayılan olarak
/// KAPALI gelirler ve UI'da "veri henüz yok" olarak işaretlenirler. Boş bölümü
/// sessizce basmak, kuruma giden raporda eksik sayfa demek olurdu.
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
    };

    public static bool IsAvailable(ReportSectionKey key) => Available.Contains(key);
}
