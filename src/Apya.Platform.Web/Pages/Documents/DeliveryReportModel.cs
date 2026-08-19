using System;
using System.Collections.Generic;
using Apya.Platform.Documents;

namespace Apya.Platform.Web.Pages.Documents;

/// <summary>
/// Teslim paketi çıktısının ham verisi. PageModel bunu mevcut app service'lerden
/// doldurur, <see cref="DeliveryPackageExporter"/> yalnız çizer — böylece
/// üretim mantığı ile sunum ayrı kalır ve exporter test edilebilir bir saf
/// dönüşüm olur (veri erişimi yok).
/// </summary>
public class DeliveryReportModel
{
    public string PackageName { get; set; } = string.Empty;
    public string ProjectName { get; set; } = string.Empty;
    public string? ProjectCode { get; set; }
    public string? PeriodCode { get; set; }
    public string? TemplateName { get; set; }
    public string? Issuer { get; set; }
    public DateTime GeneratedAt { get; set; }
    public string GeneratedBy { get; set; } = string.Empty;

    /// <summary>Şablonda AÇIK olan bölümler, sıralı. Kapalı bölüm buraya hiç girmez.</summary>
    public List<ReportSectionKey> Sections { get; set; } = new();

    /// <summary>
    /// Rapor Derleyici önizlemesi mi. Önizlemede ekler kesilmiş olabilir ve EK
    /// numaraları geçicidir; çıktıya "ÖNİZLEME" damgası basılır ki kuruma
    /// yanlışlıkla önizleme gönderilmesin.
    /// </summary>
    public bool IsPreview { get; set; }

    /// <summary>Önizlemede listeye girmeyen ek sayısı (0 = hepsi gösteriliyor).</summary>
    public int TruncatedAnnexCount { get; set; }

    public ProjectSummaryBlock Summary { get; set; } = new();
    public List<WorkStepProgressRow> WorkSteps { get; set; } = new();
    public List<ComplianceRow> Compliance { get; set; } = new();
    public List<string> MissingDocuments { get; set; } = new();
    public List<AnnexRow> Annexes { get; set; } = new();
    public List<AuditRow> AuditTrail { get; set; } = new();

    public class ProjectSummaryBlock
    {
        public int CompliancePercent { get; set; }
        public int DocumentCount { get; set; }
        public int MissingCount { get; set; }
        public int BlockingCount { get; set; }
        public decimal DocumentedAmount { get; set; }
        public string Currency { get; set; } = "TRY";
    }

    public class WorkStepProgressRow
    {
        public int Order { get; set; }
        public string Name { get; set; } = string.Empty;
        public int ProgressPercent { get; set; }
        public int DocumentCount { get; set; }
    }

    public class ComplianceRow
    {
        public string PackageName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Scope { get; set; } = string.Empty;
        public ComplianceItemStatus Status { get; set; }
        public bool IsBlocking { get; set; }
        public string? DocumentName { get; set; }
    }

    public class AnnexRow
    {
        public string AnnexNumber { get; set; } = string.Empty;
        public string DocumentName { get; set; } = string.Empty;
        public string? TypeName { get; set; }
        public DateTime? DocumentDate { get; set; }
        public decimal? Amount { get; set; }
        public long FileSize { get; set; }
    }

    public class AuditRow
    {
        public DateTime At { get; set; }
        public string Actor { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string? Target { get; set; }
        public string? Detail { get; set; }
    }
}
