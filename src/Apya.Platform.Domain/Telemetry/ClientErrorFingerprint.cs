using System;
using System.Security.Cryptography;
using System.Text;

namespace Apya.Platform.Telemetry;

/// <summary>
/// Tekilleştirme imzasını üretir. Aynı kök nedenin farklı satır/kolon numaralarıyla
/// ayrı kayıtlara dağılmaması için yalnızca stack'in İLK satırı hesaba katılır.
/// </summary>
public static class ClientErrorFingerprint
{
    public static string Compute(string message, string? stackTrace, string? pageUrl)
    {
        var firstStackLine = FirstLine(stackTrace);

        // Sorgu string'i (?id=...) aynı hatayı bölmesin → yalnızca yol kısmı.
        var path = PathOnly(pageUrl);

        var raw = string.Join('|', message.Trim(), firstStackLine, path);

        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(raw));
        return Convert.ToHexString(hash).Substring(0, ClientErrorConsts.FingerprintLength).ToLowerInvariant();
    }

    private static string FirstLine(string? stackTrace)
    {
        if (string.IsNullOrWhiteSpace(stackTrace))
        {
            return string.Empty;
        }

        var newLineIndex = stackTrace.IndexOf('\n');
        var line = newLineIndex < 0 ? stackTrace : stackTrace.Substring(0, newLineIndex);

        // Aynı dosyanın farklı build hash'leri (app.a1b2c3.js) imzayı bölmesin.
        return line.Trim();
    }

    private static string PathOnly(string? pageUrl)
    {
        if (string.IsNullOrWhiteSpace(pageUrl))
        {
            return string.Empty;
        }

        var queryIndex = pageUrl.IndexOfAny(new[] { '?', '#' });
        return queryIndex < 0 ? pageUrl : pageUrl.Substring(0, queryIndex);
    }
}
