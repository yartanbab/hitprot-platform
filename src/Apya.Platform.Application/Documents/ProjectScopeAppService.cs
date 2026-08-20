using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
// System.Threading.Tasks.TaskStatus ile çakışıyor; görev durumu bizimki.
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.Documents;

/// <summary>
/// Proje kapsamı ağacı — "bu projede raporlanabilir ne var" sorusunun tek ekranı.
///
/// Ağaç İKİ ekseni yan yana koyar, çünkü şema onları birbirine bağlamıyor:
///   • belge/eksik kalem → iş adımından sarkar (DocumentFile.WorkStepId)
///   • görev/alt görev   → projeden sarkar    (TaskItem.ProjectId + ParentTaskId)
/// Görevi iş adımına bağlayan bir alan olmadığı için görevler kardeş bir dalda
/// durur; uydurma bir eşleme (tarih örtüşmesi gibi) yanlış rapor üretirdi.
///
/// Yükleme TEMBELDİR: proje satırları toplu sorgularla, bir projenin dalı ise
/// yalnız açıldığında gelir. Tüm ağacı tek seferde üretmek 150 projeli kiracıda
/// binlerce satır ve proje başına uygunluk hesabı demekti.
/// </summary>
[Authorize(PlatformPermissions.Documents.Default)]
public class ProjectScopeAppService : ApplicationService, IProjectScopeAppService
{
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectWorkStep, Guid> _workStepRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<DocumentType, Guid> _typeRepository;
    private readonly IRepository<ComplianceAssignment, Guid> _assignmentRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<IdentityUser, Guid> _identityRepository;
    private readonly IComplianceAppService _complianceAppService;

    public ProjectScopeAppService(
        IRepository<Project, Guid> projectRepository,
        IRepository<ProjectWorkStep, Guid> workStepRepository,
        IRepository<DocumentFile, Guid> fileRepository,
        IRepository<DocumentType, Guid> typeRepository,
        IRepository<ComplianceAssignment, Guid> assignmentRepository,
        IRepository<TaskItem, Guid> taskRepository,
        IRepository<IdentityUser, Guid> identityRepository,
        IComplianceAppService complianceAppService)
    {
        _projectRepository = projectRepository;
        _workStepRepository = workStepRepository;
        _fileRepository = fileRepository;
        _typeRepository = typeRepository;
        _assignmentRepository = assignmentRepository;
        _taskRepository = taskRepository;
        _identityRepository = identityRepository;
        _complianceAppService = complianceAppService;
    }

    /* ─────────────────────────── Genel bakış ─────────────────────────── */

