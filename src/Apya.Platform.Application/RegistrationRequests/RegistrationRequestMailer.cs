using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Emailing;

namespace Apya.Platform.RegistrationRequests;

/// <summary>
/// K-02 · Kayıt talebinin adaya giden postaları: "talebiniz alındı" ve ret. Onay postası davet
/// bağlantısıyla gider (<see cref="RegistrationInviteMailer"/>).
///
/// <para>🔑 Davet postasıyla aynı sözleşme: gönderim ZORUNLU DEĞİL ve hata YUTULUR. SMTP yoksa talep
/// yine kaydedilir, durum yine değişir; aday ekranı ve host paneli postaya bağlı değildir.</para>
/// <para>Kullanıcı kararı (2026-10-19): ret gerekçesi adaya YAZILMAZ (host notu iç kayıttır) ve
/// yanıt süresi sözü VERİLMEZ.</para>
/// </summary>
public class RegistrationRequestMailer : ITransientDependency
{
    private readonly IEmailSender _emailSender;
    private readonly ILogger<RegistrationRequestMailer> _logger;

    public RegistrationRequestMailer(IEmailSender emailSender, ILogger<RegistrationRequestMailer> logger)
    {
        _emailSender = emailSender;
        _logger = logger;
    }

    public Task<bool> TrySendReceivedAsync(RegistrationRequest request)
        => TrySendAsync(request, "APYA Platformu — kayıt talebiniz alındı (" + RegistrationRequestReference.Of(request.Id) + ")",
            BuildReceivedBody(request));

    public Task<bool> TrySendRejectedAsync(RegistrationRequest request)
        => TrySendAsync(request, "APYA Platformu — kayıt talebiniz hakkında (" + RegistrationRequestReference.Of(request.Id) + ")",
            BuildRejectedBody(request));

    private async Task<bool> TrySendAsync(RegistrationRequest request, string subject, string body)
    {
        try
        {
            await _emailSender.SendAsync(request.Email, subject, body);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Kayıt talebi postası gönderilemedi ({Email}).", request.Email);
            return false;
        }
    }

    /// <summary>🔐 Adaydan gelen değerler HTML olarak kaçırılır (gövde HTML gider, metin formdan gelir).</summary>
    public static string BuildReceivedBody(RegistrationRequest request)
    {
        var name = WebUtility.HtmlEncode(request.FullName);
        var company = WebUtility.HtmlEncode(request.CompanyName);
        var reference = RegistrationRequestReference.Of(request.Id);
        return $"""
            <p>Sayın {name},</p>
            <p><strong>{company}</strong> adına gönderdiğiniz kayıt talebi bize ulaştı.</p>
            <p>Referans numaranız: <strong>{reference}</strong>. Bizimle yazışırken bu numarayı belirtmeniz yeterli.</p>
            <p>Ekibimiz talebinizi ve seçtiğiniz paketi değerlendirecek. Onayladığımızda hizmet protokolünü ve KVKK
            taahhütlerini onaylamanız için size bir bağlantı göndereceğiz; hesabınız bu onaydan sonra açılır.</p>
            <p>APYA Platformu</p>
            """;
    }

    /// <summary>Ret postası: gerekçe ve süre sözü YOK (kullanıcı kararı); host notu hiç kullanılmaz.</summary>
    public static string BuildRejectedBody(RegistrationRequest request)
    {
        var name = WebUtility.HtmlEncode(request.FullName);
        var company = WebUtility.HtmlEncode(request.CompanyName);
        var reference = RegistrationRequestReference.Of(request.Id);
        return $"""
            <p>Sayın {name},</p>
            <p><strong>{company}</strong> adına gönderdiğiniz kayıt talebini ({reference}) değerlendirdik.
            Şu aşamada talebinizle ilerleyemiyoruz.</p>
            <p>İlginiz için teşekkür ederiz.</p>
            <p>APYA Platformu</p>
            """;
    }
}
