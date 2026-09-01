using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Incomes;

public class IncomeEntryDto : FullAuditedEntityDto<Guid>
{
    public Guid? TenantId { get; set; }
    public string Title { get; set; } = null!;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "TRY";
    public DateTime IncomeDate { get; set; }
    public IncomeCategory Category { get; set; }
    public Guid? CashAccountId { get; set; }
    public string? CashAccountName { get; set; }
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

public class CreateUpdateIncomeEntryDto
{
    [Required]
    [StringLength(IncomeConsts.MaxTitleLength)]
    public string Title { get; set; } = null!;

    [Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required]
    [StringLength(IncomeConsts.CurrencyLength, MinimumLength = IncomeConsts.CurrencyLength)]
    public string Currency { get; set; } = "TRY";

    public DateTime IncomeDate { get; set; } = DateTime.Today;

    public IncomeCategory Category { get; set; } = IncomeCategory.Other;

    public Guid? CashAccountId { get; set; }
    public Guid? ProjectId { get; set; }
    public Guid? TaskId { get; set; }

    /// <summary>
    /// Gelirin yazıldığı bütçe kalemi. Zorunluluğu giderdeki ile aynı koşullu
    /// kurala tabi (bkz. <see cref="Expenses.CreateUpdateExpenseDto.BudgetLineId"/>).
    /// </summary>
    public Guid? BudgetLineId { get; set; }

    public Guid? CustomerId { get; set; }

    [StringLength(IncomeConsts.MaxDescriptionLength)]
    public string? Description { get; set; }
}

public class GetIncomeEntriesInput : PagedAndSortedResultRequestDto
{
    public string? Filter { get; set; }
    public IncomeCategory? Category { get; set; }
    public Guid? CashAccountId { get; set; }
    public Guid? ProjectId { get; set; }
    public Guid? TaskId { get; set; }
    public Guid? CustomerId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}
