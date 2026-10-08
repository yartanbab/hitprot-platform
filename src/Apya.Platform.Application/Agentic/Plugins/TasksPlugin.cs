using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.SemanticKernel;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Security.Claims;
using Volo.Abp.Users;
using Apya.Platform.Permissions;
using Apya.Platform.Tasks;

namespace Apya.Platform.Agentic.Plugins;

/// <summary>
/// A Semantic Kernel plugin that provides AI with abilities to interact with the Task Management module.
///
/// <para>🔐 Araçlar görevi doğrudan depodan okur; uygulama servisinin kapıları burada kendiliğinden
/// ÇALIŞMAZ. Bu yüzden iki kural eklentinin içinde uygulanır: (1) <c>Tasks.Default</c> izni olmayan
/// çağıran için araç görev döndürmez, (2) liste, görev listesiyle aynı gizlilik süzgecinden
/// (APYA-22, <see cref="TaskPrivacyQueryFilter"/>) geçer. İkisi de yokken asistanı kullanabilen
/// herkes kiracının BÜTÜN görev başlıklarını — gizli olanlar dahil — alıyor, başlıklar dış AI
/// sağlayıcısına da gidiyordu.</para>
/// </summary>
public class TasksPlugin
{
    private const string NotAllowedText = "Görevleri görüntüleme yetkiniz bulunmamaktadır.";

    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly Volo.Abp.Timing.IClock _clock;
    private readonly ICurrentUser _currentUser;
    private readonly IAuthorizationService _authorizationService;

    public TasksPlugin(
        IRepository<TaskItem, Guid> taskRepository,
        Volo.Abp.Timing.IClock clock,
        ICurrentUser currentUser,
        IAuthorizationService authorizationService)
    {
        _taskRepository = taskRepository;
        _clock = clock;
        _currentUser = currentUser;
        _authorizationService = authorizationService;
    }

    [KernelFunction, Description("Sistemdeki gecikmiş (deadline'ı geçmiş fakat henüz tamamlanmamış) tüm görevlerin bir listesini getirir.")]
    public async Task<string> GetOverdueTasksAsync()
    {
        var now = _clock.Now;
        var query = await VisibleTasksAsync();
        if (query == null)
        {
            return NotAllowedText;
        }

        var overdueTasks = query
            .Where(t => t.Status != Apya.Platform.Tasks.TaskStatus.Done && t.Status != Apya.Platform.Tasks.TaskStatus.Cancelled)
            .Where(t => t.DueDate.HasValue && t.DueDate.Value < now)
            .ToList();

        if (!overdueTasks.Any())
        {
            return "Geçikmiş (overdue) durumunda herhangi bir görev bulunmamaktadır.";
        }

        var resultTasks = overdueTasks.Select(t => new {
            t.Id,
            t.Title,
            t.DueDate,
            t.Status,
            t.Priority
        });

        return System.Text.Json.JsonSerializer.Serialize(resultTasks);
    }
    
    [KernelFunction, Description("Belirli bir başlıktaki tüm açık görevleri getirir.")]
    public async Task<string> GetOpenTasksAsync()
    {
        var query = await VisibleTasksAsync();
        if (query == null)
        {
            return NotAllowedText;
        }

        var openTasks = query
            .Where(t => t.Status != Apya.Platform.Tasks.TaskStatus.Done && t.Status != Apya.Platform.Tasks.TaskStatus.Cancelled)
            .ToList();

        if (!openTasks.Any())
        {
            return "Açık görev bulunmamaktadır.";
        }

        return System.Text.Json.JsonSerializer.Serialize(openTasks.Select(t => new { t.Id, t.Title, t.Status }));
    }

    /// <summary>
    /// Çağıranın görebildiği görevler; <c>Tasks.Default</c> izni yoksa <c>null</c>.
    /// </summary>
    private async Task<IQueryable<TaskItem>?> VisibleTasksAsync()
    {
        if (!await _authorizationService.IsGrantedAsync(PlatformPermissions.Tasks.Default))
        {
            return null;
        }

        bool isImpersonated = _currentUser.FindClaim(AbpClaimTypes.ImpersonatorUserId) != null;
        bool canManageTeam = await _authorizationService.IsGrantedAsync(PlatformPermissions.Projects.ManageTeam);

        return TaskPrivacyQueryFilter.Apply(
            await _taskRepository.GetQueryableAsync(), isImpersonated, canManageTeam, _currentUser.Id);
    }
}
