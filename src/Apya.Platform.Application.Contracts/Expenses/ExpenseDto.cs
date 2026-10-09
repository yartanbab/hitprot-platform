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

    /// <summary>
    /// DOC-12 · Gidere eşleştirilmiş belgeler. Yalnız LİSTE ucunda ve yalnız belge izni olan
    /// çağırana dolar; diğer uçlarda boştur.
    /// </summary>
    public System.Collections.Generic.List<Apya.Platform.ProjectBudgets.Dtos.ProjectExpenseDocumentDto> Documents { get; set; } = new();
    public Guid? ProjectId { get; set; }
    public Guid? TaskId { get; set; }
    public Guid? BudgetLineId { get; set; }
    public Guid? CustomerId { get; set; }
    public string? Description { get; set; }
    /* Üç defter — kayıt oluşurken damgalanır (bkz. FxLedgerStamper). */
    public decimal BookAmount { get; set; }
    public decimal BookRate { get; set; }
    public decimal? DonorAmount { get; set; }
    public decimal? DonorRate { get; set; }
    public bool RateLocked { get; set; }
}
