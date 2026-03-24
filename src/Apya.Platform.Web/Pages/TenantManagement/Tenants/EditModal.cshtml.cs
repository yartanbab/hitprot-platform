using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Tenants;

namespace Apya.Platform.Web.Pages.TenantManagement.Tenants;

public class EditModalModel : AbpPageModel
{
    private readonly ITenantProfileAppService _tenantProfileAppService;

    [HiddenInput]
    [BindProperty]
    public Guid TenantId { get; set; }

    [BindProperty]
    public string? TenantName { get; set; }

    [BindProperty]
    public UpdateTenantProfileDto Tenant { get; set; } = new();

    public EditModalModel(ITenantProfileAppService tenantProfileAppService)
    {
        _tenantProfileAppService = tenantProfileAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync(Guid id)
    {
        TenantId = id;
        var profile = await _tenantProfileAppService.GetProfileAsync(id);
        
        TenantName = profile.TenantName;
        Tenant.CompanyType = profile.CompanyType;
        Tenant.CorporateEmail = profile.CorporateEmail;
        Tenant.TaxNumber = profile.TaxNumber;
        Tenant.TaxOffice = profile.TaxOffice;
        Tenant.Address = profile.Address;
        Tenant.LegalRepresentativeName = profile.LegalRepresentativeName;
        Tenant.LegalRepresentativePhone = profile.LegalRepresentativePhone;
        Tenant.OperationalContactName = profile.OperationalContactName;
        Tenant.OperationalContactPhone = profile.OperationalContactPhone;
        
        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _tenantProfileAppService.UpdateProfileAsync(TenantId, Tenant);
        return NoContent();
    }
}
