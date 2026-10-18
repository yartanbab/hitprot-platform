using System.Threading.Tasks;
using Apya.Platform.ReleaseNotes;
using Apya.Platform.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.SettingManagement;
using Volo.Abp.Settings;

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
    private readonly ISettingProvider _settingProvider;
    private readonly IReleaseNotePublicationAppService _releaseNotes;

    public ProductTourController(
        ISettingManager settingManager,
        ISettingProvider settingProvider,
        IReleaseNotePublicationAppService releaseNotes)
    {
        _settingManager = settingManager;
        _settingProvider = settingProvider;
        _releaseNotes = releaseNotes;
    }

    [HttpPost("mark-seen")]
    public async Task<IActionResult> MarkSeenAsync()
    {
        await _settingManager.SetForCurrentUserAsync(PlatformSettings.Tour.Completed, "true");

        // K-12 · Hiç sürüm notu görmemiş kullanıcı turu bitirince o anki "Yenilikler" yeni değil:
        // ürünü zaten bu hâliyle tanıdı, düzeltilen eski davranışları hiç görmedi. Pencere turun
        // hemen ardından açılıp ikinci bir tanıtım bindirmesin; sonraki sürümler yine açılır.
        // Ayarın varsayılanı boş metin ("hiç görmedi"), null değil.
        if (string.IsNullOrEmpty(await _settingProvider.GetOrNullAsync(PlatformSettings.ReleaseNotes.LastSeenVersion)))
        {
            await _releaseNotes.MarkSeenAsync();
        }

        return NoContent();
    }
}
