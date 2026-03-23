using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Web.Pages.Tenants;

public class IndexModel : AbpPageModel
{
    public virtual async Task<IActionResult> OnGetAsync()
    {
        await Task.CompletedTask;
        return Page();
    }
}