    public virtual async Task<ProjectScopeOverviewDto> GetOverviewAsync()
    {
        var projectQueryable = await _projectRepository.GetQueryableAsync();
        var projects = await AsyncExecuter.ToListAsync(
            projectQueryable.AsNoTracking()
                .OrderBy(p => p.Name)
                .Select(p => new
                {
                    p.Id, p.Name, p.Code, p.StartDate, p.EndDate, p.Currency, p.IsApproved,
                }));

        if (projects.Count == 0)
        {
            return new ProjectScopeOverviewDto();
        }

        var projectIds = projects.Select(p => p.Id).ToList();

        // Belge sayısı ve tutarı tek sorguda, proje başına gruplanarak gelir.
        var fileQueryable = await _fileRepository.GetQueryableAsync();
        var files = await AsyncExecuter.ToListAsync(
            fileQueryable.AsNoTracking()
                .Where(f => f.ProjectId != null && projectIds.Contains(f.ProjectId.Value))
                .Select(f => new { ProjectId = f.ProjectId!.Value, f.Amount, f.Currency }));

        var filesByProject = files.GroupBy(f => f.ProjectId).ToDictionary(g => g.Key, g => g.ToList());

        // Uygunluk HESAPLANAN bir değer; yalnız kontrol listesi UYGULANMIŞ projeler
        // için hesaplatıyoruz. Listesi olmayan projede "%0" basmak, eksik belgesi
        // varmış gibi gösterirdi — orada doğru cevap "tanımsız".
        var assignmentQueryable = await _assignmentRepository.GetQueryableAsync();
        var projectsWithChecklist = (await AsyncExecuter.ToListAsync(
                assignmentQueryable.AsNoTracking()
                    .Where(a => projectIds.Contains(a.ProjectId))
                    .Select(a => a.ProjectId)))
            .ToHashSet();

        var compliance = new Dictionary<Guid, ComplianceSummaryDto>();
        foreach (var id in projectsWithChecklist)
        {
            var overview = await _complianceAppService.GetOverviewAsync(id);
            compliance[id] = overview.Summary;
        }

        var rows = new List<ScopeRowDto>();
        var rollup = new ScopeRollupDto
        {
            ProjectCount = projects.Count,
            Currency = projects[0].Currency,
        };

        var percents = new List<int>();

        foreach (var p in projects)
        {
            var projectFiles = filesByProject.GetValueOrDefault(p.Id) ?? new();
            var amount = SumAmount(projectFiles.Select(f => (f.Amount, f.Currency)), p.Currency, out var mixed);

            compliance.TryGetValue(p.Id, out var summary);

            rows.Add(new ScopeRowDto
            {
                Id = "p:" + p.Id,
                ParentId = null,
                Depth = 0,
                Kind = ScopeRowKind.Project,
                Name = string.IsNullOrWhiteSpace(p.Code) ? p.Name : $"{p.Code} — {p.Name}",
                Status = p.IsApproved ? ScopeStatus.InProgress : ScopeStatus.Planned,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                DocumentCount = projectFiles.Count,
                Amount = amount,
                CompliancePercent = summary?.Percent,
                // Projenin altı her zaman doludur: en azından "Görevler" grubu basılır.
                HasChildren = true,
                IsLazy = true,
                EntityId = p.Id,
            });

            rollup.DocumentCount += projectFiles.Count;
            rollup.TotalAmount += amount;
            rollup.MissingCount += summary?.MissingCount ?? 0;
            rollup.HasMixedCurrency |= mixed || p.Currency != rollup.Currency;

            if (summary != null)
            {
                percents.Add(summary.Percent);
            }
        }

        rollup.AverageCompliancePercent = percents.Count == 0
            ? null
            : (int)Math.Round(percents.Average(), MidpointRounding.AwayFromZero);

        return new ProjectScopeOverviewDto { Rows = rows, Rollup = rollup };
    }

    /* ─────────────────────────── Proje dalı ─────────────────────────── */

