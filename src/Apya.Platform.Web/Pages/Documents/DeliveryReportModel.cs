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

    /* ─── S4 · Şablonda açılabilen ama ÇİZİLMEYEN dört bölümün verisi ──────
       ReportSectionAvailability bu dördünü "veri üretiliyor" diye işaretliyordu
       (Faz E) ama modelde taşıyıcısı yoktu: kullanıcı bölümü açıyor, PDF'te hiçbir
       şey çıkmıyordu. Sessiz boşluk — kuruma eksik rapor gider. */

    /// <summary>Zaman çizelgesi: iş adımlarının tarihleri ve ilerlemesi.</summary>
    public List<TimelineRow> Timeline { get; set; } = new();

    /// <summary>Bütçe–belge kapsaması. Veri yoksa null kalır ve bölüm "veri yok" basar.</summary>
    public BudgetCoverageBlock? BudgetCoverage { get; set; }

    /// <summary>Risk kütüğü — kapanmış riskler de listelenir, kapandığı belirtilerek.</summary>
    public List<RiskRow> Risks { get; set; } = new();

    /// <summary>Kişi bazında kaydedilen zaman.</summary>
    public List<ContributorRow> Contributors { get; set; } = new();

    /// <summary>
    /// Kilometre taşları — projenin doğduğu HİBE BAŞVURUSUNDAN okunur. Proje hibeden
    /// doğmamışsa (ya da raporu üreten kullanıcının hibe yetkisi yoksa) boş kalır ve
    /// bölüm "tanımlı kilometre taşı yok" basar.
    /// </summary>
    public List<MilestoneRow> Milestones { get; set; } = new();

    /* ─── RPT-02 · Bütünleşik ilerleme raporu ──────────────────────────── */

    /// <summary>
    /// Bütçe özeti. Bütçe görme yetkisi olmayan kullanıcıda null kalır ve bölüm
    /// "bütçe verisi yok" basar — yetkisiz kullanıcının ürettiği rapora bütçe SIZMAZ.
    /// </summary>
    public BudgetSummaryBlock? BudgetSummary { get; set; }

    /// <summary>Görev ilerlemesi. Proje listesiyle AYNI kuraldan okunur.</summary>
    public TaskProgressBlock? TaskProgress { get; set; }

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

    public class TimelineRow
    {
        public int Order { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int ProgressPercent { get; set; }
    }

    public class BudgetCoverageBlock
    {
        public decimal TotalBudget { get; set; }
        public decimal TotalExpense { get; set; }
        public decimal DocumentedExpense { get; set; }
        public decimal UndocumentedExpense { get; set; }
        public int UndocumentedCount { get; set; }
        public int BudgetUsedPercent { get; set; }
        public int DocumentedPercent { get; set; }
        public string Currency { get; set; } = "TRY";
    }

    public class RiskRow
    {
        public string Title { get; set; } = string.Empty;
        public string? WorkStepName { get; set; }
        public int Likelihood { get; set; }
        public int Impact { get; set; }
        public int Score { get; set; }
        public string? Mitigation { get; set; }
        public bool IsClosed { get; set; }
    }

    public class BudgetSummaryBlock
    {
        public decimal ApprovedBudget { get; set; }
        public decimal SpentAmount { get; set; }
        public decimal RemainingBudget { get; set; }
        public int UsagePercent { get; set; }
        public bool IsOverBudget { get; set; }

        /// <summary>Hiçbir kaleme yazılmamış gider; kalem satırlarına GİRMEZ, ayrıca söylenir.</summary>
        public decimal UnassignedSpentAmount { get; set; }

        public string Currency { get; set; } = "TRY";
        public List<BudgetLineRow> Lines { get; set; } = new();
    }

    public class BudgetLineRow
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal ApprovedAmount { get; set; }
        public decimal SpentAmount { get; set; }
        public decimal RemainingAmount { get; set; }
    }

    public class TaskProgressBlock
    {
        public int Total { get; set; }
        public int Done { get; set; }
        public int InProgress { get; set; }
        public int InReview { get; set; }
        public int Todo { get; set; }
        public int Cancelled { get; set; }
        public int Overdue { get; set; }
        public int CompletionPercent { get; set; }
    }

    public class MilestoneRow
    {
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; }

        /// <summary>Tamamlanmamış ve tarihi rapor anından önce — çıktıda vurgulanır.</summary>
        public bool IsOverdue { get; set; }
    }

    public class ContributorRow
    {
        public string UserName { get; set; } = string.Empty;
        public decimal LoggedHours { get; set; }
        public decimal LoggedPersonDays { get; set; }
        public int SharePercent { get; set; }
        public int TaskCount { get; set; }
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
