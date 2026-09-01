using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.Account;

/// <summary>Demo talebi alındı onayı. Kayıt bir önceki adımda oluşturuldu.</summary>
[AllowAnonymous]
public class DemoRequestSentModel : PlatformPageModel
{
    public void OnGet()
    {
    }
}