    public virtual async Task<ProjectScopeBranchDto> GetBranchAsync(Guid projectId)
    {
        var project = await _projectRepository.GetAsync(projectId);
        var parentId = "p:" + projectId;

        var rows = new List<ScopeRowDto>();

        var steps = (await _workStepRepository.GetListAsync(s => s.ProjectId == projectId))
            .OrderBy(s => s.Order)
            .ToList();

        var fileQueryable = await _fileRepository.GetQueryableAsync();
        var files = await AsyncExecuter.ToListAsync(
            fileQueryable.AsNoTracking()
                .Where(f => f.ProjectId == projectId)
                .OrderByDescending(f => f.DocumentDate)
                .Select(f => new
                {
                    f.Id, f.DisplayName, f.WorkStepId, f.DocumentTypeId, f.Amount, f.Currency,
                    f.DocumentDate, f.Status, f.CreatorId,
                }));

        var typeNames = await GetTypeNamesAsync(files.Where(f => f.DocumentTypeId.HasValue)
            .Select(f => f.DocumentTypeId!.Value).Distinct().ToList());

        var userNames = await GetUserNamesAsync(files.Where(f => f.CreatorId.HasValue)
            .Select(f => f.CreatorId!.Value).ToList());

        var missingByStep = await GetMissingItemsAsync(projectId);

        /* --- İş adımları ve altındaki belgeler/eksikler --- */
        foreach (var step in steps)
        {
            var stepFiles = files.Where(f => f.WorkStepId == step.Id).ToList();
            var stepMissing = missingByStep.GetValueOrDefault(step.Id) ?? new();
            var stepId = "w:" + step.Id;

            rows.Add(new ScopeRowDto
            {
                Id = stepId,
                ParentId = parentId,
                Depth = 1,
                Kind = ScopeRowKind.WorkStep,
                Name = $"{step.Order} · {step.Name}",
                Status = StepStatus(step.ProgressPercent),
                StartDate = step.StartDate,
                EndDate = step.EndDate,
                DocumentCount = stepFiles.Count,
                Amount = SumAmount(stepFiles.Select(f => (f.Amount, f.Currency)), project.Currency, out _),
                CompliancePercent = StepCompliance(stepFiles.Count, stepMissing.Count),
                HasChildren = stepFiles.Count > 0 || stepMissing.Count > 0,
                EntityId = step.Id,
            });

            rows.AddRange(stepMissing.Select(m => MissingRow(m, stepId, depth: 2)));
            rows.AddRange(stepFiles.Select(f => new ScopeRowDto
            {
                Id = "d:" + f.Id,
                ParentId = stepId,
                Depth = 2,
                Kind = ScopeRowKind.Document,
                Name = f.DisplayName,
                TypeName = f.DocumentTypeId.HasValue ? typeNames.GetValueOrDefault(f.DocumentTypeId.Value) : null,
                Status = FileStatus(f.Status),
                OwnerName = f.CreatorId.HasValue ? userNames.GetValueOrDefault(f.CreatorId.Value) : null,
                StartDate = f.DocumentDate,
                DocumentCount = 1,
                Amount = f.Amount,
                EntityId = f.Id,
            }));
        }

        /* --- İş adımı atanmamış belgeler --- */
        var orphanFiles = files.Where(f => f.WorkStepId == null).ToList();
        var orphanMissing = missingByStep.GetValueOrDefault(Guid.Empty) ?? new();

        if (orphanFiles.Count > 0 || orphanMissing.Count > 0)
        {
            const string orphanId = "u:unassigned";

            rows.Add(new ScopeRowDto
            {
                Id = orphanId,
                ParentId = parentId,
                Depth = 1,
                Kind = ScopeRowKind.UnassignedGroup,
                Name = "İş adımı atanmamış",
                Status = ScopeStatus.None,
                DocumentCount = orphanFiles.Count,
                Amount = SumAmount(orphanFiles.Select(f => (f.Amount, f.Currency)), project.Currency, out _),
                HasChildren = true,
                EntityId = null,
            });

            rows.AddRange(orphanMissing.Select(m => MissingRow(m, orphanId, depth: 2)));
            rows.AddRange(orphanFiles.Select(f => new ScopeRowDto
            {
                Id = "d:" + f.Id,
                ParentId = orphanId,
                Depth = 2,
                Kind = ScopeRowKind.Document,
                Name = f.DisplayName,
                TypeName = f.DocumentTypeId.HasValue ? typeNames.GetValueOrDefault(f.DocumentTypeId.Value) : null,
                Status = FileStatus(f.Status),
                OwnerName = f.CreatorId.HasValue ? userNames.GetValueOrDefault(f.CreatorId.Value) : null,
                StartDate = f.DocumentDate,
                DocumentCount = 1,
                Amount = f.Amount,
                EntityId = f.Id,
            }));
        }

        /* --- Görev dalı --- */
        var (taskRows, taskCount, subTaskCount) = await BuildTaskBranchAsync(projectId, parentId);
        rows.AddRange(taskRows);

        return new ProjectScopeBranchDto
        {
            ProjectId = projectId,
            Rows = rows,
            TaskCount = taskCount,
            SubTaskCount = subTaskCount,
        };
    }

    /* ─────────────────────────── Yardımcılar ─────────────────────────── */

