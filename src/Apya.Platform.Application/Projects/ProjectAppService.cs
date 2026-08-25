using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Features;
using Apya.Platform.Features;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Apya.Platform.Permissions;
using Apya.Platform.Tasks;
using Apya.Platform.Customers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Apya.Platform.Application.Projects;

// SEC-013: Çıplak [Authorize] otomatik API'de (/api/app/project) Projects.Default'ı atlıyordu —
// sayfa uyguluyor ama API izinsiz kiracı kullanıcısına proje listeleme/oluşturma/güncelleme veriyordu.
[Authorize(PlatformPermissions.Projects.Default)]
public class ProjectAppService :
    CrudAppService<
        Project,
        ProjectDto,
        Guid,
        PagedAndSortedResultRequestDto,
        CreateProjectDto>,
    IProjectAppService
{
    private readonly ProjectManager _projectManager;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<ProjectAttachment, Guid> _projectAttachmentRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly TaskManager _taskManager;
    private readonly IRepository<TaskTimeLog, Guid> _timeLogRepository;
    private readonly IRepository<Customer, Guid> _customerRepository;
    private readonly ITenantStore _tenantStore;
    private readonly IRepository<Volo.Abp.TenantManagement.Tenant, Guid> _tenantRepository;
    private readonly IFeatureChecker _featureChecker;

    public ProjectAppService(
        IRepository<Project, Guid> repository,
        ProjectManager projectManager,
        IRepository<Grant, Guid> grantRepository,
        IRepository<ProjectAttachment, Guid> projectAttachmentRepository,
        IRepository<TaskItem, Guid> taskRepository,
        TaskManager taskManager,
        IRepository<TaskTimeLog, Guid> timeLogRepository,
        IRepository<Customer, Guid> customerRepository,
        ITenantStore tenantStore,
        IRepository<Volo.Abp.TenantManagement.Tenant, Guid> tenantRepository,
        IFeatureChecker featureChecker)
        : base(repository)
    {
        _projectManager = projectManager;
        _grantRepository = grantRepository;
        _projectAttachmentRepository = projectAttachmentRepository;
        _taskRepository = taskRepository;
        _taskManager = taskManager;
        _timeLogRepository = timeLogRepository;
        _customerRepository = customerRepository;
        _tenantStore = tenantStore;
        _tenantRepository = tenantRepository;
        _featureChecker = featureChecker;
    }

    // --- CREATE ---
    // SEC: CrudAppService'in CreatePolicyName'i set edilmediği ve override CheckCreatePolicyAsync'i
    // çağırmadığı için oluşturma yalnız Projects.Default'a bakıyordu — izin açıkça bağlandı.
    [Authorize(PlatformPermissions.Projects.Create)]
    public override async Task<ProjectDto> CreateAsync(CreateProjectDto input)
    {
        // Paket kotası: tenant'ın MaxProjects limitini aşması engellenir (host'a uygulanmaz).
        if (CurrentTenant.Id.HasValue)
        {
            var maxProjects = await _featureChecker.GetAsync<int>(PlatformFeatures.MaxProjects);
            var currentCount = await Repository.GetCountAsync();
            if (currentCount >= maxProjects)
            {
                throw new BusinessException("Platform:Error:MaxProjectsReached").WithData("Max", maxProjects);
            }
        }

        var overrideTenantId = CurrentTenant.Id == null ? input.TenantId : null;

        // Proje kodu hedef kiracıda benzersiz olmalı. DB'de unique index YOK
        // (PlatformDbContext'te Projects yalnız CustomerId ve TenantId+Category indeksli),
        // bu yüzden kontrol burada yapılır — formdaki canlı uyarı tek başına yeterli değil.
        var targetTenantId = overrideTenantId ?? CurrentTenant.Id;
        if (await IsCodeTakenAsync(input.Code, targetTenantId))
        {
            throw new BusinessException(PlatformDomainErrorCodes.ProjectCodeAlreadyExists)
                .WithData("Code", input.Code);
        }

        var project = await _projectManager.CreateAsync(
            input.GrantId,
            input.Name,
            input.Code,
            input.Description ?? "",
            input.TotalBudget,
            input.HourlyRate,
            input.Currency,
            input.Purpose,
            input.Duration,
            input.TargetAudience,
            input.Activities,
            input.StartDate,
            input.EndDate,
            input.CustomerId,
            input.Category,
            overrideTenantId: overrideTenantId
        );

        await Repository.InsertAsync(project);

        if (input.AddTemplateTasks)
        {
            await CreateTemplateTasksAsync(project, targetTenantId);
        }

        return ObjectMapper.Map<Project, ProjectDto>(project);
    }

    /// <summary>
    /// Kategorinin hazır görev takvimini projeyle AYNI iş biriminde kurar —
    /// AppService metodu tek UoW'da sarılı olduğu için proje ve görevler birlikte
    /// commit olur, biri düşerse ikisi de yazılmaz.
    /// </summary>
    private async Task CreateTemplateTasksAsync(Project project, Guid? targetTenantId)
    {
        var items = ProjectTaskTemplate.For(project.Category);
        if (items.Count == 0)
        {
            return;
        }

        var start = project.StartDate ?? Clock.Now;
        var end = project.EndDate ?? start;

        using (CurrentTenant.Change(targetTenantId))
        {
            // Sıra numarası BİR KEZ okunup yerelde artırılır: GetNextNumberAsync
            // DB'den MAX okur, insert'ler henüz flush olmadığı için döngüde
            // çağrılsa altı görev de aynı numarayı alırdı (GRV-N kodu çakışırdı).
            var number = await _taskManager.GetNextNumberAsync();

            foreach (var item in items)
            {
                var task = new TaskItem(
                    GuidGenerator.Create(),
                    item.Title,
                    projectId: project.Id,
                    startDate: start,
                    dueDate: ProjectTaskTemplate.DueDateFor(item, start, end),
                    tenantId: targetTenantId,
                    now: Clock.Now
                );

                task.AssignNumber(number++);
                await _taskRepository.InsertAsync(task);
            }
        }
    }

    // --- UPDATE --- domain metodu üzerinden; AutoMapper direct mapping yok
    // SEC: CreateAsync ile aynı boşluk — güncelleme de Projects.Default ile yapılabiliyordu.
    [Authorize(PlatformPermissions.Projects.Edit)]
    public override async Task<ProjectDto> UpdateAsync(Guid id, CreateProjectDto input)
    {
        // GetAccessibleProjectAsync: host, listede gördüğü kiracı projesini
        // düzenleyebilmeli. Düz Repository.GetAsync ile kaydetme 404 veriyordu.
        var project = await GetAccessibleProjectAsync(id);

        project.Update(
            input.Name,
            input.Code,
            input.Description ?? "",
            input.GrantId,
            input.CustomerId,
            input.Category,
            input.TotalBudget,
            input.HourlyRate,
            input.Currency,
            input.Purpose,
            input.Duration,
            input.TargetAudience,
            input.Activities,
            input.StartDate,
            input.EndDate
        );

        await Repository.UpdateAsync(project);

        return ObjectMapper.Map<Project, ProjectDto>(project);
    }

    // --- LIST ---
    public override async Task<PagedResultDto<ProjectDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        try
        {
            using (CurrentTenant.Id == null ? DataFilter.Disable<IMultiTenant>() : null)
            {
                var sorting = NormalizeSorting(input.Sorting);

                var queryable = await Repository.GetQueryableAsync();
                var query = queryable.OrderBy(sorting).PageBy(input.SkipCount, input.MaxResultCount);

                var totalCount = await Repository.GetCountAsync();
                var items = await AsyncExecuter.ToListAsync(query);
                var dtos = ObjectMapper.Map<List<Project>, List<ProjectDto>>(items);

                bool canViewBudget = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ViewBudget);

                // Görev listesi bütçe iznine bakılmaksızın çekilir: ilerleme%/risk/atanan sayısı
                // görev-bazlı bilgidir, bütçe rakamı değildir (yalnız time-log'dan türeyen SpentBudget bütçeye bağlı).
                List<TaskItem> allTaskItems = new();
                List<TaskTimeLog> allLogs = new();
                if (items.Any())
                {
                    var projectIds = items.Select(x => x.Id).ToList();
                    // FN-001 (liste tarafı): Assignee navigasyonu include edilmezse AutoMapper
                    // AssigneeName'i null bırakır → proje kartındaki ekip baş harfleri "?" çıkıyordu
                    // (EnrichProgressAndRisk baş harfleri AssigneeName'den türetir).
                    // GetDetailAsync'te aynı düzeltme zaten vardı; liste yolu atlanmıştı.
                    allTaskItems = await AsyncExecuter.ToListAsync(
                        (await _taskRepository.GetQueryableAsync())
                            .Include(t => t.Assignee)
                            .Where(x => x.ProjectId.HasValue && projectIds.Contains(x.ProjectId.Value)));
                    if (canViewBudget)
                    {
                        var allTaskIds = allTaskItems.Select(x => x.Id).ToList();
                        allLogs = await _timeLogRepository.GetListAsync(x => allTaskIds.Contains(x.TaskId));
                    }
                }
                var allTasks = ObjectMapper.Map<List<TaskItem>, List<Apya.Platform.Tasks.TaskDto>>(allTaskItems);

                var tenantNameMap = await ResolveTenantNamesAsync(dtos);
                var customerNameMap = await ResolveCustomerNamesAsync(dtos);
                var now = Clock.Now;

                foreach (var dto in dtos)
                {
                    EnrichBudget(dto, allTaskItems, allLogs, canViewBudget);
                    EnrichProgressAndRisk(dto, allTasks.Where(t => t.ProjectId == dto.Id).ToList(), now, CurrentUser.Id);

                    if (CurrentTenant.Id == null)
                        dto.TenantName = dto.TenantId.HasValue
                            ? tenantNameMap.GetValueOrDefault(dto.TenantId.Value, "Bilinmeyen Müşteri")
                            : "Platform (Host)";

                    if (dto.CustomerId.HasValue && customerNameMap.TryGetValue(dto.CustomerId.Value, out var custName))
                        dto.CustomerName = custName;
                }

                return new PagedResultDto<ProjectDto>(totalCount, dtos);
            }
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "ProjectAppService.GetListAsync sırasında hata oluştu! Sorting: {Sorting}", input.Sorting);
            throw;
        }
    }

    // --- DELETE ---
    [Authorize(PlatformPermissions.Projects.Delete)]
    public override async Task DeleteAsync(Guid id)
    {
        using (CurrentTenant.Id == null ? DataFilter.Disable<IMultiTenant>() : null)
        {
            await base.DeleteAsync(id);
        }
    }

    /// <summary>
    /// Tekil okuma da host bağlamında kiracı projesini görmeli: düzenleme ekranı
    /// (/Projects/Edit/{id}) bunu çağırıyor ve listedeki karttan gelen host
    /// kullanıcısına 404 veriyordu.
    /// </summary>
    public override async Task<ProjectDto> GetAsync(Guid id)
    {
        using (CurrentTenant.Id == null ? DataFilter.Disable<IMultiTenant>() : null)
        {
            return await base.GetAsync(id);
        }
    }

    // --- GRANTS ---
    public async Task<List<GrantDto>> GetAllGrantsAsync()
    {
        var q = await _grantRepository.GetQueryableAsync();
        var grants = await AsyncExecuter.ToListAsync(q.OrderBy(g => g.Name).Take(1000));
        return ObjectMapper.Map<List<Grant>, List<GrantDto>>(grants);
    }

    // --- ATTACHMENTS ---
    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task<ProjectAttachmentDto> AddAttachmentAsync(
        Guid projectId, string fileName, string storedFileName, string contentType, long fileSize, string? title = null)
    {
        var project = await GetAccessibleProjectAsync(projectId);

        var attachment = new ProjectAttachment
        {
            // CurrentTenant.Id DEĞİL: ek, projenin kiracısına ait olmalı; aksi
            // hâlde host'un eklediği dosya kiracının listesinde hiç görünmezdi.
            TenantId = project.TenantId,
            ProjectId = projectId,
            FileName = fileName,
            StoredFileName = storedFileName,
            ContentType = contentType ?? "",
            Title = string.IsNullOrWhiteSpace(title) ? null : title.Trim(),
            FileSize = fileSize
        };

        // Kayıt projenin kiracı bağlamında yapılır: ABP, kaydederken entity'nin
        // TenantId'si ile CurrentTenant'ı karşılaştırır (MultiTenancyConflict).
        // autoSave içeride SaveChanges çağırdığı için kapsam onu da örtmeli.
        using (CurrentTenant.Change(project.TenantId))
        {
            await _projectAttachmentRepository.InsertAsync(attachment, autoSave: true);
        }

        return MapAttachment(attachment);
    }

    public async Task<List<ProjectAttachmentDto>> GetAttachmentsAsync(Guid projectId)
    {
        var project = await GetAccessibleProjectAsync(projectId);

        // Sorgu projenin kiracı bağlamında koşar: ekin TenantId'si projeyle aynı,
        // host bağlamında filtre TenantId == null eşlediği için liste boş dönerdi.
        using (CurrentTenant.Change(project.TenantId))
        {
            var queryable = await _projectAttachmentRepository.GetQueryableAsync();
            var items = await AsyncExecuter.ToListAsync(
                queryable.AsNoTracking()
                         .Where(x => x.ProjectId == projectId)
                         .OrderByDescending(x => x.CreationTime));

            return items.Select(MapAttachment).ToList();
        }
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task<string> DeleteAttachmentAsync(Guid attachmentId)
    {
        // Ek satırının kendisi de kiracıya ait — host bağlamında filtre onu da
        // gizler, bu yüzden okuma projeyle aynı istisnadan geçer.
        ProjectAttachment attachment;
        using (CurrentTenant.Id == null ? DataFilter.Disable<IMultiTenant>() : null)
        {
            attachment = await _projectAttachmentRepository.GetAsync(attachmentId);
        }

        // Ekin projesi bu bağlamdan görülebiliyor mu? Ek satırının kendi TenantId'si
        // tek başına yetmez — yetki projeye bakar.
        var project = await GetAccessibleProjectAsync(attachment.ProjectId);

        var storedFileName = attachment.StoredFileName;
        using (CurrentTenant.Change(project.TenantId))
        {
            await _projectAttachmentRepository.DeleteAsync(attachment);
        }

        return storedFileName;
    }

    // --- COVER IMAGE ---
    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task<string?> SetCoverImageAsync(Guid projectId, string storedFileName)
    {
        var project = await GetAccessibleProjectAsync(projectId);
        var previous = project.CoverImageFileName;

        project.SetCoverImage(storedFileName);
        await Repository.UpdateAsync(project);

        // Eskisi yenisiyle aynıysa çağıran diski silmesin.
        return string.Equals(previous, storedFileName, StringComparison.OrdinalIgnoreCase) ? null : previous;
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task<string?> RemoveCoverImageAsync(Guid projectId)
    {
        var project = await GetAccessibleProjectAsync(projectId);
        var previous = project.CoverImageFileName;

        project.SetCoverImage(null);
        await Repository.UpdateAsync(project);

        return previous;
    }

    private static ProjectAttachmentDto MapAttachment(ProjectAttachment x) => new()
    {
        Id = x.Id,
        ProjectId = x.ProjectId,
        FileName = x.FileName,
        StoredFileName = x.StoredFileName,
        ContentType = x.ContentType,
        Title = x.Title,
        FileSize = x.FileSize,
        CreationTime = x.CreationTime,
        IsImage = !string.IsNullOrEmpty(x.ContentType)
                  && x.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase)
    };


    // --- DETAIL ---
    public async Task<ProjectDetailDto> GetDetailAsync(Guid id)
    {
        using (CurrentTenant.Id == null ? DataFilter.Disable<IMultiTenant>() : null)
        {
            var project = await Repository.GetAsync(id);
            var dto = ObjectMapper.Map<Project, ProjectDetailDto>(project);

            // FN-001: Assignee navigasyonu include edilmeden map'lenirse AutoMapper AssigneeName'i
            // null bırakır (bkz. PlatformApplicationAutoMapperProfile: AssigneeName ← Assignee.UserName)
            // → Proje Detay'daki "Atanan" filtresi hep boş kalıyordu. Include ile düzeltildi.
            var taskItems = await AsyncExecuter.ToListAsync(
                (await _taskRepository.GetQueryableAsync())
                    .Include(t => t.Assignee)
                    .Where(t => t.ProjectId == id));
            dto.Tasks = ObjectMapper.Map<List<TaskItem>, List<Apya.Platform.Tasks.TaskDto>>(taskItems);

            var taskIds = taskItems.Select(t => t.Id).ToList();
            var timeLogs = taskIds.Count > 0
                ? await _timeLogRepository.GetListAsync(x => taskIds.Contains(x.TaskId))
                : new List<TaskTimeLog>();

            // ARCH-046: Clock.Now (IClock) — DateTime.Now yerine ABP zaman soyutlaması
            var now = Clock.Now;

            if (project.TenantId.HasValue)
            {
                var tenant = await _tenantStore.FindAsync(project.TenantId.Value);
                dto.TenantDisplayName = tenant?.Name ?? "Bilinmeyen";
                dto.IsInternalProject = false;
            }
            else
            {
                dto.TenantDisplayName = "Platform (Host)";
                dto.IsInternalProject = true;
            }

            dto.CurrencySymbol = ProjectMetricsCalculator.ResolveCurrencySymbol(project.Currency);

            var time = ProjectMetricsCalculator.CalculateTimeMetrics(dto, dto.Tasks, now);
            dto.RemainingDays = time.remainingDays;
            dto.TotalProjectDays = time.totalProjectDays;
            dto.TimeUsagePercent = time.timeUsagePercent;
            dto.TimeHealthColor = time.color;
            dto.TimeHealthLabel = time.label;
            dto.TimeNotStarted = time.notStarted;

            dto.SpentBudget = ProjectMetricsCalculator.CalculateBudgetSpent(timeLogs, project.HourlyRate);
            dto.BudgetPercent = ProjectMetricsCalculator.CalculateBudgetPercent(dto.SpentBudget, project.TotalBudget);

            var risk = ProjectMetricsCalculator.CalculateAiRisk(dto, dto.Tasks, now);
            dto.AiRiskScore = risk.score;
            dto.AiRiskColor = risk.color;
            dto.AiRiskMessage = risk.message;

            return dto;
        }
    }

    // ==================== PROJE KODU ====================

    public async Task<string> GetNextCodeAsync(Guid? tenantId = null)
    {
        return await BuildNextCodeAsync(ResolveTargetTenantId(tenantId));
    }

    public async Task<ProjectCodeCheckDto> CheckCodeAsync(string code, Guid? tenantId = null)
    {
        var trimmed = (code ?? string.Empty).Trim();
        var targetTenantId = ResolveTargetTenantId(tenantId);

        if (trimmed.Length == 0 || !await IsCodeTakenAsync(trimmed, targetTenantId))
        {
            return new ProjectCodeCheckDto { IsAvailable = true, Suggestion = trimmed };
        }

        return new ProjectCodeCheckDto
        {
            IsAvailable = false,
            Suggestion = await BuildNextCodeAsync(targetTenantId)
        };
    }

    // ==================== PRIVATE HELPERS ====================

    /// <summary>
    /// Projeyi çağıranın erişebildiği kapsamda getirir; yoksa EntityNotFoundException.
    ///
    /// Kiracı kullanıcısında kiracı filtresi AÇIK kalır — çapraz kiracı erişimi
    /// kapalıdır. HOST için filtre kapatılır: host zaten tüm kiracıların projelerini
    /// listeliyor (GetListAsync aynı kalıbı kullanır) ve "Yeni Proje" formunda
    /// hesap seçip proje açabiliyor. Filtre host bağlamında TenantId == null
    /// eşlediğinden, kiracıya ait proje "bulunamadı" sayılıyordu; sonuç olarak
    /// host'un açtığı kiracı projesine dosya eklenemiyor, ek listesi okunamıyor
    /// ve kapak görseli değiştirilemiyordu.
    /// </summary>
    private async Task<Project> GetAccessibleProjectAsync(Guid projectId)
    {
        using (CurrentTenant.Id == null ? DataFilter.Disable<IMultiTenant>() : null)
        {
            return await Repository.GetAsync(projectId);
        }
    }

    /// <summary>
    /// Kod işlemlerinin hangi kiracıda yürüyeceğini belirler. Kiracı kullanıcısı
    /// başka kiracıya bakamaz — yalnız host, adına proje açtığı kiracıyı seçebilir.
    /// CreateAsync'teki overrideTenantId ile aynı kural.
    /// </summary>
    private Guid? ResolveTargetTenantId(Guid? requestedTenantId)
    {
        return CurrentTenant.Id == null ? requestedTenantId : CurrentTenant.Id;
    }

    private async Task<bool> IsCodeTakenAsync(string code, Guid? targetTenantId)
    {
        using (CurrentTenant.Change(targetTenantId))
        {
            var queryable = await Repository.GetQueryableAsync();
            return await AsyncExecuter.AnyAsync(queryable.Where(x => x.Code == code));
        }
    }

    /// <summary>
    /// PRJ-{yıl}-{sıra}: hedef kiracıda bu yıla ait en büyük sıra + 1, üç hane.
    /// Elle girilmiş farklı biçimdeki kodlar (ör. "PRJ-009") sayıma girmez.
    /// </summary>
    private async Task<string> BuildNextCodeAsync(Guid? targetTenantId)
    {
        var prefix = $"PRJ-{Clock.Now.Year}-";

        using (CurrentTenant.Change(targetTenantId))
        {
            var queryable = await Repository.GetQueryableAsync();
            var existing = await AsyncExecuter.ToListAsync(
                queryable.Where(x => x.Code.StartsWith(prefix)).Select(x => x.Code));

            var next = 1;
            foreach (var code in existing)
            {
                if (int.TryParse(code.Substring(prefix.Length), out var seq) && seq >= next)
                {
                    next = seq + 1;
                }
            }

            return prefix + next.ToString("D3");
        }
    }

    private static string NormalizeSorting(string? sorting)
    {
        if (string.IsNullOrWhiteSpace(sorting)) return "Name asc";
        return sorting
            .Replace("name", "Name", StringComparison.OrdinalIgnoreCase)
            .Replace("code", "Code", StringComparison.OrdinalIgnoreCase)
            .Replace("creationTime", "CreationTime", StringComparison.OrdinalIgnoreCase);
    }

    private async Task<Dictionary<Guid, string>> ResolveTenantNamesAsync(List<ProjectDto> dtos)
    {
        if (CurrentTenant.Id != null) return new Dictionary<Guid, string>();
        var ids = dtos.Where(d => d.TenantId.HasValue).Select(d => d.TenantId!.Value).Distinct().ToList();
        if (ids.Count == 0) return new Dictionary<Guid, string>();
        var tenants = await _tenantRepository.GetListAsync(t => ids.Contains(t.Id));
        return tenants.ToDictionary(t => t.Id, t => t.Name);
    }

    private async Task<Dictionary<Guid, string>> ResolveCustomerNamesAsync(List<ProjectDto> dtos)
    {
        var ids = dtos.Where(d => d.CustomerId.HasValue).Select(d => d.CustomerId!.Value).Distinct().ToList();
        if (ids.Count == 0) return new Dictionary<Guid, string>();
        var customers = await _customerRepository.GetListAsync(c => ids.Contains(c.Id));
        return customers.ToDictionary(c => c.Id, c => c.Name);
    }

    private static void EnrichBudget(ProjectDto dto, List<TaskItem> allTasks, List<TaskTimeLog> allLogs, bool canViewBudget)
    {
        if (canViewBudget)
        {
            var taskIds = allTasks.Where(x => x.ProjectId == dto.Id).Select(x => x.Id).ToList();
            var seconds = allLogs.Where(x => taskIds.Contains(x.TaskId)).Sum(x => x.SecondsSpent ?? 0);
            dto.SpentBudget = (decimal)(seconds / 3600.0) * dto.HourlyRate;
        }
        else
        {
            dto.TotalBudget = 0;
            dto.HourlyRate = 0;
            dto.SpentBudget = 0;
            dto.Currency = "***";
        }
    }

    /// <summary>
    /// Kart/KPI için görev-bazlı türetilmiş alanlar. IsApproved KULLANILMAZ (hiçbir yerden
    /// set edilmiyor, fiilen ölü kod) — durum StartDate/görev-tamamlanma/risk skorundan türetilir.
    /// </summary>
    private static void EnrichProgressAndRisk(ProjectDto dto, List<Apya.Platform.Tasks.TaskDto> projectTasks, DateTime now, Guid? currentUserId = null)
    {
        var time = ProjectMetricsCalculator.CalculateTimeMetrics(dto, projectTasks, now);
        var risk = ProjectMetricsCalculator.CalculateAiRisk(dto, projectTasks, now);

        var totalTasks = projectTasks.Count;
        var completedTasks = projectTasks.Count(t => t.Status == Apya.Platform.Tasks.TaskStatus.Done);
        dto.ProgressPercent = totalTasks > 0 ? (int)Math.Round((double)completedTasks / totalTasks * 100) : 0;
        dto.TaskCount = totalTasks;
        dto.CompletedTaskCount = completedTasks;

        // Gecikme/son tarih metrikleri — Projeler listesindeki risk kenarı, gecikme
        // rozeti ve "sonraki <tarih>" metni tek yerden beslensin diye burada türetilir.
        // İptal edilen görev ne gecikir ne de sıradaki son tarihi belirler.
        var openTasks = projectTasks
            .Where(t => t.Status != Apya.Platform.Tasks.TaskStatus.Done
                     && t.Status != Apya.Platform.Tasks.TaskStatus.Cancelled)
            .ToList();
        var overdue = openTasks.Where(t => t.DueDate.HasValue && t.DueDate.Value < now).ToList();
        dto.OverdueTaskCount = overdue.Count;
        dto.OldestOverdueDays = overdue.Count > 0
            ? (int)(now.Date - overdue.Min(t => t.DueDate!.Value).Date).TotalDays
            : null;
        dto.NextDueDate = openTasks
            .Where(t => t.DueDate.HasValue && t.DueDate.Value >= now)
            .Select(t => t.DueDate)
            .DefaultIfEmpty(null)
            .Min();

        var assignees = projectTasks
            .Where(t => t.AssigneeId.HasValue)
            .GroupBy(t => t.AssigneeId!.Value)
            .Select(g => g.First().AssigneeName)
            .ToList();
        dto.AssigneeCount = assignees.Count;
        dto.AssigneeInitials = assignees.Take(5).Select(ToInitials).ToList();
        dto.IsAssignedToMe = currentUserId.HasValue
                             && projectTasks.Any(t => t.AssigneeId == currentUserId.Value);

        dto.RiskColor = risk.color;
        // KIRPMA YOK: süresi geçmiş proje negatif döner. Projeler listesinin risk
        // kuralı "daysLeft < 0 → yüksek risk" bu işarete dayanıyor; Math.Max(0, …)
        // ile kırpıldığında geçmiş bitiş tarihi "bugün bitiyor"dan ayırt edilemiyordu.
        dto.DaysRemaining = (dto.StartDate.HasValue && dto.EndDate.HasValue)
            ? (int)Math.Floor((dto.EndDate.Value.Date - now.Date).TotalDays)
            : null;

        dto.DisplayStatus = (totalTasks == 0 || time.notStarted)
            ? "Planlama"
            : risk.color == "danger" ? "Risk" : "Aktif";
    }

    private static string ToInitials(string? displayName)
    {
        if (string.IsNullOrWhiteSpace(displayName)) return "?";
        var parts = displayName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        return parts.Length >= 2
            ? $"{parts[0][0]}{parts[^1][0]}".ToUpperInvariant()
            : parts[0][..Math.Min(2, parts[0].Length)].ToUpperInvariant();
    }

    // --- SUMMARY (Projeler KPI şeridi) ---
    public async Task<ProjectsSummaryDto> GetProjectsSummaryAsync()
    {
        using (CurrentTenant.Id == null ? DataFilter.Disable<IMultiTenant>() : null)
        {
            var queryable = await Repository.GetQueryableAsync();
            var items = await AsyncExecuter.ToListAsync(queryable);
            var dtos = ObjectMapper.Map<List<Project>, List<ProjectDto>>(items);

            bool canViewBudget = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ViewBudget);

            List<TaskItem> allTaskItems = new();
            if (items.Any())
            {
                var projectIds = items.Select(x => x.Id).ToList();
                // FN-001 (özet tarafı): baş harfler AssigneeName'den türediği için Assignee şart.
                allTaskItems = await AsyncExecuter.ToListAsync(
                    (await _taskRepository.GetQueryableAsync())
                        .Include(t => t.Assignee)
                        .Where(x => x.ProjectId.HasValue && projectIds.Contains(x.ProjectId.Value)));
            }
            var allTasks = ObjectMapper.Map<List<TaskItem>, List<Apya.Platform.Tasks.TaskDto>>(allTaskItems);

            var now = Clock.Now;
            foreach (var dto in dtos)
            {
                EnrichProgressAndRisk(dto, allTasks.Where(t => t.ProjectId == dto.Id).ToList(), now);
            }

            var summary = new ProjectsSummaryDto
            {
                TotalCount = dtos.Count,
                ActiveCount = dtos.Count(d => d.DisplayStatus != "Planlama"),
                AtRiskCount = dtos.Count(d => d.DisplayStatus == "Risk"),
                AverageProgressPercent = dtos.Count > 0 ? (int)Math.Round(dtos.Average(d => d.ProgressPercent)) : 0,
                TotalBudget = canViewBudget ? dtos.Sum(d => d.TotalBudget) : 0
            };
            return summary;
        }
    }
}
