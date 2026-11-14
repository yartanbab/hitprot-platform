using System;
using System.Collections.Generic;
using System.Text.Encodings.Web;
using System.Text.Json;

namespace Apya.Platform.Grants;

/// <summary>
/// Seçenek ve çoklu seçim listelerinin JSON yazımı. Varsayılan kodlayıcı Türkçe harfleri
/// <c>Ç</c> biçiminde kaçırır; değer veritabanında okunmaz olur ve kolon sınırını
/// altı kat hızlı doldururdu. Burada harfler olduğu gibi yazılır.
/// </summary>
internal static class FirmParameterJson
{
    private static readonly JsonSerializerOptions Options = new()
    {
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
    };

    public static string Write(IReadOnlyCollection<string> values) => JsonSerializer.Serialize(values, Options);

    public static IReadOnlyList<string> Read(string? json)
        => string.IsNullOrEmpty(json)
            ? Array.Empty<string>()
            : JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>();
}
