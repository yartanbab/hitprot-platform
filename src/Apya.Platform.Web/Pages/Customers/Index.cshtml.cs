using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.Customers;

[Authorize(PlatformPermissions.Customers.Default)]
public class IndexModel : AbpPageModel
{
    public virtual Task<IActionResult> OnGetAsync()
    {
        return Task.FromResult<IActionResult>(Page());
    }
}
