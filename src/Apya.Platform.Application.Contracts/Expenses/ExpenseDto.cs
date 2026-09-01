using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Expenses;

public class ExpenseDto : FullAuditedEntityDto<Guid>
{
    public Guid? TenantId { get; set; }
    public string Title { get; set; } = null!;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "TRY";
    public DateTime ExpenseDate { get; set; }
    public ExpenseCategory Category { get; set; }
    public Guid CashAccountId { get; set; }
    public string? CashAccountName { get; set; }
    public Guid? ProjectId { get; set; }
    public Guid? TaskId { get; set; }
    public Guid? BudgetLineId { get; set; }
    public Guid? CustomerId { get; set; }
    public string? Description { get; set; }
}
