using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks;
using Apya.Platform.Feedbacks.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Admin.Feedback;

/// <summary>
/// Geri bildirim modülü yapılandırması. Tüm değerler ABP Setting olarak saklanır —
/// hiçbiri koda gömülü değildir.
/// </summary>
[Authorize(PlatformPermissions.Feedbacks.ManageSettings)]
public class SettingsModel : AbpPageModel
{
    private readonly IFeedbackSettingsAppService _settingsAppService;

    [BindProperty]
    public FeedbackSettingsDto Settings { get; set; } = new();

    /// <summary>Çoklu seçim kutusundan gelen tür değerleri.</summary>
    [BindProperty]
    public List<int> SelectedTypes { get; set; } = new();

    public SettingsModel(IFeedbackSettingsAppService settingsAppService)
    {
        _settingsAppService = settingsAppService;
    }

    public async Task OnGetAsync()
    {
        Settings = await _settingsAppService.GetAsync();
        SelectedTypes = Settings.EnabledTypes.Select(t => (int)t).ToList();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        Settings.EnabledTypes = SelectedTypes
            .Where(v => Enum.IsDefined(typeof(FeedbackType), v))
            .Select(v => (FeedbackType)v)
            .ToList();

        await _settingsAppService.UpdateAsync(Settings);

        // Ayar değişikliği anında görünür olsun diye tam sayfa yenilemesi yapılır.
        return RedirectToPage();
    }
}
