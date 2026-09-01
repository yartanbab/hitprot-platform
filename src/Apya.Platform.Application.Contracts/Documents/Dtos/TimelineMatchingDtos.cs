using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Documents;

/* ─── Zaman çizelgesi & bütçe ────────────────────────────────────────── */

public class ProjectTimelineDto
{
    public Guid ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Currency { get; set; } = "TRY";

    public List<TimelineStepDto> Steps { get; set; } = new();
    public BudgetCoverageDto Budget { get; set; } = new();
    public CapacityDto Capacity { get; set; } = new();
    public List<ProjectRiskDto> Risks { get; set; } = new();
}

public class TimelineStepDto
{
    public Guid Id { get; set; }
    public int Order { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int ProgressPercent { get; set; }
    public int DocumentCount { get; set; }

    /// <summary>Bu adıma bağlı belgelerin toplam tutarı.</summary>
    public decimal DocumentedAmount { get; set; }
}

/// <summary>
/// Bütçe ↔ belge kapsaması. Asıl soru: "harcadığımın ne kadarı belgeli?"
/// </summary>
public class BudgetCoverageDto
{
    public decimal TotalBudget { get; set; }
    public decimal TotalExpense { get; set; }

    /// <summary>Bir belgeye bağlanmış harcama toplamı.</summary>
    public decimal DocumentedExpense { get; set; }

    /// <summary>Hiçbir belgeye bağlanmamış harcama toplamı — teslimde en riskli kalem.</summary>
    public decimal UndocumentedExpense { get; set; }

    public int UndocumentedCount { get; set; }

    /// <summary>Harcamanın bütçeye oranı (%).</summary>
    public int BudgetUsedPercent { get; set; }

    /// <summary>Harcamanın belgelenmiş oranı (%).</summary>
    public int DocumentedPercent { get; set; }
}

/// <summary>Adam-gün kapasitesi — mevcut görev tahminlerinden türetilir.</summary>
public class CapacityDto
{
    public decimal EstimatedHours { get; set; }
    public decimal LoggedHours { get; set; }

    /// <summary>8 saat = 1 adam-gün kabulüyle.</summary>
    public decimal EstimatedPersonDays { get; set; }
    public decimal LoggedPersonDays { get; set; }
}

public class ProjectRiskDto : FullAuditedEntityDto<Guid>
{
    public Guid ProjectId { get; set; }
    public Guid? WorkStepId { get; set; }
    public string? WorkStepName { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Likelihood { get; set; }
    public int Impact { get; set; }
    public int Score { get; set; }
    public string? Mitigation { get; set; }
    public bool IsClosed { get; set; }
}

public class CreateUpdateProjectRiskDto
{
    public Guid ProjectId { get; set; }
    public Guid? WorkStepId { get; set; }

    [Required]
    [StringLength(MatchingConsts.MaxRiskTitleLength)]
    public string Title { get; set; } = string.Empty;

    [Range(1, 5)]
    public int Likelihood { get; set; } = 3;

    [Range(1, 5)]
    public int Impact { get; set; } = 3;

    [StringLength(MatchingConsts.MaxRiskTextLength)]
    public string? Mitigation { get; set; }
}

/* ─── Harcama ↔ belge eşleştirme ─────────────────────────────────────── */

/// <summary>Sol kolon: henüz belgeye bağlanmamış harcamalar.</summary>
public class UnmatchedExpenseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "TRY";
    public DateTime ExpenseDate { get; set; }
    public string? SupplierName { get; set; }
    public string? Description { get; set; }

    /// <summary>
    /// Harcamanın yazıldığı bütçe kalemi. Eşleştirme ekranı "bu belgeyi bağlarsan
    /// hangi kalem belgeli olur" satırını buradan basar; kalem yoksa null kalır.
    /// </summary>
    public Guid? BudgetLineId { get; set; }

    /// <summary>Kalemin "kod · ad" biçiminde gösterim adı; kod boşsa yalnız ad.</summary>
    public string? BudgetLineName { get; set; }
}

/// <summary>Sağ kolon: hiçbir harcamaya bağlanmamış belgeler.</summary>
public class UnmatchedDocumentDto
{
    public Guid Id { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public decimal? Amount { get; set; }
    public string? Currency { get; set; }
    public DateTime? DocumentDate { get; set; }
    public string? DocumentTypeName { get; set; }

    /// <summary>Aynı içerik/üçlü başka bir belgede de varsa dolu gelir.</summary>
    public DuplicateReason? DuplicateOf { get; set; }
}

/// <summary>Orta kolon: bir harcama için skorlanmış aday belgeler.</summary>
public class MatchCandidateDto
{
    public Guid DocumentFileId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public decimal? Amount { get; set; }
    public DateTime? DocumentDate { get; set; }
    public int Score { get; set; }
    public int AmountScore { get; set; }
    public int DateScore { get; set; }
    public int SupplierScore { get; set; }
    public bool IsStrong { get; set; }
    public List<string> Reasons { get; set; } = new();
}

public class MatchingBoardDto
{
    public Guid ProjectId { get; set; }
    public List<UnmatchedExpenseDto> Expenses { get; set; } = new();
    public List<UnmatchedDocumentDto> Documents { get; set; } = new();
    public decimal UndocumentedTotal { get; set; }
}

public class CreateMatchDto
{
    public Guid DocumentFileId { get; set; }
    public Guid ExpenseId { get; set; }

    /// <summary>Bağlama anındaki skor — sıfır geçilirse sunucu yeniden hesaplar.</summary>
    public int Score { get; set; }

    [StringLength(MatchingConsts.MaxAnnexNumberLength)]
    public string? AnnexNumber { get; set; }
}

public class DocumentMatchDto : EntityDto<Guid>
{
    public Guid DocumentFileId { get; set; }
    public string DocumentFileName { get; set; } = string.Empty;
    public Guid ExpenseId { get; set; }
    public string ExpenseTitle { get; set; } = string.Empty;
    public decimal ExpenseAmount { get; set; }
    public int Score { get; set; }
    public MatchSource Source { get; set; }
    public string? AnnexNumber { get; set; }
}
