using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Tenants;

namespace Apya.Platform.Web.Pages.TenantManagement.Tenants;

public class CreateModalModel : AbpPageModel
{
    private readonly ITenantProfileAppService _tenantProfileAppService;

    [BindProperty]
    public CreateTenantExtendedDto Tenant { get; set; } = new();

    /// <summary>
    /// Abonelik süresi seçenekleri. Değer olarak enum ADI basılır — ABP'nin kendi
    /// enum select'leriyle aynı kural, model binding'i sayı sırasına bağlı kalmaz.
    /// </summary>
    public List<SelectListItem> PeriodOptions { get; } = SubscriptionPeriodOptions.Build();

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
