using System.Text;
using System.Threading.Tasks;
using Apya.Platform.Calendars;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;

namespace Apya.Platform.Web.Controllers;

/// <summary>
/// Takvim istemcilerinin abone olduğu salt-okunur .ics beslemesi.
/// <para>
/// Oturumsuz erişilir — Apple Takvim, Google ve Outlook bu adrese çerezsiz gelir.
/// Yetki bağlantının kendisidir: token bilinmeden içerik alınamaz, geçersiz
/// token 404 döner (kullanıcı/bağlantı var mı bilgisi sızmasın diye "yok" ile
/// "yanlış" aynı yanıtı verir).
/// </para>
/// </summary>
[AllowAnonymous]
[Route("ical")]
public class IcalController : AbpController
{
    private readonly IIcalFeedAppService _feedAppService;

    public IcalController(IIcalFeedAppService feedAppService)
    {
        _feedAppService = feedAppService;
    }

    [HttpGet("u/{token}.ics")]
    public async Task<IActionResult> GetAsync(string token)
    {
        var body = await _feedAppService.RenderAsync(token);
        if (body == null) return NotFound();

        // İstemciler dosya adını abonelik adı olarak kullanır.
        return File(Encoding.UTF8.GetBytes(body), "text/calendar; charset=utf-8", "apya-takvim.ics");
    }
}
