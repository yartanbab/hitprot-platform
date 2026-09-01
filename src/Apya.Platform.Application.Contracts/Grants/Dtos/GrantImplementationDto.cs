using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// 6c · Uygulama &amp; Tahsilat. Onaylanan desteğin ne kadarının tahsil edildiği,
/// rapor-dilim zinciri, bütçe gerçekleşmesi ve yaklaşan yükümlülükler.
/// </summary>
public class GrantImplementationDto
{
    public Guid ApplicationId { get; set; }
    public string GrantName { get; set; } = null!;
    public string Issuer { get; set; } = null!;
    public string? Period { get; set; }

    // --- Üst bar ---
    public decimal ApprovedAmount { get; set; }
    public decimal CollectedAmount { get; set; }
    public decimal RemainingAmount { get; set; }
    public int CollectedPercent { get; set; }
    public DateTime? ContractStart { get; set; }
    public DateTime? ContractEnd { get; set; }

    /// <summary>Danışman rapor/dilim durumunu değiştirebilir; firma okur.</summary>
    public bool CanManage { get; set; }

    public List<GrantChainItemDto> Chain { get; set; } = new();
    public List<GrantBudgetRealisationDto> Budget { get; set; } = new();
    public List<GrantObligationDto> Obligations { get; set; } = new();

    /// <summary>Bütçe gerçekleşmesi projeden okundu mu; proje yoksa false.</summary>
    public bool HasProject { get; set; }
    public Guid? ProjectId { get; set; }
}

/// <summary>Rapor ve (varsa) ödemesi ona bağlı dilim — tasarımdaki zincir halkası.</summary>
public class GrantChainItemDto
{
    public Guid ReportId { get; set; }
    public int Order { get; set; }
    public string Title { get; set; } = null!;
    public DateTime? DueDate { get; set; }
    public GrantReportStatus Status { get; set; }
    public string? Note { get; set; }

    public Guid? TrancheId { get; set; }
    public decimal? TrancheAmount { get; set; }
    public GrantDisbursementTrancheStatus? TrancheStatus { get; set; }

    /// <summary>Rapor onaylanmadığı için ödeme kapalı mı.</summary>
    public bool PaymentBlocked { get; set; }

    public List<GrantReportSectionDto> Sections { get; set; } = new();
}

public class GrantReportSectionDto
{
    public Guid Id { get; set; }
    public int Order { get; set; }
    public string Name { get; set; } = null!;
    public GrantReportStatus Status { get; set; }
    public string? Note { get; set; }
}

public class GrantBudgetRealisationDto
{
    public string Name { get; set; } = null!;
    public decimal ApprovedAmount { get; set; }
    public decimal SpentAmount { get; set; }
    public decimal RemainingAmount { get; set; }
    public int UsagePercent { get; set; }

    /// <summary>Kullanım eşiği aştı — kalemler arası aktarım revizyon onayı ister.</summary>
    public bool IsNearLimit { get; set; }
}

/// <summary>
/// Yaklaşan yükümlülük. Cümle sunucuda kurulmaz: tür + tarih döner, metni istemci
/// yerelleştirir.
/// </summary>
public class GrantObligationDto
{
    public GrantObligationKind Kind { get; set; }
    public string Label { get; set; } = null!;
    public DateTime DueDate { get; set; }
    public int DaysLeft { get; set; }
    public bool IsOverdue { get; set; }
}

public enum GrantObligationKind
{
    /// <summary>Rapor teslim tarihi.</summary>
    ReportDue = 0,

    /// <summary>Tahsilat diliminin beklenen tarihi.</summary>
    TrancheDue = 1
}

// ------------------------------------------------------------------ girdiler

public class SaveGrantReportInput
{
    [Required(ErrorMessage = "Başvuru zorunludur.")]
    public Guid ApplicationId { get; set; }

    public Guid? ReportId { get; set; }

    [Required(ErrorMessage = "Rapor adı zorunludur.")]
    [StringLength(128, ErrorMessage = "Rapor adı en fazla 128 karakter olabilir.")]
    public string Title { get; set; } = null!;

    public DateTime? DueDate { get; set; }
    public Guid? TrancheId { get; set; }
}

public class SetGrantReportStatusInput
{
    [Required(ErrorMessage = "Rapor zorunludur.")]
    public Guid ReportId { get; set; }

    public GrantReportStatus Status { get; set; }

    [StringLength(256, ErrorMessage = "Not en fazla 256 karakter olabilir.")]
    public string? Note { get; set; }
}

public class SetGrantReportSectionStatusInput
{
    [Required(ErrorMessage = "Bölüm zorunludur.")]
    public Guid SectionId { get; set; }

    public GrantReportStatus Status { get; set; }

    [StringLength(256, ErrorMessage = "Not en fazla 256 karakter olabilir.")]
    public string? Note { get; set; }
}

public class AddGrantReportSectionInput
{
    [Required(ErrorMessage = "Rapor zorunludur.")]
    public Guid ReportId { get; set; }

    [Required(ErrorMessage = "Bölüm adı zorunludur.")]
    [StringLength(96, ErrorMessage = "Bölüm adı en fazla 96 karakter olabilir.")]
    public string Name { get; set; } = null!;
}
