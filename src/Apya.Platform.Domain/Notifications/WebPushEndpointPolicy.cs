using System;
using System.Linq;

namespace Apya.Platform.Notifications;

/// <summary>
/// NTF-08 · Abonelik adresi yalnız BİLİNEN tarayıcı bildirim servislerine ait olabilir.
///
/// <para>Adres istemciden gelir ve sunucu ona istek atar: süzülmezse kullanıcı sunucuyu iç ağdaki
/// ya da üçüncü bir adrese istek atmaya zorlayabilir (SSRF). Yeni bir tarayıcı servisi çıkarsa
/// liste buradan genişletilir.</para>
/// </summary>
public static class WebPushEndpointPolicy
{
    private static readonly string[] AllowedHostSuffixes =
    {
        "fcm.googleapis.com",                 // Chrome, Edge (Chromium), Opera, Samsung Internet
        "android.googleapis.com",             // eski Chrome uçları
        "push.services.mozilla.com",          // Firefox
        "notify.windows.com",                 // eski Edge / Windows
        "push.apple.com",                     // Safari, iOS ana ekran uygulaması
    };

    public static bool IsAllowed(string? endpoint)
    {
        if (string.IsNullOrWhiteSpace(endpoint)
            || endpoint.Length > NotificationDeviceConsts.MaxEndpointLength
            || !Uri.TryCreate(endpoint, UriKind.Absolute, out var uri)
            || uri.Scheme != Uri.UriSchemeHttps
            || !uri.IsDefaultPort
            || !string.IsNullOrEmpty(uri.UserInfo))
        {
            return false;
        }

        var host = uri.Host.ToLowerInvariant();
        return AllowedHostSuffixes.Any(s => host == s || host.EndsWith("." + s, StringComparison.Ordinal));
    }
}
