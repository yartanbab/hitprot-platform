using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Macros;
using Apya.Platform.Notifications;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Claims;
using Volo.Abp.Timing;
using Xunit;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.EntityFrameworkCore.Macros;

/// <summary>
/// Makro Ekran › "Bana ait kayıtlar › Projelerim": üyesi olunan projeler, açık/geciken görev
/// sayısı ve "gelişme var" işareti.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class MacroScreenAppService_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IMacroScreenAppService _service;
    private readonly IRepository<Project, Guid> _projects;
    private readonly IRepository<ProjectMember, Guid> _members;
    private readonly IRepository<TaskItem, Guid> _tasks;
    private readonly IRepository<Notification, Guid> _notifications;
    private readonly ICurrentPrincipalAccessor _principal;
    private readonly ICurrentTenant _currentTenant;
    private readonly DateTime _today;

    public MacroScreenAppService_Tests()
    {
        _service = GetRequiredService<IMacroScreenAppService>();
        _projects = GetRequiredService<IRepository<Project, Guid>>();
        _members = GetRequiredService<IRepository<ProjectMember, Guid>>();
        _tasks = GetRequiredService<IRepository<TaskItem, Guid>>();
        _notifications = GetRequiredService<IRepository<Notification, Guid>>();
        _principal = GetRequiredService<ICurrentPrincipalAccessor>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _today = GetRequiredService<IClock>().Now.Date;
    }

    private IDisposable As(Guid userId) => _principal.Change(
        new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
        {
            new(AbpClaimTypes.UserId, userId.ToString()),
            new(AbpClaimTypes.UserName, "makro-" + userId.ToString("N")[..6])
        }, "Test")));

    private async Task<Project> NewProjectAsync(string name, params Guid[] memberIds)
    {
        var project = new Project(Guid.NewGuid(), _currentTenant.Id, null, name,
            "MKR-" + Guid.NewGuid().ToString("N")[..6], "Makro testi");
        await _projects.InsertAsync(project, autoSave: true);
        foreach (var memberId in memberIds)
        {
            await _members.InsertAsync(
                new ProjectMember(Guid.NewGuid(), project.Id, memberId, ProjectMemberRole.Member, project.TenantId),
                autoSave: true);
        }

        return project;
    }

    private async Task<TaskItem> NewTaskAsync(Project project, int dueInDays, bool isPrivate = false, TaskStatus? status = null)
    {
        var task = new TaskItem(Guid.NewGuid(), "Makro görevi", projectId: project.Id,
            dueDate: _today.AddDays(dueInDays), isPrivate: isPrivate, tenantId: project.TenantId,
            now: _today.AddDays(-30));
        if (status.HasValue)
        {
            task.ChangeStatus(status.Value, _today);
        }

        await _tasks.InsertAsync(task, autoSave: true);
        return task;
    }

    private async Task<Apya.Platform.Macros.Dtos.MacroMyProjectsDto> MyProjectsAsync(Guid userId)
    {
        using (As(userId))
        {
            return await WithUnitOfWorkAsync(() => _service.GetMyProjectsAsync());
        }
    }

    [Fact]
    public async Task Yalniz_uyesi_olunan_projeler_doner()
    {
        var me = Guid.NewGuid();
        var mine = await NewProjectAsync("Benim projem", me);
        await NewProjectAsync("Başkasının projesi", Guid.NewGuid());

        var result = await MyProjectsAsync(me);

        result.TotalCount.ShouldBe(1);
        result.Items.Select(p => p.Id).ShouldBe(new[] { mine.Id });
        result.Items[0].Name.ShouldBe("Benim projem");
    }

    /// <summary>
    /// Kabuktaki proje alt listesiyle aynı kural: gizli görev ne açık ne geciken sayılır — sayaç da
    /// bir sızıntı yüzeyi. Biten ve iptal edilen görev açık değildir.
    /// </summary>
    [Fact]
    public async Task Acik_ve_geciken_gorevler_gizliler_haric_sayilir()
    {
        var me = Guid.NewGuid();
        var project = await NewProjectAsync("Sayaçlı proje", me);
        await NewTaskAsync(project, dueInDays: -3);                          // açık + geciken
        await NewTaskAsync(project, dueInDays: 5);                           // açık
        await NewTaskAsync(project, dueInDays: -3, isPrivate: true);         // sayılmaz
        await NewTaskAsync(project, dueInDays: -3, status: TaskStatus.Done); // sayılmaz

        var row = (await MyProjectsAsync(me)).Items.Single();

        row.OpenTaskCount.ShouldBe(2);
        row.OverdueTaskCount.ShouldBe(1);
    }

    [Fact]
    public async Task Okunmamis_bildirim_projeyi_ya_da_gorevi_uzerinden_isaretler()
    {
        var me = Guid.NewGuid();
        var direct = await NewProjectAsync("Doğrudan bildirimli", me);
        var viaTask = await NewProjectAsync("Görev bildirimli", me);
        var read = await NewProjectAsync("Okunmuş bildirimli", me);
        var task = await NewTaskAsync(viaTask, dueInDays: 2);

        await _notifications.InsertAsync(new Notification(Guid.NewGuid(), _currentTenant.Id, me,
            NotificationType.ProjectEndingSoon, "Bitiyor", "Gövde", entityType: "Project", entityId: direct.Id), autoSave: true);
        await _notifications.InsertAsync(new Notification(Guid.NewGuid(), _currentTenant.Id, me,
            NotificationType.TaskAssigned, "Atandı", "Gövde", entityType: "Task", entityId: task.Id), autoSave: true);
        var old = new Notification(Guid.NewGuid(), _currentTenant.Id, me,
            NotificationType.ProjectEndingSoon, "Eski", "Gövde", entityType: "Project", entityId: read.Id);
        old.MarkAsRead();
        await _notifications.InsertAsync(old, autoSave: true);

        // Başkasının okunmamış bildirimi benim projemi işaretlemez.
        await _notifications.InsertAsync(new Notification(Guid.NewGuid(), _currentTenant.Id, Guid.NewGuid(),
            NotificationType.ProjectEndingSoon, "Başkası", "Gövde", entityType: "Project", entityId: read.Id), autoSave: true);

        var rows = (await MyProjectsAsync(me)).Items.ToDictionary(p => p.Id);

        rows[direct.Id].HasUnread.ShouldBeTrue();
        rows[viaTask.Id].HasUnread.ShouldBeTrue();
        rows[read.Id].HasUnread.ShouldBeFalse();
    }

    [Fact]
    public async Task Liste_en_fazla_alti_proje_tasir_toplam_hepsini_sayar()
    {
        var me = Guid.NewGuid();
        for (var i = 0; i < MacroScreenAppService.MaxProjects + 2; i++)
        {
            await NewProjectAsync("Çok proje " + i, me);
        }

        var result = await MyProjectsAsync(me);

        result.TotalCount.ShouldBe(MacroScreenAppService.MaxProjects + 2);
        result.Items.Count.ShouldBe(MacroScreenAppService.MaxProjects);
    }

    [Fact]
    public async Task Oturumsuz_cagri_bos_doner()
    {
        await NewProjectAsync("Sahipsiz", Guid.NewGuid());

        var result = await WithUnitOfWorkAsync(() => _service.GetMyProjectsAsync());

        result.TotalCount.ShouldBe(0);
        result.Items.ShouldBeEmpty();
    }
}
