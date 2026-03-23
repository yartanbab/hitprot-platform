using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Tenants;

namespace Apya.Platform.Web.Pages.TenantManagement.Tenants;

public class CreateModalModel : AbpPageModel
{
    private readonly ITenantProfileAppService _tenantProfileAppService;

    [BindProperty]
    public CreateTenantExtendedDto Tenant { get; set; } = new();

    public CreateModalModel(ITenantProfileAppService tenantProfileAppService)
    {
        _tenantProfileAppService = tenantProfileAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        return await Task.FromResult<IActionResult>(Page());
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        
        await _tenantProfileAppService.CreateTenantWithProfileAsync(Tenant);

        return NoContent();
    }
}
