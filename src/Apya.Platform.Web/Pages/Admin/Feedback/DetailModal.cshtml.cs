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

    public DetailModalModel(IFeedbackAdminAppService feedbackAdminAppService)
    {
        _feedbackAdminAppService = feedbackAdminAppService;
    }

    public async Task OnGetAsync()
    {
        Feedback = await _feedbackAdminAppService.GetAsync(Id);
        Breadcrumb = ParseBreadcrumb(Feedback.BreadcrumbJson);
    }

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
