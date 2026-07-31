using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks;
using Apya.Platform.Feedbacks.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Admin.Feedback;

[Authorize(PlatformPermissions.Feedbacks.Default)]
public class DetailModalModel : AbpPageModel
{
    private readonly IFeedbackAdminAppService _feedbackAdminAppService;

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public FeedbackDetailDto Feedback { get; set; } = default!;

    /// <summary>Breadcrumb JSON'u Razor'da parse etmek yerine burada çözülür.</summary>
    public List<BreadcrumbEvent> Breadcrumb { get; set; } = new();

    /// <summary>Türe özel alanlar (DetailsJson) — etiket/değer çiftleri olarak çözülmüş.</summary>
    public List<KeyValuePair<string, string>> Details { get; set; } = new();

    public List<FeedbackActivityDto> Activities { get; set; } = new();

    public List<FeedbackAssigneeDto> Assignees { get; set; } = new();

    public DetailModalModel(IFeedbackAdminAppService feedbackAdminAppService)
    {
        _feedbackAdminAppService = feedbackAdminAppService;
    }

    public async Task OnGetAsync()
    {
        Feedback = await _feedbackAdminAppService.GetAsync(Id);
        Breadcrumb = ParseBreadcrumb(Feedback.BreadcrumbJson);
        Details = ParseDetails(Feedback.DetailsJson);
        Activities = await _feedbackAdminAppService.GetActivitiesAsync(Id);
        Assignees = await _feedbackAdminAppService.GetAssigneesAsync();
    }

    /// <summary>DetailsJson düz bir string sözlüğüdür; anahtarlar Türkçe etiketlere çevrilir.</summary>
    private static List<KeyValuePair<string, string>> ParseDetails(string? json)
    {
        var result = new List<KeyValuePair<string, string>>();
        if (string.IsNullOrWhiteSpace(json))
        {
            return result;
        }

        try
        {
            using var doc = JsonDocument.Parse(json);
            foreach (var prop in doc.RootElement.EnumerateObject())
            {
                var value = prop.Value.ValueKind == JsonValueKind.String
                    ? prop.Value.GetString()
                    : prop.Value.ToString();

                if (!string.IsNullOrWhiteSpace(value))
                {
                    result.Add(new KeyValuePair<string, string>(DetailLabel(prop.Name), value!));
                }
            }
        }
        catch (JsonException)
        {
            // Bozuk JSON teşhis verisidir; sessizce atlanır.
        }

        return result;
    }

    private static string DetailLabel(string key) => key switch
    {
        "expected"    => "Beklenen sonuç",
        "actual"      => "Gerçekleşen sonuç",
        "steps"       => "Yeniden oluşturma adımları",
        "frequency"   => "Tekrar sıklığı",
        "problem"     => "Çözülmek istenen problem",
        "solution"    => "Önerilen çözüm",
        "benefit"     => "Sağlayacağı fayda",
        "usage"       => "Kullanım sıklığı",
        _             => key
    };

    private static List<BreadcrumbEvent> ParseBreadcrumb(string? json)
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

    public record BreadcrumbEvent(DateTime Time, string Type, string Label);
}
