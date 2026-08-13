using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// Görev listesinin hiyerarşik kipi: RootOnly ile yalnız kök görevler sayfalanır,
/// ParentTaskId ile bir üst görevin alt görevleri çekilir, SubTaskCount rozetleri besler.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskAppService_SubtaskHierarchy_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentTenant _currentTenant;

    public TaskAppService_SubtaskHierarchy_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<TaskItem> CreateTaskAsync(string title, Guid? parentTaskId = null, bool isPrivate = false)
    {
        var task = new TaskItem(
            Guid.NewGuid(),
            title,
            parentTaskId: parentTaskId,
            isPrivate: isPrivate,
            tenantId: _currentTenant.Id,
            now: DateTime.Now);

        await _taskRepository.InsertAsync(task, autoSave: true);
        return task;
    }

    [Fact]
    public async Task RootOnly_alt_gorevleri_listeden_cikarir()
    {
        var parent = await CreateTaskAsync("Hiyerarşi kökü");
        var child = await CreateTaskAsync("Hiyerarşi alt görevi", parentTaskId: parent.Id);

        var result = await _taskAppService.GetListAsync(new GetTasksInput { RootOnly = true, MaxResultCount = 1000 });

        result.Items.ShouldContain(t => t.Id == parent.Id);
        result.Items.ShouldNotContain(t => t.Id == child.Id);
    }

    [Fact]
    public async Task RootOnly_verilmezse_liste_duz_kalir_alt_gorev_de_doner()
    {
        var parent = await CreateTaskAsync("Düz kip kökü");
        var child = await CreateTaskAsync("Düz kip alt görevi", parentTaskId: parent.Id);

        var result = await _taskAppService.GetListAsync(new GetTasksInput { MaxResultCount = 1000 });

        result.Items.ShouldContain(t => t.Id == parent.Id);
        result.Items.ShouldContain(t => t.Id == child.Id);
    }

    [Fact]
    public async Task ParentTaskId_yalnizca_o_ustun_alt_gorevlerini_doner()
    {
        var parent = await CreateTaskAsync("Sahip");
        var other = await CreateTaskAsync("Başka kök");
        var child1 = await CreateTaskAsync("Alt 1", parentTaskId: parent.Id);
        var child2 = await CreateTaskAsync("Alt 2", parentTaskId: parent.Id);
        await CreateTaskAsync("Yabancı alt", parentTaskId: other.Id);

        var result = await _taskAppService.GetListAsync(
            new GetTasksInput { ParentTaskId = parent.Id, MaxResultCount = 1000 });

        result.Items.Select(t => t.Id).OrderBy(x => x)
            .ShouldBe(new[] { child1.Id, child2.Id }.OrderBy(x => x));
    }

    [Fact]
    public async Task SubTaskCount_toplam_ve_tamamlanan_sayisini_doldurur()
    {
        var parent = await CreateTaskAsync("Sayaç kökü");
        var done = await CreateTaskAsync("Biten alt", parentTaskId: parent.Id);
        await CreateTaskAsync("Bekleyen alt", parentTaskId: parent.Id);

        // TaskStatus, System.Threading.Tasks.TaskStatus ile çakışır — tam nitelendir.
        done.ChangeStatus(Apya.Platform.Tasks.TaskStatus.Done);
        await _taskRepository.UpdateAsync(done, autoSave: true);

        var result = await _taskAppService.GetListAsync(new GetTasksInput { RootOnly = true, MaxResultCount = 1000 });

        var row = result.Items.Single(t => t.Id == parent.Id);
        row.SubTaskCount.ShouldBe(2);
        row.CompletedSubTaskCount.ShouldBe(1);
    }

    [Fact]
    public async Task Alt_gorevi_olmayan_gorevin_sayaclari_sifirdir()
    {
        var lonely = await CreateTaskAsync("Yalnız görev");

        var result = await _taskAppService.GetListAsync(new GetTasksInput { RootOnly = true, MaxResultCount = 1000 });

        var row = result.Items.Single(t => t.Id == lonely.Id);
        row.SubTaskCount.ShouldBe(0);
        row.CompletedSubTaskCount.ShouldBe(0);
    }
}
