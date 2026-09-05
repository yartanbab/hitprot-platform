using System.Threading.Tasks;
using Apya.Platform.ReleaseNotes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;

namespace Apya.Platform.Web.Controllers;

/// <summary>
/// "Yenilikler" penceresinin görülme işaretini yazar (kullanıcı ayarına). Antiforgery bilinçli
/// devre dışı: uç yalnız kullanıcının kendi "gördüm" bayrağını günceller, sahte istek zararsızdır.
///
/// <para>Damga istemciden ALINMAZ; sunucu kullanıcının o an göreceği madde kümesinden
/// yeniden hesaplar. Böylece manipülasyonla "hepsini gördüm" yazdırılamaz.</para>
/// </summary>
[Authorize]
[IgnoreAntiforgeryToken]
[Route("release-notes")]
public class ReleaseNotesController : AbpController
{
    private readonly IReleaseNotePublicationAppService _publicationAppService;

    public ReleaseNotesController(IReleaseNotePublicationAppService publicationAppService)
    {
        _publicationAppService = publicationAppService;
    }

    [HttpPost("mark-seen")]
    public async Task<IActionResult> MarkSeenAsync()
    {
        await _publicationAppService.MarkSeenAsync();
        return NoContent();
    }
}
