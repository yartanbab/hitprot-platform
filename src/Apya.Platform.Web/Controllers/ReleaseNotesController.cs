using System.Threading.Tasks;
using Apya.Platform.Settings;
using Apya.Platform.Web.ReleaseNotes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.SettingManagement;

namespace Apya.Platform.Web.Controllers;

/// <summary>
/// "Yenilikler" penceresinin görülme işaretini yazar (kullanıcı ayarına). Antiforgery bilinçli
/// devre dışı: uç yalnız kullanıcının kendi "gördüm" bayrağını günceller, sahte istek zararsızdır.
/// </summary>
[Authorize]
[IgnoreAntiforgeryToken]
[Route("release-notes")]
public class ReleaseNotesController : AbpController
{
    private readonly ISettingManager _settingManager;

    public ReleaseNotesController(ISettingManager settingManager)
    {
        _settingManager = settingManager;
    }

    [HttpPost("mark-seen")]
    public async Task<IActionResult> MarkSeenAsync(string? version)
    {
        // Yalnız katalogda var olan bir sürümü kabul et; yoksa en yeniye çek (manipülasyona karşı).
        var target = ReleaseNoteCatalog.Find(version) ?? ReleaseNoteCatalog.Latest;
        await _settingManager.SetForCurrentUserAsync(
            PlatformSettings.ReleaseNotes.LastSeenVersion, target.Version);
        return NoContent();
    }
}
