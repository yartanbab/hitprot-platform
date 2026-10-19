using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.Json;

namespace Apya.Platform.Tasks;

/// <summary>
/// QA-23 · Denetim kaydındaki ham alan değişikliğini okunur hâle getirir: alan adı Türkçe etiket, değer JSON'dan
/// çözülür (durum/öncelik adı, gün düzeyi tarih, kişi/proje adı). Kullanıcıya anlamı olmayan teknik alanlar
/// (sıra numarası, eşzamanlılık damgası, uyarı bayrakları…) atlanır.
/// </summary>
public static class TaskHistoryFormatter
{
    private static readonly Dictionary<string, string> Labels = new()
    {
        ["Title"] = "Başlık",
        ["Description"] = "Açıklama",
        ["Status"] = "Durum",
        ["Priority"] = "Öncelik",
        ["StartDate"] = "Başlangıç",
        ["DueDate"] = "Son tarih",
        ["AssigneeId"] = "Sorumlu",
        ["ProjectId"] = "Proje",
        ["IsPrivate"] = "Gizlilik",
        ["EstimatedHours"] = "Tahmini süre",
        ["TaskType"] = "Görev tipi",
        ["Sprint"] = "Sprint",
        ["CancelReason"] = "İptal nedeni",
        ["ParentTaskId"] = "Üst görev",
    };

    private static readonly string[] StatusNames = { "İptal", "Yapılacak", "Sürüyor", "Testte", "Tamamlandı" };
    private static readonly string[] PriorityNames = { "", "Düşük", "Orta", "Yüksek", "Kritik" };

    /// <summary>Gösterilmeyecek alan için <c>null</c>.</summary>
    public static TaskHistoryChangeDto? Format(
        string propertyName, string? originalValue, string? newValue, IReadOnlyDictionary<Guid, string> names)
    {
        if (!Labels.TryGetValue(propertyName, out var label))
        {
            return null;
        }

        if (propertyName == "Description")
        {
            // Zengin metin: eski/yeni HTML okunmaz; değiştiği söylenir.
            return new TaskHistoryChangeDto { Field = label, NewValue = "güncellendi" };
        }

        return new TaskHistoryChangeDto
        {
            Field = label,
            OldValue = Value(propertyName, originalValue, names),
            NewValue = Value(propertyName, newValue, names),
        };
    }

    /// <summary>JSON olarak saklanan değerin ham metni ("\"metin\"" → metin; "null" → null).</summary>
    public static string? Raw(string? json)
    {
        if (string.IsNullOrEmpty(json) || json == "null")
        {
            return null;
        }

        if (json.Length >= 2 && json[0] == '"' && json[^1] == '"')
        {
            try { return JsonSerializer.Deserialize<string>(json); } catch (JsonException) { return json.Trim('"'); }
        }

        return json;
    }

    private static string? Value(string propertyName, string? json, IReadOnlyDictionary<Guid, string> names)
    {
        var raw = Raw(json);
        if (raw == null)
        {
            return null;
        }

        switch (propertyName)
        {
            case "Status":
                return int.TryParse(raw, out var s) && s >= 0 && s < StatusNames.Length ? StatusNames[s] : raw;
            case "Priority":
                return int.TryParse(raw, out var p) && p > 0 && p < PriorityNames.Length ? PriorityNames[p] : raw;
            case "StartDate":
            case "DueDate":
                return DateTime.TryParse(raw, CultureInfo.InvariantCulture, DateTimeStyles.None, out var d)
                    ? d.ToString("dd.MM.yyyy", CultureInfo.InvariantCulture)
                    : raw;
            case "IsPrivate":
                return raw.Equals("true", StringComparison.OrdinalIgnoreCase) ? "Gizli" : "Açık";
            case "AssigneeId":
            case "ProjectId":
            case "ParentTaskId":
                return Guid.TryParse(raw, out var id) && names.TryGetValue(id, out var name) ? name : "—";
            default:
                return raw;
        }
    }
}
