using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks;
using Apya.Platform.IssueTasks.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Settings;
using Apya.Platform.Tasks;
using Apya.Platform.Telemetry;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;

using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.SettingManagement;
using Volo.Abp.Settings;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.IssueTasks;

/// <summary>
/// Geri bildirim ve hata kayıtlarını göreve dönüştürür. Host-only: geri bildirim havuzu
/// tüm kiracıları kapsar, görev ise host projesinde açılır.
/// </summary>
[Authorize(PlatformPermissions.IssueTasks.Default)]
public class IssueTaskAppService : ApplicationService, IIssueTaskAppService
{
    private readonly IssueTaskManager _issueTaskManager;
    private readonly ServerErrorSignalBuilder _serverErrorSignalBuilder;
    private readonly IRepository<IssueTaskLink, Guid> _linkRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<Feedback, Guid> _feedbackRepository;
    private readonly IRepository<ClientError, Guid> _clientErrorRepository;
    private readonly ITenantRepository _tenantRepository;
    private readonly IIdentityUserRepository _userRepository;
    private readonly IDataFilter<IMultiTenant> _multiTenantFilter;
    private readonly ISettingManager _settingManager;

    public IssueTaskAppService(
        IssueTaskManager issueTaskManager,
        ServerErrorSignalBuilder serverErrorSignalBuilder,
        IRepository<IssueTaskLink, Guid> linkRepository,
        IRepository<TaskItem, Guid> taskRepository,
        IRepository<Project, Guid> projectRepository,
        IRepository<Feedback, Guid> feedbackRepository,
        IRepository<ClientError, Guid> clientErrorRepository,
        ITenantRepository tenantRepository,
        IIdentityUserRepository userRepository,
        IDataFilter<IMultiTenant> multiTenantFilter,
        ISettingManager settingManager)
    {
        _issueTaskManager = issueTaskManager;
        _serverErrorSignalBuilder = serverErrorSignalBuilder;
        _linkRepository = linkRepository;
        _taskRepository = taskRepository;
        _projectRepository = projectRepository;
        _feedbackRepository = feedbackRepository;
        _clientErrorRepository = clientErrorRepository;
        _tenantRepository = tenantRepository;
        _userRepository = userRepository;
        _multiTenantFilter = multiTenantFilter;
        _settingManager = settingManager;
    }

    /* ==================== BAĞLAM ==================== */

    public async Task<IssueTaskTargetDto> GetTargetAsync()
    {
        EnsureHostContext();

        var dto = new IssueTaskTargetDto
        {
            TargetProjectId   = await GetGuidSettingAsync(PlatformSettings.IssueTasks.TargetProjectId),
            DefaultAssigneeId = await GetGuidSettingAsync(PlatformSettings.IssueTasks.DefaultAssigneeId)
        };

        var projects = await AsyncExecuter.ToListAsync(
            (await _projectRepository.GetQueryableAsync())
                .OrderBy(p => p.Name)
                .Take(200)
                .Select(p => new IssueTaskProjectDto { Id = p.Id, Name = p.Name, Code = p.Code }));

        dto.Projects = projects;

        var target = dto.TargetProjectId.HasValue
            ? projects.FirstOrDefault(p => p.Id == dto.TargetProjectId.Value)
            : null;

        dto.TargetProjectName = target?.Name;
        dto.IsReady = target is not null;

        // Görev yalnızca host kullanıcısına atanabilir — işi yürüten ekip host tarafında.
        var users = await _userRepository.GetListAsync(sorting: nameof(IdentityUser.UserName), maxResultCount: 200);
        dto.Assignees = users
            .Where(u => u.TenantId == null)
            .Select(u => new IssueTaskAssigneeDto { Id = u.Id, UserName = u.UserName, Name = u.Name })
            .ToList();

        return dto;
    }

    /* ==================== BAĞ SORGULARI ==================== */

    public async Task<IssueTaskLinkDto?> GetLinkForFeedbackAsync(Guid feedbackId)
    {
        EnsureHostContext();
        return await MapLinkOrNullAsync(await _issueTaskManager.FindLinkAsync(IssueSourceType.Feedback, feedbackId.ToString("N")));
    }

    public async Task<IssueTaskLinkDto?> GetLinkForClientErrorAsync(Guid clientErrorId)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var error = await _clientErrorRepository.FindAsync(clientErrorId);
            if (error is null)
            {
                return null;
            }

