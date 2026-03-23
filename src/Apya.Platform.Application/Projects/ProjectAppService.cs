using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement; // ITenantStore için gerekli kütüphane
using Apya.Platform.Permissions; // Permissions eklendi
using Apya.Platform.Tasks;

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
    private readonly ITenantStore _tenantStore; 

    public ProjectAppService(
        IRepository<Project, Guid> repository,
        ProjectManager projectManager,
        IRepository<Grant, Guid> grantRepository,
        IRepository<ProjectAttachment, Guid> projectAttachmentRepository,
        IRepository<TaskItem, Guid> taskRepository,
        IRepository<TaskTimeLog, Guid> timeLogRepository,
        ITenantStore tenantStore)
        : base(repository)
    {
        _projectManager = projectManager;
        _grantRepository = grantRepository;
        _projectAttachmentRepository = projectAttachmentRepository;
        _taskRepository = taskRepository;
        _timeLogRepository = timeLogRepository;
        _tenantStore = tenantStore;
    }

    // --- CREATE ---
    public override async Task<ProjectDto> CreateAsync(CreateProjectDto input)
    {
        var project = await _projectManager.CreateAsync(
            input.GrantId,
            input.Name,
            input.Code,
            input.Description ?? ""
        );

        await Repository.InsertAsync(project);
        
        project.TotalBudget = input.TotalBudget;
        project.HourlyRate = input.HourlyRate;
        project.Currency = input.Currency;
        
        return ObjectMapper.Map<Project, ProjectDto>(project);
    }

    // --- GET LIST ---
    public override async Task<PagedResultDto<ProjectDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        // Root Admin (Host) için tenant filtresini kapatıyoruz
        using (CurrentTenant.Id == null ? DataFilter.Disable<IMultiTenant>() : null)
        {
            var queryable = await Repository.GetQueryableAsync();

            var query = queryable
                .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? "Name asc" : input.Sorting)
                .PageBy(input.SkipCount, input.MaxResultCount);

            var totalCount = await Repository.GetCountAsync();
            var items = await AsyncExecuter.ToListAsync(query);

            var dtos = ObjectMapper.Map<List<Project>, List<ProjectDto>>(items);

            // YETKİ KONTROLÜ: Kullanıcı bütçeleri görebilir mi? (APYA-Rol/Müşteri Gizliliği)
            bool canViewBudget = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ViewBudget);

            // BÜTÇE HESAPLAMALARINI SADECE YETKİLİLER İÇİN YAP
            List<TaskItem> allTasks = new();
            List<TaskTimeLog> allLogs = new();
            if (canViewBudget)
            {
                var projectIds = items.Select(x => x.Id).ToList();
                allTasks = await _taskRepository.GetListAsync(x => x.ProjectId.HasValue && projectIds.Contains(x.ProjectId.Value));
                var allTaskIds = allTasks.Select(x => x.Id).ToList();
                allLogs = await _timeLogRepository.GetListAsync(x => allTaskIds.Contains(x.TaskId));
            }

            foreach (var dto in dtos)
            {
                if (canViewBudget)
                {
                    var projectTasks = allTasks.Where(x => x.ProjectId == dto.Id).Select(x => x.Id).ToList();
                    var projectSeconds = allLogs.Where(x => projectTasks.Contains(x.TaskId)).Sum(x => x.SecondsSpent ?? 0);
                    dto.SpentBudget = (decimal)(projectSeconds / 3600.0) * dto.HourlyRate;
                }
                else
                {
                    // Katılımcı / proje üyesi için finansal verileri sıfırla/kapat
                    dto.TotalBudget = 0;
                    dto.HourlyRate = 0;
                    dto.SpentBudget = 0;
                    dto.Currency = "***";
                }

                // SADECE ROOT ADMIN İÇİN MÜŞTERİ İSİMLERİNİ ÇEKİYORUZ
                if (CurrentTenant.Id == null)
                {
                    if (dto.TenantId.HasValue)
                    {
                        var tenant = await _tenantStore.FindAsync(dto.TenantId.Value);
                        dto.TenantName = tenant?.Name ?? "Bilinmeyen Müşteri";
                    }
                    else
                    {
                        dto.TenantName = "Platform (Host)";
                    }
                }
            }

            return new PagedResultDto<ProjectDto>(totalCount, dtos);
        }
    }

    // --- DELETE ---
    [Authorize(PlatformPermissions.Projects.Delete)]
    public override async Task DeleteAsync(Guid id)
    {
        // Yalnızca SİLME yetkisi olanlar bu metoda girebilir.
        // Projeye ait alt kayıtların silinmesi mantığı (görevler vb.) Entity Framework Cascade Delete ile,
        // veya ABP'nin Domain Event'leri ile halledilebilir. 
        // Temel güvenlik Katmanı:
        await base.DeleteAsync(id);
    }

    // --- INTERFACE TARAFINDAN BEKLENEN EKSİK METODLAR ---

    public async Task<List<GrantDto>> GetAllGrantsAsync()
    {
        var grants = await _grantRepository.GetListAsync();
        return ObjectMapper.Map<List<Grant>, List<GrantDto>>(grants);
    }

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

    public Task<ProjectAnalysisDto?> GetAnalysisAsync(Guid projectId)
    {
        return Task.FromResult<ProjectAnalysisDto?>(null);
    }

    public Task<ProjectAnalysisDto> AddAnalysisAsync(CreateAnalysisDto input)
    {
        return Task.FromResult(new ProjectAnalysisDto());
    }

    public Task<List<GrantDto>> GetSuitableGrantsAsync(Guid projectId)
    {
        return Task.FromResult(new List<GrantDto>());
    }
}