using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks;
using Apya.Platform.Feedbacks.Dtos;
using Apya.Platform.IssueTasks;
using Apya.Platform.IssueTasks.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Telemetry;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Admin.Feedback;

[Authorize(PlatformPermissions.Feedbacks.Default)]
public class DetailModalModel : AbpPageModel
{
    private readonly IFeedbackAdminAppService _feedbackAdminAppService;
    private readonly IIssueTaskAppService _issueTaskAppService;

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public FeedbackDetailDto Feedback { get; set; } = default!;

    /// <summary>Breadcrumb JSON'u Razor'da parse etmek yerine burada çözülür.</summary>
    public List<BreadcrumbEvent> Breadcrumb { get; set; } = new();

    /// <summary>Türe özel alanlar (DetailsJson) — etiket/değer çiftleri olarak çözülmüş.</summary>
    public List<KeyValuePair<string, string>> Details { get; set; } = new();

    public List<FeedbackActivityDto> Activities { get; set; } = new();

    public List<FeedbackAssigneeDto> Assignees { get; set; } = new();

    /// <summary>Bu geri bildirim göreve dönüştürülmüşse bağ; yoksa null.</summary>
    public IssueTaskLinkDto? IssueTaskLink { get; set; }

    /// <summary>Köprü izni olmayan yönetici için bağ hiç sorgulanmaz (servis yetki ister).</summary>
    public bool CanCreateIssueTask { get; set; }

    public DetailModalModel(
        IFeedbackAdminAppService feedbackAdminAppService,
        IIssueTaskAppService issueTaskAppService)
    {
        _feedbackAdminAppService = feedbackAdminAppService;
        _issueTaskAppService = issueTaskAppService;
    }

    public async Task OnGetAsync()
    {
        Feedback = await _feedbackAdminAppService.GetAsync(Id);
        Breadcrumb = BreadcrumbParser.Parse(Feedback.BreadcrumbJson);
        Details = ParseDetails(Feedback.DetailsJson);
        Activities = await _feedbackAdminAppService.GetActivitiesAsync(Id);
        Assignees = await _feedbackAdminAppService.GetAssigneesAsync();

        CanCreateIssueTask = await AuthorizationService.IsGrantedAsync(PlatformPermissions.IssueTasks.Default);
        if (CanCreateIssueTask)
        {
            IssueTaskLink = await _issueTaskAppService.GetLinkForFeedbackAsync(Id);
        }
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
                    result.Add(new KeyValuePair<string, string>(FeedbackDetailLabels.For(prop.Name), value!));
                }
            }
        }
        catch (JsonException)
        {
            // Bozuk JSON teşhis verisidir; sessizce atlanır.
        }

        return result;
    }

}
