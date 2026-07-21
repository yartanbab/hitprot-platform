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
using Microsoft.Extensions.Logging;

namespace Apya.Platform.Application.Projects;

[Authorize]
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
        _timeLogRepository = timeLogRepository;
        _customerRepository = customerRepository;
        _tenantStore = tenantStore;
        _tenantRepository = tenantRepository;
        _featureChecker = featureChecker;
    }

    // --- CREATE ---
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

        return ObjectMapper.Map<Project, ProjectDto>(project);
    }

    // --- UPDATE --- domain metodu üzerinden; AutoMapper direct mapping yok
    public override async Task<ProjectDto> UpdateAsync(Guid id, CreateProjectDto input)
    {
        var project = await Repository.GetAsync(id);

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

                List<TaskItem> allTasks = new();
                List<TaskTimeLog> allLogs = new();
                if (canViewBudget && items.Any())
                {
                    var projectIds = items.Select(x => x.Id).ToList();
                    allTasks = await _taskRepository.GetListAsync(x => x.ProjectId.HasValue && projectIds.Contains(x.ProjectId.Value));
                    var allTaskIds = allTasks.Select(x => x.Id).ToList();
                    allLogs = await _timeLogRepository.GetListAsync(x => allTaskIds.Contains(x.TaskId));
                }

                var tenantNameMap = await ResolveTenantNamesAsync(dtos);
                var customerNameMap = await ResolveCustomerNamesAsync(dtos);

                foreach (var dto in dtos)
                {
                    EnrichBudget(dto, allTasks, allLogs, canViewBudget);

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
        await base.DeleteAsync(id);
    }

    // --- GRANTS ---
    public async Task<List<GrantDto>> GetAllGrantsAsync()
    {
        var q = await _grantRepository.GetQueryableAsync();
        var grants = await AsyncExecuter.ToListAsync(q.OrderBy(g => g.Name).Take(1000));
        return ObjectMapper.Map<List<Grant>, List<GrantDto>>(grants);
    }

    // --- ATTACHMENTS ---
    public async Task AddAttachmentAsync(Guid projectId, string fileName, string storedFileName, long fileSize)
    {
        await _projectAttachmentRepository.InsertAsync(new ProjectAttachment
        {
            ProjectId = projectId,
            FileName = fileName,
            StoredFileName = storedFileName,
            FileSize = fileSize
        });
    }

    // --- STUBS (henüz implement edilmedi) ---
    public Task<ProjectAnalysisDto?> GetAnalysisAsync(Guid projectId)
    {
        Logger.LogWarning("GetAnalysisAsync çağrıldı ama implement edilmedi. ProjectId: {ProjectId}", projectId);
        throw new NotImplementedException("Proje analizi henüz desteklenmiyor.");
    }

    public Task<ProjectAnalysisDto> AddAnalysisAsync(CreateAnalysisDto input)
    {
        Logger.LogWarning("AddAnalysisAsync çağrıldı ama implement edilmedi.");
        throw new NotImplementedException("Proje analizi ekleme henüz desteklenmiyor.");
    }

    public Task<List<GrantDto>> GetSuitableGrantsAsync(Guid projectId)
    {
        Logger.LogWarning("GetSuitableGrantsAsync çağrıldı ama implement edilmedi. ProjectId: {ProjectId}", projectId);
        throw new NotImplementedException("Uygun hibe önerisi henüz desteklenmiyor.");
    }

    // --- DETAIL ---
    public async Task<ProjectDetailDto> GetDetailAsync(Guid id)
    {
        using (CurrentTenant.Id == null ? DataFilter.Disable<IMultiTenant>() : null)
        {
            var project = await Repository.GetAsync(id);
            var dto = ObjectMapper.Map<Project, ProjectDetailDto>(project);

            var taskItems = await _taskRepository.GetListAsync(t => t.ProjectId == id);
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

    // ==================== PRIVATE HELPERS ====================

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
}