            return await MapLinkOrNullAsync(
                await _issueTaskManager.FindLinkAsync(IssueSourceType.ClientError, error.Fingerprint));
        }
    }

    public async Task<IssueTaskLinkDto?> GetLinkForServerErrorAsync(string url, string? httpMethod, int windowDays)
    {
        EnsureHostContext();

        // Anahtar exception TÜRÜNÜ de içerir; tür pencere içindeki en yeni satırdan gelir.
        var signal = await _serverErrorSignalBuilder.BuildAsync(url, httpMethod, windowDays);
        if (signal is null)
        {
            return null;
        }

        var key = IssueTaskManager.BuildServerErrorKey(signal.HttpMethod, signal.Url, signal.ExceptionType);
        return await MapLinkOrNullAsync(await _issueTaskManager.FindLinkAsync(IssueSourceType.ServerError, key));
    }

    /* ==================== GÖREVE DÖNÜŞTÜRME ==================== */

    public async Task<IssueTaskLinkDto> CreateFromFeedbackAsync(Guid feedbackId, CreateIssueTaskInput input)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var feedback = await _feedbackRepository.FindAsync(feedbackId);
            if (feedback is null)
            {
                throw new EntityNotFoundException(typeof(Feedback), feedbackId);
            }

            var tenantNames = await GetTenantNamesAsync();
            var options = await BuildOptionsAsync(input);

            var link = await _issueTaskManager.CreateFromFeedbackAsync(
                feedback,
                ResolveTenantName(feedback.TenantId, tenantNames),
                options);

            return await MapLinkAsync(link);
        }
    }

    public async Task<IssueTaskLinkDto> CreateFromClientErrorAsync(Guid clientErrorId, CreateIssueTaskInput input)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var error = await _clientErrorRepository.FindAsync(clientErrorId);
            if (error is null)
            {
                throw new EntityNotFoundException(typeof(ClientError), clientErrorId);
            }

            var tenantNames = await GetTenantNamesAsync();
            var options = await BuildOptionsAsync(input);

            var link = await _issueTaskManager.CreateFromClientErrorAsync(
                error,
                ResolveTenantName(error.TenantId, tenantNames),
                options);

            return await MapLinkAsync(link);
        }
    }

    public async Task<IssueTaskLinkDto> CreateFromServerErrorAsync(CreateServerErrorTaskInput input)
    {
        EnsureHostContext();

        var signal = await _serverErrorSignalBuilder.BuildAsync(input.Url, input.HttpMethod, input.WindowDays);
        if (signal is null)
        {
            throw new BusinessException(PlatformDomainErrorCodes.IssueTaskSourceNotFound)
                .WithData("url", input.Url);
        }

        var options = await BuildOptionsAsync(input);

        var link = await _issueTaskManager.CreateFromServerErrorAsync(signal, options);
        return await MapLinkAsync(link);
    }

    public async Task RemoveLinkAsync(Guid linkId)
    {
        EnsureHostContext();

        var link = await _linkRepository.FindAsync(linkId);
        if (link is null)
        {
            return;
        }

        await _linkRepository.DeleteAsync(link);
    }

    /* ==================== AYARLAR ==================== */

    public async Task<IssueTaskSettingsDto> GetSettingsAsync()
    {
        EnsureHostContext();

        // KRİTİK: bu ayarlar .WithProviders(Global) ile kısıtlı olduğundan
        // DefaultValueSettingValueProvider zincirde YOKTUR — her okumada açık
        // varsayılan verilmeli, aksi halde hiç yazılmamış ayar false/0 gelir.
        return new IssueTaskSettingsDto
        {
            TargetProjectId   = await GetGuidSettingAsync(PlatformSettings.IssueTasks.TargetProjectId),
            DefaultAssigneeId = await GetGuidSettingAsync(PlatformSettings.IssueTasks.DefaultAssigneeId),

            AutoCreateEnabled = await SettingProvider.GetAsync(
                PlatformSettings.IssueTasks.AutoCreateEnabled, PlatformSettingDefaults.IssueTaskAutoCreateEnabled),

            FeedbackMinPriority = ParsePriority(await SettingProvider.GetOrNullAsync(
                PlatformSettings.IssueTasks.FeedbackMinPriority)),

            ClientErrorThreshold = await SettingProvider.GetAsync(
                PlatformSettings.IssueTasks.ClientErrorThreshold, IssueTaskConsts.DefaultClientErrorThreshold),

            ServerErrorThreshold = await SettingProvider.GetAsync(
                PlatformSettings.IssueTasks.ServerErrorThreshold, IssueTaskConsts.DefaultServerErrorThreshold),

            CloseSourceOnTaskDone = await SettingProvider.GetAsync(
                PlatformSettings.IssueTasks.CloseSourceOnTaskDone, PlatformSettingDefaults.IssueTaskCloseSourceOnTaskDone)
        };
    }

    [Authorize(PlatformPermissions.IssueTasks.ManageSettings)]
    public async Task UpdateSettingsAsync(IssueTaskSettingsDto input)
    {
        EnsureHostContext();

        // Hedef proje host'ta gerçekten var mı? Silinmiş bir Id kaydedilirse dönüştürme
        // ancak kullanıcı düğmeye bastığında patlardı.
        if (input.TargetProjectId.HasValue)
        {
            var project = await _projectRepository.FindAsync(input.TargetProjectId.Value);
            if (project is null || project.TenantId is not null)
            {
                throw new BusinessException(PlatformDomainErrorCodes.IssueTaskTargetProjectNotFound)
                    .WithData("projectId", input.TargetProjectId.Value);
            }
        }

        var clientThreshold = Math.Clamp(
            input.ClientErrorThreshold, IssueTaskConsts.MinOccurrenceThreshold, IssueTaskConsts.MaxOccurrenceThreshold);
        var serverThreshold = Math.Clamp(
            input.ServerErrorThreshold, IssueTaskConsts.MinOccurrenceThreshold, IssueTaskConsts.MaxOccurrenceThreshold);

        await _settingManager.SetGlobalAsync(PlatformSettings.IssueTasks.TargetProjectId,
            input.TargetProjectId?.ToString() ?? string.Empty);
        await _settingManager.SetGlobalAsync(PlatformSettings.IssueTasks.DefaultAssigneeId,
            input.DefaultAssigneeId?.ToString() ?? string.Empty);
        await _settingManager.SetGlobalAsync(PlatformSettings.IssueTasks.AutoCreateEnabled,
            input.AutoCreateEnabled.ToString().ToLowerInvariant());
        await _settingManager.SetGlobalAsync(PlatformSettings.IssueTasks.FeedbackMinPriority,
            ((int)input.FeedbackMinPriority).ToString());
        await _settingManager.SetGlobalAsync(PlatformSettings.IssueTasks.ClientErrorThreshold,
            clientThreshold.ToString());
        await _settingManager.SetGlobalAsync(PlatformSettings.IssueTasks.ServerErrorThreshold,
            serverThreshold.ToString());
        await _settingManager.SetGlobalAsync(PlatformSettings.IssueTasks.CloseSourceOnTaskDone,
            input.CloseSourceOnTaskDone.ToString().ToLowerInvariant());
    }

    /* ==================== yardımcılar ==================== */

    private async Task<IssueTaskOptions> BuildOptionsAsync(CreateIssueTaskInput input)
    {
        var projectId = input.ProjectId ?? await GetGuidSettingAsync(PlatformSettings.IssueTasks.TargetProjectId);
        if (projectId is null || projectId == Guid.Empty)
        {
            throw new BusinessException(PlatformDomainErrorCodes.IssueTaskTargetProjectNotSet);
        }

        var assigneeId = input.AssigneeId ?? await GetGuidSettingAsync(PlatformSettings.IssueTasks.DefaultAssigneeId);

        return new IssueTaskOptions
        {
            ProjectId   = projectId.Value,
            AssigneeId  = assigneeId,
            Priority    = input.Priority,
            DueDate     = input.DueDate,
            Title       = input.Title,
            Note        = input.Note,
            IsAutomatic = false
        };
    }

    private async Task<IssueTaskLinkDto?> MapLinkOrNullAsync(IssueTaskLink? link)
    {
        return link is null ? null : await MapLinkAsync(link);
    }

    private async Task<IssueTaskLinkDto> MapLinkAsync(IssueTaskLink link)
    {
        // Görev host bağlamında yaşar; bu servis zaten host'ta çalışıyor.
        var task = await _taskRepository.FindAsync(link.TaskId);

        return new IssueTaskLinkDto
        {
            Id             = link.Id,
            SourceType     = link.SourceType,
            SourceId       = link.SourceId,
            SourceKey      = link.SourceKey,
            SourceLabel    = link.SourceLabel,
            TaskId         = link.TaskId,
            TaskNumber     = task?.Number ?? 0,
            TaskTitle      = task?.Title ?? string.Empty,
            TaskStatus     = task?.Status ?? Apya.Platform.Tasks.TaskStatus.Cancelled,
            TaskExists     = task is not null,
            IsAutomatic    = link.IsAutomatic,
            CreationTime   = link.CreationTime,
            SourceClosedAt = link.SourceClosedAt
        };
    }

    private async Task<Guid?> GetGuidSettingAsync(string name)
    {
        var raw = await SettingProvider.GetOrNullAsync(name);
        return Guid.TryParse(raw, out var value) && value != Guid.Empty ? value : null;
    }

    private static FeedbackPriority ParsePriority(string? raw)
    {
        if (int.TryParse(raw, out var value) && Enum.IsDefined(typeof(FeedbackPriority), value))
        {
            return (FeedbackPriority)value;
        }

        return (FeedbackPriority)PlatformSettingDefaults.IssueTaskFeedbackMinPriority;
    }

    private async Task<Dictionary<Guid, string>> GetTenantNamesAsync()
    {
        var tenants = await _tenantRepository.GetListAsync();
        return tenants.ToDictionary(t => t.Id, t => t.Name);
    }

    private static string? ResolveTenantName(Guid? tenantId, Dictionary<Guid, string> names)
    {
        if (tenantId is null)
        {
            return "Host";
        }

        return names.TryGetValue(tenantId.Value, out var name) ? name : null;
    }

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException("Bu işlem yalnızca host bağlamında yapılabilir.");
        }
    }

}
