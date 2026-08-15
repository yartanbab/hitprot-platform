using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp;

namespace Apya.Platform.DynamicAssets.Webhooks;

/// <summary>
/// SEC-011: Webhook hedef URL'lerini SSRF'e karşı korur. İki katman:
/// <list type="number">
///   <item>Abonelikte erken doğrulama (<see cref="ValidateOrThrow"/>): şema http/https,
///   düz IP literal'i iç aralıkta değil.</item>
///   <item>Bağlantı-anında IP denetimi (<see cref="GuardedConnectAsync"/>): DNS çözümü
///   sonrası gerçek IP iç aralıktaysa bağlantı reddedilir — DNS-rebinding'e karşı asıl
///   savunma budur (public görünen host, connect anında private'a çözülebilir).</item>
/// </list>
/// </summary>
public static class WebhookUrlGuard
{
    /// <summary>Abonelik oluşturma/güncellemede çağrılır; geçersizse BusinessException fırlatır.</summary>
    public static void ValidateOrThrow(string? url)
    {
        if (string.IsNullOrWhiteSpace(url) ||
            !Uri.TryCreate(url, UriKind.Absolute, out var uri))
        {
            throw Blocked(url);
        }

        if (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps)
        {
            throw Blocked(url);
        }

        // Host doğrudan bir IP literal'iyse hemen denetle (DNS'e gerek yok).
        if (IPAddress.TryParse(uri.Host, out var literal) && IsBlockedIp(literal))
        {
            throw Blocked(url);
        }
    }

    private static BusinessException Blocked(string? url) =>
        new BusinessException(PlatformDomainErrorCodes.WebhookTargetUrlNotAllowed)
            .WithData("Url", url ?? string.Empty);

    /// <summary>
    /// "WebhookClient" HttpClient'ının ConnectCallback'i. Host'u çözer, iç aralıktaki
    /// adresleri eler; kalan yoksa bağlantıyı reddeder.
    /// </summary>
    public static async ValueTask<Stream> GuardedConnectAsync(
        SocketsHttpConnectionContext context, CancellationToken cancellationToken)
    {
        var host = context.DnsEndPoint.Host;
        var port = context.DnsEndPoint.Port;

        IPAddress[] addresses = IPAddress.TryParse(host, out var literal)
            ? new[] { literal }
            : await Dns.GetHostAddressesAsync(host, cancellationToken);

        var allowed = addresses.Where(a => !IsBlockedIp(a)).ToArray();
        if (allowed.Length == 0)
        {
            throw new IOException($"Webhook hedefi engellenen bir adrese çözümlendi: {host}");
        }

        var socket = new Socket(SocketType.Stream, ProtocolType.Tcp) { NoDelay = true };
        try
        {
            await socket.ConnectAsync(allowed, port, cancellationToken);
            return new NetworkStream(socket, ownsSocket: true);
        }
        catch
        {
            socket.Dispose();
            throw;
        }
    }

    /// <summary>Loopback / private / link-local / metadata / unspecified aralıkları engellenir.</summary>
    public static bool IsBlockedIp(IPAddress ip)
    {
        if (ip.IsIPv4MappedToIPv6)
        {
            ip = ip.MapToIPv4();
        }

        if (IPAddress.IsLoopback(ip))               // 127.0.0.0/8, ::1
        {
            return true;
        }

        if (ip.AddressFamily == AddressFamily.InterNetwork)
        {
            var b = ip.GetAddressBytes();
            return b[0] == 0                         // 0.0.0.0/8 (unspecified/this-network)
                || b[0] == 10                        // 10.0.0.0/8
                || (b[0] == 100 && b[1] >= 64 && b[1] <= 127)   // 100.64.0.0/10 (CGNAT)
                || b[0] == 127                       // 127.0.0.0/8
                || (b[0] == 169 && b[1] == 254)      // 169.254.0.0/16 (link-local + bulut metadata)
                || (b[0] == 172 && b[1] >= 16 && b[1] <= 31)    // 172.16.0.0/12
                || (b[0] == 192 && b[1] == 168);     // 192.168.0.0/16
        }

        if (ip.AddressFamily == AddressFamily.InterNetworkV6)
        {
            if (ip.IsIPv6LinkLocal || ip.IsIPv6SiteLocal)       // fe80::/10, fec0::/10
            {
                return true;
            }
            var b = ip.GetAddressBytes();
            if (b.All(x => x == 0))                  // :: (unspecified)
            {
                return true;
            }
            return (b[0] & 0xFE) == 0xFC;            // fc00::/7 (unique local)
        }

        return true; // bilinmeyen aile → engelle
    }
}
