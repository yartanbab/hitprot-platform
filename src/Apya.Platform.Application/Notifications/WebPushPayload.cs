using System;
using System.Text.Json;

namespace Apya.Platform.Notifications;

/// <summary>
/// NTF-08 · Push gövdesi — service worker (<c>wwwroot/sw.js</c>) ile AYNI alan adları.
///
/// <para>🔴 Ürün kararı K2: gövde YALNIZ BAŞLIK taşır. İşletim sistemi bildirimi kilit ekranında,
/// yetkisi olmayan birinin gözü önünde görünebilir; tutar ve ayrıntı uygulama içinde kalır.
/// Bu yüzden bildirimin <c>Body</c> alanı buraya HİÇ girmez.</para>
/// </summary>
public static class WebPushPayload
{
    private static readonly JsonSerializerOptions Json = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public static string Build(Guid notificationId, string title, string? tag, NotificationSeverity severity, string url)
        => JsonSerializer.Serialize(new
        {
            notificationId,
            title,
            tag = tag ?? "apya-" + notificationId,
            severity = (int)severity,
            url
        }, Json);

    /// <summary>
    /// Bildirim servisindeki "topic": aynı konudaki bekleyen mesaj yenisiyle değiştirilir.
    /// RFC 8030: en çok 32 karakter, URL-güvenli base64 alfabesi.
    /// </summary>
    public static string Topic(Guid notificationId) => notificationId.ToString("N");
}
