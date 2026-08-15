using System;
using System.Text.Json;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// <c>AppDocument.PublishSettingsJson</c>'ın çözülmüş hâli. Form Builder yayınlama
/// panelinde kaydedilir (<c>{ startDate, endDate, kvkk, captcha }</c>); bu tip onu
/// sunucu tarafında UYGULANABİLİR hâle getirir (önceden yalnız kaydediliyordu).
/// </summary>
public sealed class FormPublishSettings
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool Kvkk { get; set; }
    public bool Captcha { get; set; }

    private static readonly JsonSerializerOptions Options = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public static FormPublishSettings Parse(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            return new FormPublishSettings();
        }

        try
        {
            return JsonSerializer.Deserialize<FormPublishSettings>(json, Options)
                   ?? new FormPublishSettings();
        }
        catch (JsonException)
        {
            // Bozuk ayar formu kilitlemesin — hiçbir kısıt yokmuş gibi davran.
            return new FormPublishSettings();
        }
    }

    /// <summary>Verilen an için form penceresi dışında mı? Hata kodu döner, yoksa null.</summary>
    public string? WindowViolation(DateTime now)
    {
        if (StartDate.HasValue && now.Date < StartDate.Value.Date)
        {
            return PlatformDomainErrorCodes.FormNotStarted;
        }
        if (EndDate.HasValue && now.Date > EndDate.Value.Date)
        {
            return PlatformDomainErrorCodes.FormExpired;
        }
        return null;
    }
}
