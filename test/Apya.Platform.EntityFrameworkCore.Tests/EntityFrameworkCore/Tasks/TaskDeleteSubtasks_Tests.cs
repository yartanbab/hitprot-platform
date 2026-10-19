using System;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// QA-28 · Görev silinince alt görevleri de silinmeli.
///
/// Silme onayı "bu görev ve tüm alt görevleri silinecek" diyordu ama sunucu yalnız
/// görevin kendisini siliyordu. Alt görev, üstü silinmiş "hayalet" olarak kalıyordu:
/// hiyerarşik listede görünmüyor, proje ilerlemesinde sayılıyordu (QA turunda ölçüldü:
/// şerit 1/7, liste 6 satır). Düzeltme öncesi ilk iki test düşüyordu.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskDeleteSubtasks_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid OtherTenantId = Guid.Parse("33333333-4444-5555-6666-777777777777");

    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<TaskDependency, Guid> _dependencyRepository;
    private readonly IDataFilter _dataFilter;
    private readonly ICurrentTenant _currentTenant;

    public TaskDeleteSubtasks_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _dependencyRepository = GetRequiredService<IRepository<TaskDependency, Guid>>();
        _dataFilter = GetRequiredService<IDataFilter>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<TaskItem> CreateTaskAsync(string title, Guid? parentTaskId = null, Guid? tenantId = null)
    {
        var task = new TaskItem(Guid.NewGuid(), title, parentTaskId: parentTaskId,
            tenantId: tenantId ?? _currentTenant.Id, now: DateTime.Now);
        using (_dataFilter.Disable<IMultiTenant>())
        {
            await _taskRepository.InsertAsync(task, autoSave: true);
        }
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
    public async Task Gorev_silinince_alt_gorevleri_her_derinlikte_silinir()
    {
        var root = await CreateTaskAsync("Silinecek kök");
        var child = await CreateTaskAsync("Alt görev", parentTaskId: root.Id);
        var grandChild = await CreateTaskAsync("Alt görevin alt görevi", parentTaskId: child.Id);
        var sibling = await CreateTaskAsync("Komşu kök");

        await _taskAppService.DeleteAsync(root.Id);

        (await IsDeletedAsync(root.Id)).ShouldBeTrue();
        (await IsDeletedAsync(child.Id)).ShouldBeTrue("onay metni alt görevlerin de silineceğini söylüyor");
        (await IsDeletedAsync(grandChild.Id)).ShouldBeTrue();
        (await IsDeletedAsync(sibling.Id)).ShouldBeFalse();
    }

    [Fact]
    public async Task Alt_gorevin_bagimliliklari_da_temizlenir()
    {
        var root = await CreateTaskAsync("Bağlı kök");
        var child = await CreateTaskAsync("Bağlı alt görev", parentTaskId: root.Id);
        var outside = await CreateTaskAsync("Dışarıdaki görev");

        // Dışarıdaki görev, silinecek alt göreve öncül olarak bağlı.
        await _dependencyRepository.InsertAsync(new TaskDependency(Guid.NewGuid(), outside.Id, child.Id), autoSave: true);

        await _taskAppService.DeleteAsync(root.Id);

        (await _dependencyRepository.GetListAsync(d => d.PredecessorTaskId == child.Id)).ShouldBeEmpty();
    }

    [Fact]
    public async Task Host_tohumlamasi_ustu_silinmis_alt_gorevleri_tum_kiracilarda_temizler()
    {
        _currentTenant.Id.ShouldBeNull("test host bağlamında koşmalı");
        var hostParent = await CreateTaskAsync("Eski host kökü", tenantId: null);
        var hostOrphan = await CreateTaskAsync("Eski host yetimi", parentTaskId: hostParent.Id, tenantId: null);
        var tenantParent = await CreateTaskAsync("Eski kiracı kökü", tenantId: OtherTenantId);
        var tenantOrphan = await CreateTaskAsync("Eski kiracı yetimi", parentTaskId: tenantParent.Id, tenantId: OtherTenantId);
        var liveParent = await CreateTaskAsync("Canlı kök", tenantId: null);
        var liveChild = await CreateTaskAsync("Canlı alt görev", parentTaskId: liveParent.Id, tenantId: null);

        // Düzeltme öncesi davranış: üst görev alt görevlerine dokunulmadan silinir.
        using (_dataFilter.Disable<IMultiTenant>())
        {
            await _taskRepository.DeleteAsync(hostParent.Id, autoSave: true);
            await _taskRepository.DeleteAsync(tenantParent.Id, autoSave: true);
        }
        (await IsDeletedAsync(tenantOrphan.Id)).ShouldBeFalse("kurgu: alt görev yetim kalmalı");

        await WithUnitOfWorkAsync(() => GetRequiredService<DeletedParentSubtasksCleanupSeedContributor>()
            .SeedAsync(new DataSeedContext()));

        (await IsDeletedAsync(hostOrphan.Id)).ShouldBeTrue();
        (await IsDeletedAsync(tenantOrphan.Id)).ShouldBeTrue();
        (await IsDeletedAsync(liveChild.Id)).ShouldBeFalse();
    }
}
