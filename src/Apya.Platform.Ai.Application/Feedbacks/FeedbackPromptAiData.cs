using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.Encodings.Web;
using System.Text.Json;
using Apya.Platform.Feedbacks.Dtos;
using Apya.Platform.Telemetry.Dtos;

namespace Apya.Platform.Ai.Feedbacks;

/// <summary>
/// Modele gidecek geri bildirim verisini BEYAZ LİSTEYLE kurar. Gönderen, kiracı, atanan ve
/// yorum yazarı adları alan olarak hiç yoktur; kullanıcı kaynaklı her metin süzgeçten geçer.
/// </summary>
public static class FeedbackPromptAiData
{
    private const int StepsLimit = 4000;
    private const int StackLimit = 1000;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
    };

    public static string Build(
        FeedbackDetailDto f,
        ClientErrorDto? clientError,
        bool includeInternalNotes,
        Func<string, string> sanitize)
    {
        string? Clean(string? value) => string.IsNullOrWhiteSpace(value) ? null : sanitize(value);

        var data = new Dictionary<string, object?>
        {
            ["numara"] = f.FeedbackNumber,
            ["tur"] = f.Type.ToString(),
            ["konu"] = Clean(f.Subject),
            ["metin"] = Clean(f.Body),
            ["tarih"] = f.CreationTime.ToString("yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture),
            ["kullanicininOnemDegerlendirmesi"] = f.Severity?.ToString(),
            ["memnuniyetPuani"] = f.Rating,
            ["ekipOnceligi"] = f.Priority.ToString(),
            ["ekipEtkiDegerlendirmesi"] = f.Impact?.ToString(),
            ["ayrintilar"] = ParseDetails(f.DetailsJson, sanitize),
            ["sayfa"] = f.PageUrl,
            ["sayfaBasligi"] = Clean(f.PageTitle),
            ["modul"] = f.ModuleCode,
            ["bilesen"] = f.ComponentCode,
            ["eylem"] = f.ActionCode,
            ["ilgiliKayitTuru"] = f.RelatedEntityType,
            ["uygulamaSurumu"] = f.AppVersion,
            ["tarayici"] = f.UserAgent,
            ["ekran"] = f.ScreenResolution,
            ["ekler"] = f.HasScreenshot || f.Attachments.Count > 0
                ? $"ekran görüntüsü: {(f.HasScreenshot ? "var" : "yok")}, ek dosya: {f.Attachments.Count.ToString(CultureInfo.InvariantCulture)} (içerik gönderilmedi)"
                : null,
            // Sondaki adımlar gönderime en yakın olanlar — kırpma baştan yapılır.
            ["gonderimOncesiAdimlar"] = Clean(TakeLast(f.BreadcrumbJson, StepsLimit)),
            ["tarayiciHatasi"] = clientError is null ? null : new Dictionary<string, object?>
            {
                ["mesaj"] = clientError.Message,
                ["sayfa"] = clientError.PageUrl,
                ["olusum"] = clientError.OccurrenceCount,
                ["yiginIzi"] = Clip(clientError.StackTrace, StackLimit)
            },
            ["yazisma"] = Comments(f.Comments, includeInternalNotes, sanitize)
        };

        return JsonSerializer.Serialize(data, JsonOptions);
    }

    private static List<Dictionary<string, string>>? Comments(
        List<FeedbackCommentDto> comments, bool includeInternalNotes, Func<string, string> sanitize)
    {
        var shown = comments
            .Where(c => includeInternalNotes || !c.IsInternal)
            .Where(c => !string.IsNullOrWhiteSpace(c.Text))
            .OrderBy(c => c.CreationTime)
            .Select(c => new Dictionary<string, string>
            {
                ["tur"] = c.IsInternal ? "iç not" : "cevap",
                ["metin"] = sanitize(c.Text)
            })
            .ToList();

        return shown.Count == 0 ? null : shown;
    }

    private static Dictionary<string, string>? ParseDetails(string? json, Func<string, string> sanitize)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            return null;
        }

        try
        {
            using var doc = JsonDocument.Parse(json);
            if (doc.RootElement.ValueKind != JsonValueKind.Object)
            {
                return null;
            }

            var result = new Dictionary<string, string>();
            foreach (var prop in doc.RootElement.EnumerateObject())
            {
                var value = prop.Value.ValueKind == JsonValueKind.String ? prop.Value.GetString() : prop.Value.ToString();
                if (!string.IsNullOrWhiteSpace(value))
                {
                    result[prop.Name] = sanitize(value!);
                }
            }
            return result.Count == 0 ? null : result;
        }
        catch (JsonException)
        {
            // Bozuk JSON teşhis verisidir; sessizce atlanır.
            return null;
        }
    }

    private static string? TakeLast(string? value, int limit) =>
        value is null || value.Length <= limit ? value : "…" + value[^limit..];

    private static string? Clip(string? value, int limit) =>
        value is null || value.Length <= limit ? value : value[..limit] + "…";
}
