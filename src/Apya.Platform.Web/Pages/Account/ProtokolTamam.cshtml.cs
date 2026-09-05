using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages.Account;

/// <summary>
/// Protokol onaylandı, hesap açıldı. Kiracı adı ve yönetici e-postası TempData ile gelir —
/// bu değerleri sorguya koymak, giriş bilgilerini tarayıcı geçmişine ve sunucu erişim
/// loglarına yazmak olurdu.
/// </summary>
[AllowAnonymous]
public class ProtokolTamamModel : PlatformPageModel
{
    public string? TenantName { get; private set; }

    public string? AdminEmail { get; private set; }

    public string? AgreementNumber { get; private set; }

    public IActionResult OnGet()
    {
        TenantName = TempData["ProtocolTenantName"] as string;
        AdminEmail = TempData["ProtocolAdminEmail"] as string;
        AgreementNumber = TempData["ProtocolAgreementNumber"] as string;

        // Doğrudan adrese gidilmişse gösterecek bir şey yok; girişe al.
        if (string.IsNullOrWhiteSpace(TenantName))
        {
            return RedirectToPage("./Login");
        }

        return Page();
    }
}
