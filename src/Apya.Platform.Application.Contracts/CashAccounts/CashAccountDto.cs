using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.CashAccounts;

public class CashAccountDto : FullAuditedEntityDto<Guid>
{
    public Guid? TenantId { get; set; }
    public string Name { get; set; } = null!;
    public CashAccountType Type { get; set; }
    public string Currency { get; set; } = "TRY";
    public decimal OpeningBalance { get; set; }
    public string? Description { get; set; }
    public string? BankName { get; set; }
    public string? Branch { get; set; }
    public string? Iban { get; set; }
    public bool IsActive { get; set; }
}
