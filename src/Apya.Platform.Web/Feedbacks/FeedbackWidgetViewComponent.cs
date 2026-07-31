using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Users;

namespace Apya.Platform.Web.Feedbacks;

/// <summary>
/// Site geneli geri bildirim tetikleyicisi + her sayfada gizli duran gönderim modalı.
/// Yalnızca oturum açmış kullanıcıda render edilir (gönderme izin gerektirmez,
/// yalnızca oturum — bkz. PlatformPermissions.Feedbacks yorumu).
/// Görünürlük, konum ve form seçenekleri AYARDAN gelir; koda gömülü değildir.
/// </summary>
public class FeedbackWidgetViewComponent : AbpViewComponent
{
    protected ICurrentUser CurrentUser { get; }
    protected IFeedbackSettingsAppService SettingsAppService { get; }

    public FeedbackWidgetViewComponent(
        ICurrentUser currentUser,
        IFeedbackSettingsAppService settingsAppService)
    {
        CurrentUser = currentUser;
        SettingsAppService = settingsAppService;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        if (!CurrentUser.IsAuthenticated)
        {
            return View("Empty");
        }

        var settings = await SettingsAppService.GetAsync();

        if (!settings.TriggerEnabled)
        {
            return View("Empty");
        }

        return View(new FeedbackWidgetViewModel
        {
            Placement = settings.TriggerPlacement,
            EnabledTypes = settings.EnabledTypes,
            MaxFileSizeMb = settings.MaxFileSizeMb,
            AllowedFileExtensions = settings.AllowedFileExtensions,
            AllowAnonymous = settings.AllowAnonymous
        });
    }
}

public class FeedbackWidgetViewModel
{
    /// <summary>"header" veya "floating".</summary>
    public string Placement { get; set; } = "header";

    /// <summary>Boş liste = tüm türler gösterilir.</summary>
    public List<FeedbackType> EnabledTypes { get; set; } = new();

    public int MaxFileSizeMb { get; set; }
    public string AllowedFileExtensions { get; set; } = string.Empty;
    public bool AllowAnonymous { get; set; }

    public bool IsTypeEnabled(FeedbackType type)
        => EnabledTypes.Count == 0 || EnabledTypes.Contains(type);
}
