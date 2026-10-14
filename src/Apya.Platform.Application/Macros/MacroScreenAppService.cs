using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Macros.Dtos;
using Apya.Platform.Notifications;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Domain.Repositories;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.Macros;

/// <summary>
/// Makro Ekran'a özel sorgular (bkz. <see cref="IMacroScreenAppService"/>).
///
/// <para>Kiracı süzgeci AÇIK kalır: host kullanıcısı yalnız host projelerindeki üyeliklerini görür.
/// Proje listesindeki (ProjectAppService) host'un bütün kiracıları görmesi bir yönetim ekranı
/// davranışıdır; "bana ait" listesinin onu taklit etmesi için sebep yok.</para>
/// </summary>
[Authorize]
public class MacroScreenAppService : PlatformAppService, IMacroScreenAppService
{
    /// <summary>Panelde gösterilen en fazla proje; kalanı grup başlığındaki sayıdan anlaşılır.</summary>
    public const int MaxProjects = 6;

    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectMember, Guid> _memberRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<Notification, Guid> _notificationRepository;
    private readonly MacroUsageManager _usageManager;
    private readonly MacroSettingsProvider _settingsProvider;

    public MacroScreenAppService(
        IRepository<Project, Guid> projectRepository,
        IRepository<ProjectMember, Guid> memberRepository,
        IRepository<TaskItem, Guid> taskRepository,
        IRepository<Notification, Guid> notificationRepository,
        MacroUsageManager usageManager,
        MacroSettingsProvider settingsProvider)
    {
        _projectRepository = projectRepository;
        _memberRepository = memberRepository;
        _taskRepository = taskRepository;
        _notificationRepository = notificationRepository;
        _usageManager = usageManager;
        _settingsProvider = settingsProvider;
    }

    public async Task<MacroMyProjectsDto> GetMyProjectsAsync()
    {
        var result = new MacroMyProjectsDto();
        if (!CurrentUser.Id.HasValue
            || !await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.Default))
        {
            return result;
        }

        var userId = CurrentUser.Id.Value;
        var memberProjectIds = (await _memberRepository.GetQueryableAsync())
            .Where(m => m.UserId == userId)
            .Select(m => m.ProjectId);
        var projectQuery = (await _projectRepository.GetQueryableAsync())
            .Where(p => memberProjectIds.Contains(p.Id));

        result.TotalCount = await AsyncExecuter.CountAsync(projectQuery);
        if (result.TotalCount == 0)
        {
            return result;
        }

        result.Items = await AsyncExecuter.ToListAsync(projectQuery
            .OrderByDescending(p => p.LastModificationTime ?? p.CreationTime)
            .Take(MaxProjects)
            .Select(p => new MacroProjectDto { Id = p.Id, Name = p.Name, Code = p.Code, EndDate = p.EndDate }));

        var ids = result.Items.Select(p => p.Id).ToList();
        var today = Clock.Now.Date;
        var taskQuery = await _taskRepository.GetQueryableAsync();

        // Kabuktaki proje alt listesiyle (ShellAppService) aynı kural: gizli görev sayılmaz —
        // sayaç da bir sızıntı yüzeyidir.
        var counts = (await AsyncExecuter.ToListAsync(taskQuery
                .Where(t => t.ProjectId != null && ids.Contains(t.ProjectId.Value)
                            && !t.IsPrivate
                            && t.Status != TaskStatus.Done && t.Status != TaskStatus.Cancelled)
                .GroupBy(t => t.ProjectId!.Value)
                .Select(g => new
                {
                    ProjectId = g.Key,
                    Open = g.Count(),
                    Overdue = g.Count(t => t.DueDate != null && t.DueDate < today)
                })))
            .ToDictionary(x => x.ProjectId);

        var unread = await GetProjectsWithUnreadAsync(userId, ids, taskQuery);

        foreach (var project in result.Items)
        {
            if (counts.TryGetValue(project.Id, out var count))
            {
                project.OpenTaskCount = count.Open;
                project.OverdueTaskCount = count.Overdue;
            }

            project.HasUnread = unread.Contains(project.Id);
        }

