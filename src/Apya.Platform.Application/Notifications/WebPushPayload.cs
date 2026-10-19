using System;
using System.Text.Json;

namespace Apya.Platform.Notifications;

/// <summary>
/// NTF-08 · Push gövdesi — service worker (<c>wwwroot/sw.js</c>) ile AYNI alan adları.
///
/// <para>Ürün kararı K2: işletim sistemi bildirimi kilit ekranında, yetkisi olmayan birinin gözü önünde
/// görünebilir. Kullanıcı kararı (2026-10-19): kişisel tercih — "yalnız başlık" seçende <c>body</c> HİÇ yazılmaz;
/// diğerinde bildirimin gövdesi kısaltılarak (<see cref="MaxBodyLength"/>) gelir.</para>
/// </summary>
public static class WebPushPayload
{
    private static readonly JsonSerializerOptions Json = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
    };

    /// <summary>Kilit ekranında okunur uzunluk; fazlası "…" ile kesilir.</summary>
    public const int MaxBodyLength = 120;

    public static string Build(
        Guid notificationId, string title, string? body, string? tag, NotificationSeverity severity, string url)
        => JsonSerializer.Serialize(new
        {
            notificationId,
            title,
            body = Short(body),
            tag = tag ?? "apya-" + notificationId,
            severity = (int)severity,
            url
        }, Json);

    /// <summary>Boşlukları tekler, <see cref="MaxBodyLength"/>'i aşanı keser; boşsa <c>null</c> (alan yazılmaz).</summary>
    public static string? Short(string? body)
    {
        if (string.IsNullOrWhiteSpace(body))
        {
            return null;
        }

        var text = string.Join(' ', body.Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries));
        return text.Length <= MaxBodyLength ? text : text[..(MaxBodyLength - 1)].TrimEnd() + "…";
    }

    /// <summary>
    /// Bildirim servisindeki "topic": aynı konudaki bekleyen mesaj yenisiyle değiştirilir.
    /// RFC 8030: en çok 32 karakter, URL-güvenli base64 alfabesi.
    /// </summary>
    public static string Topic(Guid notificationId) => notificationId.ToString("N");
}
