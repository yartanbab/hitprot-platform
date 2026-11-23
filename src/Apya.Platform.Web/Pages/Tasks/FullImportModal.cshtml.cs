using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Import;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Volo.Abp.TenantManagement;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.Web.Pages.Tasks;

/// <summary>Dosya satırı: kimlik doluysa görev güncellenir, boşsa hedef kiracıda yeni görev açılır.</summary>
public sealed class TaskFullImportRow : IFullParameterRow
{
    public Guid? Id { get; init; }

    public Guid? TenantId { get; init; }

    public CreateUpdateTaskDto Input { get; init; } = new();

    public bool Unchanged { get; init; }
}

/// <summary>Tam parametreli görev aktarımının istek boyu seçenekleri; kiracı başına bir kez yüklenir.</summary>
public sealed class TaskFullImportLookups
{
    internal TaskParameterSheet Sheet { get; init; } = null!;

    internal List<(Guid Id, string Name)> Tenants { get; init; } = [];

    /// <summary>Kiracı (host: <see cref="Guid.Empty"/>) → seçenekler; görev izni kapalı kiracıda <c>null</c>.</summary>
    internal Dictionary<Guid, TaskTenantContext?> Contexts { get; } = [];

    internal HashSet<Guid> SeenIds { get; } = [];
}

/// <summary>
/// Sistem yöneticisine özel toplu aktarım: görevlerin bütün parametreleri, kiracı seçilerek. Her satır
/// kiracının bağlamında görev penceresinin servisinden geçer. Kiracının gizli görevleri çıktıya girmez
/// ve güncellenemez (bürünme kuralıyla aynı). Yükleme bildirim üretmez (ürün kararı 2026-11-23).
/// </summary>
[Authorize(PlatformPermissions.Tasks.Create)]
public class FullImportModalModel : FullParameterImportPageModel<TaskFullImportLookups, TaskFullImportRow>
{
    private readonly ITaskAppService _taskAppService;
    private readonly IBoardColumnAppService _boardColumnAppService;
    private readonly IProjectBudgetAppService _budgetAppService;
    private readonly ITenantRepository _tenantRepository;

    public FullImportModalModel(ITaskAppService taskAppService, IBoardColumnAppService boardColumnAppService,
        IProjectBudgetAppService budgetAppService, ITenantRepository tenantRepository)
    {
        _taskAppService = taskAppService;
        _boardColumnAppService = boardColumnAppService;
        _budgetAppService = budgetAppService;
        _tenantRepository = tenantRepository;
    }

    protected override string NameKey => "DataTransfer:Module:TasksFull";

    /// <summary>Görev olayları iş birimi tamamlanırken yayınlanır: kapsam bütün isteği sarar.</summary>
    public override async Task OnPageHandlerExecutionAsync(PageHandlerExecutingContext context, PageHandlerExecutionDelegate next)
    {
        using (NotificationSuppression.Begin())
        {
            await base.OnPageHandlerExecutionAsync(context, next);
        }
    }

    protected override IReadOnlyList<ImportColumn> Columns(TaskFullImportLookups lookups) => lookups.Sheet.Columns;

    protected override void CompleteTemplate(XLWorkbook workbook, TaskFullImportLookups lookups)
        => lookups.Sheet.AddGuide(workbook);

    /// <summary>Host ve bütün kiracıların görevleri, içe aktarmanın sütunlarıyla.</summary>
    public async Task<IActionResult> OnGetExportAsync()
    {
        var lookups = await LoadLookupsAsync();
        var rows = new List<TaskSheetRow>();
        if (!Request.Query.ContainsKey(TableExport.ColumnsQueryKey))
        {
            foreach (var tenantId in new Guid?[] { null }.Concat(lookups.Tenants.Select(t => (Guid?)t.Id)))
            {
                if (await ContextAsync(lookups, tenantId) is { } context)
                {
                    rows.AddRange(context.Tasks.Values.Select(t => new TaskSheetRow(t, context)));
                }
            }
        }

        return SheetFile(lookups.Sheet, rows);
    }

    protected override async Task<TaskFullImportLookups> LoadLookupsAsync()
    {
        var tenants = (await _tenantRepository.GetListAsync()).Select(t => (t.Id, t.Name)).ToList();
        return new TaskFullImportLookups
        {
            Sheet = new TaskParameterSheet(L, tenants.Select(t => t.Name).ToList(), Clock.Now.Date),
            Tenants = tenants
        };
    }

    private async Task<TaskTenantContext?> ContextAsync(TaskFullImportLookups lookups, Guid? tenantId)
    {
        var key = tenantId ?? Guid.Empty;
        if (lookups.Contexts.TryGetValue(key, out var cached))
        {
            return cached;
        }

        TaskTenantContext? context = null;
        using (CurrentTenant.Change(tenantId))
        {
            if (await AuthorizationService.IsGrantedAsync(PlatformPermissions.Tasks.Default))
            {
                context = await LoadContextAsync(lookups, tenantId);
            }
        }

        lookups.Contexts[key] = context;
        return context;
    }

