using System.Threading.Tasks;
using Apya.Platform.Accounts;
using Apya.Platform.Accounts.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Admin.LoginScreen;

/// <summary>
/// Giriş ekranı yapılandırması — host seviyesinde. Değerler ABP Setting olarak
/// saklanır, hiçbiri koda gömülü değildir.
/// </summary>
[Authorize(PlatformPermissions.LoginScreen.Default)]
public class IndexModel : AbpPageModel
{
    private readonly ILoginScreenSettingsAppService _settingsAppService;

    [BindProperty]
    public LoginScreenSettingsDto Settings { get; set; } = new();

    public IndexModel(ILoginScreenSettingsAppService settingsAppService)
    {
        _settingsAppService = settingsAppService;
    }

    public async Task OnGetAsync()
    {
        Settings = await _settingsAppService.GetAsync();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        await _settingsAppService.UpdateAsync(Settings);
        TempData["Saved"] = true;
        return RedirectToPage();
    }
}
