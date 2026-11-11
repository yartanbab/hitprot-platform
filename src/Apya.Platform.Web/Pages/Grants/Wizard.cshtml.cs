using System;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 2a · Başvuru sihirbazı. Kiracı (firma) ve host (danışman) AYNI sayfayı açar;
/// rol sunucuda çözülür (bkz. GrantApplicationWizardAppService).
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class WizardModel : PlatformPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public IActionResult OnGet()
    {
        // Başvuru kimliği olmadan sihirbazın gösterecek bir şeyi yok.
        return Id == Guid.Empty ? Redirect("/Grants") : Page();
    }

    /// <summary>Başvurunun PDF özeti; okuma sihirbazın servisinden (firma/danışman görme kuralı orada).</summary>
    public async Task<IActionResult> OnGetPdfAsync([FromServices] IGrantApplicationWizardAppService wizard)
    {
        var application = await wizard.GetAsync(Id);
        var bytes = GrantApplicationPdf.Build(application, L, Clock.Now);
        return File(bytes, "application/pdf", $"{L["Grants:Pdf:FileName"]}_{application.GrantName}.pdf");
    }
}
