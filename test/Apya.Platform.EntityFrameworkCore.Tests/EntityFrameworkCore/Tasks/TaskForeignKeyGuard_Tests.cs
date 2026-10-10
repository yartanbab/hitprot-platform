using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Apya.Platform.Tasks.Dtos;
using Shouldly;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// Çağırandan gelen iki kimlik hiç doğrulanmıyordu: önkoşul görev (bağımlılık satırına düz
/// yazılıyordu) ve taşıma/kopyalama hedefi proje. İkisi de başka kiracının ya da kullanıcının
/// göremediği bir kaydı gösterebiliyordu. Okuma tarafı süzüldüğü için veri sızmıyordu, ama
/// kayıt başka kiracının kaydına sarkık bir bağ taşıyordu.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskForeignKeyGuard_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid OtherTenant = Guid.Parse("99990000-cccc-4000-8000-000000000051");

    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<TaskDependency, Guid> _dependencyRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly ICurrentTenant _currentTenant;

    public TaskForeignKeyGuard_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _dependencyRepository = GetRequiredService<IRepository<TaskDependency, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> OtherTenantTaskAsync()
    {
        using (_currentTenant.Change(OtherTenant))
        {
            var task = new TaskItem(Guid.NewGuid(), "Başka kiracının görevi", tenantId: OtherTenant, now: DateTime.Now);
            await _taskRepository.InsertAsync(task, autoSave: true);
            return task.Id;
        }
    }

    private async Task<Guid> OtherTenantProjectAsync()
    {
        using (_currentTenant.Change(OtherTenant))
        {
            var project = new Project(
                Guid.NewGuid(), OtherTenant, null, "Başka kiracının projesi",
                "YBN-" + Guid.NewGuid().ToString("N")[..8], "açıklama");
            await _projectRepository.InsertAsync(project, autoSave: true);
            return project.Id;
        }
    }

    private async Task<Guid> OwnTaskAsync(string title, List<Guid>? predecessors = null)
        => (await _taskAppService.CreateAsync(new CreateUpdateTaskDto
        {
            Title = title,
            StartDate = new DateTime(2026, 10, 12),
            PredecessorIds = predecessors ?? new List<Guid>()
        })).Id;

    [Fact]
    public async Task Baska_kiracinin_gorevi_onkosul_olarak_yazilamaz()
    {
        var foreign = await OtherTenantTaskAsync();

        await Should.ThrowAsync<EntityNotFoundException>(
            () => OwnTaskAsync("Sarkık bağ denemesi", new List<Guid> { foreign }));

        (await _dependencyRepository.GetListAsync(d => d.PredecessorTaskId == foreign)).ShouldBeEmpty();
    }

    [Fact]
    public async Task Guncellemede_eklenen_yabanci_onkosul_reddedilir_var_olan_bag_korunur()
    {
        var predecessor = await OwnTaskAsync("Gerçek önkoşul");
        var taskId = await OwnTaskAsync("Bağımlı görev", new List<Guid> { predecessor });
        var foreign = await OtherTenantTaskAsync();

        await Should.ThrowAsync<EntityNotFoundException>(() => _taskAppService.UpdateAsync(taskId, new CreateUpdateTaskDto
        {
            Title = "Bağımlı görev",
            StartDate = new DateTime(2026, 10, 12),
            PredecessorIds = new List<Guid> { predecessor, foreign }
        }));

        // Karşı yön: var olan bağı olduğu gibi geri gönderen güncelleme çalışır.
        await _taskAppService.UpdateAsync(taskId, new CreateUpdateTaskDto
        {
            Title = "Bağımlı görev (yeniden adlandırıldı)",
            StartDate = new DateTime(2026, 10, 12),
            PredecessorIds = new List<Guid> { predecessor }
        });

        (await _dependencyRepository.GetListAsync(d => d.TaskId == taskId))
            .Select(d => d.PredecessorTaskId).ShouldBe(new[] { predecessor });
    }

    [Theory]
    [InlineData(TaskTransferMode.Move)]
    [InlineData(TaskTransferMode.Copy)]
    public async Task Gorev_baska_kiracinin_projesine_tasinamaz_ve_kopyalanamaz(TaskTransferMode mode)
    {
        var taskId = await OwnTaskAsync("Taşınacak görev");
        var foreignProject = await OtherTenantProjectAsync();

        await Should.ThrowAsync<EntityNotFoundException>(() => _taskAppService.TransferAsync(taskId, new TransferTaskDto
        {
            TargetProjectIds = new List<Guid> { foreignProject },
            Mode = mode,
            Include = new TransferTaskIncludeDto()
        }));

        (await _taskRepository.GetAsync(taskId)).ProjectId.ShouldBeNull();
        using (_currentTenant.Change(OtherTenant))
        {
            (await _taskRepository.GetListAsync(t => t.ProjectId == foreignProject)).ShouldBeEmpty();
        }
    }
}
