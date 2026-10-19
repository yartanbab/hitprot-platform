using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Lib.Net.Http.WebPush;
using Lib.Net.Http.WebPush.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Notifications;

/// <summary>
/// NTF-08 · VAPID kimliği ve RFC 8291 şifrelemesiyle gönderim (Lib.Net.Http.WebPush).
/// Şifreleme elle yazılmadı: yaklaşık 200 satır kripto, bakımı bu projenin işi değil.
/// </summary>
public class WebPushSender : IWebPushSender, ITransientDependency
{
    /// <summary>Tarayıcı kapalıyken bildirim servisinin mesajı tutacağı süre (saniye). N-02: acil
    /// (Yüksek/Kritik) bildirim 3 gün tutulur — hafta sonu kapalı kalan telefon da pazartesi alır.</summary>
    private const int TimeToLiveSeconds = 24 * 60 * 60;
    private const int UrgentTimeToLiveSeconds = 3 * 24 * 60 * 60;

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly WebPushOptions _options;
    private readonly ILogger<WebPushSender> _logger;

    public WebPushSender(
        IHttpClientFactory httpClientFactory,
        IOptions<WebPushOptions> options,
        ILogger<WebPushSender> logger)
    {
        _httpClientFactory = httpClientFactory;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<WebPushSendResult> SendAsync(NotificationDevice device, string payloadJson, string? topic, bool urgent)
    {
        // Adres kayıtta süzüldü; gönderimde de süzülür (kural sonradan daralmış olabilir).
        if (!WebPushEndpointPolicy.IsAllowed(device.Endpoint))
        {
            return WebPushSendResult.SubscriptionGone;
        }

        var subscription = new PushSubscription { Endpoint = device.Endpoint };
        subscription.SetKey(PushEncryptionKeyName.P256DH, device.P256dh);
        subscription.SetKey(PushEncryptionKeyName.Auth, device.Auth);

        var message = new PushMessage(payloadJson)
        {
            TimeToLive = urgent ? UrgentTimeToLiveSeconds : TimeToLiveSeconds,
            Urgency = urgent ? PushMessageUrgency.High : PushMessageUrgency.Normal,
            Topic = topic,
        };

        var client = new PushServiceClient(_httpClientFactory.CreateClient(nameof(WebPushSender)))
        {
            DefaultAuthentication = new VapidAuthentication(_options.PublicKey, _options.PrivateKey)
            {
                Subject = _options.Subject
            }
        };

        try
        {
            await client.RequestPushMessageDeliveryAsync(subscription, message);
            return WebPushSendResult.Sent;
        }
        catch (PushServiceClientException ex) when (
            ex.StatusCode == HttpStatusCode.NotFound || ex.StatusCode == HttpStatusCode.Gone)
        {
            return WebPushSendResult.SubscriptionGone;
        }
        catch (PushServiceClientException ex)
        {
            // Adres günlüğe YAZILMAZ: abonelik adresi tek başına bildirim göndermeye yeten bir sırdır.
            _logger.LogWarning("Web push geçici hata: cihaz {DeviceId}, durum {Status}", device.Id, (int)ex.StatusCode);
            return WebPushSendResult.TransientFailure;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogWarning(ex, "Web push ağ hatası: cihaz {DeviceId}", device.Id);
            return WebPushSendResult.TransientFailure;
        }
        catch (TaskCanceledException)
        {
            return WebPushSendResult.TransientFailure;
        }
    }
}
