using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.IssueTasks;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Projects;

/// <summary>
/// Proje silinince görevleri de silinmeli.
///
/// Canlıda görülen hata: proje soft-delete oluyor ama görevlerine dokunulmuyordu;
/// pano (liste, kart, takvim) silinmiş projenin görevlerini göstermeye devam
/// ediyordu. Yerel veritabanında 7 silinmiş projeye ait 101 canlı görev ölçüldü.
/// Düzeltme öncesi ilk üç test düşüyordu (ölçüldü); dördüncüsü eski veriyi
/// temizleyen tohumlama katkısını sınar.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ProjectDeleteTasks_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid OtherTenantId = Guid.Parse("22222222-3333-4444-5555-666666666666");

    private readonly IProjectAppService _projectAppService;
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<TaskDependency, Guid> _dependencyRepository;
    private readonly IRepository<IssueTaskLink, Guid> _issueLinkRepository;
    private readonly IDataFilter _dataFilter;
    private readonly ICurrentTenant _currentTenant;

    public ProjectDeleteTasks_Tests()
    {
        _projectAppService = GetRequiredService<IProjectAppService>();
        _taskAppService = GetRequiredService<ITaskAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _dependencyRepository = GetRequiredService<IRepository<TaskDependency, Guid>>();
        _issueLinkRepository = GetRequiredService<IRepository<IssueTaskLink, Guid>>();
        _dataFilter = GetRequiredService<IDataFilter>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Project> CreateProjectAsync(Guid? tenantId)
    {
        var code = "PD-" + Guid.NewGuid().ToString("N").Substring(0, 6);
        var project = new Project(Guid.NewGuid(), tenantId, grantId: null,
            name: "Silme Testi " + code, code: code, description: "test");
        await _projectRepository.InsertAsync(project, autoSave: true);
        return project;
    }

    private async Task<TaskItem> CreateTaskAsync(Guid projectId, Guid? tenantId, Guid? parentTaskId = null)
    {
        var task = new TaskItem(Guid.NewGuid(), "Görev", projectId: projectId, parentTaskId: parentTaskId,
            dueDate: DateTime.Today, tenantId: tenantId, now: DateTime.Now);
        await _taskRepository.InsertAsync(task, autoSave: true);
        return task;
    }

    private async Task<bool> IsDeletedAsync(Guid taskId)
    {
        using (_dataFilter.Disable<ISoftDelete>())
        using (_dataFilter.Disable<IMultiTenant>())
        {
            return (await _taskRepository.GetAsync(taskId)).IsDeleted;
        }
    }

    [Fact]
    public async Task Proje_silinince_gorevleri_ve_alt_gorevleri_panodan_duser()
    {
        var project = await CreateProjectAsync(_currentTenant.Id);
        var other = await CreateProjectAsync(_currentTenant.Id);
        var root = await CreateTaskAsync(project.Id, _currentTenant.Id);
        var child = await CreateTaskAsync(project.Id, _currentTenant.Id, parentTaskId: root.Id);
        var survivor = await CreateTaskAsync(other.Id, _currentTenant.Id);

        await _projectAppService.DeleteAsync(project.Id);

        // Liste + kart görünümü getList'ten, takvim getPoints'ten beslenir.
        var list = await _taskAppService.GetListAsync(new GetTasksInput { MaxResultCount = 1000 });
        list.Items.Select(t => t.Id).ShouldNotContain(root.Id);
        list.Items.Select(t => t.Id).ShouldNotContain(child.Id);
        list.Items.Select(t => t.Id).ShouldContain(survivor.Id);

        var points = await _taskAppService.GetPointsAsync(new GetTasksInput { MaxResultCount = 1000 });
        points.Select(t => t.Id).ShouldNotContain(root.Id);
        points.Select(t => t.Id).ShouldContain(survivor.Id);

        // Soft-delete: satır durur, silinmiş işaretlidir.
        (await IsDeletedAsync(root.Id)).ShouldBeTrue();
        (await IsDeletedAsync(child.Id)).ShouldBeTrue();
    }

    [Fact]
    public async Task Proje_silinince_gorevlerin_baglari_temizlenir()
    {
        var project = await CreateProjectAsync(_currentTenant.Id);
        var other = await CreateProjectAsync(_currentTenant.Id);
        var task = await CreateTaskAsync(project.Id, _currentTenant.Id);
        var outside = await CreateTaskAsync(other.Id, _currentTenant.Id);

        // Başka projedeki görev, silinecek göreve öncül olarak bağlı.
        await _dependencyRepository.InsertAsync(
            new TaskDependency(Guid.NewGuid(), outside.Id, task.Id), autoSave: true);
        await _issueLinkRepository.InsertAsync(
            new IssueTaskLink(Guid.NewGuid(), IssueSourceType.Feedback, Guid.NewGuid(),
                "fb-" + Guid.NewGuid().ToString("N"), null, null, task.Id, isAutomatic: false),
            autoSave: true);

        await _projectAppService.DeleteAsync(project.Id);

        (await _dependencyRepository.GetListAsync(d => d.PredecessorTaskId == task.Id)).ShouldBeEmpty();
        (await _issueLinkRepository.GetListAsync(l => l.TaskId == task.Id)).ShouldBeEmpty();
    }

    [Fact]
    public async Task Host_kiraci_projesini_silince_kiracinin_gorevleri_de_silinir()
    {
        _currentTenant.Id.ShouldBeNull("test host bağlamında koşmalı");
        var project = await CreateProjectAsync(OtherTenantId);
        var task = await CreateTaskAsync(project.Id, OtherTenantId);

        await _projectAppService.DeleteAsync(project.Id);

        // Görev sorgusu filtre kapsamı dışında kalsaydı kiracı filtresi görevi
        // gizler, görev silinmeden kalırdı.
        (await IsDeletedAsync(task.Id)).ShouldBeTrue();
    }

    [Fact]
    public async Task Tohumlama_eskiden_silinmis_projelerin_gorevlerini_temizler()
    {
        var project = await CreateProjectAsync(_currentTenant.Id);
        var other = await CreateProjectAsync(_currentTenant.Id);
        var orphan = await CreateTaskAsync(project.Id, _currentTenant.Id);
        var survivor = await CreateTaskAsync(other.Id, _currentTenant.Id);

        // Düzeltme öncesi davranış: proje görevlerine dokunulmadan silinir.
        await _projectRepository.DeleteAsync(project.Id, autoSave: true);
        (await IsDeletedAsync(orphan.Id)).ShouldBeFalse("kurgu: görev yetim kalmalı");

        await WithUnitOfWorkAsync(() => GetRequiredService<DeletedProjectTasksCleanupSeedContributor>()
            .SeedAsync(new DataSeedContext(_currentTenant.Id)));

        (await IsDeletedAsync(orphan.Id)).ShouldBeTrue();
        (await IsDeletedAsync(survivor.Id)).ShouldBeFalse();
    }
}
