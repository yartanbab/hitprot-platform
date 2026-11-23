using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Tasks;
using Apya.Platform.Web.Import;
using Microsoft.Extensions.Localization;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.Web.Pages.Tasks;

/// <summary>Bir kiracının görev aktarımı için seçenekleri. Kiracının gizli görevleri burada yoktur.</summary>
internal sealed class TaskTenantContext
{
    public Guid? TenantId { get; init; }

    public string TenantName { get; init; } = string.Empty;

    public List<ProjectLookupDto> Projects { get; init; } = [];

    public List<(Guid Id, string Label, string?[] Names)> Users { get; init; } = [];

    public Dictionary<Guid, TaskDto> Tasks { get; init; } = [];

    /// <summary>Görev kodu (GRV-12) → kimlik.</summary>
    public Dictionary<string, Guid> TaskCodes { get; init; } = new(StringComparer.OrdinalIgnoreCase);

    /// <summary>Proje → bütçe kalemleri; kiracıda bütçe yetkisi yoksa boş.</summary>
    public Dictionary<Guid, List<(Guid Id, string Label, string Name)>> Lines { get; init; } = [];
}

/// <summary>Çıktı satırı: görev ve ait olduğu kiracının seçenekleri.</summary>
internal sealed record TaskSheetRow(TaskDto Task, TaskTenantContext Context);

/// <summary>
/// Görevin tek satırlık Excel karşılığı. Üst görev ve önkoşullar görev koduyla yazılır; ekler, yorumlar
/// ve zaman kayıtları sayfada yoktur.
/// </summary>
internal sealed class TaskParameterSheet : ParameterSheet<TaskSheetRow, CreateUpdateTaskDto>
{
    private const int MaxTitleLength = 200;
    private const int MaxTypeLength = 64;
    private const int MaxSprintLength = 32;
    private const decimal MaxEstimatedHours = 9999.99m;

    private readonly DateTime _today;
    private readonly List<(TaskStatus Value, string Label)> _statuses;
    private readonly List<(TaskPriority Value, string Label)> _priorities;

    public TaskParameterSheet(IStringLocalizer l, IReadOnlyList<string> tenantNames, DateTime today)
        : base(l, "Import:TaskFull:")
    {
        _today = today;
        _statuses = Enum.GetValues<TaskStatus>().Select(s => (s, l[$"Tasks:Status:{s}"].Value)).ToList();
        _priorities = Enum.GetValues<TaskPriority>().Select(p => (p, l[$"Tasks:Priority:{p}"].Value)).ToList();

        Fields =
        [
            new(TenantHeader, Guide("Tenant"), s => s.Context.TenantName, (_, _) => { }, (_, _) => { }, Options: tenantNames),
            TaskCode(),
            Text("Title", s => s.Task.Title, (t, v) => t.Title = v ?? string.Empty, required: true, maxLength: MaxTitleLength),
            ProjectRef(),
            Text("Description", s => s.Task.Description, (t, v) => t.Description = v),
            Date("StartDate", s => s.Task.StartDate, (t, v) => t.StartDate = v ?? _today),
            Date("DueDate", s => s.Task.DueDate, (t, v) => t.DueDate = v),
            Status(),
            BoardColumn(),
            Priority(),
            Assignee(),
            ParentTask(),
            Predecessors(),
            YesNo("IsPrivate", s => s.Task.IsPrivate, (t, v) => t.IsPrivate = v),
            Amount("EstimatedHours", s => s.Task.EstimatedHours, (t, v) => t.EstimatedHours = v),
            BudgetLine(),
            Amount("PlannedAmount", s => s.Task.PlannedAmount, (t, v) => t.PlannedAmount = v),
            Text("TaskType", s => s.Task.TaskType, (t, v) => t.TaskType = v, maxLength: MaxTypeLength),
            Text("Sprint", s => s.Task.Sprint, (t, v) => t.Sprint = v, maxLength: MaxSprintLength),
            TagList(),
        ];
    }

    public string TenantHeader => H("Tenant");

    public string StatusHeader => H("Status");

    public string BoardColumnHeader => H("BoardColumn");

    public string ParentTaskHeader => H("ParentTask");

    /// <summary>Satırın hedef kiracısı; sayfa okumadan önce belirler.</summary>
    public TaskTenantContext Target { get; set; } = null!;

    /// <summary>Hücreye yazılan pano kolonu. Listeyi okumak varsayılan kolonları kurduğu için sayfa, yalnız gerekince çözer.</summary>
    public string? RequestedColumn { get; set; }

    protected override Guid IdOf(TaskSheetRow source) => source.Task.Id;

    protected override void Validate(ImportRow row, CreateUpdateTaskDto input)
    {
        Require(row, H("Title"), input.Title);
        if (input.DueDate < input.StartDate)
        {
            row.Errors.Add(L["Import:Error:DueBeforeStart", H("DueDate"), H("StartDate")]);
        }

        if (input.EstimatedHours is < 0 or > MaxEstimatedHours)
        {
            row.Errors.Add(L["Import:Error:Range", H("EstimatedHours"), 0, MaxEstimatedHours]);
        }

        if (input.PlannedAmount < 0)
        {
            row.Errors.Add(L["Import:Error:Negative", H("PlannedAmount")]);
        }
    }

    private Field TaskCode()
    {
        var header = H("Code");
        return new(header, Guide("TaskCode"), s => s.Task.Code, (_, _) => { },
            (row, _) =>
            {
                if (row.Text(header).Length > 0)
                {
                    row.Errors.Add(L["Import:Error:ReadOnly", header]);
                }
            });
    }

