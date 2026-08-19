using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Documents;

public class CompliancePackageDto : EntityDto<Guid>
{
    public Guid? TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsSystem { get; set; }
    public int RequirementCount { get; set; }

    /// <summary>Bu paket sorgulanan projeye zaten uygulanmış mı?</summary>
    public bool IsApplied { get; set; }
}

/// <summary>
/// Kontrol listesinin TEK bir satırı — kalem × kapsam örneği.
/// WorkStep kapsamlı bir kalem 4 iş adımı için 4 satır üretir.
/// </summary>
public class ComplianceItemDto
{
    public Guid RequirementId { get; set; }
    public string Title { get; set; } = string.Empty;
    public ComplianceScope Scope { get; set; }
    public bool IsBlocking { get; set; }

    public Guid? DocumentTypeId { get; set; }
    public string? DocumentTypeName { get; set; }

    /// <summary>Kapsam örneği — WorkStep kapsamında iş adımı, Period kapsamında dönem.</summary>
    public Guid? WorkStepId { get; set; }
    public string? WorkStepName { get; set; }
    public int? WorkStepOrder { get; set; }
    public string? PeriodCode { get; set; }

    public ComplianceItemStatus Status { get; set; }

    /// <summary>Kalemi karşılayan belge (otomatik eşleşme veya elle bağlama).</summary>
    public Guid? DocumentFileId { get; set; }
    public string? DocumentFileName { get; set; }

    public string? WaiveReason { get; set; }
}

public class ComplianceChecklistDto
{
    public Guid AssignmentId { get; set; }
    public Guid PackageId { get; set; }
    public string PackageName { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string? PeriodCode { get; set; }

    public List<ComplianceItemDto> Items { get; set; } = new();
    public ComplianceSummaryDto Summary { get; set; } = new();
}

/// <summary>
/// KPI şeridinin kaynağı. Yüzde = karşılanan / (toplam − feragat edilen);
/// feragat edilen kalemler paydadan DÜŞER, yoksa feragat yüzdeyi düşürürdü.
/// </summary>
public class ComplianceSummaryDto
{
    public int TotalCount { get; set; }
    public int SatisfiedCount { get; set; }
    public int WaivedCount { get; set; }
    public int MissingCount { get; set; }

    /// <summary>Eksik VE teslimi bloke eden kalem sayısı.</summary>
    public int BlockingMissingCount { get; set; }

    public int Percent { get; set; }
}

/// <summary>Projeye ait tüm paketlerin birleşik özeti (KPI şeridi).</summary>
public class ComplianceOverviewDto
{
    public ComplianceSummaryDto Summary { get; set; } = new();
    public List<ComplianceChecklistDto> Checklists { get; set; } = new();
}

public class ApplyCompliancePackageDto
{
    public Guid ProjectId { get; set; }
    public Guid PackageId { get; set; }

    [StringLength(DocumentConsts.MaxPeriodCodeLength)]
    public string? PeriodCode { get; set; }
}

public class WaiveComplianceItemDto
{
    public Guid AssignmentId { get; set; }
    public Guid RequirementId { get; set; }
    public Guid? WorkStepId { get; set; }

    [StringLength(DocumentConsts.MaxPeriodCodeLength)]
    public string? PeriodCode { get; set; }

    /// <summary>false = feragati kaldır (Reason aranmaz).</summary>
    public bool Waive { get; set; } = true;

    [StringLength(ComplianceConsts.MaxWaiveReasonLength)]
    public string? Reason { get; set; }
}

public class LinkComplianceDocumentDto
{
    public Guid AssignmentId { get; set; }
    public Guid RequirementId { get; set; }
    public Guid? WorkStepId { get; set; }

    [StringLength(DocumentConsts.MaxPeriodCodeLength)]
    public string? PeriodCode { get; set; }

    /// <summary>null = elle bağlamayı kaldır.</summary>
    public Guid? DocumentFileId { get; set; }
}
