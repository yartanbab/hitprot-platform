using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks;
using Apya.Platform.IssueTasks;
using Apya.Platform.IssueTasks.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Telemetry;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using TaskPriority = Apya.Platform.Tasks.TaskPriority;

namespace Apya.Platform.Web.Pages.Admin.IssueTasks;

/// <summary>
/// Üç kaynağın da (geri bildirim / istemci hatası / sunucu hatası) ortak "göreve
/// dönüştür" formu. Kaynak farkı yalnızca özet satırında ve POST'ta çağrılan uçtadır;
/// alanların tamamı ortaktır.
/// </summary>
[Authorize(PlatformPermissions.IssueTasks.Default)]
public class CreateTaskModalModel : AbpPageModel
{
    private readonly IIssueTaskAppService _issueTaskAppService;
    private readonly IFeedbackAdminAppService _feedbackAdminAppService;
    private readonly ISystemHealthAppService _systemHealthAppService;

    [BindProperty(SupportsGet = true)]
    public IssueSourceType SourceType { get; set; }

    /// <summary>Geri bildirim / istemci hatası kaydının Id'si. Sunucu hatasında boştur.</summary>
    [BindProperty(SupportsGet = true)]
    public Guid? SourceId { get; set; }

    /// <summary>Sunucu hatasının adresi. (PageModel.Url'i gizlememek için ayrı ad.)</summary>
    [BindProperty(SupportsGet = true)]
    public string? SourceUrl { get; set; }

    [BindProperty(SupportsGet = true)]
    public int WindowDays { get; set; } = 7;

    [BindProperty]
    public CreateIssueTaskInput Input { get; set; } = new();

    public IssueTaskTargetDto Target { get; set; } = default!;

    /// <summary>"Neyi göreve çeviriyorum?" — formun üstündeki tek satırlık kaynak özeti.</summary>
    public string SourceSummary { get; set; } = string.Empty;

    public List<SelectListItem> ProjectList { get; set; } = new();
    public List<SelectListItem> AssigneeList { get; set; } = new();
    public List<SelectListItem> PriorityList { get; set; } = new();

    public CreateTaskModalModel(
        IIssueTaskAppService issueTaskAppService,
        IFeedbackAdminAppService feedbackAdminAppService,
        ISystemHealthAppService systemHealthAppService)
    {
        _issueTaskAppService = issueTaskAppService;
        _feedbackAdminAppService = feedbackAdminAppService;
        _systemHealthAppService = systemHealthAppService;
    }

    public async Task OnGetAsync()
    {
        Target = await _issueTaskAppService.GetTargetAsync();

        Input.ProjectId  = Target.TargetProjectId;
        Input.AssigneeId = Target.DefaultAssigneeId;

        SourceSummary = await BuildSourceSummaryAsync();
        BuildLists();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        switch (SourceType)
        {
            case IssueSourceType.Feedback when SourceId.HasValue:
                await _issueTaskAppService.CreateFromFeedbackAsync(SourceId.Value, Input);
                break;

            case IssueSourceType.ClientError when SourceId.HasValue:
                await _issueTaskAppService.CreateFromClientErrorAsync(SourceId.Value, Input);
                break;

            case IssueSourceType.ServerError:
                await _issueTaskAppService.CreateFromServerErrorAsync(new CreateServerErrorTaskInput
                {
                    Url        = SourceUrl ?? string.Empty,
                    WindowDays = WindowDays,
                    Title      = Input.Title,
                    Note       = Input.Note,
                    Priority   = Input.Priority,
                    AssigneeId = Input.AssigneeId,
                    DueDate    = Input.DueDate,
                    ProjectId  = Input.ProjectId
                });
                break;

            default:
                throw new Volo.Abp.UserFriendlyException("Göreve dönüştürülecek kayıt belirtilmedi.");
        }

        return NoContent();
    }

    private async Task<string> BuildSourceSummaryAsync()
    {
        switch (SourceType)
        {
            case IssueSourceType.Feedback when SourceId.HasValue:
            {
                var feedback = await _feedbackAdminAppService.GetAsync(SourceId.Value);
                return $"{feedback.FeedbackNumber} · {feedback.Subject}";
            }

            case IssueSourceType.ClientError when SourceId.HasValue:
            {
                var error = await _systemHealthAppService.GetClientErrorAsync(SourceId.Value);
                return $"{error.Message} ({error.OccurrenceCount} oluşum)";
            }

            case IssueSourceType.ServerError:
                return $"{SourceUrl} · son {WindowDays} gün";

            default:
                return string.Empty;
        }
    }

    private void BuildLists()
    {
        ProjectList = Target.Projects
            .Select(p => new SelectListItem(
                p.Code.IsNullOrWhiteSpace() ? p.Name : $"{p.Code} · {p.Name}",
                p.Id.ToString()))
            .ToList();

        // Boş seçenek: atanmamış görev normal bir durumdur, zorlamıyoruz.
        AssigneeList = new List<SelectListItem> { new("(atanmasın)", "") };
        AssigneeList.AddRange(Target.Assignees
            .Select(a => new SelectListItem(
                a.Name.IsNullOrWhiteSpace() ? (a.UserName ?? "-") : a.Name!,
                a.Id.ToString())));

        PriorityList = new List<SelectListItem>
        {
            new("(kaynaktan belirlensin)", ""),
            new("Düşük", ((int)TaskPriority.Low).ToString()),
            new("Orta", ((int)TaskPriority.Medium).ToString()),
            new("Yüksek", ((int)TaskPriority.High).ToString()),
            new("Kritik", ((int)TaskPriority.Critical).ToString())
        };
    }

    public static string SourceTypeLabel(IssueSourceType type) => type switch
    {
        IssueSourceType.Feedback    => "Geri bildirim",
        IssueSourceType.ClientError => "İstemci hatası",
        _                           => "Sunucu hatası"
    };
}
