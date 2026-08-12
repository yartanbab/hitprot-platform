using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.TenantManagement;
using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.TenantManagement.Tenants;

[Authorize(TenantManagementPermissions.Tenants.Default)]
public class IndexModel : AbpPageModel
{
    public virtual Task<IActionResult> OnGetAsync()
    {
        return Task.FromResult<IActionResult>(Page());
    }
}
