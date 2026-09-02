using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Apya.Platform.Expenses;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// 2e · Onaylanan başvurunun projeye dönüştürülmesi. Önizleme, oluşacak projeyi
/// ve aktarılacak her kalemi kaydetmeden ÖNCE gösterir.
/// </summary>
public class GrantConversionPreviewDto
{
    public Guid ApplicationId { get; set; }
    public string FirmName { get; set; } = null!;
    public string GrantName { get; set; } = null!;
    public string? Period { get; set; }

    /// <summary>Onaylanan destek; girilmemişse dönüştürme yapılamaz.</summary>
    public decimal? ApprovedAmount { get; set; }

    public bool CanConvert { get; set; }

    /// <summary>Dönüştürme yapıldıysa üretilen projenin kimliği.</summary>
    public Guid? ProjectId { get; set; }

    // --- Oluşacak proje ---
    public string SuggestedProjectName { get; set; } = null!;
    public string SuggestedProjectCode { get; set; } = null!;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal TotalBudget { get; set; }

    public List<GrantConversionBudgetMapDto> BudgetMappings { get; set; } = new();
    public List<GrantConversionTaskDto> Tasks { get; set; } = new();
    public List<GrantConversionTrancheDto> Tranches { get; set; } = new();
    public List<GrantConversionMemberDto> Members { get; set; } = new();

    // --- Aktarılacaklar (tasarım 2e · sağ panel) ---
    public int DocumentCount { get; set; }
    public int MessageCount { get; set; }
    public decimal ConsultingHours { get; set; }

    /// <summary>Eşleşmesi olmayan hibe kalemi sayısı — uyarı olarak gösterilir.</summary>
    public int UnmappedCount { get; set; }
}

public class GrantConversionBudgetMapDto
{
    public GrantCostItemKind Kind { get; set; }
    public decimal Amount { get; set; }

    /// <summary>Önerilen proje bütçe kalemi adı; hibe kalemi adından türetilir.</summary>
    public string SuggestedName { get; set; } = null!;

    /// <summary>Önerilen gider kategorisi; eşleşme bulunamazsa null (host seçer).</summary>
    public ExpenseCategory? SuggestedCategory { get; set; }

    /// <summary>Program bu kalemi desteklemiyorsa proje bütçesine planlanan olarak girer.</summary>
    public bool IsEligible { get; set; }
}

public class GrantConversionTaskDto
{
    public Guid MilestoneId { get; set; }
    public string Title { get; set; } = null!;
    public DateTime? DueDate { get; set; }
}

public class GrantConversionTrancheDto
{
    public Guid TrancheId { get; set; }
    public int SequenceNo { get; set; }
    public decimal Amount { get; set; }
    public DateTime? DueDate { get; set; }

    /// <summary>Dilimin onaylanan destekteki payı (%) — tasarımdaki "%40 · ön ödeme".</summary>
    public int SharePercent { get; set; }
}

public class GrantConversionMemberDto
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = null!;
}

// ------------------------------------------------------------------ girdiler

public class ConvertGrantApplicationInput
{
    [Required(ErrorMessage = "Başvuru zorunludur.")]
    public Guid ApplicationId { get; set; }

    [Required(ErrorMessage = "Proje adı zorunludur.")]
    [StringLength(200, ErrorMessage = "Proje adı en fazla 200 karakter olabilir.")]
    public string ProjectName { get; set; } = null!;

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    /// <summary>Projeye atanacak KİRACI kullanıcıları.</summary>
    public List<Guid> MemberUserIds { get; set; } = new();

    public List<ConvertGrantBudgetLineInput> BudgetLines { get; set; } = new();

    /// <summary>Milestone'lar göreve dönüşsün mü.</summary>
    public bool CreateTasks { get; set; } = true;

    /// <summary>Tahsilat dilimleri projenin gelir planına aktarılsın mı.</summary>
    public bool CreateTranches { get; set; } = true;
}

public class ConvertGrantBudgetLineInput
{
    public GrantCostItemKind Kind { get; set; }

    [Required(ErrorMessage = "Bütçe kalemi adı zorunludur.")]
    [StringLength(128, ErrorMessage = "Kalem adı en fazla 128 karakter olabilir.")]
    public string Name { get; set; } = null!;

    public decimal Amount { get; set; }
    public ExpenseCategory? Category { get; set; }
}

public class GrantConversionResultDto
{
    public Guid ProjectId { get; set; }
    public string ProjectCode { get; set; } = null!;
    public int BudgetLineCount { get; set; }
    public int TaskCount { get; set; }
    public int TrancheCount { get; set; }
    public int MemberCount { get; set; }
}