        return result;
    }

    public async Task RecordUseAsync(string key)
    {
        if (!CurrentUser.Id.HasValue || string.IsNullOrWhiteSpace(key)
            || !MacroCatalog.All.Any(definition => definition.Key == key))
        {
            return;
        }

        await _usageManager.RecordAsync(CurrentUser.Id.Value, key, Clock.Now);
    }

    public async Task<Dictionary<string, int>> GetMyUsageAsync()
    {
        return CurrentUser.Id.HasValue
            ? await _usageManager.GetCountsAsync(CurrentUser.Id.Value, Clock.Now)
            : new Dictionary<string, int>();
    }

    public async Task<MacroLayoutDto> GetMyLayoutAsync()
    {
        var settings = await _settingsProvider.GetForCurrentUserAsync();
        return new MacroLayoutDto
        {
            Usage = await GetMyUsageAsync(),
            Pins = await _settingsProvider.GetPinsForCurrentUserAsync(settings),
            Settings = settings,
            Badges = await GetMyBadgesAsync()
        };
    }

    /// <summary>Rozette sayılan en fazla okunmamış bildirim (en yeniler); rozet zaten "99+" keser.</summary>
    public const int MaxBadgeNotifications = 500;

    /// <summary>
    /// Güncelleme rozeti okunmamış bildirimlerden türetilir (kullanıcı kararları 2026-10-14: ayrı
    /// "son görülme" kaydı yok, makroyu açmak sıfırlamaz — bildirim okununca düşer). Bağlantı, bildirim
    /// merkezinin kullandığı NotificationTypeRegistry.BuildDeepLink ile kurulur; eşleme katalogda.
    /// </summary>
    private async Task<Dictionary<string, int>> GetMyBadgesAsync()
    {
        var badges = new Dictionary<string, int>(StringComparer.Ordinal);
        if (!CurrentUser.Id.HasValue)
        {
            return badges;
        }

        var userId = CurrentUser.Id.Value;
        var query = (await _notificationRepository.GetQueryableAsync())
            .Where(n => n.UserId == userId && !n.IsRead)
            .OrderByDescending(n => n.LastOccurredAt)
            .Take(MaxBadgeNotifications)
            .Select(n => new { n.Type, n.EntityId });

        foreach (var n in await AsyncExecuter.ToListAsync(query))
        {
            var key = MacroCatalog.MatchNotificationLink(NotificationTypeRegistry.BuildDeepLink(n.Type, n.EntityId));
            if (key != null)
            {
                badges[key] = badges.GetValueOrDefault(key) + 1;
            }
        }

        return badges;
    }

    /// <summary>
    /// "Gelişme var" = kullanıcının projeye ya da projenin bir görevine dair okunmamış bildirimi.
    /// Ayrı bir "son görülme" kaydı tutulmaz (kullanıcı kararı 2026-10-14: bildirimden türetilir).
    /// Bildirim kullanıcının kendisine gönderildiği için gizli görev süzgecine gerek yok.
    /// </summary>
    private async Task<HashSet<Guid>> GetProjectsWithUnreadAsync(
        Guid userId, List<Guid> projectIds, IQueryable<TaskItem> taskQuery)
    {
        var unread = (await _notificationRepository.GetQueryableAsync())
            .Where(n => n.UserId == userId && !n.IsRead && n.EntityId != null);

        var direct = await AsyncExecuter.ToListAsync(unread
            .Where(n => n.EntityType == "Project" && projectIds.Contains(n.EntityId!.Value))
            .Select(n => n.EntityId!.Value));

        var viaTasks = await AsyncExecuter.ToListAsync(
            from n in unread
            join t in taskQuery on n.EntityId equals (Guid?)t.Id
            where n.EntityType == "Task" && t.ProjectId != null && projectIds.Contains(t.ProjectId.Value)
            select t.ProjectId!.Value);

        return direct.Concat(viaTasks).ToHashSet();
    }
}