    private async Task<(List<ScopeRowDto> Rows, int TaskCount, int SubTaskCount)> BuildTaskBranchAsync(
        Guid projectId, string parentId)
    {
        var taskQueryable = await _taskRepository.GetQueryableAsync();
        var tasks = await AsyncExecuter.ToListAsync(
            taskQueryable.AsNoTracking()
                .Where(t => t.ProjectId == projectId)
                .OrderBy(t => t.Number)
                .Select(t => new
                {
                    t.Id, t.Number, t.Title, t.Status, t.ParentTaskId,
                    t.StartDate, t.DueDate, t.AssigneeId,
                }));

        if (tasks.Count == 0)
        {
            return (new List<ScopeRowDto>(), 0, 0);
        }

        var assigneeNames = await GetUserNamesAsync(
            tasks.Where(t => t.AssigneeId.HasValue).Select(t => t.AssigneeId!.Value).ToList());

        var roots = tasks.Where(t => t.ParentTaskId == null).ToList();
        var childrenByParent = tasks.Where(t => t.ParentTaskId != null)
            .GroupBy(t => t.ParentTaskId!.Value)
            .ToDictionary(g => g.Key, g => g.ToList());

        const string groupId = "g:tasks";
        var rows = new List<ScopeRowDto>
        {
            new()
            {
                Id = groupId,
                ParentId = parentId,
                Depth = 1,
                Kind = ScopeRowKind.TaskGroup,
                Name = "Görevler",
                Status = ScopeStatus.None,
                HasChildren = true,
            },
        };

        foreach (var task in roots)
        {
            var taskId = "t:" + task.Id;
            var children = childrenByParent.GetValueOrDefault(task.Id) ?? new();

            rows.Add(new ScopeRowDto
            {
                Id = taskId,
                ParentId = groupId,
                Depth = 2,
                Kind = ScopeRowKind.Task,
                Name = $"#{task.Number} · {task.Title}",
                Status = MapTaskStatus(task.Status, task.DueDate),
                OwnerName = task.AssigneeId.HasValue ? assigneeNames.GetValueOrDefault(task.AssigneeId.Value) : null,
                StartDate = task.StartDate,
                EndDate = task.DueDate,
                HasChildren = children.Count > 0,
                EntityId = task.Id,
            });

            rows.AddRange(children.Select(c => new ScopeRowDto
            {
                Id = "t:" + c.Id,
                ParentId = taskId,
                Depth = 3,
                Kind = ScopeRowKind.SubTask,
                Name = $"#{c.Number} · {c.Title}",
                Status = MapTaskStatus(c.Status, c.DueDate),
                OwnerName = c.AssigneeId.HasValue ? assigneeNames.GetValueOrDefault(c.AssigneeId.Value) : null,
                StartDate = c.StartDate,
                EndDate = c.DueDate,
                EntityId = c.Id,
            }));
        }

        return (rows, roots.Count, tasks.Count - roots.Count);
    }

    /// <summary>
    /// Kontrol listesindeki eksik kalemleri iş adımına göre kümeler. İş adımı
    /// olmayan (proje/dönem kapsamlı) kalemler <see cref="Guid.Empty"/> altında
    /// toplanır ve "İş adımı atanmamış" düğümüne düşer.
    /// </summary>
    private async Task<Dictionary<Guid, List<ComplianceItemDto>>> GetMissingItemsAsync(Guid projectId)
    {
        var overview = await _complianceAppService.GetOverviewAsync(projectId);

        return overview.Checklists
            .SelectMany(c => c.Items)
            .Where(i => i.Status == ComplianceItemStatus.Missing)
            .GroupBy(i => i.WorkStepId ?? Guid.Empty)
            .ToDictionary(g => g.Key, g => g.ToList());
    }

    private static ScopeRowDto MissingRow(ComplianceItemDto item, string parentId, int depth) => new()
    {
        // Eksik kalemin kendi kaydı yok (durum hesaplanır); anahtar gereksinim
        // kimliğinden türetilir.
        Id = "m:" + item.RequirementId + ":" + (item.WorkStepId ?? Guid.Empty),
        ParentId = parentId,
        Depth = depth,
        Kind = ScopeRowKind.MissingItem,
        Name = item.Title,
        Status = ScopeStatus.Missing,
        DocumentCount = 0,
        CompliancePercent = 0,
        EntityId = item.RequirementId,
    };

