using System;
using System.Text.Json;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Ai.Prompts;

/// <summary>
/// Validates that the response is a JSON array (possibly wrapped in ```json fences).
/// Used by the task-extraction prompt template.
/// </summary>
public class JsonArrayResponseValidator : IAiResponseValidator, ITransientDependency
{
    public ValidationOutcome Validate(string response)
    {
        if (string.IsNullOrWhiteSpace(response))
            return ValidationOutcome.Invalid(
                "Response is empty.",
                "Boş yanıt döndürdün. Lütfen JSON array formatında ([] veya doluyken [{...}]) yanıt ver.");

        var trimmed = response.Trim();

        // Strip ```json fences if present
        if (trimmed.StartsWith("```json", StringComparison.OrdinalIgnoreCase))
        {
            trimmed = trimmed.Substring(7);
            if (trimmed.EndsWith("```"))
                trimmed = trimmed.Substring(0, trimmed.Length - 3);
            trimmed = trimmed.Trim();
        }

        if (!trimmed.StartsWith('[') || !trimmed.EndsWith(']'))
            return ValidationOutcome.Invalid(
                "Response is not a JSON array.",
                "Yanıt JSON array formatında olmalı. Açıklama ekleme, sadece [ ile başlayan ve ] ile biten geçerli JSON gönder.");

        try
        {
            using var doc = JsonDocument.Parse(trimmed);
            if (doc.RootElement.ValueKind != JsonValueKind.Array)
                return ValidationOutcome.Invalid(
                    "Root JSON element is not an array.",
                    "Kök element bir array olmalı.");
            return ValidationOutcome.Ok();
        }
        catch (JsonException ex)
        {
            return ValidationOutcome.Invalid(
                "Invalid JSON: " + ex.Message,
                "Önceki yanıtın geçerli JSON değildi: " + ex.Message + ". Lütfen sadece geçerli JSON array gönder.");
        }
    }
}
