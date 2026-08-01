using System;
using System.Collections.Generic;
using System.Text.Json;

namespace Apya.Platform.Web.Telemetry;

/// <summary>Davranış izindeki tek olay — apya-telemetry.js'in ürettiği {t,y,l} üçlüsü.</summary>
public record BreadcrumbEvent(DateTime Time, string Type, string Label);

/// <summary>
/// apya-telemetry.js'in ürettiği davranış izi JSON'unu çözer. Hem geri bildirim
/// detayında hem istemci hatası detayında aynı biçim kullanılır — tek kaynak.
/// Bozuk/eksik JSON teşhis verisidir; sessizce boş liste döner.
/// </summary>
public static class BreadcrumbParser
{
    public static List<BreadcrumbEvent> Parse(string? json)
    {
        var result = new List<BreadcrumbEvent>();
        if (string.IsNullOrWhiteSpace(json))
        {
            return result;
        }

        try
        {
            using var doc = JsonDocument.Parse(json);
            foreach (var item in doc.RootElement.EnumerateArray())
            {
                var t = item.TryGetProperty("t", out var tProp) ? tProp.GetInt64() : 0;
                var y = item.TryGetProperty("y", out var yProp) ? yProp.GetString() : null;
                var l = item.TryGetProperty("l", out var lProp) ? lProp.GetString() : null;

                result.Add(new BreadcrumbEvent(
                    DateTimeOffset.FromUnixTimeMilliseconds(t).LocalDateTime,
                    y ?? "?",
                    l ?? ""));
            }
        }
        catch (JsonException)
        {
            // Bozuk/eksik JSON sessizce boş liste döner — teşhis verisi opsiyoneldir.
        }

        return result;
    }
}
