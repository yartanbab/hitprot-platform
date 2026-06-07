using System;
using System.Linq;
using System.Text.Json;

namespace Apya.Platform.Ai.Prompts;

/// <summary>
/// Validates that an AI response is a JSON object and (when a schema is supplied) contains the
/// schema's <c>required</c> properties. Constructed per-evaluation with the prompt version's schema,
/// so it reuses the existing <see cref="IAiResponseValidator"/> + <see cref="ValidationOutcome"/>
/// repair-loop contract without being a singleton DI service (unlike <c>JsonArrayResponseValidator</c>).
/// A full JSON-Schema engine can replace the required-field subset later (hardening).
/// </summary>
public class JsonSchemaResponseValidator : IAiResponseValidator
{
    private readonly string? _jsonSchema;

    public JsonSchemaResponseValidator(string? jsonSchema)
    {
        _jsonSchema = jsonSchema;
    }

    public ValidationOutcome Validate(string response)
    {
        if (string.IsNullOrWhiteSpace(response))
            return ValidationOutcome.Invalid(
                "Response is empty.",
                "Boş yanıt döndürdün. Lütfen şemaya uygun bir JSON nesnesi ({...}) döndür.");

        var trimmed = StripFences(response.Trim());

        JsonDocument doc;
        try
        {
            doc = JsonDocument.Parse(trimmed);
        }
        catch (JsonException ex)
        {
            return ValidationOutcome.Invalid(
                "Invalid JSON: " + ex.Message,
                "Önceki yanıtın geçerli JSON değildi. Açıklama ekleme; sadece geçerli bir JSON nesnesi gönder.");
        }

        using (doc)
        {
            if (doc.RootElement.ValueKind != JsonValueKind.Object)
                return ValidationOutcome.Invalid(
                    "Root JSON element is not an object.",
                    "Kök element bir JSON nesnesi (obje) olmalı.");

            if (!string.IsNullOrWhiteSpace(_jsonSchema))
            {
                var missing = GetMissingRequired(doc.RootElement, _jsonSchema!);
                if (missing.Length > 0)
                    return ValidationOutcome.Invalid(
                        "Missing required fields: " + string.Join(", ", missing),
                        $"Şu zorunlu alanlar eksik: {string.Join(", ", missing)}. Lütfen şemaya tam uyan JSON gönder.");
            }

            return ValidationOutcome.Ok();
        }
    }

    private static string StripFences(string value)
    {
        if (value.StartsWith("```json", StringComparison.OrdinalIgnoreCase))
            value = value.Substring(7);
        else if (value.StartsWith("```"))
            value = value.Substring(3);

        if (value.EndsWith("```"))
            value = value.Substring(0, value.Length - 3);

        return value.Trim();
    }

    private static string[] GetMissingRequired(JsonElement root, string schemaJson)
    {
        try
        {
            using var schema = JsonDocument.Parse(schemaJson);
            if (!schema.RootElement.TryGetProperty("required", out var required) ||
                required.ValueKind != JsonValueKind.Array)
                return Array.Empty<string>();

            return required.EnumerateArray()
                .Select(e => e.GetString())
                .Where(name => !string.IsNullOrEmpty(name) && !root.TryGetProperty(name!, out _))
                .Select(name => name!)
                .ToArray();
        }
        catch (JsonException)
        {
            // A malformed schema must not block evaluation; treat as "no required constraints".
            return Array.Empty<string>();
        }
    }
}
