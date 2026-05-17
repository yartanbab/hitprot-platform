using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Expenses;

public class GetExpensesInput : PagedAndSortedResultRequestDto
{
    public string? Filter { get; set; }
    public ExpenseCategory? Category { get; set; }
    public Guid? CashAccountId { get; set; }
    public Guid? ProjectId { get; set; }
    public Guid? CustomerId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}
