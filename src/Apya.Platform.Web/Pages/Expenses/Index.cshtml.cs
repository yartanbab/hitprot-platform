using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Expenses;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Export;

namespace Apya.Platform.Web.Pages.Expenses;

[Authorize(PlatformPermissions.Expenses.Default)]
public class IndexModel : PlatformPageModel
{
    private readonly IExpenseAppService _expenseAppService;

    public IndexModel(IExpenseAppService expenseAppService)
    {
        _expenseAppService = expenseAppService;
    }

    public virtual Task<IActionResult> OnGetAsync()
    {
        return Task.FromResult<IActionResult>(Page());
    }

    /// <summary>Ekrandaki arama ve sıralamayla giderler (.xlsx).</summary>
    public async Task<IActionResult> OnGetExcelAsync(GetExpensesInput input)
    {
        var rows = await ExcelTable.CollectAsync((skip, take) =>
        {
            input.SkipCount = skip;
            input.MaxResultCount = take;
            return _expenseAppService.GetListAsync(input);
        });

        var columns = new List<ExcelColumn<ExpenseDto>>
        {
            new(L["Export:Col:Date"], e => e.ExpenseDate, "dd.MM.yyyy"),
            new(L["Export:Col:Title"], e => e.Title),
            new(L["Export:Col:Category"], e => L[$"Expense:Category:{e.Category}"].Value),
            new(L["Export:Col:Amount"], e => e.Amount),
            new(L["Export:Col:Currency"], e => e.Currency),
            new(L["Export:Col:CashAccount"], e => e.CashAccountName),
            new(L["Export:Col:Description"], e => e.Description),
        };

        var name = L["Export:Expenses:Name"].Value;
        var note = rows.Truncated ? L["Export:Truncated", ExcelTable.MaxRows].Value : null;
        return File(ExcelTable.Build(name, columns, rows.Items, note), ExcelTable.ContentType, ExcelTable.FileName(name, Clock.Now));
    }
}
