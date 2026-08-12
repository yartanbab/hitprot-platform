using System.Threading.Tasks;
using Apya.Platform.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.SettingManagement;

namespace Apya.Platform.Web.Pages.Settings;

/// <summary>
/// Kişisel "Genel Ayarlar" sayfası — her oturumlu kullanıcı kendi tercihlerini yönetir.
/// Özel izin YOK, yalnız kimlik doğrulaması yeterli.
/// </summary>
[Authorize]
public class IndexModel : AbpPageModel
{
    [BindProperty]
    public string TaskDetailUi { get; set; } = PlatformSettingDefaults.TaskDetailUi;

    private readonly ISettingManager _settingManager;

    public IndexModel(ISettingManager settingManager)
    {
        _settingManager = settingManager;
    }

    public async Task OnGetAsync()
    {
        // fallback: true → kullanıcı henüz seçmediyse tanımlı varsayılana ("v3") iner.
        TaskDetailUi = await _settingManager.GetOrNullForCurrentUserAsync(PlatformSettings.TaskDetail.Ui)
                       ?? PlatformSettingDefaults.TaskDetailUi;
    }

    public async Task<IActionResult> OnPostAsync()
    {
        // Beyaz liste dışındaki her şey varsayılana çekilir (form manipülasyonuna karşı).
        var value = System.Array.IndexOf(PlatformSettingDefaults.TaskDetailUiValues, TaskDetailUi) >= 0
            ? TaskDetailUi
            : PlatformSettingDefaults.TaskDetailUi;
        await _settingManager.SetForCurrentUserAsync(PlatformSettings.TaskDetail.Ui, value);
        TempData["Saved"] = true;
        return RedirectToPage();
    }
}
