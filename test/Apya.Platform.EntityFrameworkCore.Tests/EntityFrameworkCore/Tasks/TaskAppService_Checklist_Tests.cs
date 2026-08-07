using System;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskAppService_Checklist_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentTenant _currentTenant;

    public TaskAppService_Checklist_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> CreateTaskInCurrentTenantAsync()
    {
        var task = new TaskItem(Guid.NewGuid(), "Checklist test görevi", tenantId: _currentTenant.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(task, autoSave: true);
        return task.Id;
    }

    [Fact]
    public async Task AddChecklistItemAsync_eklenen_madde_GetChecklistItemsAsync_ile_gorunur()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();

        await _taskAppService.AddChecklistItemAsync(taskId, "İlk madde");
        var result = await _taskAppService.GetChecklistItemsAsync(taskId);

        result.ShouldHaveSingleItem().Text.ShouldBe("İlk madde");
        result[0].IsDone.ShouldBeFalse();
    }

    [Fact]
    public async Task AddChecklistItemAsync_bos_metin_hata_verir()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();

        await Should.ThrowAsync<UserFriendlyException>(
            async () => await _taskAppService.AddChecklistItemAsync(taskId, "   "));
    }

    [Fact]
    public async Task AddChecklistItemAsync_500_karakterden_uzun_metin_hata_verir()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();
        var tooLong = new string('a', 501);

        await Should.ThrowAsync<UserFriendlyException>(
            async () => await _taskAppService.AddChecklistItemAsync(taskId, tooLong));
    }

    [Fact]
    public async Task ToggleChecklistItemAsync_IsDone_u_ters_cevirir()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();
        var itemId = await _taskAppService.AddChecklistItemAsync(taskId, "Madde");

        await _taskAppService.ToggleChecklistItemAsync(itemId);
        var afterFirst = await _taskAppService.GetChecklistItemsAsync(taskId);
        afterFirst.ShouldHaveSingleItem().IsDone.ShouldBeTrue();

        await _taskAppService.ToggleChecklistItemAsync(itemId);
        var afterSecond = await _taskAppService.GetChecklistItemsAsync(taskId);
        afterSecond.ShouldHaveSingleItem().IsDone.ShouldBeFalse();
    }

    [Fact]
    public async Task DeleteChecklistItemAsync_maddeyi_kaldirir()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();
        var itemId = await _taskAppService.AddChecklistItemAsync(taskId, "Madde");

        await _taskAppService.DeleteChecklistItemAsync(itemId);
        var result = await _taskAppService.GetChecklistItemsAsync(taskId);

        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task GetChecklistItemsAsync_baska_tenantin_gorevinde_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        Guid taskId;
        using (_currentTenant.Change(otherTenantId))
        {
            var task = new TaskItem(Guid.NewGuid(), "Diğer tenant görevi", tenantId: otherTenantId, now: DateTime.Now);
            await _taskRepository.InsertAsync(task, autoSave: true);
            taskId = task.Id;
        }

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.GetChecklistItemsAsync(taskId));
    }
}
