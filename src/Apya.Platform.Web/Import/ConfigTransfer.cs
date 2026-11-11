using System;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Apya.Platform.Web.Import;

/// <summary>
/// Ayar aktarımının (.json) ortak zarfı: <c>{ format, version, exportedAt, data }</c>. Biçim adı dosyanın
/// hangi ekrana ait olduğunu söyler; başka ekranın dosyası ya da bilinmeyen sürüm okunmaz. İçe aktarma
/// her zaman YENİ kayıt açar, mevcut kaydın üzerine yazmaz (bu kural çağıran ekranındır).
/// </summary>
public static class ConfigTransfer
{
    public const int Version = 1;
    public const long MaxBytes = 2 * 1024 * 1024;
    public const string ContentType = "application/json";

    private static readonly JsonSerializerOptions Options = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
    };

    public sealed class Envelope<T>
    {
        public string Format { get; set; } = string.Empty;
        public int Version { get; set; }
        public DateTime ExportedAt { get; set; }
        public T? Data { get; set; }
    }

    public static byte[] Write<T>(string format, T data, DateTime now)
        => Encoding.UTF8.GetBytes(JsonSerializer.Serialize(
            new Envelope<T> { Format = format, Version = Version, ExportedAt = now, Data = data }, Options));

    /// <summary>Dosya adı: "{ad}_{yyyy-MM-dd}.json"; dosya sistemine uymayan karakterler "-" olur.</summary>
    public static string FileName(string name, DateTime now)
    {
        var clean = string.Join("-", name.Split(Path.GetInvalidFileNameChars(), StringSplitOptions.RemoveEmptyEntries)).Trim();
        return $"{(clean.Length == 0 ? "apya" : clean)}_{now:yyyy-MM-dd}.json";
    }

    /// <summary>
    /// Dosyayı okur. Hata varsa <c>Error</c> metin anahtarıdır (<c>Transfer:Error:*</c>, ilk biçim parametresi).
    /// </summary>
    public static async Task<(T? Data, string? Error)> ReadAsync<T>(IFormFile? file, string format) where T : class
    {
        if (file == null || file.Length == 0) return (null, "Transfer:Error:ChooseFile");
        if (file.Length > MaxBytes) return (null, "Transfer:Error:TooLarge");

        Envelope<T>? envelope;
        try
        {
            await using var stream = file.OpenReadStream();
            envelope = await JsonSerializer.DeserializeAsync<Envelope<T>>(stream, Options);
        }
        catch (JsonException)
        {
            return (null, "Transfer:Error:NotJson");
        }

        if (envelope == null || !string.Equals(envelope.Format, format, StringComparison.Ordinal))
            return (null, "Transfer:Error:WrongFormat");
        if (envelope.Version != Version) return (null, "Transfer:Error:Version");
        return envelope.Data == null ? (null, "Transfer:Error:NotJson") : (envelope.Data, null);
    }
}
