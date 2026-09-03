using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Calendars;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.Calendars;

/// <summary>
/// Geliştirme/tanıtım için sahte bağlama ekranı: OAuth istemcisi tanımlı DEĞİLKEN
/// hesap bağlama akışının ekranda denenebilmesini sağlar.
/// <para>
/// Sağlayıcı gerçekten yapılandırıldığında bu sayfa KAPANIR (404). Aksi hâlde takvim
/// izni olan herkes sahte token'lı hesap üretebilir; hesap bağlı görünür ama her okuma
/// sessizce hataya düşer.
/// </para>
/// </summary>
[Authorize(PlatformPermissions.Calendars.Default)]
public class SimulateAuthModel : AbpPageModel
{
    private readonly IConfiguration _configuration;

    public SimulateAuthModel(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public IActionResult OnGet(int provider = (int)CalendarProviderType.Google)
    {
        var sectionKey = provider == (int)CalendarProviderType.Outlook ? "Outlook" : "Google";

        var configured = !string.IsNullOrWhiteSpace(_configuration[$"Calendars:{sectionKey}:ClientId"])
                      && !string.IsNullOrWhiteSpace(_configuration[$"Calendars:{sectionKey}:ClientSecret"]);

        return configured ? NotFound() : Page();
    }
}
