using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 6a · Kiracı · Başvurularım. Host tarafındaki karşılığı pipeline konsoludur (2c).
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class MyApplicationsModel : PlatformPageModel
{
    public void OnGet()
    {
    }

    /// <summary>Başvurularım (.xlsx). <paramref name="filter"/> ekrandaki çip: all / open / closed (MyApplications.js visible()).</summary>
    public async Task<IActionResult> OnGetExcelAsync(string? filter, [FromServices] IGrantMyApplicationsAppService myApplications)
    {
        var items = (await myApplications.GetAsync()).Items.Where(r =>
            filter == "open" ? !r.IsClosed : filter == "closed" ? r.IsClosed : true);

        var columns = new List<ExcelColumn<GrantMyApplicationRowDto>>
        {
            new(L["Export:Col:Program"], r => r.GrantName),
            new(L["Export:Col:Issuer"], r => r.Issuer),
            new(L["Export:Col:Period"], r => r.Period),
            new(L["Export:Col:Stage"], r => r.StageName ?? L[$"Grants:Stage:{r.Stage}"].Value),
            new(L["Export:Col:ProgressPercent"], r => r.ProgressPercent),
            new(L["Export:Col:Amount"], r => r.Amount),
            new(L["Export:Col:DueDate"], r => r.Deadline, "dd.MM.yyyy"),
            new(L["Export:Col:SubmittedAt"], r => r.SubmittedAt, "dd.MM.yyyy"),
            new(L["Export:Col:Collected"], r => r.CollectedAmount),
            new(L["Export:Col:Consultant"], r => r.AssignedUserName),
        };

        var name = L["Export:MyGrantApplications:Name"].Value;
        return this.TableFile(name, columns, items);
    }
}
