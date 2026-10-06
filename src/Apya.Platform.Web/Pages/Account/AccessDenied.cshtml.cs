using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages.Account;

/// <summary>
/// Çerez işleyicisinin erişim reddi sayfası. Oturumlu kullanıcı hangi yoldan gelirse gelsin
/// (sayfa işleyicilerindeki açık Forbid(), HTML dışı istekler, eski yer imleri) uygulama kabuğundaki
/// /AccessDenied'a gider — hesap düzeninde "Girişe dön" oturum açıkken giriş formuna ve aynı yasak
/// adrese döngü kuruyordu (ROL-05, ACC-12). Oturumsuz görünüm aynen kalır.
///
/// <para>Çerez AccessDeniedPath'i DEĞİŞMEZ (global kimlik çerezi ayarı); bedeli bu yollarda tek ek
/// 302. Yasaklı tam sayfa gezinmeleri zaten doğrudan /AccessDenied'a gider
/// (<see cref="Middleware.AccessDeniedResultHandler"/>).</para>
/// </summary>
[AllowAnonymous]
public class ApyaAccessDeniedModel : Volo.Abp.Account.Web.Pages.Account.AccessDeniedModel
{
    public override Task<IActionResult> OnGetAsync()
        => CurrentUser.IsAuthenticated ? Task.FromResult(ToApplicationPage()) : base.OnGetAsync();

    public override Task<IActionResult> OnPostAsync()
        => CurrentUser.IsAuthenticated ? Task.FromResult(ToApplicationPage()) : base.OnPostAsync();

    private IActionResult ToApplicationPage()
        => RedirectToPage("/AccessDenied/Index", new { returnUrl = ReturnUrl });
}
