using System;
using System.Text;

namespace Apya.Platform.Telemetry;

/// <summary>
/// Audit log'daki ham yolu uç (endpoint) kimliğine indirger:
/// <c>/Projects/ProjectDetails/3a233119-da82-38d8-5988-1d55d7d0dbb2</c> →
/// <c>/Projects/ProjectDetails/{id}</c>.
/// <para>
/// Bu olmadan her kayıt kendi "endpoint"i sayılır: 200 projeyi 200 kez açan bir
/// kullanıcı, 200 ayrı yavaş uç üretir ve gerçek darboğaz listede hiç görünmez.
/// Gruplama SQL'de ham yola göre yapılır (ucuz), normalizasyon dönen küçük küme
/// üzerinde bellekte uygulanıp yeniden gruplanır.
/// </para>
/// </summary>
public static class EndpointUrlNormalizer
{
    /// <summary>Değişken segmentin yerine konan işaret.</summary>
    public const string Placeholder = "{id}";

    /// <summary>Bu uzunluktan itibaren salt-hex bir segment kimlik sayılır (SHA/token).</summary>
    private const int MinHexTokenLength = 24;

    /// <summary>
    /// Ham yolu uç kimliğine çevirir. Sorgu dizesi ve fragment atılır (ABP zaten
    /// yalnız yolu yazıyor, yine de savunmacı davranılır); sondaki eğik çizgi düşer.
    /// </summary>
    public static string Normalize(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
        {
            return string.Empty;
        }

        var path = url!.Trim();

        var cut = path.IndexOfAny(new[] { '?', '#' });
        if (cut >= 0)
        {
            path = path[..cut];
        }

        if (path.Length > 1)
        {
            path = path.TrimEnd('/');
        }

        if (path.Length == 0)
        {
            return "/";
        }

        // Segment sınırlarını koruyarak yeniden kurar; baştaki '/' Split ile boş
        // segment üretir ve aynen geri yazılır.
        var segments = path.Split('/');
        var builder = new StringBuilder(path.Length);

        for (var i = 0; i < segments.Length; i++)
        {
            if (i > 0)
            {
                builder.Append('/');
            }

            builder.Append(IsVariable(segments[i]) ? Placeholder : segments[i]);
        }

        return builder.ToString();
    }

    /// <summary>Yol değişken segment içeriyor mu? İçermiyorsa SQL'de eşitlikle aranabilir.</summary>
    public static bool HasPlaceholder(string? normalizedUrl)
        => !string.IsNullOrEmpty(normalizedUrl)
           && normalizedUrl!.Contains(Placeholder, StringComparison.Ordinal);

    /// <summary>
    /// Normalize yolun ilk <c>{id}</c>'ye kadarki sabit öneki.
    /// <para>
    /// Normalize bir yol ham audit satırlarıyla EŞİT DEĞİLDİR; tam eşleştirme ancak
    /// bellekte yapılabilir. Bu önek SQL'de <c>LIKE 'önek%'</c> ön-daraltması için:
    /// tüm tablo taranmaz, bellekte eşleştirilecek küme küçük kalır.
    /// </para>
    /// </summary>
    public static string LiteralPrefix(string? normalizedUrl)
    {
        if (string.IsNullOrEmpty(normalizedUrl))
        {
            return string.Empty;
        }

        var index = normalizedUrl!.IndexOf(Placeholder, StringComparison.Ordinal);
        return index < 0 ? normalizedUrl : normalizedUrl[..index];
    }

    /// <summary>Segment kayda özgü bir kimlik mi (GUID, sayı ya da uzun hex token)?</summary>
    private static bool IsVariable(string segment)
    {
        if (segment.Length == 0)
        {
            return false;
        }

        if (Guid.TryParse(segment, out _))
        {
            return true;
        }

        if (IsAllDigits(segment))
        {
            return true;
        }

        return segment.Length >= MinHexTokenLength && IsAllHex(segment);
    }

    private static bool IsAllDigits(string value)
    {
        foreach (var c in value)
        {
            if (c is < '0' or > '9')
            {
                return false;
            }
        }

        return true;
    }

    private static bool IsAllHex(string value)
    {
        foreach (var c in value)
        {
            var isHex = c is >= '0' and <= '9'
                     || c is >= 'a' and <= 'f'
                     || c is >= 'A' and <= 'F';

            if (!isHex)
            {
                return false;
            }
        }

        return true;
    }
}
