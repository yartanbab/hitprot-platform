using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.TenantManagement;
using Apya.Platform.Ai.Tenants;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;
using Apya.Platform.Ai.Permissions;

namespace Apya.Platform.Web.Pages.TenantManagement.AiSettings;

// İki kapı birlikte (AND): sayfa ManageAi, çağırdığı servis AiPermissions.TenantSettings.Default
// istiyor. Yalnız ilki varken sayfa açılıp servis çağrısında 500 veriyordu.
[Authorize(PlatformPermissions.TenantSettings.ManageAi)]
[Authorize(AiPermissions.TenantSettings.Default)]
public class IndexModel : AbpPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid? TenantId { get; set; }

    [BindProperty]
    public UpdateTenantAiSettingsDto Input { get; set; } = new();

    public TenantAiSettingsDto? Current { get; set; }
    public List<TenantSelectItem> TenantOptions { get; set; } = new();

    private readonly ITenantAiSettingsAppService _appService;
    private readonly ITenantAppService _tenantAppService;

    public IndexModel(ITenantAiSettingsAppService appService, ITenantAppService tenantAppService)
    {
        _appService = appService;
        _tenantAppService = tenantAppService;
    }

    public async Task OnGetAsync()
    {
        await LoadTenantsAsync();
        Current = await _appService.GetAsync(TenantId);
        Input.PreferredProvider = Current.PreferredProvider;
        Input.PreferredModel = Current.PreferredModel;
        Input.MonthlyTokenQuota = Current.MonthlyTokenQuota;
        Input.IsEnabled = Current.IsEnabled;
    }

    public async Task<IActionResult> OnPostAsync()
    {
        await _appService.UpdateAsync(TenantId, Input);
        return RedirectToPage(new { TenantId });
    }

    public async Task<IActionResult> OnPostResetAsync()
    {
        await _appService.ResetQuotaAsync(TenantId);
        return RedirectToPage(new { TenantId });
    }

    private async Task LoadTenantsAsync()
    {
        TenantOptions.Add(new TenantSelectItem(null, "(Host)"));

        // Kiracı listesi ayrı izin (AbpTenantManagement.Tenants) ister; yoksa seçici yalnız
        // host'u gösterir — sayfa tümden düşmez.
        if (!await AuthorizationService.IsGrantedAsync(TenantManagementPermissions.Tenants.Default))
        {
            return;
        }

        var tenants = await _tenantAppService.GetListAsync(new GetTenantsInput { MaxResultCount = 100 });
        foreach (var t in tenants.Items)
            TenantOptions.Add(new TenantSelectItem(t.Id, t.Name));
    }

    public record TenantSelectItem(Guid? Id, string Name);
}
