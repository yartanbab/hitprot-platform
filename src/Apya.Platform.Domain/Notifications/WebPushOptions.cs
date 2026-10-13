namespace Apya.Platform.Notifications;

/// <summary>
/// NTF-08 · Web push (VAPID) yapılandırması — <c>WebPush</c> bölümünden bağlanır.
///
/// <para>🔴 <see cref="PrivateKey"/> <c>appsettings.json</c>'a YAZILMAZ: kullanıcı sırlarından
/// (<c>secrets.json</c>) ya da ortam değişkeninden (<c>WebPush__PrivateKey</c>) gelir. Açık anahtar
/// gizli değildir; istemciye abonelik için verilir.</para>
/// </summary>
public class WebPushOptions
{
    public string? PublicKey { get; set; }
    public string? PrivateKey { get; set; }

    /// <summary>VAPID "subject": bildirim servisinin ulaşacağı adres (mailto: ya da https:).</summary>
    public string? Subject { get; set; }

    /// <summary>İki anahtar ve konu tanımlı değilse kanal kapalıdır: abonelik alınmaz, gönderim yapılmaz.</summary>
    public bool IsEnabled =>
        !string.IsNullOrWhiteSpace(PublicKey)
        && !string.IsNullOrWhiteSpace(PrivateKey)
        && !string.IsNullOrWhiteSpace(Subject);
}
