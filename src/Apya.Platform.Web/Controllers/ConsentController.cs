using System;
using System.Threading.Tasks;
using Apya.Platform.Consents;
using Apya.Platform.Consents.Dtos;
using Apya.Platform.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.SettingManagement;
using Volo.Abp.Uow;

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
    private readonly ISettingManager _settingManager;
    private readonly IUnitOfWorkManager _unitOfWorkManager;

    public ConsentController(
        IConsentAppService consentAppService,
        ISettingManager settingManager,
        IUnitOfWorkManager unitOfWorkManager)
    {
        _consentAppService = consentAppService;
        _settingManager = settingManager;
        _unitOfWorkManager = unitOfWorkManager;
    }

    /// <summary>
    /// Çerez bilgilendirme şeridinin "anladım" onayı.
    /// <para>
    /// Sıra ÖNEMLİ: önce onay çerezi bırakılır, DB yazımları SONRA gelir ve
    /// izole edilir. Aksi halde tek bir DB hatası (örn. <c>AppConsentRecords</c>
    /// tablosu yoksa) 500'e döner, hata ara katmanı yanıtı temizlerken
    /// <c>Set-Cookie</c> de düşer ve şerit her sayfada geri gelir.
    /// </para>
    /// </summary>
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
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddYears(1),
                IsEssential = true
            });
        }

        // Şeridi bir daha gösterme. Secure yalnız HTTPS'te işaretlenir; sabit true
        // olsaydı düz HTTP ile çalışan ortamda tarayıcı çerezi sessizce ATAR.
        Response.Cookies.Append(ConsentConsts.CookieNoticeAckCookieName, ConsentConsts.CookiePolicyVersion, new CookieOptions
        {
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddYears(1),
            IsEssential = true
        });

        // Giriş yapmış kullanıcıda onay ayrıca kullanıcı ayarına yazılır: çerez
        // silinse, başka tarayıcı/cihaza geçilse ya da çerez ömrü dolsa bile şerit
        // bir daha çıkmaz (ProductTour / ReleaseNotes ile aynı desen).
        if (isUser)
        {
            await TryPersistAsync(
                () => _settingManager.SetForCurrentUserAsync(PlatformSettings.CookieNotice.Acknowledged, "true"),
                "Çerez onayı kullanıcı ayarına yazılamadı; onay çerezi yine de bırakıldı.");
        }

        await TryPersistAsync(
            () => _consentAppService.RecordAsync(new RecordConsentInput
            {
                Type = ConsentType.CookieNotice,
                Granted = true,
                SubjectKind = isUser ? ConsentSubjectKind.User : ConsentSubjectKind.Anonymous,
                SubjectId = isUser ? CurrentUser.Id?.ToString() : anonymousId,
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                UserAgent = Request.Headers.UserAgent.ToString(),
                SourceRef = Request.Headers.Referer.ToString()
            }),
            "Çerez rıza kaydı yazılamadı (AppConsentRecords). Onay çerezi bırakıldı, şerit tekrar gösterilmeyecek.");

        return NoContent();
    }

    /// <summary>
    /// Yazmayı KENDİ iş biriminde çalıştırır ve hatayı yutar. Ayrı iş birimi şart:
    /// dış iş birimine düşen bir <c>SaveChanges</c> hatası istek sonunda yeniden
    /// fırlar ve yanıtı (dolayısıyla onay çerezini) düşürürdü. Onay kullanıcıya
    /// aittir; analiz/ispat kaydının yazılamaması onu geri almaz.
    /// </summary>
    private async Task TryPersistAsync(Func<Task> action, string failureMessage)
    {
        try
        {
            using var uow = _unitOfWorkManager.Begin(requiresNew: true, isTransactional: false);
            await action();
            await uow.CompleteAsync();
        }
        catch (Exception ex)
        {
            Logger.LogWarning(ex, failureMessage);
        }
    }
}
