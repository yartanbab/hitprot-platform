using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Microsoft.Extensions.Options;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Claims;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Notifications;

/// <summary>
/// NTF-08 Faz 2 · Tarayıcı bildirimi abonelikleri: kayıt / yenileme, sahiplik, ortak tarayıcı,
/// adres süzgeci (SSRF) ve tercihlerdeki Push anahtarı.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class NotificationDevice_Tests : PlatformEntityFrameworkCoreTestBase
{
    private const string Chrome = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";

    private readonly INotificationDeviceAppService _devices;
    private readonly INotificationAppService _notifications;
    private readonly IRepository<NotificationDevice, Guid> _deviceRepository;
    private readonly WebPushOptions _options;

    public NotificationDevice_Tests()
    {
        _devices = GetRequiredService<INotificationDeviceAppService>();
        _notifications = GetRequiredService<INotificationAppService>();
        _deviceRepository = GetRequiredService<IRepository<NotificationDevice, Guid>>();

        // Kanal yalnız anahtarlar tanımlıyken açıktır; test anahtarları gerçek değildir.
        _options = GetRequiredService<IOptions<WebPushOptions>>().Value;
        _options.PublicKey = "test-public-key";
        _options.PrivateKey = "test-private-key";
        _options.Subject = "mailto:test@example.com";
    }

    private IDisposable As(Guid userId) => GetRequiredService<ICurrentPrincipalAccessor>().Change(
        new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(AbpClaimTypes.UserId, userId.ToString()),
            new Claim(AbpClaimTypes.UserName, "cihaz-" + userId.ToString("N")[..6])
        }, "Test")));

    private static string Endpoint(string token = "") =>
        "https://fcm.googleapis.com/fcm/send/" + (token.Length > 0 ? token : Guid.NewGuid().ToString("N"));

    private static RegisterWebPushInput Input(string endpoint, string p256dh = "p256dh-1", string auth = "auth-1") => new()
    {
        Endpoint = endpoint, P256dh = p256dh, Auth = auth, UserAgent = Chrome
    };

    [Fact]
    public async Task Abonelik_kaydedilir_ayni_adres_yeniden_gelince_tek_satir_kalir_anahtar_yenilenir()
    {
        var user = Guid.NewGuid();
        var endpoint = Endpoint();

        using (As(user))
        {
            var first = await _devices.SubscribeWebPushAsync(Input(endpoint));
            first.DeviceLabel.ShouldBe("Chrome · Windows");
            // İstemci "bu cihaz" satırını bu özetle bulur; adresin kendisi dönmez.
            first.EndpointHash.ShouldBe(NotificationDevice.HashEndpoint(endpoint));
            first.IsActive.ShouldBeTrue();

            var second = await _devices.SubscribeWebPushAsync(Input(endpoint, "p256dh-2", "auth-2"));
            second.Id.ShouldBe(first.Id);

            (await _devices.GetListAsync()).Count.ShouldBe(1);
        }

        var row = (await _deviceRepository.GetListAsync(d => d.UserId == user)).Single();
        row.P256dh.ShouldBe("p256dh-2");
        row.Auth.ShouldBe("auth-2");
        row.EndpointHash.Length.ShouldBe(64);
    }

    /// <summary>Tekil indeks yalnız CANLI satırları kapsar: abonelikten çıkıp yeniden abone olunabilir.</summary>
    [Fact]
    public async Task Abonelikten_cikan_ayni_adresle_yeniden_abone_olabilir()
    {
        var user = Guid.NewGuid();
        var endpoint = Endpoint();

        using (As(user))
        {
            await _devices.SubscribeWebPushAsync(Input(endpoint));
            await _devices.UnsubscribeWebPushAsync(new UnsubscribeWebPushInput { Endpoint = endpoint });
            (await _devices.GetListAsync()).ShouldBeEmpty();

            await _devices.SubscribeWebPushAsync(Input(endpoint));
            (await _devices.GetListAsync()).Count.ShouldBe(1);
        }
    }

    /// <summary>
    /// Ortak bilgisayar: aynı tarayıcı aboneliği yeni kullanıcıya geçer, önceki kullanıcının kaydı
    /// silinir — yoksa önceki kişinin bildirimleri bu tarayıcıda görünmeye devam ederdi.
    /// </summary>
    [Fact]
    public async Task Ayni_tarayici_aboneligi_yeni_kullaniciya_gecer_oncekinin_kaydi_silinir()
    {
        var previous = Guid.NewGuid();
        var next = Guid.NewGuid();
        var endpoint = Endpoint();

        using (As(previous)) { await _devices.SubscribeWebPushAsync(Input(endpoint)); }
        using (As(next)) { await _devices.SubscribeWebPushAsync(Input(endpoint)); }

        (await _deviceRepository.GetListAsync(d => d.UserId == previous)).ShouldBeEmpty();
        (await _deviceRepository.GetListAsync(d => d.UserId == next)).Count.ShouldBe(1);
    }

    [Fact]
    public async Task Kullanici_yalniz_kendi_cihazini_gorur_ve_siler()
    {
        var owner = Guid.NewGuid();
        var other = Guid.NewGuid();
        Guid deviceId;

        using (As(owner)) { deviceId = (await _devices.SubscribeWebPushAsync(Input(Endpoint()))).Id; }

        using (As(other))
        {
            (await _devices.GetListAsync()).ShouldBeEmpty();
            await Should.ThrowAsync<EntityNotFoundException>(() => _devices.DeleteAsync(deviceId));
        }

        (await _deviceRepository.FindAsync(deviceId)).ShouldNotBeNull();

        using (As(owner)) { await _devices.DeleteAsync(deviceId); }
        (await _deviceRepository.FindAsync(deviceId)).ShouldBeNull();
    }

    /// <summary>Sunucu bu adrese istek atacak: bilinen bildirim servisleri dışındaki adres reddedilir.</summary>
    [Theory]
    [InlineData("http://fcm.googleapis.com/fcm/send/abc")]            // https değil
    [InlineData("https://localhost/push")]
    [InlineData("https://169.254.169.254/latest/meta-data")]
    [InlineData("https://fcm.googleapis.com.evil.example/push")]      // son ek taklidi
    [InlineData("https://evilfcm.googleapis.com.example.org/push")]
    [InlineData("https://fcm.googleapis.com:8443/fcm/send/abc")]      // varsayılan dışı kapı
    [InlineData("https://user:pw@fcm.googleapis.com/fcm/send/abc")]   // kimlik bilgisi taşıyan adres
    public async Task Taninmayan_adrese_abonelik_kaydedilmez(string endpoint)
    {
        var user = Guid.NewGuid();
        using (As(user))
        {
            (await Should.ThrowAsync<BusinessException>(() => _devices.SubscribeWebPushAsync(Input(endpoint))))
                .Code.ShouldBe(PlatformDomainErrorCodes.NotificationDeviceEndpointInvalid);
        }

        (await _deviceRepository.GetListAsync(d => d.UserId == user)).ShouldBeEmpty();
    }

    [Theory]
    [InlineData("https://fcm.googleapis.com/fcm/send/abc")]
    [InlineData("https://updates.push.services.mozilla.com/wpush/v2/abc")]
    [InlineData("https://wns2-db5p.notify.windows.com/w/?token=abc")]
    [InlineData("https://web.push.apple.com/abc")]
    public void Bilinen_tarayici_bildirim_servisleri_kabul_edilir(string endpoint)
        => WebPushEndpointPolicy.IsAllowed(endpoint).ShouldBeTrue();

    [Fact]
    public async Task Anahtarlar_tanimli_degilse_kanal_kapalidir_ozel_anahtar_hic_donmez()
    {
        (await _devices.GetWebPushConfigAsync()).ShouldSatisfyAllConditions(
            c => c.Enabled.ShouldBeTrue(),
            c => c.PublicKey.ShouldBe("test-public-key"));

        _options.PrivateKey = null;
        try
        {
            var config = await _devices.GetWebPushConfigAsync();
            config.Enabled.ShouldBeFalse();
            config.PublicKey.ShouldBeNull();

            using (As(Guid.NewGuid()))
            {
                (await Should.ThrowAsync<BusinessException>(() => _devices.SubscribeWebPushAsync(Input(Endpoint()))))
                    .Code.ShouldBe(PlatformDomainErrorCodes.NotificationWebPushDisabled);
            }
        }
        finally
        {
            _options.PrivateKey = "test-private-key";
        }
    }

    /// <summary>Push tercihi varsayılan açık; alanı göndermeyen eski istemci değeri değiştirmez.</summary>
    [Fact]
    public async Task Push_tercihi_varsayilan_acik_kapatilir_ve_eski_istemci_degeri_ezmez()
    {
        using (As(Guid.NewGuid()))
        {
            (await _notifications.GetPreferencesAsync())
                .Single(p => p.Category == NotificationCategory.Projects).Push.ShouldBeTrue();

            await _notifications.UpdatePreferenceAsync(new UpdateNotificationPreferenceInput
            {
                Category = NotificationCategory.Projects, InApp = true, Email = false, Push = false
            });
            (await _notifications.GetPreferencesAsync())
                .Single(p => p.Category == NotificationCategory.Projects).Push.ShouldBeFalse();

            // Alanı bilmeyen istemci: Push gönderilmez, kapalı kalır.
            await _notifications.UpdatePreferenceAsync(new UpdateNotificationPreferenceInput
            {
                Category = NotificationCategory.Projects, InApp = true, Email = true
            });
            var pref = (await _notifications.GetPreferencesAsync()).Single(p => p.Category == NotificationCategory.Projects);
            pref.Push.ShouldBeFalse();
            pref.Email.ShouldBeTrue();
        }
    }
}
