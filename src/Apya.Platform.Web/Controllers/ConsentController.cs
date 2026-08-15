using System;
using System.Threading.Tasks;
using Apya.Platform.Consents;
using Apya.Platform.Consents.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;

namespace Apya.Platform.Web.Controllers;

/// <summary>
/// Rıza yazma sınırı. Oturumsuz erişilir; IP/UA SUNUCUDA yakalanır (istemciye
/// güvenilmez), sonra in-process <see cref="IConsentAppService"/> çağrılır.
/// Antiforgery bilinçli devre dışı: uç yalnız "çerez bilgilendirmesini gördüm"
/// kaydı oluşturur; sahte istek zararsızdır.
/// </summary>
[AllowAnonymous]
[IgnoreAntiforgeryToken]
[Route("consent")]
public class ConsentController : AbpController
{
    private readonly IConsentAppService _consentAppService;

    public ConsentController(IConsentAppService consentAppService)
    {
        _consentAppService = consentAppService;
    }

    /// <summary>Çerez bilgilendirme şeridinin "anladım" onayı.</summary>
    [HttpPost("ack")]
    public async Task<IActionResult> AckCookieNoticeAsync()
    {
        var isUser = CurrentUser.IsAuthenticated;

        // Oturumsuz ziyaretçiyi rıza kaydı için tanımla (kalıcı çerez).
        var anonymousId = Request.Cookies[ConsentConsts.AnonymousIdCookieName];
        if (!isUser && string.IsNullOrEmpty(anonymousId))
        {
            anonymousId = Guid.NewGuid().ToString("N");
            Response.Cookies.Append(ConsentConsts.AnonymousIdCookieName, anonymousId, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddYears(1),
                IsEssential = true
            });
        }

        await _consentAppService.RecordAsync(new RecordConsentInput
        {
            Type = ConsentType.CookieNotice,
            Granted = true,
            SubjectKind = isUser ? ConsentSubjectKind.User : ConsentSubjectKind.Anonymous,
            SubjectId = isUser ? CurrentUser.Id?.ToString() : anonymousId,
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
            UserAgent = Request.Headers.UserAgent.ToString(),
            SourceRef = Request.Headers.Referer.ToString()
        });

        // Şeridi bir daha gösterme.
        Response.Cookies.Append(ConsentConsts.CookieNoticeAckCookieName, ConsentConsts.CookiePolicyVersion, new CookieOptions
        {
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddYears(1),
            IsEssential = true
        });

        return NoContent();
    }
}