    private async Task<Dictionary<Guid, string>> GetUserNamesAsync(List<Guid> userIds)
    {
        var distinct = userIds.Distinct().ToList();

        if (distinct.Count == 0)
        {
            return new Dictionary<Guid, string>();
        }

        var queryable = await _identityRepository.GetQueryableAsync();
        return (await AsyncExecuter.ToListAsync(
                queryable.AsNoTracking()
                    .Where(u => distinct.Contains(u.Id))
                    .Select(u => new { u.Id, u.UserName })))
            .ToDictionary(k => k.Id, v => v.UserName);
    }

    private async Task<Dictionary<Guid, string>> GetTypeNamesAsync(List<Guid> typeIds)
    {
        if (typeIds.Count == 0)
        {
            return new Dictionary<Guid, string>();
        }

        var queryable = await _typeRepository.GetQueryableAsync();
        return (await AsyncExecuter.ToListAsync(
                queryable.AsNoTracking()
                    .Where(t => typeIds.Contains(t.Id))
                    .Select(t => new { t.Id, t.Name })))
            .ToDictionary(k => k.Id, v => v.Name);
    }

    /// <summary>
    /// Tutarları toplar. Para birimi projeninkinden FARKLI olan belge toplama
    /// katılmaz — kuru bilinmeden toplamak uydurma bir rakam üretir; karışım
    /// olduğu <paramref name="mixed"/> ile bildirilir.
    /// </summary>
    private static decimal SumAmount(
        IEnumerable<(decimal? Amount, string? Currency)> items, string projectCurrency, out bool mixed)
    {
        mixed = false;
        var total = 0m;

        foreach (var (amount, currency) in items)
        {
            if (amount is null)
            {
                continue;
            }

            // Para birimi boş belge, projenin para biriminde kabul edilir.
            if (!string.IsNullOrEmpty(currency) && currency != projectCurrency)
            {
                mixed = true;
                continue;
            }

            total += amount.Value;
        }

        return total;
    }

    private static ScopeStatus StepStatus(int progressPercent) => progressPercent switch
    {
        >= 100 => ScopeStatus.Done,
        > 0 => ScopeStatus.InProgress,
        _ => ScopeStatus.Planned,
    };

    /// <summary>
    /// İş adımının uygunluğu = karşılanan zorunlu kalem oranı. Kontrol listesi
    /// tanımlı değilse (ne belge ne eksik) yüzde basılmaz.
    /// </summary>
    private static int? StepCompliance(int fileCount, int missingCount)
    {
        var total = fileCount + missingCount;
        return total == 0 ? null : (int)Math.Round(fileCount * 100m / total, MidpointRounding.AwayFromZero);
    }

    private static ScopeStatus FileStatus(DocumentFileStatus status) => status switch
    {
        DocumentFileStatus.Draft => ScopeStatus.Draft,
        DocumentFileStatus.Final => ScopeStatus.Final,
        DocumentFileStatus.Matched => ScopeStatus.Matched,
        DocumentFileStatus.Expired => ScopeStatus.Expired,
        _ => ScopeStatus.None,
    };

    private ScopeStatus MapTaskStatus(TaskStatus status, DateTime? dueDate)
    {
        if (status == TaskStatus.Done)
        {
            return ScopeStatus.Done;
        }

        if (status == TaskStatus.Cancelled)
        {
            return ScopeStatus.Cancelled;
        }

        // Gecikme SAKLANMAZ, türetilir: bitmemiş ve teslim tarihi geçmiş görev geciktir.
        if (dueDate.HasValue && dueDate.Value.Date < Clock.Now.Date)
        {
            return ScopeStatus.Late;
        }

        return status == TaskStatus.Todo ? ScopeStatus.Planned : ScopeStatus.InProgress;
    }
}
