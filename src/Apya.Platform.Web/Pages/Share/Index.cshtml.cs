using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Web.Pages.Share;

/// <summary>
/// Denetçi görünümü — süreli link ile açılan, SALT OKUNUR dış sayfa.
///
/// Anonimdir: yetki token'ın kendisindedir. Sayfa bilinçli olarak React island
/// kullanmaz; dış alıcıya uygulamanın tüm paketini göndermenin bir faydası yok
/// ve saldırı yüzeyini büyütür.
/// </summary>
[AllowAnonymous]
public class IndexModel : AbpPageModel
{
    private readonly IExternalShareAppService _shareAppService;

    public IndexModel(IExternalShareAppService shareAppService)
    {
        _shareAppService = shareAppService;
    }

    public SharedPackageViewDto? View { get; private set; }

    /// <summary>Link süresi dolmuş/iptal edilmiş ya da hiç yoksa gösterilecek mesaj.</summary>
    public string? ErrorMessage { get; private set; }

    public async Task OnGetAsync(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            ErrorMessage = "Bağlantı geçersiz.";
            return;
        }

        try
        {
            View = await _shareAppService.ResolveAsync(token, HashClientIp(), TruncatedUserAgent());
        }
        catch (BusinessException ex) when (ex.Code == PlatformDomainErrorCodes.ShareLinkExpired)
        {
            ErrorMessage = "Bu bağlantının süresi dolmuş.";
        }
        catch (BusinessException ex) when (ex.Code == PlatformDomainErrorCodes.ShareLinkRevoked)
        {
            ErrorMessage = "Bu bağlantı iptal edilmiş.";
        }
        catch (EntityNotFoundException)
        {
            // Var olmayan token ile süresi dolmuş token aynı mesajı alır —
            // geçerli token tahmin etmeyi kolaylaştıracak bir ipucu vermeyiz.
            ErrorMessage = "Bağlantı geçersiz.";
        }
    }

    /// <summary>
    /// KVKK: ham IP saklanmaz. Tek yönlü özet yalnız aynı ziyaretçiyi tekrar eden
    /// erişimlerde eşleştirmeye yarar; kişi tanımlamaya değil.
    /// </summary>
    private string? HashClientIp()
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();

        if (string.IsNullOrEmpty(ip))
        {
            return null;
        }

        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(ip));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }

    private string? TruncatedUserAgent()
    {
        var agent = Request.Headers.UserAgent.ToString();
        return string.IsNullOrWhiteSpace(agent)
            ? null
            : agent.Length > 400 ? agent[..400] : agent;
    }
}
