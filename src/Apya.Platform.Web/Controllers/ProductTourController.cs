using System.Threading.Tasks;
using Apya.Platform.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.SettingManagement;

namespace Apya.Platform.Web.Controllers;

/// <summary>
/// Tanıtım turunun "görüldü" işaretini yazar (kullanıcı ayarına).
/// ReleaseNotesController ile aynı desen: antiforgery bilinçli devre dışı —
/// uç yalnız kullanıcının kendi bayrağını günceller, sahte istek zararsızdır
/// (en kötü ihtimalle kullanıcı turu bir kez görmemiş olur).
/// </summary>
[Authorize]
[IgnoreAntiforgeryToken]
[Route("product-tour")]
public class ProductTourController : AbpController
{
    private readonly ISettingManager _settingManager;

    public ProductTourController(ISettingManager settingManager)
    {
        _settingManager = settingManager;
    }

    [HttpPost("mark-seen")]
    public async Task<IActionResult> MarkSeenAsync()
    {
        await _settingManager.SetForCurrentUserAsync(PlatformSettings.Tour.Completed, "true");
        return NoContent();
    }
}
