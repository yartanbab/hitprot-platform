using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

[Authorize(PlatformPermissions.Grants.Edit)]
public class ApplicationsModel : PlatformPageModel
{
    public void OnGet()
    {
    }

    /// <summary>Tüm firmaların başvuruları (.xlsx); ekran süzgeçsiz, dosya da öyle.</summary>
    public async Task<IActionResult> OnGetExcelAsync([FromServices] IGrantApplicationHostAppService applications)
    {
        var rows = await applications.GetListAsync();
        var columns = new List<ExcelColumn<GrantApplicationDto>>
        {
            new(L["Export:Col:Firm"], a => a.TenantName),
            new(L["Export:Col:Program"], a => a.GrantName),
            new(L["Export:Col:Period"], a => a.Period),
            new(L["Export:Col:Stage"], a => L[$"Grants:Stage:{a.Stage}"].Value),
            new(L["Export:Col:AppliedDate"], a => a.AppliedDate, "dd.MM.yyyy"),
            new(L["Export:Col:ApprovedAmount"], a => a.ApprovedAmount),
        };

        var name = L["Export:GrantApplications:Name"].Value;
        return this.TableFile(name, columns, rows);
    }
}
