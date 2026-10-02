using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.TenantManagement;
using Apya.Platform.Ai.Tenants;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Ai.Providers;

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

    /// <summary>Seçilebilir sağlayıcılar — servisin kabul ettiği kümenin aynısı (ADM-14).</summary>
    public List<SelectListItem> ProviderOptions { get; private set; } = new();

    /// <summary>Kayıtlı değer geçerli adlardan biri değilse ham hâli (serbest metin döneminden kalan kayıt).</summary>
    public string? UnknownStoredProvider { get; private set; }

    /// <summary>Değer listede yoksa boş yer tutucu basılır: sessizce ilk sağlayıcıya düşüp kaydı ezmesin.</summary>
    public bool ProviderNeedsChoice => ProviderOptions.All(o => o.Value != Input.PreferredProvider);

    private readonly ITenantAiSettingsAppService _appService;
    private readonly ITenantAppService _tenantAppService;

    public IndexModel(ITenantAiSettingsAppService appService, ITenantAppService tenantAppService)
    {
        _appService = appService;
        _tenantAppService = tenantAppService;
    }

    public async Task OnGetAsync()
    {
        await LoadAsync();
        Input.PreferredProvider = Canonical(Current!.PreferredProvider) ?? string.Empty;
        Input.PreferredModel = Current.PreferredModel;
        Input.MonthlyTokenQuota = Current.MonthlyTokenQuota;
        Input.IsEnabled = Current.IsEnabled;
    }

    public async Task<IActionResult> OnPostAsync()
    {
        // Hata aynı sayfada, alanın altında; yazılan değerler bağlanmış modelden korunur.
        if (!ModelState.IsValid)
        {
            await LoadAsync();
            return Page();
        }

        try
        {
            await _appService.UpdateAsync(TenantId, Input);
        }
        catch (BusinessException ex) when (ex.Code == PlatformDomainErrorCodes.AiProviderUnknown)
        {
            ModelState.AddModelError("Input.PreferredProvider", this.UserMessage(ex));
            await LoadAsync();
            return Page();
        }

        TempData["Saved"] = true;
        return RedirectToPage(new { TenantId });
    }

    public async Task<IActionResult> OnPostResetAsync()
    {
        await _appService.ResetQuotaAsync(TenantId);
        return RedirectToPage(new { TenantId });
    }

    /// <summary>Sayfanın salt okunur kısmı. <see cref="Input"/>'a DOKUNMAZ (hatalı gönderimde yazılanlar kalır).</summary>
    private async Task LoadAsync()
    {
        await LoadTenantsAsync();
        Current = await _appService.GetAsync(TenantId);

        var names = await _appService.GetProviderNamesAsync();
        ProviderOptions = names.Select(n => new SelectListItem(Label(n), n)).ToList();
        UnknownStoredProvider = Canonical(Current.PreferredProvider) == null ? Current.PreferredProvider : null;
    }

    /// <summary>AI Merkezi'ndeki yazımla aynı etiket (OpenAI, Claude, Gemini, DeepSeek); eşi yoksa adın kendisi.</summary>
    private static string Label(string name) =>
        Enum.GetNames<AiProviderType>().FirstOrDefault(e => string.Equals(e, name, StringComparison.OrdinalIgnoreCase)) ?? name;

    private string? Canonical(string? provider) =>
        ProviderOptions.FirstOrDefault(o => string.Equals(o.Value, provider?.Trim(), StringComparison.OrdinalIgnoreCase))?.Value;

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
