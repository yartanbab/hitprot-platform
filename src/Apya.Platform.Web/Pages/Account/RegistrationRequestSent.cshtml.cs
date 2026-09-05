using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.Account;

/// <summary>
/// Kayıt talebi alındı onayı. Kayıt bir önceki adımda oluşturuldu; burada adaya
/// sürecin devamı (onay → protokol → hesap) anlatılır.
/// </summary>
[AllowAnonymous]
public class RegistrationRequestSentModel : PlatformPageModel
{
    public void OnGet()
    {
    }
}