    private Field ProjectRef()
    {
        var header = H("Project");
        return new(header, Guide("ProjectRef"),
            s => s.Task.ProjectId is { } id ? s.Context.Projects.FirstOrDefault(p => p.Id == id)?.Code : null,
            (s, t) => t.ProjectId = s.Task.ProjectId,
            (row, t) =>
            {
                var text = row.Text(header);
                t.ProjectId = text.Length > 0 && TryPick(row, header, text, Target.Projects, p => [p.Code, p.Name], out var match)
                    ? match.Id
                    : null;
            });
    }

    private Field Status()
    {
        var header = StatusHeader;
        return new(header, Guide("Status"), s => _statuses.First(x => x.Value == s.Task.Status).Label,
            (s, t) => t.Status = s.Task.Status,
            (row, t) =>
            {
                var text = row.Text(header);
                t.Status = text.Length > 0 && TryPick(row, header, text, _statuses, x => [x.Label, x.Value.ToString()], out var match)
                    ? match.Value
                    : TaskStatus.Todo;
            },
            Options: _statuses.Select(x => x.Label).ToList());
    }

    private Field BoardColumn()
        => new(BoardColumnHeader, Guide("BoardColumn"),
            s => s.Task.BoardColumnId.HasValue ? s.Task.BoardColumnName : null,
            (s, t) => t.BoardColumnId = s.Task.BoardColumnId,
            (row, t) =>
            {
                t.BoardColumnId = null;
                RequestedColumn = row.Text(BoardColumnHeader);
            });

    private Field Priority()
    {
        var header = H("Priority");
        return new(header, Guide("Pick"), s => _priorities.First(x => x.Value == s.Task.Priority).Label,
            (s, t) => t.Priority = s.Task.Priority,
            (row, t) =>
            {
                var text = row.Text(header);
                t.Priority = text.Length > 0 && TryPick(row, header, text, _priorities, x => [x.Label, x.Value.ToString()], out var match)
                    ? match.Value
                    : TaskPriority.Medium;
            },
            Options: _priorities.Select(x => x.Label).ToList());
    }

    private Field Assignee()
    {
        var header = H("Assignee");
        return new(header, Guide("Assignee"),
            s => s.Task.AssigneeId is { } id ? s.Context.Users.FirstOrDefault(u => u.Id == id).Label ?? s.Task.AssigneeName : null,
            (s, t) => t.AssigneeId = s.Task.AssigneeId,
            (row, t) =>
            {
                var text = row.Text(header);
                t.AssigneeId = text.Length > 0 && TryPick(row, header, text, Target.Users, u => u.Names, out var match)
                    ? match.Id
                    : null;
            });
    }

    private Field ParentTask()
    {
        var header = ParentTaskHeader;
        return new(header, Guide("ParentTask"),
            s => s.Task.ParentTaskId is { } id && s.Context.Tasks.TryGetValue(id, out var parent) ? parent.Code : null,
            (s, t) => t.ParentTaskId = s.Task.ParentTaskId,
            (row, t) =>
            {
                var text = row.Text(header);
                if (text.Length == 0)
                {
                    t.ParentTaskId = null;
                }
                else if (Target.TaskCodes.TryGetValue(text, out var id))
                {
                    t.ParentTaskId = id;
                }
                else
                {
                    row.Errors.Add(L["Import:Error:NotFound", header, text]);
                }
            });
    }

    private Field Predecessors()
    {
        var header = H("Predecessors");
        return new(header, Guide("Predecessors"),
            s => JoinEntries(s.Task.PredecessorIds
                .Where(s.Context.Tasks.ContainsKey)
                .Select(id => s.Context.Tasks[id].Code)
                .OrderBy(code => code, StringComparer.Ordinal)),
            (s, t) => t.PredecessorIds = s.Task.PredecessorIds.ToList(),
            (row, t) =>
            {
                t.PredecessorIds = [];
                foreach (var code in Entries(row.Text(header)).Select(Unescape))
                {
                    if (Target.TaskCodes.TryGetValue(code, out var id))
                    {
                        if (!t.PredecessorIds.Contains(id)) t.PredecessorIds.Add(id);
                    }
                    else
                    {
                        row.Errors.Add(L["Import:Error:NotFound", header, code]);
                    }
                }
            });
    }

    private Field BudgetLine()
    {
        var header = H("BudgetLine");
        return new(header, Guide("BudgetLine"),
            s => s.Task.BudgetLineId is { } id && s.Task.ProjectId is { } project && s.Context.Lines.TryGetValue(project, out var lines)
                ? lines.FirstOrDefault(l => l.Id == id).Label
                : null,
            (s, t) => t.BudgetLineId = s.Task.BudgetLineId,
            (row, t) =>
            {
                var text = row.Text(header);
                t.BudgetLineId = null;
                if (text.Length == 0)
                {
                    return;
                }

                if (t.ProjectId is not { } project)
                {
                    row.Errors.Add(L["Import:Error:BudgetLineWithoutProject", header, H("Project")]);
                    return;
                }

                var lines = Target.Lines.GetValueOrDefault(project) ?? [];
                if (TryPick(row, header, text, lines, l => [l.Label, l.Name], out var match))
                {
                    t.BudgetLineId = match.Id;
                }
            });
    }

    private Field TagList()
    {
        var header = H("Tags");
        return new(header, Guide("Tags"),
            s => JoinEntries(s.Task.Tags.Select(x => x.Name).OrderBy(n => n, StringComparer.Ordinal)),
            (s, t) => t.TagNames = s.Task.Tags.Select(x => x.Name).ToList(),
            (row, t) => t.TagNames = Entries(row.Text(header)).Select(Unescape).Distinct(StringComparer.OrdinalIgnoreCase).ToList());
    }
}