    private async Task<TaskTenantContext> LoadContextAsync(TaskFullImportLookups lookups, Guid? tenantId)
    {
        var projects = await _taskAppService.GetProjectsLookupAsync();
        var users = (await _taskAppService.GetUsersLookupAsync()).Items
            .Select(u => (u.Id, TaskPersonName.Label(u.Name, u.Surname, u.UserName),
                new string?[] { TaskPersonName.Label(u.Name, u.Surname, u.UserName), TaskPersonName.Of(u.Name, u.Surname, u.UserName), u.UserName }))
            .ToList();

        var all = await ExcelTable.CollectAsync((skip, take) =>
            _taskAppService.GetListAsync(new GetTasksInput { SkipCount = skip, MaxResultCount = take }));
        var predecessors = (await _taskAppService.GetProjectDependenciesAsync())
            .ToLookup(e => e.TaskId, e => e.PredecessorTaskId);
        foreach (var task in all.Items)
        {
            task.PredecessorIds = predecessors[task.Id].ToList();
        }

        var visible = all.Items.Where(t => tenantId == null || !t.IsPrivate).ToDictionary(t => t.Id);

        var lines = new Dictionary<Guid, List<(Guid Id, string Label, string Name)>>();
        if (await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ViewBudget))
        {
            foreach (var project in projects)
            {
                lines[project.Id] = (await _budgetAppService.GetLinesAsync(project.Id))
                    .Select(l => (l.Id, string.IsNullOrWhiteSpace(l.Code) ? l.Name : l.Code, l.Name))
                    .ToList();
            }
        }

        var codes = new Dictionary<string, Guid>(StringComparer.OrdinalIgnoreCase);
        foreach (var task in visible.Values)
        {
            codes.TryAdd(task.Code, task.Id);
        }

        return new TaskTenantContext
        {
            TenantId = tenantId,
            TenantName = tenantId is { } id ? lookups.Tenants.First(t => t.Id == id).Name : string.Empty,
            Projects = projects,
            Users = users,
            Tasks = visible,
            TaskCodes = codes,
            Lines = lines
        };
    }

    protected override async Task<TaskFullImportRow> MapAsync(ImportRow row, TaskFullImportLookups lookups)
    {
        var sheet = lookups.Sheet;

        Guid? tenantId = null;
        var tenantText = row.Text(sheet.TenantHeader);
        if (tenantText.Length > 0)
        {
            if (!TryMatch(row, sheet.TenantHeader, tenantText, lookups.Tenants, t => [t.Name], out var tenant))
            {
                return new TaskFullImportRow();
            }

            tenantId = tenant.Id;
        }

        var context = await ContextAsync(lookups, tenantId);
        if (context == null)
        {
            row.Errors.Add(L["Import:Error:NotFound", sheet.TenantHeader, tenantText]);
            return new TaskFullImportRow();
        }

        // Kimlik yalnız satırın kiracısında aranır: görev kiracılar arasında taşınmaz, gizli görev görünmez.
        Guid? id = null;
        TaskSheetRow? current = null;
        var idText = row.Text(sheet.IdHeader);
        if (idText.Length > 0)
        {
            if (!Guid.TryParse(idText, out var parsed) || !context.Tasks.TryGetValue(parsed, out var task))
            {
                row.Errors.Add(L["Import:Error:NotFound", sheet.IdHeader, idText]);
            }
            else if (!lookups.SeenIds.Add(parsed))
            {
                row.Errors.Add(L["Import:Error:Duplicate", sheet.IdHeader, idText]);
            }
            else
            {
                id = parsed;
                current = new TaskSheetRow(task, context);
            }
        }

        sheet.Target = context;
        sheet.RequestedColumn = null;
        var (input, unchanged) = sheet.Read(row, current);
        if (unchanged)
        {
            return new TaskFullImportRow { Id = id, TenantId = tenantId, Input = input, Unchanged = true };
        }

        if (current == null && input.Status == TaskStatus.Cancelled)
        {
            row.Errors.Add(L["Import:Error:CancelledNew", sheet.StatusHeader]);
        }

        if (current != null)
        {
            // Servis üst görevi yalnız oluşturmada yazar; değişiklik sessizce yok sayılmasın.
            if (input.ParentTaskId != current.Task.ParentTaskId)
            {
                row.Errors.Add(L["Import:Error:NewOnly", sheet.ParentTaskHeader]);
            }

            // Çıktıda görünmeyen gizli önkoşullar korunur: servis bağları toptan yeniden yazar.
            input.PredecessorIds.AddRange(current.Task.PredecessorIds
                .Where(p => !context.Tasks.ContainsKey(p) && !input.PredecessorIds.Contains(p)));

            // Durum elle değiştiyse kart özel kolondan düşer (durum ucunun kuralı); yoksa kolon durumu geri alırdı.
            if (string.IsNullOrEmpty(sheet.RequestedColumn) && input.Status != current.Task.Status)
            {
                input.BoardColumnId = null;
            }
        }

        if (!string.IsNullOrEmpty(sheet.RequestedColumn))
        {
            await ResolveColumnAsync(row, sheet, input, tenantId);
        }

        return new TaskFullImportRow { Id = id, TenantId = tenantId, Input = input };
    }

    private async Task ResolveColumnAsync(ImportRow row, TaskParameterSheet sheet, CreateUpdateTaskDto input, Guid? tenantId)
    {
        if (input.ProjectId is not { } projectId)
        {
            row.Errors.Add(L["Import:Error:NotFound", sheet.BoardColumnHeader, sheet.RequestedColumn!]);
            return;
        }

        using (CurrentTenant.Change(tenantId))
        {
            var columns = await _boardColumnAppService.GetListByProjectAsync(projectId);
            if (TryMatch(row, sheet.BoardColumnHeader, sheet.RequestedColumn!, columns, c => [c.Name], out var column))
            {
                input.BoardColumnId = column!.Id;
            }
        }
    }

    protected override async Task SaveAsync(TaskFullImportRow row)
    {
        using (CurrentTenant.Change(row.TenantId))
        {
            if (row.Id is { } id)
            {
                await _taskAppService.UpdateAsync(id, row.Input);
            }
            else
            {
                await _taskAppService.CreateAsync(row.Input);
            }
        }
    }
}
