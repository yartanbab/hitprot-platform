using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// TaskDto.ProjectName, GetList'te doldurulmalı. TaskItem'da Project navigasyonu
/// olmadığı ve AutoMapper eşlemesi de bulunmadığı için alan bugüne kadar HER ZAMAN
/// null dönüyordu: görev listesindeki "Proje" kolonu hep "—" gösteriyor, çapraz-proje
/// kanban'daki showProjectName ölü kalıyor, Gantt'ta "Proje" gruplaması çalışmıyordu.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskAppService_ProjectName_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly ICurrentTenant _currentTenant;

    public TaskAppService_ProjectName_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Project> CreateProjectAsync(string name)
    {
        var project = new Project(
            Guid.NewGuid(),
            _currentTenant.Id,
            grantId: null,
            name: name,
            code: "PRJ-" + Guid.NewGuid().ToString("N").Substring(0, 6),
            description: "test");
        await _projectRepository.InsertAsync(project, autoSave: true);
        return project;
    }

    private async Task<TaskItem> CreateTaskAsync(string title, Guid? projectId)
    {
        var task = new TaskItem(Guid.NewGuid(), title, projectId: projectId,
            tenantId: _currentTenant.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(task, autoSave: true);
        return task;
    }

    [Fact]
    public async Task GetList_projeye_bagli_gorevin_proje_adini_doldurur()
    {
        var project = await CreateProjectAsync("Zaman Çizelgesi Projesi");
        var task = await CreateTaskAsync("Projeli görev", project.Id);

        var result = await _taskAppService.GetListAsync(
            new GetTasksInput { ProjectId = project.Id, MaxResultCount = 1000 });

        result.Items.Single(t => t.Id == task.Id).ProjectName.ShouldBe("Zaman Çizelgesi Projesi");
    }

    [Fact]
    public async Task Projesiz_gorevde_proje_adi_null_kalir()
    {
        var task = await CreateTaskAsync("Projesiz görev", null);

        var result = await _taskAppService.GetListAsync(new GetTasksInput { MaxResultCount = 1000 });

        result.Items.Single(t => t.Id == task.Id).ProjectName.ShouldBeNull();
    }

    [Fact]
    public async Task Farkli_projelerdeki_gorevler_kendi_adlarini_alir()
    {
        var a = await CreateProjectAsync("Alfa");
        var b = await CreateProjectAsync("Beta");
        var ta = await CreateTaskAsync("Alfa görevi", a.Id);
        var tb = await CreateTaskAsync("Beta görevi", b.Id);

        var result = await _taskAppService.GetListAsync(new GetTasksInput { MaxResultCount = 1000 });

        result.Items.Single(t => t.Id == ta.Id).ProjectName.ShouldBe("Alfa");
        result.Items.Single(t => t.Id == tb.Id).ProjectName.ShouldBe("Beta");
    }
}
