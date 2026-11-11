using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Expenses;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Import;
using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.Expenses;

/// <summary>Giderleri Excel'den içe aktarma; her satır gider penceresinin servisinden geçer.</summary>
[Authorize(PlatformPermissions.Expenses.Create)]
public class ImportModalModel : FinanceImportPageModel<ExpenseCategory>
{
    private readonly IExpenseAppService _expenseAppService;

    public ImportModalModel(IExpenseAppService expenseAppService)
    {
        _expenseAppService = expenseAppService;
    }

    protected override string NameKey => "Export:Expenses:Name";
    protected override string CategoryKeyPrefix => "Expense:Category:";
    protected override bool AccountRequired => true;
    protected override int MaxTitleLength => ExpenseConsts.MaxTitleLength;
    protected override int MaxDescriptionLength => ExpenseConsts.MaxDescriptionLength;

    protected override async Task<IReadOnlyList<CashAccountLookupDto>> GetAccountsAsync()
        => (await _expenseAppService.GetCashAccountLookupAsync()).Items;

    protected override Task CreateAsync(FinanceImportRow<ExpenseCategory> row)
        => _expenseAppService.CreateAsync(new CreateUpdateExpenseDto
        {
            Title = row.Title,
            ExpenseDate = row.Date,
            Category = row.Category,
            Amount = row.Amount,
            Currency = row.Currency,
            CashAccountId = row.CashAccountId!.Value,
            ProjectId = row.ProjectId,
            BudgetLineId = row.BudgetLineId,
            Description = row.Description
        });
}
