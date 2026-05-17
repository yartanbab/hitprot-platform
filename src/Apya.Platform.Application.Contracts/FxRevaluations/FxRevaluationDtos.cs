using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.FxRevaluations;

public class FxRevaluationLineDto
{
    public Guid CashAccountId { get; set; }
    public string CashAccountName { get; set; } = null!;
    public string Currency { get; set; } = null!;
    public decimal Balance { get; set; }
    public decimal? Rate { get; set; }
    public decimal TryValue { get; set; }
}

public class FxRevaluationSnapshotDto : FullAuditedEntityDto<Guid>
{
    public Guid? TenantId { get; set; }
    public DateTime AsOfDate { get; set; }
    public decimal TotalTryValue { get; set; }
    public string? Notes { get; set; }
    public List<FxRevaluationLineDto> Lines { get; set; } = new();
}

public class RunFxRevaluationDto
{
    public DateTime AsOfDate { get; set; } = new(DateTime.Today.Year, 12, 31);

    [StringLength(500)]
    public string? Notes { get; set; }
}

public class GetFxRevaluationsInput : PagedAndSortedResultRequestDto
{
}
