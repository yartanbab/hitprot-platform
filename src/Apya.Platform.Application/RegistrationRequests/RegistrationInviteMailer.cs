using System;
using System.Net;
using System.Threading.Tasks;
using Apya.Platform.Tenants;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Emailing;

namespace Apya.Platform.RegistrationRequests;

/// <summary>
/// Davet bağlantısını adaya e-postayla iletir.
///
/// <para>🔑 <b>Gönderim ZORUNLU DEĞİLDİR.</b> Gönderilemezse metot <c>false</c> döner ve
/// host bağlantıyı ekrandan kopyalayıp kendisi iletir. Akışın
/// e-postaya bağlanması, posta ayarı gelene kadar hesap açılışını tamamen durdururdu.</para>
///
/// <para>🔴 Hata da YUTULUR: davet zaten üretilmiştir ve ham jeton host'un ekranında
/// duruyordur. Gönderim hatasında istisna fırlatmak, host'a "davet üretilemedi" dedirtir
/// ve elindeki geçerli bağlantıyı çöpe attırır.</para>
/// </summary>
public class RegistrationInviteMailer : ITransientDependency
{
    private readonly IEmailSender _emailSender;
    private readonly ILogger<RegistrationInviteMailer> _logger;

    public RegistrationInviteMailer(
        IEmailSender emailSender,
        ILogger<RegistrationInviteMailer> logger)
    {
        _emailSender = emailSender;
        _logger = logger;
    }

    /// <summary>
    /// Postayı gönderir. <c>true</c> = gönderildi; <c>false</c> = SMTP yapılandırılmamış
    /// ya da gönderim düştü — her iki durumda da host bağlantıyı elle iletmeli.
    /// </summary>
    public async Task<bool> TrySendAsync(RegistrationRequest request, string protocolUrl)
    {
        // 🔴 "SMTP yapılandırılmış mı" diye ÖNDEN bakmıyoruz. ABP'nin Smtp.Host ayarının
        // VARSAYILANI vardır (127.0.0.1), yani boşluk kontrolü hiçbir zaman false dönmez ve
        // sahte bir güven verir (ölçüldü: test ortamında da "yapılandırılmış" görünüyordu).
        // Tek dürüst kontrol göndermeyi denemektir: SMTP yoksa bağlantı reddedilir, aşağıdaki
        // yakalama devreye girer ve host "siz iletin" uyarısını görür.
        try
        {
            await _emailSender.SendAsync(
                request.Email,
                "APYA Platformu — hizmet protokolü onayınız bekleniyor",
                BuildBody(request, protocolUrl));

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Davet e-postası gönderilemedi ({Email}); bağlantı ekranda duruyor.", request.Email);

            return false;
        }
    }

    /// <summary>
    /// 🔐 Adaydan gelen değerler (unvan, ad) HTML olarak kaçırılır: e-posta gövdesi HTML
    /// gönderiliyor ve bu metinler formdan geliyor.
    /// </summary>
    private static string BuildBody(RegistrationRequest request, string protocolUrl)
    {
        var company = WebUtility.HtmlEncode(request.CompanyName);
        var name = WebUtility.HtmlEncode(request.FullName);
        var plan = WebUtility.HtmlEncode(SalesPlanCatalog.DisplayName(request.EffectivePlan));

        // Bağlantı jetonu taşıyor: kaçırma URL'yi bozmasın diye öznitelik içine
        // HtmlEncode ile konuyor (jeton base64url — & veya < içermez, yine de kural aynı).
        var url = WebUtility.HtmlEncode(protocolUrl);

        return $"""
            <p>Sayın {name},</p>
            <p><strong>{company}</strong> adına gönderdiğiniz kayıt talebi onaylandı.</p>
            <p>Seçilen paket: <strong>{plan}</strong></p>
            <p>Hesabınızın açılması için hizmet protokolünü okuyup onaylamanız ve
            yönetici şifrenizi belirlemeniz gerekiyor:</p>
            <p><a href="{url}">Protokolü görüntüle ve onayla</a></p>
            <p>Bağlantı size özeldir ve tek kullanımlıktır. Onayınızın ardından hesabınız
            hemen açılacaktır.</p>
            <p>APYA Platformu · Pargetto</p>
            """;
    }
}
