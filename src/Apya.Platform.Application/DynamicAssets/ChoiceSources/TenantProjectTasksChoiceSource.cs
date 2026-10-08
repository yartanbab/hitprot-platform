using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Security.Claims;
using Volo.Abp.Users;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.DynamicAssets.ChoiceSources;

/// <summary>
/// 16b · Zincirli alan: yukarıdaki proje alanında seçilen projenin görevleri. Üst alan seçilmeden liste
/// BOŞ gelir — "tüm görevler" göstermek zincirin anlamını bozardı.
///
/// <para>Kapsam kiracıdır (süzgeç açık); üstelik proje kimliği de kiracının kendi projesi olmak zorundadır,
/// başka firmanın proje kimliği yazılsa bile sorgu boş döner.</para>
///
/// <para>🔴 Oturumsuz ziyaretçiye liste dönmez (bkz. <see cref="TenantProjectsChoiceSource"/>).</para>
///
/// <para>🔴 Liste görev BAŞLIĞI verir → görev listesiyle aynı gizlilik süzgeci (APYA-22,
/// <see cref="TaskPrivacyQueryFilter"/>). Süzgeç yokken formu dolduran herkes, göremediği gizli
/// görevlerin başlıklarını açılır listede okuyordu.</para>
/// </summary>
[ExposeServices(typeof(IFormChoiceSource))]
public class TenantProjectTasksChoiceSource : IFormChoiceSource, ITransientDependency
{
    private static readonly CultureInfo Turkish = CultureInfo.GetCultureInfo("tr-TR");

    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentUser _currentUser;
    private readonly IAuthorizationService _authorizationService;

    public TenantProjectTasksChoiceSource(
        IRepository<TaskItem, Guid> taskRepository,
        ICurrentUser currentUser,
        IAuthorizationService authorizationService)
    {
        _taskRepository = taskRepository;
        _currentUser = currentUser;
        _authorizationService = authorizationService;
    }

    public string Key => FormChoiceSources.TenantProjectTasks;

    public FormChoiceSourceScope Scope => FormChoiceSourceScope.FillerTenant;

    public string? DependsOnSourceKey => FormChoiceSources.TenantProjects;

    public async Task<List<FormChoiceDto>> GetAsync(string? parentValue)
    {
        if (!_currentUser.IsAuthenticated || !Guid.TryParse(parentValue, out var projectId))
        {
            return new List<FormChoiceDto>();
        }

        var tasks = await _taskRepository.GetListAsync(t => t.ProjectId == projectId && t.Status != TaskStatus.Cancelled);

        // Gizli görev yoksa yetki sorgusu da atılmaz (olağan durum).
        if (tasks.Any(t => t.IsPrivate))
        {
            bool isImpersonated = _currentUser.FindClaim(AbpClaimTypes.ImpersonatorUserId) != null;
            bool canManageTeam = await _authorizationService.IsGrantedAsync(PlatformPermissions.Projects.ManageTeam);

            tasks = TaskPrivacyQueryFilter
                .Apply(tasks.AsQueryable(), isImpersonated, canManageTeam, _currentUser.Id)
                .ToList();
        }

        return tasks
            .Select(t => new FormChoiceDto { Value = t.Id.ToString(), Label = t.Title })
            .OrderBy(c => c.Label, StringComparer.Create(Turkish, ignoreCase: true))
            .ToList();
    }
}
