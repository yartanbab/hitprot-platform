using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Projects.Dtos;

public class ProjectDto : AuditedEntityDto<Guid>
{
    public Guid? GrantId { get; set; }
    public Guid? TenantId { get; set; }
    public string TenantName { get; set; } = string.Empty;

    public string Name { get; set; }

    public string Code { get; set; }

    public string Description { get; set; } = string.Empty;
    public string? Purpose { get; set; }
    public string? Duration { get; set; }
    public string? TargetAudience { get; set; }
    public string? Activities { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool IsApproved { get; set; }

    public decimal TotalBudget { get; set; }
    public decimal HourlyRate { get; set; }
    public string Currency { get; set; } = "TRY";
    public decimal SpentBudget { get; set; }
}
