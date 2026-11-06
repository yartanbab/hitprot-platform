using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks;
using Apya.Platform.Feedbacks.Dtos;
using Apya.Platform.IssueTasks;
using Apya.Platform.IssueTasks.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Telemetry;
using Apya.Platform.Telemetry.Dtos;
using Apya.Platform.Web.Telemetry;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Web.Pages.Admin.Feedback;

[Authorize(PlatformPermissions.Feedbacks.Default)]
public class DetailModalModel : AbpPageModel
{
    private readonly IFeedbackAdminAppService _feedbackAdminAppService;
    private readonly IIssueTaskAppService _issueTaskAppService;
    private readonly ISystemHealthAppService _systemHealthAppService;

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

    /// <summary>Kodlama asistanına yapıştırılacak geliştirme prompt'u (iç notlar hariç).</summary>
    public string DevPrompt { get; set; } = string.Empty;

    /// <summary>İç notlar dahil sürüm; kayıtta iç not yoksa null (onay kutusu çizilmez).</summary>
    public string? DevPromptWithNotes { get; set; }

    public DetailModalModel(
        IFeedbackAdminAppService feedbackAdminAppService,
        IIssueTaskAppService issueTaskAppService,
        ISystemHealthAppService systemHealthAppService)
    {
        _feedbackAdminAppService = feedbackAdminAppService;
        _issueTaskAppService = issueTaskAppService;
        _systemHealthAppService = systemHealthAppService;
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

        var clientError = await FindLastClientErrorAsync();
        DevPrompt = FeedbackPromptBuilder.Build(Feedback, Details, Breadcrumb, clientError, includeInternalNotes: false);
        if (Feedback.Comments.Any(c => c.IsInternal))
        {
            DevPromptWithNotes = FeedbackPromptBuilder.Build(Feedback, Details, Breadcrumb, clientError, includeInternalNotes: true);
        }
    }

    /// <summary>
    /// Gönderimden hemen önceki tarayıcı hatası. Sistem Sağlığı izni olmayana hiç
    /// sorgulanmaz; saklama süresiyle silinmişse prompt onsuz üretilir.
    /// </summary>
    private async Task<ClientErrorDto?> FindLastClientErrorAsync()
    {
        if (Feedback.LastClientErrorId is null
            || !await AuthorizationService.IsGrantedAsync(PlatformPermissions.SystemHealth.Default))
        {
            return null;
        }

        try
        {
            return await _systemHealthAppService.GetClientErrorAsync(Feedback.LastClientErrorId.Value);
        }
        catch (EntityNotFoundException)
        {
            return null;
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
