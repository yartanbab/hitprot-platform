using System.Threading.Tasks;

namespace Apya.Platform.Notifications;

/// <summary>Bildirim servisinin yanıtı: kalıcı hata (abonelik öldü) ile geçici hata ayrılır.</summary>
public enum WebPushSendResult
{
    Sent = 0,

    /// <summary>404 / 410: abonelik artık yok. Yeniden DENENMEZ; cihaz pasifleştirilir.</summary>
    SubscriptionGone = 1,

    /// <summary>429 / 5xx / ağ hatası: arka plan işi yeniden dener.</summary>
    TransientFailure = 2,
}

/// <summary>
/// NTF-08 · Tek bir aboneliğe şifreli web push gönderir. Arayüz, gerçek bildirim servisine
/// gitmeden iş mantığını (pasifleştirme, yeniden deneme) ölçebilmek için ayrıdır.
/// </summary>
public interface IWebPushSender
{
    Task<WebPushSendResult> SendAsync(NotificationDevice device, string payloadJson, string? topic, bool urgent);
}
