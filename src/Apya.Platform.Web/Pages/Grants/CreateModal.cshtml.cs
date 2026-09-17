using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// Hibe PROGRAMI oluşturma penceresi (çağrı değil). Tur 22'den beri hiçbir yerden
/// açılmıyor — program /Grants/Import üzerinden doğuyor. Sayfa adresle hâlâ
/// erişilebilir olduğu için kapı burada da duruyor; yazma zaten
/// GrantAppService.CreatePolicyName ile korunuyordu.
/// </summary>
[Authorize(PlatformPermissions.Grants.Create)]
public class CreateModalModel : AbpPageModel
{
    private readonly IGrantAppService _grantAppService;

    [BindProperty]
    public CreateUpdateGrantDto Grant { get; set; } = new();

    public CreateModalModel(IGrantAppService grantAppService)
    {
        _grantAppService = grantAppService;
    }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnPostAsync()
    {
        await _grantAppService.CreateAsync(Grant);
        return NoContent();
    }
}
