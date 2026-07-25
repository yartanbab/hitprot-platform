using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Grants.Dtos;

public class GrantApplicationDto : EntityDto<Guid>
{
    public Guid GrantCallId { get; set; }
    public string? Period { get; set; }
    public string? GrantName { get; set; }
    public GrantApplicationStage Stage { get; set; }
    public DateTime AppliedDate { get; set; }
    public decimal? ApprovedAmount { get; set; }
    public List<GrantDisbursementTrancheDto> Tranches { get; set; } = new();
    public List<GrantMilestoneDto> Milestones { get; set; } = new();

    /// <summary>Yalnız host listesinde (<see cref="IGrantApplicationHostAppService.GetListAsync"/>) doldurulur.</summary>
    public string? TenantName { get; set; }
}
