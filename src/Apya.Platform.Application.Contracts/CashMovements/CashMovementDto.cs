using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.CashMovements;

public class CashMovementDto : FullAuditedEntityDto<Guid>
{
    public Guid? TenantId { get; set; }
    public Guid CashAccountId { get; set; }
    public string? CashAccountName { get; set; }
    public CashMovementDirection Direction { get; set; }
    public decimal Amount { get; set; }
    public DateTime MovementDate { get; set; }
    public string? Description { get; set; }
    public CashMovementSource Source { get; set; }
    public Guid? ReferenceId { get; set; }
}

/// <summary>APYA-134: Kasa bakiye özeti.</summary>
public class CashAccountBalanceDto
{
    public Guid CashAccountId { get; set; }
    public string CashAccountName { get; set; } = null!;
    public string Currency { get; set; } = "TRY";
    public decimal OpeningBalance { get; set; }
    public decimal TotalIn { get; set; }
    public decimal TotalOut { get; set; }
    public decimal CurrentBalance { get; set; }
}
