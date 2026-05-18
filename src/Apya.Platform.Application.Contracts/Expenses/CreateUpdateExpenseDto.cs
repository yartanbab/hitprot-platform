using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Expenses;

public class CreateUpdateExpenseDto
{
    [Required]
    [StringLength(ExpenseConsts.MaxTitleLength)]
    public string Title { get; set; } = null!;

    [Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required]
    [StringLength(ExpenseConsts.CurrencyLength, MinimumLength = ExpenseConsts.CurrencyLength)]
    public string Currency { get; set; } = "TRY";

    public DateTime ExpenseDate { get; set; } = DateTime.Today;

    public ExpenseCategory Category { get; set; } = ExpenseCategory.Other;

    [Required]
    public Guid CashAccountId { get; set; }

    public Guid? ProjectId { get; set; }
    public Guid? TaskId { get; set; }
    public Guid? CustomerId { get; set; }

    [StringLength(ExpenseConsts.MaxDescriptionLength)]
    public string? Description { get; set; }
}
