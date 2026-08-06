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
public class TaskAppService_FeatureAssignment_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentTenant _currentTenant;

    public TaskAppService_FeatureAssignment_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> CreateTaskInCurrentTenantAsync()
    {
        var task = new TaskItem(
            Guid.NewGuid(), "Feature assignment test görevi",
            tenantId: _currentTenant.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(task, autoSave: true);
        return task.Id;
    }

    private async Task<Guid> CreateTaskInTenantAsync(Guid tenantId)
    {
        using (_currentTenant.Change(tenantId))
        {
            var task = new TaskItem(
                Guid.NewGuid(), "Diğer tenant görevi",
                tenantId: tenantId, now: DateTime.Now);
            await _taskRepository.InsertAsync(task, autoSave: true);
            return task.Id;
        }
    }

    [Fact]
    public async Task GetFeatureAssignmentsAsync_hicbir_feature_eklenmemis_gorevde_bos_liste_doner()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();

        var result = await _taskAppService.GetFeatureAssignmentsAsync(taskId);

        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task AddFeatureAsync_eklenen_feature_GetFeatureAssignmentsAsync_ile_gorunur()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();

        await _taskAppService.AddFeatureAsync(taskId, "finance");
        var result = await _taskAppService.GetFeatureAssignmentsAsync(taskId);

        result.ShouldContain("finance");
    }

    [Fact]
    public async Task AddFeatureAsync_ayni_feature_ikinci_kez_eklenirse_hata_vermez_ve_tekrarlanmaz()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();

        await _taskAppService.AddFeatureAsync(taskId, "finance");
        await _taskAppService.AddFeatureAsync(taskId, "finance");
        var result = await _taskAppService.GetFeatureAssignmentsAsync(taskId);

        result.ShouldBe(new[] { "finance" });
    }

    [Fact]
    public async Task RemoveFeatureAsync_eklenmis_feature_kaldirilinca_listede_gorunmez()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();
        await _taskAppService.AddFeatureAsync(taskId, "finance");

        await _taskAppService.RemoveFeatureAsync(taskId, "finance");
        var result = await _taskAppService.GetFeatureAssignmentsAsync(taskId);

        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task RemoveFeatureAsync_var_olmayan_feature_icin_hata_vermez()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();

        await Should.NotThrowAsync(async () =>
            await _taskAppService.RemoveFeatureAsync(taskId, "hic-eklenmemis-feature"));
    }

    [Fact]
    public async Task GetFeatureAssignmentsAsync_baska_tenantin_gorevinde_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        var taskId = await CreateTaskInTenantAsync(otherTenantId);

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.GetFeatureAssignmentsAsync(taskId));
    }

    [Fact]
    public async Task AddFeatureAsync_baska_tenantin_gorevinde_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        var taskId = await CreateTaskInTenantAsync(otherTenantId);

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.AddFeatureAsync(taskId, "finance"));
    }

    [Fact]
    public async Task RemoveFeatureAsync_baska_tenantin_gorevinde_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        var taskId = await CreateTaskInTenantAsync(otherTenantId);

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.RemoveFeatureAsync(taskId, "finance"));
    }
}
