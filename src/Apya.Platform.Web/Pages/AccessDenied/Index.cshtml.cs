using System;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Tenants;
using Apya.Platform.Web.Pages.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages.AccessDenied;

/// <summary>
/// Oturumlu kullanıcının erişim reddi — uygulama kabuğunda (ROL-05, ACC-12, SHL-11, GRT-14).
///
/// <para>Rota bilerek /Account DIŞINDA: kabuk betikleri (kenar çubuğu, üst çubuk, komut paleti,
/// tema, mobil çekmece) /Account/* yolunda erken döner; aynı URL'de düzeni değiştirmek kabuğu yarım
/// bırakırdı. Yasaklı tam sayfa gezinmesi buraya eksik izin adıyla gelir
/// (<see cref="Middleware.AccessDeniedResultHandler"/>); açık Forbid() ve eski yer imleri çerez
/// yolundan (/Account/AccessDenied → <see cref="Account.ApyaAccessDeniedModel"/>) izinsiz gelir.</para>
///
/// <para>Öznitelik YOK: oturumsuz istek girişe değil eski /Account/AccessDenied'a gider (hesap düzeni
/// + "Girişe dön" aynen). ReturnUrl ekrana basılmaz ve oturumlu dalda hiçbir yere yönlendirme hedefi
/// değildir.</para>
/// </summary>
public class IndexModel : PlatformPageModel
{
    private readonly AccessDenialExplainer _explainer;

    public IndexModel(AccessDenialExplainer explainer)
    {
        _explainer = explainer;
    }

    [BindProperty(SupportsGet = true)]
    public string? ReturnUrl { get; set; }

    /// <summary>Reddedilen izin adları (en fazla 5; açıklayıcı ayrıca süzer).</summary>
    [BindProperty(SupportsGet = true, Name = "permission")]
    public string[] Permission { get; set; } = Array.Empty<string>();

    public EmptyStateModel State { get; private set; } = new();

    public async Task<IActionResult> OnGetAsync()
    {
        if (!CurrentUser.IsAuthenticated)
        {
            return Redirect(Url.Content("~/Account/AccessDenied") + QueryString.Create("ReturnUrl", ReturnUrl ?? string.Empty));
        }

        // Çerez yönlendirmesini izleyen X-Requested-With'siz fetch HTML almasın ("Unexpected token <").
        if (!PlatformWebModule.IsHtmlNavigation(HttpContext))
        {
            return StatusCode(StatusCodes.Status403Forbidden);
        }

        var explanation = await _explainer.ExplainAsync(Permission);
        var canViewSubscription = CurrentTenant.Id != null
            && await AuthorizationService.IsGrantedAsync(PlatformPermissions.TenantSettings.Default);
        var canOpenDashboard = await AuthorizationService.IsGrantedAsync(ErrorStates.DashboardPermission);

        State = ErrorStates.ForAccessDenial(explanation, canOpenDashboard, canViewSubscription, L);
        return Page();
    }
}
