using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Web.Export;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Web.Pages.Projects;

[Authorize(PlatformPermissions.Projects.Default)]
public class IndexModel : PlatformPageModel
{
    private readonly IProjectAppService _projectAppService;

    public IndexModel(IProjectAppService projectAppService)
    {
        _projectAppService = projectAppService;
    }

    public void OnGet()
    {
    }

    /// <summary>
    /// Görülebilen tüm projeler (.xlsx). Ekrandaki çipler istemcide süzüyor, sunucuya gitmiyor;
    /// dosya bu yüzden portföyün tamamını taşır. Bütçe sütunları yalnız bütçe görme izniyle gelir.
    /// </summary>
    public async Task<IActionResult> OnGetExcelAsync()
    {
        var rows = await ExcelTable.CollectAsync((skip, take) =>
            _projectAppService.GetListAsync(new PagedAndSortedResultRequestDto { SkipCount = skip, MaxResultCount = take }));

        var columns = new List<ExcelColumn<ProjectDto>>
        {
            new(L["Export:Col:Code"], p => p.Code),
            new(L["Export:Col:Name"], p => p.Name),
        };
        if (CurrentTenant.Id == null)
        {
            columns.Add(new(L["Export:Col:Tenant"], p => p.TenantName));
        }
        columns.AddRange(
        [
            new(L["Export:Col:Customer"], p => p.CustomerName),
            new(L["Export:Col:Category"], p => p.CategoryName),
            new(L["Export:Col:Status"], p => p.DisplayStatus),
            new(L["Export:Col:StartDate"], p => p.StartDate, "dd.MM.yyyy"),
            new(L["Export:Col:EndDate"], p => p.EndDate, "dd.MM.yyyy"),
            new(L["Export:Col:DaysRemaining"], p => p.DaysRemaining),
            new(L["Export:Col:ProgressPercent"], p => p.ProgressPercent),
            new(L["Export:Col:TaskCount"], p => p.TaskCount),
            new(L["Export:Col:CompletedTaskCount"], p => p.CompletedTaskCount),
            new(L["Export:Col:OverdueTaskCount"], p => p.OverdueTaskCount),
        ]);
        if (await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ViewBudget))
        {
            columns.AddRange(
            [
                new(L["Export:Col:Budget"], p => p.TotalBudget),
                new(L["Export:Col:Spent"], p => p.SpentBudget),
                new(L["Export:Col:Currency"], p => p.Currency),
            ]);
        }

        var name = L["Export:Projects:Name"].Value;
        var note = rows.Truncated ? L["Export:Truncated", ExcelTable.MaxRows].Value : null;
        return this.TableFile(name, columns, rows.Items, note);
    }
}
