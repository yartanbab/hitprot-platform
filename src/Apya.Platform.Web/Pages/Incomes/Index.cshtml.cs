using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Incomes;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Export;

namespace Apya.Platform.Web.Pages.Incomes;

[Authorize(PlatformPermissions.Incomes.Default)]
public class IndexModel : PlatformPageModel
{
    private readonly IIncomeEntryAppService _incomeEntryAppService;

    public IndexModel(IIncomeEntryAppService incomeEntryAppService)
    {
        _incomeEntryAppService = incomeEntryAppService;
    }

    public virtual Task<IActionResult> OnGetAsync()
    {
        return Task.FromResult<IActionResult>(Page());
    }

    /// <summary>Ekrandaki arama ve sıralamayla gelirler (.xlsx).</summary>
    public async Task<IActionResult> OnGetExcelAsync(GetIncomeEntriesInput input)
    {
        var rows = await ExcelTable.CollectAsync((skip, take) =>
        {
            input.SkipCount = skip;
            input.MaxResultCount = take;
            return _incomeEntryAppService.GetListAsync(input);
        });

        // Sütunlar içe aktarma şablonuyla aynı (FinanceImportPageModel): dosya geri yüklenebilir.
        var labels = await FinanceExportLabels.LoadAsync(this, rows.Items.Select(e => e.ProjectId));
        var columns = new List<ExcelColumn<IncomeEntryDto>>
        {
            new(L["Export:Col:Date"], e => e.IncomeDate, "dd.MM.yyyy"),
            new(L["Export:Col:Title"], e => e.Title),
            new(L["Export:Col:Category"], e => L[$"Income:Category:{e.Category}"].Value),
            new(L["Export:Col:Amount"], e => e.Amount),
            new(L["Export:Col:Currency"], e => e.Currency),
            new(L["Export:Col:CashAccount"], e => e.CashAccountName),
            new(L["Export:Col:Project"], e => labels.Project(e.ProjectId)),
            new(L["Export:Col:BudgetLine"], e => labels.BudgetLine(e.BudgetLineId)),
            new(L["Export:Col:Description"], e => e.Description),
        };

        var name = L["Export:Incomes:Name"].Value;
        var note = rows.Truncated ? L["Export:Truncated", ExcelTable.MaxRows].Value : null;
        return this.TableFile(name, columns, rows.Items, note);
    }
}
