using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Tasks;
using Apya.Platform.Web.Import;
using Microsoft.AspNetCore.Authorization;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.Web.Pages.Tasks;

/// <summary>Görev içe aktarmanın istek boyu seçenekleri.</summary>
public sealed class TaskImportLookups
{
    internal List<ProjectLookupDto> Projects { get; init; } = [];
    internal List<(Guid Id, string Label, string[] Names)> Users { get; init; } = [];
    internal List<(TaskStatus Value, string Name)> Statuses { get; init; } = [];
    internal List<(TaskPriority Value, string Name)> Priorities { get; init; } = [];
}

/// <summary>
/// Görevleri Excel'den içe aktarma; her satır görev penceresinin <see cref="ITaskAppService.CreateAsync"/>'inden
/// geçer (oluşturma politikası, atama izni, etiket oluşturma aynen çalışır). Planlama alanları
/// (tahmini süre, bütçe kalemi, üst görev) alınmaz: pencerede de paket + izin kapısının arkasındalar.
/// </summary>
[Authorize(PlatformPermissions.Tasks.Create)]
public class ImportModalModel : ExcelImportPageModel<TaskImportLookups, CreateUpdateTaskDto>
{
    /// <summary><see cref="CreateUpdateTaskDto.Title"/>'daki sınır.</summary>
    private const int MaxTitleLength = 200;

    // Pencerenin "Durum / Kolon" seçicisindeki sistem durumları; İptal ile görev açılmaz.
    private static readonly TaskStatus[] CreatableStatuses =
        [TaskStatus.Todo, TaskStatus.InProgress, TaskStatus.InReview, TaskStatus.Done];

    private readonly ITaskAppService _taskAppService;

    public ImportModalModel(ITaskAppService taskAppService)
    {
        _taskAppService = taskAppService;
    }

    protected override string NameKey => "Export:Tasks:Name";

    private sealed record Headers(string Title, string Project, string StartDate, string DueDate, string Status,
        string Priority, string Assignee, string Tags, string Description);

    // Başlıklar dışa aktarmayla aynı: ekrandan indirilen dosya geri yüklenebilir.
    private Headers H => new(L["Export:Col:Title"], L["Export:Col:Project"], L["Export:Col:StartDate"],
        L["Export:Col:DueDate"], L["Export:Col:Status"], L["Export:Col:Priority"], L["Export:Col:Assignee"],
        L["Export:Col:Tags"], L["Export:Col:Description"]);

    protected override IReadOnlyList<ImportColumn> Columns(TaskImportLookups lookups)
    {
        var h = H;
        return
        [
            new(h.Title, Required: true),
            new(h.Project, Options: lookups.Projects.Select(p => p.Name).ToList()),
            new(h.StartDate),
            new(h.DueDate),
            new(h.Status, Options: lookups.Statuses.Select(s => s.Name).ToList()),
            new(h.Priority, Options: lookups.Priorities.Select(p => p.Name).ToList()),
            new(h.Assignee, Options: lookups.Users.Select(u => u.Label).ToList()),
            new(h.Tags),
            new(h.Description),
        ];
    }

    protected override async Task<TaskImportLookups> LoadLookupsAsync()
    {
        // Atama izni yoksa yalnız kişinin kendisi seçilebilir (pencerenin kuralı; sunucu da reddeder).
        var canAssign = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Tasks.Assign);
        var users = (await _taskAppService.GetUsersLookupAsync()).Items
            .Where(u => canAssign || u.Id == CurrentUser.Id)
            .Select(u => (u.Id, TaskPersonName.Label(u.Name, u.Surname, u.UserName),
                new[] { TaskPersonName.Label(u.Name, u.Surname, u.UserName), TaskPersonName.Of(u.Name, u.Surname, u.UserName), u.UserName, u.Email }))
            .ToList();

        return new TaskImportLookups
        {
            Projects = await _taskAppService.GetProjectsLookupAsync(),
            Users = users,
            Statuses = CreatableStatuses.Select(s => (s, L[$"Tasks:Status:{s}"].Value)).ToList(),
            Priorities = Enum.GetValues<TaskPriority>().Select(p => (p, L[$"Tasks:Priority:{p}"].Value)).ToList()
        };
    }

    protected override Task<CreateUpdateTaskDto> MapAsync(ImportRow row, TaskImportLookups lookups)
    {
        var h = H;
        var dto = new CreateUpdateTaskDto { StartDate = Clock.Now.Date, TagNames = new List<string>() };

        dto.Title = row.Text(h.Title);
        if (dto.Title.Length == 0) row.Errors.Add(L["Import:Error:Required", h.Title]);
        else if (dto.Title.Length > MaxTitleLength) row.Errors.Add(L["Import:Error:TooLong", h.Title, MaxTitleLength]);

        var project = row.Text(h.Project);
        if (project.Length > 0 && TryMatch(row, h.Project, project, lookups.Projects, x => [x.Name, x.Code], out var match))
        {
            dto.ProjectId = match!.Id;
        }

        // Başlangıç boşsa bugün (pencerenin varsayılanı); son tarih isteğe bağlı.
        if (row.Text(h.StartDate).Length > 0)
        {
            var start = ExcelImport.Date(row.Value(h.StartDate));
            if (start == null) row.Errors.Add(L["Import:Error:Date", h.StartDate]);
            else dto.StartDate = start.Value;
        }

        if (row.Text(h.DueDate).Length > 0)
        {
            var due = ExcelImport.Date(row.Value(h.DueDate));
            if (due == null) row.Errors.Add(L["Import:Error:Date", h.DueDate]);
            else if (due < dto.StartDate) row.Errors.Add(L["Import:Error:DueBeforeStart", h.DueDate, h.StartDate]);
            else dto.DueDate = due;
        }

        var status = row.Text(h.Status);
        if (status.Length > 0 && TryMatch(row, h.Status, status, lookups.Statuses, x => [x.Name, x.Value.ToString()], out var st))
        {
            dto.Status = st.Value;
        }

        var priority = row.Text(h.Priority);
        if (priority.Length > 0 && TryMatch(row, h.Priority, priority, lookups.Priorities, x => [x.Name, x.Value.ToString()], out var pr))
        {
            dto.Priority = pr.Value;
        }

        var assignee = row.Text(h.Assignee);
        if (assignee.Length > 0 && TryMatch(row, h.Assignee, assignee, lookups.Users, u => u.Names.Where(n => !string.IsNullOrEmpty(n)), out var user))
        {
            dto.AssigneeId = user.Id;
        }

        dto.TagNames = row.Text(h.Tags).Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Distinct(StringComparer.OrdinalIgnoreCase).ToList();
        dto.Description = row.Text(h.Description) is { Length: > 0 } d ? d : null;

        return Task.FromResult(dto);
    }

    protected override Task CreateAsync(CreateUpdateTaskDto row) => _taskAppService.CreateAsync(row);
}
