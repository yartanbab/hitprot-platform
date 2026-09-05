using System.Threading.Tasks;
using Apya.Platform.Consents;
using Apya.Platform.Consents.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Admin.Consent;

[Authorize(PlatformPermissions.Consents.Default)]
public class IndexModel : AbpPageModel
{
    private readonly IConsentAppService _consentAppService;

    [BindProperty(SupportsGet = true)]
    public int Days { get; set; } = 30;

    public ConsentAnalyticsDto Stats { get; set; } = default!;

    public IndexModel(IConsentAppService consentAppService)
    {
        _consentAppService = consentAppService;
    }

    public async Task OnGetAsync()
    {
        Stats = await _consentAppService.GetAnalyticsAsync(new ConsentAnalyticsFilter { WindowDays = Days });
    }

    public static string TypeLabel(ConsentType type) => type switch
    {
        ConsentType.CookieNotice => "Çerez Bilgilendirmesi",
        ConsentType.FormKvkk => "Form KVKK Onayı",
        ConsentType.AiTransfer => "AI / Yurt Dışı Aktarım",
        ConsentType.ServiceAgreement => "Hizmet Protokolü Kabulü",
        ConsentType.ServiceAgreementKvkk => "Protokol KVKK Taahhüdü",
        _ => type.ToString()
    };
}
